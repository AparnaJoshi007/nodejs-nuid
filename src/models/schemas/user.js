import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, require: true },
  nuid: { type: String, unique: true, required: true },
  name: String,
});

export default UserSchema;
