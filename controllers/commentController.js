const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');
const queue = require('../config/kue');


module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            try {
                let comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                });

                await comment.populate('user', 'name email avatar');

                post.comments.push(comment);
                post.save();


                // commentsMailer.newComment(comment);
                let job = queue.create('emails', comment).save(function (err) {
                    if (err) {
                        console.log("error in sending to the queue!", err);
                        return;
                    }
                    console.log('job enqueued!', job.id);
                })

                if (req.xhr) {
                    return res.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "Comment created!"
                    });
                }
         

                req.flash('success', 'Comment published!');
                res.redirect('/');

            } catch (error) {
                req.flash('error', error);
                console.log('Error in adding the comment', error);
                return;
            }
        }
    } catch (error) {
        req.flash('error', 'Comment failed!');
        console.log('Error in adding the comment', error);
        return;
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = comment.post;

            await Comment.findByIdAndDelete(comment.id);

            let post = await Post.findByIdAndUpdate(postId, { $pull: { comments: comment.id } });

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });
            
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted!"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');
        }

        else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }

    } catch (error) {
        req.flash('error', 'Cannot delete comment!');
        console.log('error in deleting the comments ');
        return;
    }
}