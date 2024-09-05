const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');


module.exports.home = async function (req, res) {
    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
              path: "comments",
              populate: {
                path: "user",
              },
            })
            .populate({
              path: "comments",
              populate: {
                path: "likes",
              },
            })
            .populate("likes");
    
        let users = await User.find({});

        let user;
        if (req.user) {
          user = await User.findById(req.user._id)
            .populate({
              path: "friends",
              populate: {
                path: "from_user",
              },
            })
            .populate({
              path: "friends",
              populate: {
                path: "to_user",
              },
            });
        }

        return res.render('home', {
            title: "Lambda",
            posts: posts,
            all_users: users,
            user: user
        });
    } catch (err) {
        console.log('Error', err);
        return;
    }
}