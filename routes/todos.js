const express = require("express");
const jwt = require("jsonwebtoken");
const Todo = require("../models/Todo");

const router = express.Router();

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId });
    res.json({ todos }); 
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const todo = new Todo({ userId: req.userId, text: req.body.text, completed: false });
    await todo.save();
    res.status(201).json({ todo }); 
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { completed: req.body.completed }, 
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ todo });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;