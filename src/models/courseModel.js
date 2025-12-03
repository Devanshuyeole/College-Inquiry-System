import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema({
  tuition: { type: String, default: "" },
  registration: { type: String, default: "" },
  lab: { type: String, default: "" },
  workshop: { type: String, default: "" },
  fieldWork: { type: String, default: "" },
  materials: { type: String, default: "" },
  library: { type: String, default: "" },
  total: { type: String, default: "" }
}, { _id: false });

const admissionCriteriaSchema = new mongoose.Schema({
  eligibility: { type: String, default: "" },
  minimumGrade: { type: String, default: "" },
  entranceExam: { type: String, default: "" }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  fullDescription: { type: String, default: "" },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  seats: { type: String, required: true },
  fee: { type: String, required: true },
  
  // Extended Information (all optional)
  feeStructure: { type: feeStructureSchema, default: {} },
  admissionCriteria: { type: admissionCriteriaSchema, default: {} },
  
  // Legacy fields (optional)
  name: { type: String },
  department: { type: String },
  credits: { type: Number },
  instructor: { type: String },
  semester: { type: String },
  schedule: { type: String }
}, { 
  timestamps: true,
  strict: false // Allows additional fields
});

export default mongoose.model("Course", courseSchema);