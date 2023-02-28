const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 Characters"],
    minLength: [4, "Name should have more than 4 Characters"],
  },
  email: {
    type: String,
    required: [true, "Pleae Enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
     default: "user",
    required: true
  },
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 7)
});

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", userSchema)