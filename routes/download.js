var express = require('express');
var router = express.Router();
const downloadget = require('../controller/download');
const authcheck = require('../middleware/authcheck');
router.get('/downloadarrivals/:name',authcheck, downloadget.downloadarrivals);
router.get('/downloaddespatch/:name',authcheck, downloadget.downloaddespatch);
router.post('/downloadloadersreport',authcheck, downloadget.downloadloaders);
router.post('/downloadtransportreport',authcheck, downloadget.downloadtransport);
router.post('/downloadallaccounts',authcheck, downloadget.downloadallaccounts);
router.post('/individualloadingworks',authcheck, downloadget.individualloadingworks);
router.post('/downloademployeereport',authcheck, downloadget.downloademployeereport);
router.post('/downloadincomeexpensereport',authcheck, downloadget.downloadincomeexpensereport);

module.exports = router;
