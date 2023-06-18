const Thought = require('../models/Thought');
const User = require('../models/User');

const getUsers = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
};

const getSingleUser = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .select('-__v')
    .populate('friends')
    .populate('thoughts')
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
};

const createUser = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.status(500).json(err));
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        username: req.body.username,
        email: req.body.email,
      },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
      console.log(`Updated: ${updatedUser}`);
    } else {
      res.status(404).json({ message: "No user found with that ID" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error", error: err });
  }
};


const deleteUser = (req, res) => {
  User.findOneAndRemove({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : Thought.deleteMany({ username: user.username })
            .then((thoughts) =>
              !thoughts
                ? res.status(404).json({ message: 'No thoughts for that user' })
                : res.json(user)
            )
    )
    .catch((err) => res.status(500).json(err));
};

const addFriend = (req, res) => {
  User.findOne({ _id: req.params.friendId })
    .select('-__v')
    .then((user) => {
      return User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $addToSet: {
            friends: user._id
          }
        },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
};

const deleteFriend = (req, res) => {
  User.findOne({ _id: req.params.friendId })
    .select('-__v')
    .then((user) => {
      return User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $pull: {
            friends: user._id
          }
        },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
};

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend
};
