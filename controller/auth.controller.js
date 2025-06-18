  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const User = require("../models/user.schema");

  // Register Controller
  const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(newUser);

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ message: "User registered successfully", token });

  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};


  // Login Controller
  const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User not found" });

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          isAdmin: user.isAdmin,
        },
      });

    } catch (err) {
      res.status(500).json({ message: "Login failed", error: err.message });
    }
  };

  // Logout Controller (Stateless)
  const logout = (req, res) => {
    // On frontend: just delete the token from storage
    res.status(200).json({ message: "Logout successful" });
  };

  // Get Profile Controller (Protected)
  const getProfile = async (req, res) => {
    console.log('called');
    
    try {
      const user = await User.findById(req.user.id).select("-password"); // exclude password
      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch profile", error: err.message });
    }
  };

  // Update Username
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Username updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update username", error: err.message });
  }
};

// Update Bio
const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;

    if (bio === undefined) {
      return res.status(400).json({ message: "Bio is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { bio },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Bio updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to update bio", error: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateUsername,
  updateBio,
};

