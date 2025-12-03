import express from "express";
import Department from "../models/departmentModel.js";

const router = express.Router();

// Get all departments
router.get("/", async (req, res) => {
  try {
    const data = await Department.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

// Create new department
router.post("/", async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) {
    res.status(400).json({ message: "Failed to create department" });
  }
});

// Update department
router.put("/:id", async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Department not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update department" });
  }
});

// Delete department
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Department deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete department" });
  }
});

export default router;
