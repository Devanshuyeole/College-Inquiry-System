import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: String,
  head: String,
  faculty: Number,
  programs: [String],
  email: String,
}, { timestamps: true });

export default mongoose.model("Department", departmentSchema);
