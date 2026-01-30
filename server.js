const express = require("express");
require("dotenv/config");
const cron = require("node-cron");
const app = express();
const db = require("./app/models");
const cors = require("cors");
const path = require("path");
const updateOverduePayments = require("./cron/updateOverduePayments");
const updateCheckedOut = require("./cron/updateCheckedOut");
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

db.receipt.sync({ alter: true })
    .then( () => {
        console.log("receipt Altered ✅")
    }
    )
db.sequelize.sync({ force: false })
    .then(() => {
        console.log("✅ Database Sync...")
    })

cron.schedule("*/2 * * * *", () => {
  updateOverduePayments();
    updateCheckedOut();
});

app.get('/', (req, res) => {
    res.send('Hello Elyia');
});
require("./app/routes/auth.routes")(app);
require("./app/routes/accommodation.routes")(app);
require("./app/routes/activity.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/caltest.routes")(app);
require("./app/routes/booking.routes")(app);
require("./app/routes/payment.routes")(app);

const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port} `)
});



