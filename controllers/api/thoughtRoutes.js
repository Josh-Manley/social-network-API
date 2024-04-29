const { Thought } = require('../../models');
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const thoughtData = await Thought.find();
    res.json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
