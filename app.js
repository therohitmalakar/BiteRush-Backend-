import express from "express";
import dotenv from "dotenv"
dotenv.config();
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js"
import cors from "cors"


connectDb();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://bite-rush-rosy.vercel.app",
  "https://bite-rush-backend-git-main-therohitmalakars-projects.vercel.app/"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  })
);

// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))

app.use("/user", userRoute);


app.get('/', (req, res) => {
  res.send("hello")
})

app.listen(port, () => {
  console.log(`App is running at port ${port}`);
})