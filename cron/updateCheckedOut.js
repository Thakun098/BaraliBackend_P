const db = require("../app/models");
const { Op } = require("sequelize");
const Booking = db.booking;

async function updateCheckedOut() {
  const now = new Date();

  await Booking.update(
    { checkedOut: true},
    {
      where: {
        checkedOut: false,
        checkOutDate: { [Op.lt]: now }
      }
    }
  );

  console.log(`[Cron] Updated checkedOut at ${now.toISOString()}`);
  console.log("[Cron] Current time (UTC):", new Date().toISOString());

}
module.exports = updateCheckedOut;
