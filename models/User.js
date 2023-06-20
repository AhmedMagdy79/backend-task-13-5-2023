import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: { type: String },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
