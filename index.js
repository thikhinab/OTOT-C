const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const rootRouter = require("./routes/root-router");
const authnRouter = require("./routes/authn-router");
const cookieParser = require("cookie-parser");
const verifyJwt = require("./middleware/verify-jwt");

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

app.use("/", rootRouter);
app.use(verifyJwt);
app.use("/authn", authnRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
