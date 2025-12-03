import express from "express";
import Course from "../models/courseModel.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
});

// Get single course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Failed to fetch course", error: error.message });
  }
});

// Create new course
router.post("/", async (req, res) => {
  try {
    console.log("Received course data:", req.body);

    // Validate required fields
    const { title, category, duration, seats, fee } = req.body;
    
    if (!title || !category || !duration || !seats || !fee) {
      return res.status(400).json({ 
        message: "Missing required fields: title, category, duration, seats, fee" 
      });
    }

    // Create course with all fields
    const courseData = {
      title: req.body.title,
      fullDescription: req.body.fullDescription || "",
      category: req.body.category,
      duration: req.body.duration,
      seats: req.body.seats,
      fee: req.body.fee,
      feeStructure: {
        tuition: req.body.feeStructure?.tuition || "",
        registration: req.body.feeStructure?.registration || "",
        lab: req.body.feeStructure?.lab || "",
        workshop: req.body.feeStructure?.workshop || "",
        fieldWork: req.body.feeStructure?.fieldWork || "",
        materials: req.body.feeStructure?.materials || "",
        library: req.body.feeStructure?.library || "",
        total: req.body.feeStructure?.total || ""
      },
      admissionCriteria: {
        eligibility: req.body.admissionCriteria?.eligibility || "",
        minimumGrade: req.body.admissionCriteria?.minimumGrade || "",
        entranceExam: req.body.admissionCriteria?.entranceExam || ""
      }
    };

    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();
    
    console.log("Course saved successfully:", savedCourse);
    res.status(201).json(savedCourse);

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ 
      message: "Failed to create course", 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined
    });
  }
});

// Update course
router.put("/:id", async (req, res) => {
  try {
    console.log("Updating course:", req.params.id);
    console.log("Update data:", req.body);

    const courseData = {
      title: req.body.title,
      fullDescription: req.body.fullDescription || "",
      category: req.body.category,
      duration: req.body.duration,
      seats: req.body.seats,
      fee: req.body.fee,
      feeStructure: {
        tuition: req.body.feeStructure?.tuition || "",
        registration: req.body.feeStructure?.registration || "",
        lab: req.body.feeStructure?.lab || "",
        workshop: req.body.feeStructure?.workshop || "",
        fieldWork: req.body.feeStructure?.fieldWork || "",
        materials: req.body.feeStructure?.materials || "",
        library: req.body.feeStructure?.library || "",
        total: req.body.feeStructure?.total || ""
      },
      admissionCriteria: {
        eligibility: req.body.admissionCriteria?.eligibility || "",
        minimumGrade: req.body.admissionCriteria?.minimumGrade || "",
        entranceExam: req.body.admissionCriteria?.entranceExam || ""
      }
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      courseData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("Course updated successfully:", updatedCourse);
    res.json(updatedCourse);

  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ 
      message: "Failed to update course", 
      error: error.message 
    });
  }
});

// Delete course
router.delete("/:id", async (req, res) => {
  try {
    console.log("Deleting course:", req.params.id);

    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("Course deleted successfully");
    res.json({ message: "Course deleted successfully", course: deletedCourse });

  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ 
      message: "Failed to delete course", 
      error: error.message 
    });
  }
});

export default router;