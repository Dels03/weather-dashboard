const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,

  preferences: {
    unit: {
      type: String,
      enum: ["celsius", "fahrenheit"],
      default: "celsius",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },
    defaultLocation: {
      cityName: String,
      countryCode: String,
      latitude: Number,
      longitude: Number,
    },
  },

  favoriteCities: [
    {
      cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
      customName: String,
      displayOrder: Number,
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });
userSchema.index({ "favoriteCities.cityId": 1 });

module.exports = mongoose.model("User", userSchema);
