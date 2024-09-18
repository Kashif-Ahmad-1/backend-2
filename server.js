const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const machineRoutes = require('./routes/machineRoutes'); // Import machine routes
const companyRoutes = require('./routes/companyRoutes'); // Import company routes
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
