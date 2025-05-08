// import mongoose, { Types } from "mongoose";
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true , unique :true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword){
return await bcrypt.compare(enteredPassword , this.password);
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // important to call next() and return here
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // ✅ ensure this is called after hashing
  } catch (err) {
    next(err); // ✅ forward error if something fails
  }
});

// userSchema.pre('save',async function(next){
//   if(!this.ismodified('password')){
//     next()
//   }
//   const salt = await bcrypt.genSalt(10);

//   this.password = await bcrypt.hash(this.password , salt);
// })

const User = mongoose.model("User", userSchema);

module.exports = User;
