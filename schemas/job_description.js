const mongoose = require("mongoose");

const { Schema } = mongoose;

const jobDescriptionSchema = new Schema({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
  },
  addLogoURL: {
    type: String,
  },
  jobPosition: {
    type: String,
    required: [true, "Job position is required"],
  },
  monthlySalary: {
    type: String,
    required: [true, "Monthly salary is required"],
  },
  jobType: {
    type: String,
    required: [true, "Job type is required"],
  },
  remoteOnsite: {
    type: String,
    required: [true, "Remote/Onsite is required"],
  },
  jobLocation: {
    type: String,
  },
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
  },
  aboutCompany: {
    type: String,
    required: [true, "About company is required"],
  },
  skillsRequired: {
    type: [String],
    required: [true, "Skills required is required"],
  },
  information: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const jobDescription = mongoose.model("JobListing", jobDescriptionSchema);

module.exports = jobDescription;
