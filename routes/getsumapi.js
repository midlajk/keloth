var express = require('express');
var router = express.Router();
const adminpostapis = require('../controller/getsumforaccounts.js');
const authcheck = require('../middleware/authcheck');
const loginMiddleware = require('../middleware/logincheck.js');

/* GET home page. */
router.get('/getpurchasesum',authcheck, adminpostapis.getpurchasesum);
router.get('/getsalessum',authcheck, adminpostapis.getsalessum);

router.get('/getcommitmentsum',authcheck, adminpostapis.getcommitmentsum);

router.get('/commitmenttotal',authcheck, adminpostapis.commitmenttotal);

router.get('/expenseincometotal',loginMiddleware, adminpostapis.expenseincometotal);
router.get('/agentsum/:name',loginMiddleware, adminpostapis.agentsum);

module.exports = router;
