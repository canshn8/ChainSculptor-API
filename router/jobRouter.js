const express = require("express");
const router = express.Router();
const jobController = require("../controller/jobController");
const verifyToken = require("../middleware/token/verifyToken");


router.post("/job/addJob", verifyToken, jobController.addJob);

router.put("/job/updateJob/:id", verifyToken, jobController.updateJob);

router.delete("/job/deleteJob/:id",verifyToken, jobController.deleteJob);

router.get("/job/getJob/:id", jobController.getJob);

router.get("/job/getJobs", jobController.getJobs);

module.exports = router;
