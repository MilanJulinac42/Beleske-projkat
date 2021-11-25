const express = require("express");
const dontenv = require("dotenv");
const logger = require("./middleware/logger");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");

const schedule = require("node-schedule");
const sendEmail = require("./utils/sendEmail");
const Beleske = require("./model/Beleske");
const User = require("./model/User");

dontenv.config({ path: "./config/config.env" });

connectDB();

const scheduleHandler = async () => {
  const beleske = await Beleske.find();
  for (let obj of beleske) {
    const user = await User.findById(obj.user);
    const options = {
      email: user.email,
      subject: obj.title,
      message: obj.content,
    };

    const job = schedule.scheduleJob(obj.id, obj.remindAt, function () {
      sendEmail(options);
    });
  }
};

scheduleHandler();

const beleske = require("./routes/beleske");
const auth = require("./routes/auth");
const users = require("./routes/users");

const app = express();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(logger);
}

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

app.use("/api/beleske", beleske);
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
