const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: {
        type: "String",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    // Include the ids of all the comments under the posts
    comments: [ {
         type: mongoose.Schema.Types.ObjectId,
         ref : 'Comment'
    }] ,
    likes: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Like'
   }] 
},{
    timestamps: true
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;