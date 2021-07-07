const { Router } = require("express");
const UserController = require('../controller/user');
const {validator} = require('../middleware/validate');
const {userValidation} = require('../validator/index');

const router = Router();
const {createUser, getAllUsers, getUserByID} = UserController;

// endpoints
router.post('/', validator(userValidation), createUser)
router.get('/users', getAllUsers)
router.get('/users/:userId', getUserByID)

module.exports = router;
