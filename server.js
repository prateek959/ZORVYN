import express from 'express';
import db from './config/db.js';
import userRoutes from './routes/user.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import authRoutes from './routes/auth.routes.js';
import RecordRoutes from './routes/records.routes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());


app.use('/users', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/auth', authRoutes);
app.use('/records', RecordRoutes);

const PORT = 3002;
app.listen(PORT, async () => {
    await db();
    console.log(`Server is Running on ${PORT}`)
})