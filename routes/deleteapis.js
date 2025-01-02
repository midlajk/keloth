var express = require('express');
var router = express.Router();
const adminpostapis = require('../controller/deleteapis');
const authMiddleware = require('../middleware/authcheck.js');
const loginMiddleware = require('../middleware/logincheck.js');

/* GET home page. */
router.delete('/deletepurchasecommitments/:id/:name',authMiddleware, adminpostapis.deletepurchasecommitment);
router.delete('/deletesalescommitments/:id/:name',authMiddleware, adminpostapis.deletesalescommitments);
router.delete('/bills/:billId/:name',authMiddleware, adminpostapis.deletepurchasebill);
router.delete('/sbills/:billId/:name',authMiddleware, adminpostapis.deletesalesbill);
router.delete('/deleteuser',authMiddleware, adminpostapis.deleteuser);
router.delete('/transaction/:id/:name',authMiddleware, adminpostapis.deletetransaction);
router.delete('/deletepurchase/:id/:name',authMiddleware, adminpostapis.deletepurchase);
router.delete('/deletesales/:id/:name',authMiddleware, adminpostapis.deletesales);
router.delete('/expencesandincome/:id/:name',authMiddleware, adminpostapis.deleteexpencesandincome);
router.delete('/deleteagent',authMiddleware, adminpostapis.deleteagent);
router.delete('/deleteagentdata',authMiddleware, adminpostapis.deleteagentdata);
router.delete('/deleteloadingwork',loginMiddleware, adminpostapis.deleteloadingwork);


module.exports = router;
