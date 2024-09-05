const { findByIdAndDelete } = require('../models/comment');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        await post.populate('user', 'name email avatar');


        // To detect AJAX request 
        if (req.xhr) {
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created !!"
            });
        }

        req.flash('success', 'Post Published!!');
        return res.redirect('back');

    } catch (error) {
        req.flash('error', error);
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        // .id actually converts the object id into string id.
        if (post.user == req.user.id) {

            //delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            await Like.deleteMany({ likeable: { $in: post.comments } });

            await Post.findByIdAndDelete(post.id);

            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted !"
                });

            }


            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }

        else {
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error', error);
        console.log('error in deleting the post !! ', error);
        return res.redirect('back');
    }
}