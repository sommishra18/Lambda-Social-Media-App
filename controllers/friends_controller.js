const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.addFriend = async function (req, res) {
    try {
        let existingFriend = await Friendship.findOne({
            from_user: req.user._id,
            to_user: req.query.id
        });

        let flag = false;
        let fromUser = await User.findById(req.user._id);
        let toUser = await User.findById(req.query.id);
        if (existingFriend) {
            fromUser.friends.pull(existingFriend._id);
            toUser.friends.pull(existingFriend._id);
            fromUser.save();
            toUser.save();
            await Friendship.findByIdAndDelete(existingFriend._id);
            flag = true;


        } else {
            let newFriendship = await Friendship.create({
                from_user: req.user._id,
                to_user: req.query.id
            });

            fromUser.friends.push(newFriendship._id);
            toUser.friends.push(newFriendship._id);
            toUser.save();
            fromUser.save();
        }
        if (req.xhr) {
            return res.status(200).json({
                message: 'Request Successful',
                data: {
                    flag: flag
                }
            });
        }

        return res.redirect('back');

    } catch (err) {
        console.log('Error in adding a friend', err);
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
} 