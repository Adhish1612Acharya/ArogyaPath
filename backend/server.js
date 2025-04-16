import { config as dotEnvConfig } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotEnvConfig();
}

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import bodyParser from "body-parser";
import errorHandler from "./utils/errorHandler.js";
import http from 'http';
// import { Server } from 'socket.io';
import Message from './models/Message/Message.js';

import { Strategy as localStrategy } from "passport-local";
import Expert from "./models/Expert/Expert.js";
import User from "./models/User/User.js";

import expertGoogleAuth from "./routes/auth/googleExpertAuth.js";
import userGoogleAuth from "./routes/auth/googleUserAuth.js";
import expertEmailPasswordAuth from "./routes/auth/expertEmailPassowrdAuth.js";
import postRoute from "./routes/Post.js";

import passport from "passport";
import MongoStore from "connect-mongo";

// dotenv.config();
const app = express();

main()
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log("DB connect error");
    console.log(err.message);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ayurpath");
}

const store = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/ayurpath",
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
    secure: process.env.NODE_ENV === "production", // ✅ False for local dev
    sameSite: "lax", // ✅ Prevents cross-origin issues
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

passport.use("expert", new localStrategy(Expert.authenticate()));

passport.use("user", new localStrategy(User.authenticate()));


passport.serializeUser((entity, done) => {
  console.log("Serializing", entity);

  done(null, { id: entity._id, type: entity.role });
});

passport.deserializeUser((obj, done) => {
  console.log("Deserializing", obj);
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

app.get("/", (req, res) => {
  res.json("Success");
});

app.use("/api/auth/expert", expertEmailPasswordAuth);
app.use("/api/posts", postRoute);

// app.use("/auth/google", expertGoogleAuth);
// app.use("/api/auth/google/user", userGoogleAuth);

// app.use("/api/auth/user")

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
