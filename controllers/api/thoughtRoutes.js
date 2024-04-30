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
      return res.status(404).json({ message: 'No thought with that id' });
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

// POST to create a new reaction for a specific thought
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    // Find the thought by thoughtId
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Create a new reaction
    const newReaction = { reactionBody, username };
    thought.reactions.push(newReaction);
    await thought.save();

    // Return the updated thought with reactions in the response
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a reaction by reactionId from a specific thought
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;

    // Find the thought by thoughtId
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Find the index of the reaction to remove
    const reactionIndex = thought.reactions.findIndex(
      (reaction) => reaction.reactionId.toString() === reactionId
    );

    // Check if reactionIndex is valid
    if (reactionIndex === -1) {
      return res.status(404).json({ message: 'Reaction not found' });
    }

    // Remove the reaction from the reactions array
    thought.reactions.splice(reactionIndex, 1);
    await thought.save();

    // Return the updated thought without the deleted reaction in the response
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
