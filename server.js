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

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'https://carservice-frontend-1i3i.vercel.app'], // Allow both localhost and deployed frontend
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
app.use("/api/quotations", quotationRoutes);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// // Template Schema
// const templateSchema = new mongoose.Schema({
//     template: String,
// });

// const Template = mongoose.model('Template', templateSchema);

// // Get template
// app.get('/api/template', async (req, res) => {
//     const template = await Template.findOne({});
//     res.json(template);
// });

// // Save template
// app.post('/api/template', async (req, res) => {
//     await Template.findOneAndUpdate({}, { template: req.body.template }, { upsert: true });
//     res.sendStatus(200);
// });


app.get('/',(req,res)=>{
  res.json({message: "Hello this is kashif"})
})
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log('Server has been successfully deployed!'); // Confirmation message
});
