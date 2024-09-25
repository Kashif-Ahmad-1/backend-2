const express = require("express");
const { saveChecklist, upload,getChecklists } = require("../controllers/checklistController");

const router = express.Router();

// Route to save checklist and upload PDF
router.post("/", upload.single('pdf'), saveChecklist);
router.get("/", getChecklists); // New endpoint
module.exports = router;
