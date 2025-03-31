import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from "http";
import { Server } from "socket.io"

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*"
        : process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  })
);



app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouters from "./routes/user.routes.js"
import chatRouters from "./routes/chat.routes.js"
import messageRouters from "./routes/message.routes.js"
import helthCheckRouters from "./routes/helth.routes.js"
import { errorHandler } from "./middlewares/error.middlewares.js"
import { initializeSocketIO } from "./socket/index.js";

//routes declaration
app.use("/api/v1/users", userRouters)
app.use("/api/v1/chats", chatRouters)
app.use("/api/v1/messages", messageRouters)
app.use("/api/v1/health_check", helthCheckRouters)
initializeSocketIO(io);

app.use(errorHandler)
export { httpServer }