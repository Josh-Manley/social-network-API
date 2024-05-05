const { User } = require('../../models');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const userData = await User.find();
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body, // This contains the new data to update
      { new: true } // This option ensures you get the updated user data back
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const deltedUser = await User.findByIdAndDelete(userId);
    res.json(deltedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    // Check if both userId and friendId are valid ObjectId
    if (!userId.match(/^[0-9a-fA-F]{24}$/) || !friendId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID or friend ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Add the friend to the user's friends array
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      friend.friends.push(user);
      await friend.save();
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Check if the friendId exists in the user's friends array
    if (!user.friends.includes(friendId)) {
      return res.status(404).json({ message: 'Friend not found in user\'s friend list' });
    }

    // Remove the friendId from the user's friends array
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);
    await friend.save();
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
