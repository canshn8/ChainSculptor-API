const { default: mongoose } = require("mongoose");
const Job = require("../model/Job");
const User = require("../model/User");

exports.addJob = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "Employer") {
            return res.status(403).json({ message: "Only employers can post jobs!" });
        }

        const { title, description, categories, budget, deliveryTime, jobType, status, portfolio, evaluation, escrowStatus, paymentStatus } = req.body;

        if (!title || !description || !categories || !budget || !deliveryTime || !jobType) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newJob = new Job({
            title,
            description,
            categories,
            budget: {
                min: budget?.min || 0,
                max: budget?.max || 0
            },
            deliveryTime,
            employer: user._id,
            jobType: jobType,
            status: status || "Open",
            portfolio: portfolio || "",
            evaluation: evaluation || "",
            escrowStatus: escrowStatus || "Pending",
            paymentStatus: paymentStatus || "Pending",
            freelancerApplications: [],
        });

        const savedJob = await newJob.save();
        res.status(201).json({ success: true, job: savedJob });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};



exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found!" });
        }

        if (job.employer.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this job!" });
        }

        const { employer, freelancerApplications, escrowStatus, paymentStatus, ...updateFields } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, job: updatedJob });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found!" });
        }

        if (job.employer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this job!" });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Job successfully deleted!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};


exports.getJob = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid job ID" });
        }

        const findJob = await Job.findById(req.params.id).populate({
            path: "employer",
            select: "name email"
        });

        if (!findJob) {
            return res.status(404).json({ success: false, message: "Job not found!" });
        }

        res.status(200).json({ success: true, job: findJob });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error", error: err.message });
    }
};


exports.getJobs = async (req, res) => {
    try {
        const { new: qNew, category, jobType, page = 1, limit = 10 } = req.query;

        let filter = {};

        if (category) {
            filter.categories = category; 
        }

        if (jobType) {
            filter.jobType = jobType; 
        }

        let jobsQuery = Job.find(filter).sort({ createdAt: -1 });

        if (qNew) {
            jobsQuery = jobsQuery.limit(1);
        } else {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            jobsQuery = jobsQuery.skip(skip).limit(parseInt(limit)); 
        }

        const jobs = await jobsQuery;

        res.status(200).json({
            success: true,
            count: jobs.length,
            page: parseInt(page),
            limit: parseInt(limit),
            data: jobs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
