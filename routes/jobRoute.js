const express = require("express");
const JobDescription = require("../schemas/job_description");

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

const addJob = async (req, res) => {
  try {
    const { 
        companyName,
        addLogoURL,
        jobPosition, 
        monthlySalary, 
        jobType, 
        remoteOnsite, 
        jobLocation, 
        jobDescription, 
        aboutCompany, 
        skillsRequired,
    } = req.body;

    // Check if all the required fields are provided
    if (
      !companyName ||
      !jobPosition ||
      !jobDescription ||
      !skillsRequired ||
      !aboutCompany ||
      !monthlySalary ||
      !jobType ||
      !remoteOnsite ||
      !addLogoURL
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // If jobType is "remote", set jobLocation to empty string
    const updatedJobLocation = jobLocation === "" ? "Remote" : jobLocation;

    const updatedLogoURL = req.body.addLogoURL
      ? req.body.addLogoURL
      : "https://eu.ui-avatars.com/api/?name=John+Doe&size=250";

    // Create a new job listing
    const newJobListing = new JobDescription({
      companyName,
      addLogoURL: updatedLogoURL,
      jobPosition,
      monthlySalary,
      jobType,
      remoteOnsite,
      jobLocation: updatedJobLocation,
      jobDescription,
      aboutCompany,
      skillsRequired,
    });

    await newJobListing.save();

    res.status(201).json({ message: "Job listing created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      companyName,
      addLogoURL,
      jobPosition,
      monthlySalary,
      jobType,
      remoteOnsite,
      jobLocation,
      jobDescription,
      aboutCompany,
      skillsRequired,
    } = req.body;

    // Check if all the required fields are provided
    if (
      !companyName ||
      !jobPosition ||
      !jobDescription ||
      !skillsRequired ||
      !aboutCompany ||
      !monthlySalary ||
      !jobType ||
      !remoteOnsite ||
      !addLogoURL
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const updatedJobLocation = jobLocation === "" ? "Remote" : jobLocation;

    const updatedLogoURL = req.body.addLogoURL
      ? req.body.addLogoURL
      : "https://eu.ui-avatars.com/api/?name=John+Doe&size=250";

    // Find the existing job listing by ID
    const jobListing = await JobDescription.findById(jobId);

    if (!jobListing) {
      return res.status(404).json({ error: "Job listing not found" });
    }

    // Update the job listing fields
    jobListing.companyName = companyName;
    jobListing.addLogoURL = updatedLogoURL;
    jobListing.jobPosition = jobPosition;
    jobListing.monthlySalary = monthlySalary;
    jobListing.jobType = jobType;
    jobListing.remoteOnsite = remoteOnsite;
    jobListing.jobLocation = updatedJobLocation;
    jobListing.jobDescription = jobDescription;
    jobListing.aboutCompany = aboutCompany;
    jobListing.skillsRequired = skillsRequired;

    // Save the updated job listing
    await jobListing.save();

    res.status(200).json({ message: "Job listing updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { skills, searchTerm } = req.query;

    const filter = {};
    if (skills) filter.skillsRequired = { $in: skills.split(",") };
    if (searchTerm) filter.jobPosition = new RegExp(searchTerm, "i");

    // Find job listings that match the filter
    const jobListings = await JobDescription.find(filter);

    res.status(200).json({ jobListings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOneJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    // Find the job listing by ID
    const jobListing = await JobDescription.findById(jobId);

    if (!jobListing) {
      return res.status(404).json({ error: "Job listing not found" });
    }

    res.status(200).json({ jobListing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const jobRouter = express.Router();

jobRouter.route("/job-posting").post(authenticateUser, addJob);     // Create a new job listing (protected route)
jobRouter.route("/job-posting/:id").put(authenticateUser, updateJob);   //Update any job posted
jobRouter.route("/jobs").get(getAllJobs);       // List all jobs with filters based on skills
jobRouter.route("/jobs/:id").get(getOneJob);    // Show the detailed description of a job post


module.exports = jobRouter;