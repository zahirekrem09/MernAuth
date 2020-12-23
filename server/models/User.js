const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a firtName"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a lastName"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide a email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    minlength: [6, "Please provide a password with min lenght 6"],
    required: [true, "Please provide a password"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  //   role: {
  //     type: String,
  //     default: "user",
  //     enum: ["user", "admin"],
  //   },
});

//Methods
UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this._id,
    firstName: this.firstName,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: 3600,
  });

  return token;
};

//Pre Hooks
UserSchema.pre("save", function (next) {
  //code write(pass hash)
  // console.log(this);

  //update for user
  if (!this.isModified("password")) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      // Store hash in your password DB.
      if (err) next(err);
      // console.log(this.password);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
