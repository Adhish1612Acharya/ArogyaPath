import { config as dotEnvConfig } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotEnvConfig();
}

import path from "path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import bodyParser from "body-parser";
import errorHandler from "./utils/errorHandler.js";
import chatRoutes from "./routes/Chat.js";
// import { Server } from 'socket.io';
// import http from "http";
// import { Server } from "socket.io";
// import initSocket from "./socket.js";

import successStoryRoute from "./routes/SuccessStory.js";

import { Strategy as localStrategy } from "passport-local";
import Expert from "./models/Expert/Expert.js";
import User from "./models/User/User.js";

import userGoogleAuth from "./routes/auth/googleUserAuth.js";
import expertGoogleAuth from "./routes/auth/googleExpertAuth.js";
import expertEmailPasswordAuth from "./routes/auth/expertEmailPassowrdAuth.js";
import userEmailPasswordAuth from "./routes/auth/userEmailPasswordAuth.js";
import postRoute from "./routes/Post.js";
import routinesRoute from "./routes/Routines.js";
import expertRoute from "./routes/Expert.js";
import userRoutes from "./routes/User.js";
import prakrathiRoutes from "./routes/Prakrathi.js";
import healthChallenge from "./routes/healthChallenge.js";
import commonAuthRouter from "./routes/auth/commonAuth.js";

import passport from "passport";
import MongoStore from "connect-mongo";

import aiFeaturesRoute from "./routes/aiFeature.js";

// dotenv.config();
const app = express();

//socket connection
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// Initialize Socket.IO
// initSocket(io);

main()
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("DB connect error");
    console.log(err.message);
  });

async function main() {
  await mongoose.connect(
    process.env.DB_URL || "mongodb://127.0.0.1:27017/ayurpath"
  );
}

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL || "mongodb://127.0.0.1:27017/ayurpath",
  crypto: {
    secret: process.env.SECRET || "My secret code",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error occurred in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "MySecretKey",
  resave: false,
  saveUninitialized: false, // ⬅️ Ensure only authenticated sessions are stored
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};
// const server = http.createServer(app);
// const io = new Server(server);

app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "expert",
  new localStrategy({ usernameField: "email" }, Expert.authenticate())
);

passport.use(
  "user",
  new localStrategy({ usernameField: "email" }, User.authenticate())
);

passport.serializeUser((entity, done) => {
  done(null, { id: entity._id, type: entity.role });
});

passport.deserializeUser((obj, done) => {
  switch (obj.type) {
    case "expert":
      Expert.findById(obj.id).then((user) => {
        if (user) {
          done(null, user);
        } else {
          done(new Error("Client id not found: " + obj.id));
        }
      });
      break;
    case "user":
      User.findById(obj.id).then((user) => {
        if (user) {
          done(null, user);
        } else {
          done(new Error("Client id not found: " + obj.id));
        }
      });
      break;
    default:
      done(new Error("No entity type: " + obj.type));
      break;
  }
});

app.get("/api/user/data", (req, res) => {
  res.status(200).json({
    userEmail: req.user.email,
  });
});

app.use("/api/ai", aiFeaturesRoute);

app.use("/api/auth", commonAuthRouter);
app.use("/api/auth/expert", expertEmailPasswordAuth);
app.use("/api/auth/user", userEmailPasswordAuth);

app.use("/api/posts", postRoute);
app.use("/api/success-stories", successStoryRoute);
app.use("/api/routines", routinesRoute);
app.use("/api/experts", expertRoute);
app.use("/api/users", userRoutes);
app.use("/api/prakrithi", prakrathiRoutes);
app.use("/api/healthChallenge", healthChallenge);
app.use("/api/chat", chatRoutes);

app.use("/api/auth/google/expert", expertGoogleAuth);
app.use("/api/auth/google/user", userGoogleAuth);

// app.get("/check", (req, res) => {
//   console.log("Logged IN : ", req.isAuthenticated());
//   res.json("LoggedIn : ");
// });

// app.get("/debug-session", (req, res) => {
//   console.log(" Session Details:", req.session);
//   console.log(" Authenticated User:", req.user);
//   res.json({ session: req.session, user: req.user });
// });

// -------------------Deployment------------------//

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "local") {
//   app.use(express.static(path.join(__dirname1, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.join(__dirname1, "../", "frontend", "dist", "index.html")
//     );
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.json("Success");
//   });
// }

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "local") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json("Success");
  });
}

// -------------------Deployment------------------//

// app.get("/login", (req, res) => {
//   const buildPath = path.join(__dirname1, "../frontend/dist");
//   res.sendFile(path.join(buildPath, "index.html"));
// });

app.use(errorHandler);

const port = process.env.PORT || 3000;

// io.on('connection', (socket) => {

//   console.log(`Connected: ${socket.user._id}`);

//   //socket.on('joinRoom', (roomId) => socket.join(roomId));

//   socket.on('disconnect', () => console.log(`Disconnected: ${socket.user._id}`));

// });

app.listen(port, () => {
  console.log("Server listening on port: ", port);
});

//SOCKET CONNECTION

// // Start the server
// server.listen(8080, () => console.log("Server running on http://localhost:8080"));
