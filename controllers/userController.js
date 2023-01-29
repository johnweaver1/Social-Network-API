const { User, Thought } = require("../models");

module.exports = {
    //Get users
    getUser(req, res) {
        User.find()
        .then ((user) => res.json(user))
        .catch((err) => res.status(500).json(err))
    },
    //get user
    getAUser(req, res) {
        User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "ID did not match a known user." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
    },
    //create user 
    CreateUser(req, res) {
      User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
    },
   //update a user
   updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "ID did not match a known user." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  }, 
  //delete a user + thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "ID did not match a known user." })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "Deleted user and thoughts" }))
      .catch((err) => res.status(500).json(err));
  },
  //add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "ID did not match a known user." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //delete a friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: "ID did not match a known user." })
            : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};