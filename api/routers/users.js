const express = require('express');
const router = express.Router();

router.use(express.json());

const { getAllUsers, getUser, addUser, findUserByEmail, editUser } = require('../utils/db');
const { validateUser, validateNewUser } = require('../utils/validation');

router.get('/', async (req, res) => {
  const rows = await getAllUsers();
  res
    .status(200)
    .json(rows)
});

router.get('/:id', async (req, res) => {
  const rows = await getUser(req.params.id);
  if (rows[0]) {
    return res
      .status(200)
      .json(rows)
  }
  return res
    .status(404)
    .end('Not found')
});

router.post('/:id', async (req, res, next) => {
  try {
    const userDetails = validateUser(req.params.id, req.body);
    const rows = await editUser(userDetails);
    res
      .status(201)
      .json(rows)
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  console.log('Request new user');
  try {
    const userExists = await findUserByEmail(req.body.email);
    if (userExists) {
      return res
        .status(200)
        .end('User exists')
    }
    const userDetails = validateNewUser(req.body);
    const newRow = await addUser(userDetails);
    return res
      .status(201)
      .json(newRow)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
