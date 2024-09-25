const express = require("express");
const { saveChecklist, upload,getAllChecklists,editChecklist,deleteChecklist } = require("../controllers/checklistController");

const router = express.Router();

// Route to save checklist and upload PDF
router.post("/", upload.single('pdf'), saveChecklist);
router.get("/", getAllChecklists); // New endpoint
router.put("/:id", editChecklist); // New endpoint
router.delete("/:id", deleteChecklist);
module.exports = router;
