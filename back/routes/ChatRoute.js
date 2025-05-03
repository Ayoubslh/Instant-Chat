const express = require('express');
const Controller = require('../controllers/promptController')
const router = express.Router()

router.route('/chat').post(Controller.Generate);

module.exports = router;