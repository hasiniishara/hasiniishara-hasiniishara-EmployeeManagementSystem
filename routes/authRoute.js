const passport = require('passport')
const express = require('express')
const checkRoles = require("../middleware/checkRole");
const {register, login, getAllEmployees, viewEmployee, updateEmployee, deleteEmployee} = require('../controller/authController')

const router = express.Router();

router.post('/register', passport.authenticate("jwt", { session: false }),checkRoles(["Admin"]), register)

router.post('/login', login)

router.get("/", passport.authenticate("jwt", { session: false }), checkRoles(["Admin"]), getAllEmployees);

router.get("/:id", viewEmployee);

router.patch("/:id", updateEmployee);

router.delete("/:id", passport.authenticate("jwt", { session: false }),checkRoles(["Admin"]), deleteEmployee);


module.exports = router;
