const { User, Thought } = require("../models");

module.exports = {
    // Get all thoughts
    getThought(req, res) {
        Thought.find()
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    //Get a thought
    getAThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select("__v")
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: `ID didn't match a thought`})
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //create a thought and push the id to the associated user's id.
    createThought(req, res) {
        Thought.create(req.body)
          .then(({ _id }) => {
            return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { thoughts: _id } },
              { new: true }
            );
          })
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: "ID did not match a known user." })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
      //update a thought
      updateThought(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, New: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: "ID didn't match a thought" })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
      },
      //delete a thought
      deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: "ID didn't match a thought" })
              : User.findOneAndUpdate(
                  { thoughts: req.params.thoughtId },
                  { $pull: { thoughts: req.params.thoughtId } },
                  { new: true }
                )
          )
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'Thought was deleted but no user associated with it'})
              : res.json({ message: 'Both user and thought deleted' })
          )
          .catch((err) => res.status(500).json(err));
      },
      //create reaction
      createReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: "ID didn't match a thought" })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
      //delete reaction
      deleteReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: "ID didn't match a thought" })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
};