import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/User.route.js";
import categoryRouter from "./routes/Category.route.js";
import adminRouter from "./routes/Admin.route.js";
import foodRouter from "./routes/Food.route.js";
import cartRouter from "./routes/Cart.route.js";
import addressRouter from "./routes/Address.route.js";
import orderRouter from "./routes/Order.route.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/", adminRouter);

app.use("/api/v1/users", userRouter);

app.use("/api/v1/category", categoryRouter);

app.use("/api/v1/food", foodRouter);

app.use("/api/v1/cart", cartRouter);

app.use("/api/v1/address", addressRouter);
// app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/orders", orderRouter);
app.use(errorHandler);

export { app };
