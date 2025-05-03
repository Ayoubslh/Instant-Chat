const express = require('express');
const Controller = require('../controllers/EprocessAgentController')
const router = express.Router();
const { getOneById } = require('../controllers/userControllers');

const { protect } = require('../controllers/Authentication');


router.route('/process-emails/:id').post(protect, Controller.processagent);

router.route('/write-email/:id').post(protect, Controller.writeEmail);
router.route('/schedule-calendar/:id').post(protect, Controller.scheduleCalendar);
router.route('/send-custom-email/:id').post(protect,Controller.sendCustomEmail);
router.route('/handle-input').post(protect, Controller.handleInput);






module.exports = router;