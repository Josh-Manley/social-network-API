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

module.exports = router;
