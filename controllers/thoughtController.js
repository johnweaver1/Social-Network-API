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
        ? res.status(404).json({ message: `Id didn't match a thought`})
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //create a thought and push the id to the associated user's id!
}