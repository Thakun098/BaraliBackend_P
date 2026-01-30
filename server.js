const express = require("express");
require("dotenv/config");
const cron = require("node-cron");
const app = express();
const db = require("./app/models");
const cors = require("cors");
const path = require("path");
const updateOverduePayments = require("./cron/updateOverduePayments");
const updateCheckedOut = require("./cron/updateCheckedOut");

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

db.sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database Sync...");
});
cron.schedule("*/2 * * * *", () => {
  updateOverduePayments();
  updateCheckedOut();
});
require("./app/routes/auth.routes")(app);
require("./app/routes/accommodation.routes")(app);
require("./app/routes/activity.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/caltest.routes")(app);
require("./app/routes/booking.routes")(app);
require("./app/routes/payment.routes")(app);

// Health check / Index route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Railway uses PORT, fallback to SERVER_PORT or 5000
const port = process.env.PORT || process.env.SERVER_PORT || 5000;
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
