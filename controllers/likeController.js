const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req,res){
    try {
        
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // Check if a like already exist
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // If the like already exists then delete it 
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            await Like.findByIdAndDelete(existingLike._id);
            // existingLike.remove();
            deleted = true;
        }
        else{
            // make a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.json(200, {
            message: 'Request Successful',
            data: {
                deleted : deleted
            }
        })

    } catch (err) {
        console.log('Toggle Like ' , err);
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
}