const express = require("express");
const { saveChecklist, upload } = require("../controllers/checklistController");

const router = express.Router();

// Route to save checklist and upload PDF
router.post("/", upload.single('pdf'), saveChecklist);

module.exports = router;
