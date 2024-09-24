const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const machineRoutes = require('./routes/machineRoutes'); // Import machine routes
const companyRoutes = require('./routes/companyRoutes'); // Import company routes
const path = require('path');
const checklistRoutes = require("./routes/checklistRoutes");
// const quotationRoutes = require('./routes/quotationRoutes');
const multer = require('multer');
dotenv.config();
const cors = require('cors');
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you need to send cookies
  }));
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/machines', machineRoutes); 
app.use('/api/companies', companyRoutes); 


app.use("/api/checklist", checklistRoutes);
// app.use('/api/quotations', quotationRoutes);





// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// quotations

const quotationSchema = new mongoose.Schema({
  appointmentId: String,
  quotationData: Object,
  pdfPath: String,
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
});

const Quotation = mongoose.model('Quotation', quotationSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

const upload = multer({ storage });

// Route to handle PDF upload and quotation data
app.post('/api/quotations', upload.single('fileField'), async (req, res) => {
  try {
    const { appointmentId, quatationData } = JSON.parse(req.body.quatationData);
    const pdfPath = req.file.path;

    const newQuotation = new Quotation({
      appointmentId,
      quotationData: quatationData,
      pdfPath,
    });

    await newQuotation.save();
    res.status(201).json({ message: 'Quotation saved successfully', quotation: newQuotation });
  } catch (error) {
    console.error('Error saving quotation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
