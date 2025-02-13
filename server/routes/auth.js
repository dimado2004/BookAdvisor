const express = require("express");
const bcrypt = require("bcryptjs");

require('dotenv').config();
const jwt = require("jsonwebtoken");

const token = jwt.sign({ userId: '12345' }, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log(token);

const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  res.json({ message: "Utilisateur créé avec succès" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Identifiants incorrects" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user });
});

module.exports = router;