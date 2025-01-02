var express = require('express');
var router = express.Router();
const adminget = require('../controller/getdetailedview');
const authcheck = require('../middleware/authcheck');
const loginMiddleware = require('../middleware/logincheck.js');

/* GET home page. */
router.get('/purchaseaccount/:name',authcheck, adminget.individualpurchaseaccount);


router.get('/getdetailedreport',authcheck, adminget.getdetailedreport);
router.get('/ieaccount',loginMiddleware, adminget.ieaccount);
router.get('/idaaccount',loginMiddleware, adminget.idaaccount);



module.exports = router;
