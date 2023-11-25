const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const postRoutes = require("./routes/post");
const getRoutes = require("./routes/get");
const authRoutes = require("./routes/auth");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", [postRoutes, getRoutes]);
app.use("/auth", authRoutes);

const port = process.env.PORT || 5173;
app.listen(port, async () => console.log(`App listening on port ${port}`));
