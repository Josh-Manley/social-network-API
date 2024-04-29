const { User } = require('../../models');
const router = require('express').Router();

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;