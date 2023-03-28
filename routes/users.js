var express = require("express");
var router = express.Router();
const controllers = require("../controllers/user.controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/", controllers.getUsers);
router.get("/:id", controllers.getUserById);
router.post("/", controllers.updateUser);
router.put("/:id", controllers.createUser);
router.delete("/:id", controllers.deleteUser);

module.exports = router;
