const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Task = require("./tasks")
const sharp = require("sharp")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true

  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value == "password") {
        throw new Error("the password must not be password");
      }
    },
  },
  avatar: {
    type : Buffer,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }]
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
  autopopulate: true
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('user not found')
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('unable to login')
  }
  return user;
}
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ "_id": user.id }, process.env.JWT_SECRET, { "expiresIn": "7 days" },);

  user.tokens = user.tokens.concat({ token })

  await user.save;
  return token;

}

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject()

  delete userObject.password;
  delete userObject.tokens

  return userObject;
}

userSchema.pre("save", async function () {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
 });
userSchema.pre("remove", async function () {
  const user = this;
  await Task.deleteMany({ "owner": user._id })

})
const User = mongoose.model("User", userSchema);

module.exports = User;
