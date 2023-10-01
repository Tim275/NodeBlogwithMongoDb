const mongoose = require("mongoose");

// Link zur Verbindung mit MongoDB
const uri = "mongodb+srv://flamur:12345@cluster0.axyol2u.mongodb.net/?retryWrites=true&w=majority";

// Funktion zur Verbindung mit MongoDB
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Verbunden mit Flamurs MongoDB");
  } catch (error) {
    console.error(error);
  }
}

// "User" erstellen mit MongoDB
const User = mongoose.model("User", {
  username: String,
  password: String,
});

// Registrierung von "User"
async function registerUser(username, password) {
  await User.create({ username, password });
}

// Login von "User"
async function loginUser(username, password) {
  const user = await User.findOne({ username, password });
  return user;
}

module.exports = {
  connect,
  registerUser,
  loginUser,
};