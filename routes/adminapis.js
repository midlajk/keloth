var express = require('express');
var router = express.Router();
const dashboardApis = require('../controller/dashboardapis');
const authMiddleware = require('../middleware/authcheck.js');

/* GET home page. */
router.get('/dashboard',authMiddleware, dashboardApis.dashboardapi);


module.exports = router;
