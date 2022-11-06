const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const router = require("./routes/router.js");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());

require("dotenv").config();
const PORT = process.env.PORT || 3000;

mongoose.connect(
    process.env.MONGODB_URI,
    () => console.log("Connected to Database"),
    (err) => console.log(err)
);

app.use("/", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
