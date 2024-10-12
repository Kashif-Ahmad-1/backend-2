const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const machineRoutes = require('./routes/machineRoutes');
const companyRoutes = require('./routes/companyRoutes');
const path = require('path');
const checklistRoutes = require("./routes/checklistRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs'); // Add this line at the top


dotenv.config();
const app = express();


app.use(cors({
    origin: ['http://localhost:3000', 'https://carservice-frontend-1i3i.vercel.app'], // Allow both localhost and deployed frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you need to send cookies
}));
app.options('*', cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/companies', companyRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/quotations", quotationRoutes);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




// Initial templates
const templatesFilePath = './templates.json';

// Load templates from file
const loadTemplates = () => {
  if (!fs.existsSync(templatesFilePath)) {
    fs.writeFileSync(templatesFilePath, JSON.stringify({
      template1: "Hello! 📄\n\nWe have generated a new PDF document for you.\n\n📑 **Document Title**: Document Title Here\n✍️ **Description**: Brief description of what this PDF contains.\n🔗 **Download Link**: {pdfUrl}\n\nIf you have any questions, feel free to reach out!\n\nThank you! 😊",
      template2: "Hi! 👋\n\nYour requested document is ready!\n\n📄 **Title**: Your Document Title\n📋 **Details**: This is a brief description of your document.\n🔗 **Access the document**: {pdfUrl}\n\nLet us know if you need any further assistance!\n\nCheers! 😊"
    }));
  }
  return JSON.parse(fs.readFileSync(templatesFilePath));
};

app.get('/templates', (req, res) => {
    try {
      const templates = loadTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  app.post('/templates', (req, res) => {
    try {
      const { template1, template2 } = req.body;
      fs.writeFileSync(templatesFilePath, JSON.stringify({ template1, template2 }));
      res.json({ message: 'Templates saved successfully!' });
    } catch (error) {
      console.error("Error saving templates:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  
app.get('/',(req,res)=>{
  res.json({message: "Hello this is kashif"})
})
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log('Server has been successfully deployed!'); // Confirmation message
});
