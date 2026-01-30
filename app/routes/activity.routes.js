const controller = require("../controllers/activity.controller");
module.exports = (app) => {
    app.get("/api/activity", controller.getAll);
}