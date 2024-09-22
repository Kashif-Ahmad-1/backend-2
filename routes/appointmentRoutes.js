const express = require('express');
const { createAppointment, getAppointments, upload } = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating an appointment with an optional file upload
router.post('/', authMiddleware, upload.single('document'), createAppointment);
router.get('/', authMiddleware, getAppointments);
// Route for creating an appointment with file uploads
router.post('/', authMiddleware, upload.fields([
    { name: 'document', maxCount: 1 },
    { name: 'checklistDocument', maxCount: 1 }
  ]), createAppointment);
  
module.exports = router;
