import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true, },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
  },
  {
    timestamps: true, 
  }
);

const Todo = mongoose.models?.Todo || mongoose.model("Todo", userSchema);
export default Todo;
