const express = require("express");
const { chats } = require("./data/data");
const dotEnv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotEnv.config();

connectDB();
const app = express();
app.use(express.json()); //to accept json data by server
app.use(cors());

// app.get("/route", (req, res) => {
//   res.send("api is running");
// });

app.use("/api/user", userRoutes);
// app.get("/api/chat", (req, res) => {
//   if (req.query.id) {
//     console.log(req.query.id);
//     const singleId = chats.find((chat) => chat._id === req.query.id);
//     res.send(singleId);
//   }
//   res.send(chats);
// });
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 40001;
app.listen(port, console.log(`Server started on port ${port}`.yellow.bold));
