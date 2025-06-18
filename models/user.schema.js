  const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      avatar: {
        type: String,
        default: "",
      },

      bio: {
        type: String,
        default: '',
        maxlength: 200,
      },

      password: {
        type: String,
        required: true,
      },

      isAdmin: {
        type: Boolean,
        default: false,
      },

      isOnline: {
        type: Boolean,
        default: false,
      },

      lastSeen: {
        type: Date,
        default: null,
      },
      projects: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Project',
      },
  },{
    timestamps:true
  });


  module.exports = mongoose.model("User", userSchema);