import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session, { Cookie } from "express-session";
import bodyParser from "body-parser";
import errorHandler from "./utils/errorHandler";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import Expert from "./models/Expert/Expert";
import User from "./models/User/User";

const app = express();

main()
  .then(() => {
    console.log("DB connected succesfully");
  })
  .catch((err) => {
    console.log("DB connect error");
    console.log(err.message);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ayurpath");
}

const store = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/sportsbuddy",
  crypto: {
    secret: process.env.SECRET || "My secret code",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error occured in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: "MySecretKey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

app.use(bodyParser.json());
app.use(session(sessionOptions));

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

// passport.use(
//   "student",
//   new localStrategy({ usernameField: "email" }, Student.authenticate())
// );

passport.serializeUser(
  (
    entity: any,
    done: (err: any, user?: { id: string; type: string }) => void
  ) => {
    done(null, { id: entity._id, type: entity.role });
  }
);

passport.deserializeUser(
  (
    obj: { id: string; type: string },
    done: (err: any, user?: any) => void
  ): void => {
    switch (obj.type) {
      case "expert":
        Expert.findById(obj.id).then((user) => {
          if (user) {
            done(null, user);
          } else {
            done(new Error("Client id not found:" + obj.id));
          }
        });
        break;
        case "user":
          User.findById(obj.id).then((user) => {
            if (user) {
              done(null, user);
            } else {
              done(new Error("Client id not found:" + obj.id));
            }
          });
          break;
      default:
        done(new Error("no entity type:" + obj.type));
        break;
    }
  }
);

app.get("/", (req: Request, res: Response) => {
  res.json("Success");
});

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

app.listen(port, () => {
  console.log("Server listening on port : ", port);
});
