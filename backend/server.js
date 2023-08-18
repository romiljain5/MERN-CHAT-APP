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
const { Server } = require("socket.io");
const path = require("path");

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

// -------------------- Deployment ---------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}
// -------------------- Deployment ---------------------

app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 4001;
const server = app.listen(
  port,
  console.log(`Server started on port ${port}`.yellow.bold)
);

// const io = require("socket.io")(server, {
//   pingTimeout: 60000, //will wait for 60sec for end user to send message and then close connection if no response
//   cors: {
//     origin: "http:localhost:3000", //to avoid cors issue
//   },
// });

const io = new Server(server, {
  pingTimeout: 60000, //will wait for 60sec for end user to send message and then close connection if no response
  cors: {
    origin: "http://localhost:3000", //to avoid cors issue
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    //making room for user exclusive to him
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  //when we click on any of chat it will create room for that particular
  //user and when other user joins it will join him to this room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    //for sending message
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return; //so it does not sends message to sender

      socket.in(user._id).emit("message recieved", newMessageRecieved); //will listen on FE
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
