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
          ? res.status(404).json({ message: "No User find with that ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
    },
}