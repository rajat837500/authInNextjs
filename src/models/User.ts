// src/models/User.ts
import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  role: "USER" | "ADMIN"; // Extend roles as needed
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;



// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   username: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: { type: String, default: 'USER' }
// });

// export default mongoose.models.User || mongoose.model('User', userSchema);
