// External libraries
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";

// Internal project modules
import connectMongoDB from "./connectDB";
import { PORT } from "./config";
import authenticationRoute from "./routes/authenticationRoute";
import userRoute from "./routes/userRoute";
import voucherRoute from "./routes/voucherRoute";
import productRoute from "./routes/productRoute";

// Initialize Express Application
const app: Application = express();
const port: string | number = PORT;

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Test root",
  });
});

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // allow for sending JWT cookies
};

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Route Handlers
app.use("/authentication", authenticationRoute);
app.use("/users", userRoute);
app.use("/vouchers", voucherRoute);
app.use("/products", productRoute);

// Start Server and Connect to Database
app.listen(port, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
