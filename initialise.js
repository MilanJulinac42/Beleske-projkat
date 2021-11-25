const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const Beleske = require("./model/Beleske");
const User = require("./model/User");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

const beleske = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/beleske.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const importData = async () => {
  try {
    await Beleske.create(beleske);
    await User.create(users);
    console.log("Podaci importovani...");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Beleske.deleteMany();
    await User.deleteMany();
    console.log("Podaci obrsiani...");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == "-import") {
  importData();
} else if (process.argv[2] == "-delete") {
  deleteData();
}
