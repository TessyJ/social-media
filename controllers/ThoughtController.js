const Thought = require("../models/Thought");
const User = require("../models/User");

const getThoughts = (req, res) => {
  Thought.find()
    .then((thoughts) => res.json(thoughts))
    .catch((err) => res.status(500).json(err));
};

const getSingleThought = (req, res) => {
  Thought.findOne({ _id: req.params.thoughtId })
    .select("-__v")
    .populate("reactions")
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought with that ID" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
};

const createThought = (req, res) => {
  Thought.create({
    thoughtText: req.body.thoughtText,
    username: req.body.username,
  })
    .then((thought) => {
      return User.findOneAndUpdate(
        { username: req.body.username },
        {
          $addToSet: { thoughts: thought._id },
        },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res.status(404).json({
            message: "Error creating thought - no user with that ID",
          })
        : res.json(user)
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};
const updateThought = async (req, res) => {
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {
        thoughtText: req.body.thoughtText,
        username: req.body.username,
      },
      { new: true }
    );

    if (updatedThought) {
      res.status(200).json(updatedThought);
      console.log(`Updated: ${updatedThought}`);
    } else {
      res.status(404).json({ message: "No thought found with that ID" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error", error: err });
  }
};


const deleteThought = (req, res) => {
  Thought.findOneAndRemove({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought with this id!" })
        : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          )
    )
    .then((user) =>
      !user
        ? res.status(404).json({
            message: "Error deleting thought",
          })
        : res.json({ message: "Thought successfully deleted!" })
    )
    .catch((err) => res.status(500).json(err));
};
const addReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought with this ID" });
    }

    res.json("Reaction added");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};


const removeReaction = async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "No thought with this ID" });
    }

    res.json("Reaction deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};


module.exports = {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
};
