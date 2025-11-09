import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import bookRoute from "./Routes/Book-route.js";
import UserRoute from "./Routes/User-route.js";
import checkoutRoutes from "./Routes/checkout-route.js";
import contactRoute from "./Routes/contact-route.js";
import newsletterRoutes from "./Routes/newsletter-route.js";
import { connectMongo } from "./lib/mongoose.js";
import "./Models/index.js";

dotenv.config();

const app = express();
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5000;

app.use(express.json());

const apiRouter = express.Router();
apiRouter.use("/book", bookRoute);
apiRouter.use("/user", UserRoute);
apiRouter.use("/checkout", checkoutRoutes);
apiRouter.use("/contact", contactRoute);
apiRouter.use("/newsletter", newsletterRoutes);
app.use("/api", apiRouter);

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Remove catch-all route since backend only serves API + static files
// Frontend (Vite) handles its own routing

async function start() {
  try {
    await connectMongo();
    console.log("MongoDB connected");
    app.listen(port, () =>
      console.log(`Server started at http://localhost:${port}`)
    );
  } catch (err) {
    console.error("Mongo connection failed:", err);
    process.exit(1);
  }
}

start();
