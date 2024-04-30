const { Thought, User } = require('../../models');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const thoughtData = await Thought.find();
    res.json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:thoughtId', async (req, res) => {
  try {
    const thoughtData = await Thought.findOne({ _id: req.params.thoughtId });
    if (!thoughtData) {
      return res.status(404).json({ message: 'No though with that id' });
    }
    res.json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a new thought and associate it with a user
router.post('/', async (req, res) => {
  try {
    const { thoughtText, username, userId } = req.body;

    // Create a new thought using the provided data
    const newThought = await Thought.create({ thoughtText, username });

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      // If user is not found, delete the newly created thought (rollback)
      await newThought.remove();
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the newly created thought's _id to the user's thoughts array
    user.thoughts.push(newThought._id);
    await user.save();

    // Return the newly created thought data in the response
    res.json(newThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:thoughtId', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const thoughtUpdate = await Thought.findByIdAndUpdate(thoughtId, req.body, { new: true });

    if (!thoughtUpdate) {
      return res.status(404).json({ message: 'No thought with that id' });
    }

    res.json(thoughtUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:thoughtId', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const thoughtDelete = await Thought.findByIdAndDelete(thoughtId);
    res.json(thoughtDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
