

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routes/contacts");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Contact Manager API is running!");
});

// Contacts API routes
app.use("/api/contacts", contactsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
