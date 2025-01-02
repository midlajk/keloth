var express = require('express');
var router = express.Router();
const pdfMaster = require("pdf-master");
const mongoose = require('mongoose');

const ClientModel = mongoose.model('Client')
const Reference = mongoose.model('Reference')
const authMiddleware = require('../middleware/authcheck.js');
const Financialyear = mongoose.model('Financialyear')
const loginMiddleware = require('../middleware/logincheck.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login',{ title: 'Express' });
});
router.get('/dashboard',loginMiddleware, async function(req, res, next) {

  res.render('dashboard',{ route: 'dashboard' });

  // res.render('dashboard',{ route: 'dashboard' });
});
router.get('/generatereport',authMiddleware, async function(req, res, next) {
  var date = req.session.workingdate || new Date()
  const workingdate = new Date(date).toISOString().split('T')[0]

   const reference = await Reference.findOne({})
    .sort({ defaulted: -1 }) // Sort by 'defaulted' date in descending order
    
    res.render('generatereport',{ route: 'generatereport',refferance:reference?reference.name:'' ,workingdate:workingdate});
});
router.get('/accounts',authMiddleware, function(req, res, next) {
  res.render('accounts',{ route: 'accounts' });
});
router.get('/transactions',authMiddleware, function(req, res, next) {
  res.render('transactions',{ route: 'transactions' });
});
router.get('/expencesandincome',authMiddleware, function(req, res, next) {
  res.render('expencesandincome',{ route: 'expencesandincome' });
});
router.get('/purchasedelivered',authMiddleware, function(req, res, next) {
  res.render('purchasedelivered',{ route: 'purchasedelivered' });
});
router.get('/purchasestorage',authMiddleware, function(req, res, next) {
  res.render('purchasestorage',{ route: 'purchasestorage' });
});
router.get('/salesdelivered',authMiddleware, function(req, res, next) {
  res.render('salesdelivered',{ route: 'salesdelivered' });
});
router.get('/salesstorage',authMiddleware, function(req, res, next) {
  res.render('salesstorage',{ route: 'salesstorage' });
});
router.get('/purchaseaccount',authMiddleware, function(req, res, next) {
  res.render('salesstorage',{ route: 'salesstorage' });
});
router.get('/settings',authMiddleware, async function(req, res, next) {
  const reference = await Reference.findOne({})
    .sort({ defaulted: -1 })
    const year = await Financialyear.findOne({})
    .sort({ defaulted: -1 })
  res.render('settings',{ route: 'settings',user:req.session.user ,refferance:reference?reference.name:'',year:year?year.year:'' });
});
router.get('/deliveryagents',loginMiddleware, function(req, res, next) {
  res.render('deliveryagents',{ route: 'deliveryagents' });
});
router.get('/loaders',loginMiddleware, function(req, res, next) {
  res.render('loaders',{ route: 'loaders' });
});
router.get('/purchases',authMiddleware, function(req, res, next) {
  res.render('purchase',{ route: 'purchases' });
});
router.get('/sales',authMiddleware, function(req, res, next) {
  res.render('sales',{ route: 'sales' });
});
router.get('/commitments',authMiddleware, function(req, res, next) {
  res.render('commitments',{ route: 'commitments' });
});
router.get('/getpurchasecommitmentreport/:products',authMiddleware, function(req, res, next) {
  res.render('detailedcommitments',{ route: 'commitments',product:req.params.products,type:'purchase',  });
});
router.get('/getsalescommitmentreport/:products',authMiddleware, function(req, res, next) {
  res.render('detailedcommitments',{ route: 'commitments',product:req.params.products,type:'sale', });
});
router.get('/report',authMiddleware, function(req, res, next) {
  res.render('report',{ route: 'report' });
});
router.get('/employees',loginMiddleware, function(req, res, next) {
  res.render('employees',{ route: 'employees' });
});
router.get('/expenceincome',loginMiddleware, function(req, res, next) {
  res.render('expenceincome',{ route: 'expenceincome' });
});
router.get('/loadinworks',loginMiddleware, function(req, res, next) {
  res.render('loadinworks',{ route: 'loadinworks' });
});
router.get('/allpuchasecommitments',authMiddleware, function(req, res, next) {
  res.render('allpcommitments',{ route: 'commitments' });
});
router.get('/allsalescommitments',authMiddleware, function(req, res, next) {
  res.render('allscommitments',{ route: 'commitments' });
});

router.get('/ieaccount/:employee',loginMiddleware, function(req, res, next) {
  res.render('iaccounts/ieemployee',{ route: 'employees',employee:req.params.employee });
});

router.get('/idaaccount/:employee',loginMiddleware, function(req, res, next) {
  res.render('iaccounts/idaaccount',{ route: 'deliveryagents',employee:req.params.employee });
});
router.get('/ialoaders/:employee',loginMiddleware, function(req, res, next) {
  res.render('iaccounts/ialoaders',{ route: 'loaders',employee:req.params.employee });
});
router.get('/ieiaccounts/:employee',loginMiddleware, function(req, res, next) {
  res.render('iaccounts/ieiaccounts',{ route: 'expenceincome',employee:req.params.employee });
});

router.get('/indivdualoadingworks/:employee',loginMiddleware, function(req, res, next) {
  res.render('iaccounts/individuallodingworks',{ route: 'loaders',employee:req.params.employee });
});

router.get('/trashinside',authMiddleware, function(req, res, next) {
  res.render('trashinside',{ route: 'trashinside' });
});
router.get('/trashoutside',authMiddleware, function(req, res, next) {
  res.render('trashoutside',{ route: 'trashoutside' });
});
module.exports = router;
