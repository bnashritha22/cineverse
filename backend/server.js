const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/cineverse")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

const User = require("./models/User");

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// SIGNUP
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(400).json({ message: "User exists" });
  }

  const user = new User({ username, password });
  await user.save();

  res.json({ message: "User created" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    res.json({
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

// ADD WATCHLIST
app.post("/watchlist", async (req, res) => {
  const { userId, movie } = req.body;

  const user = await User.findById(userId);

  const exists = user.watchlist.find(
    (m) => m.movieId === movie.movieId
  );

  if (!exists) {
    user.watchlist.push(movie);
    await user.save();
  }

  res.json(user.watchlist);
});

// GET WATCHLIST
app.get("/watchlist/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user.watchlist);
});

// REMOVE WATCHLIST
app.delete("/watchlist", async (req, res) => {
  const { userId, movieId } = req.body;

  const user = await User.findById(userId);

  user.watchlist = user.watchlist.filter(
    (m) => m.movieId !== movieId
  );

  await user.save();

  res.json(user.watchlist);
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});