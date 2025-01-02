var express = require('express');
var router = express.Router();
const adminget = require('../controller/editapis');
const authcheck = require('../middleware/authcheck');
const loginMiddleware = require('../middleware/logincheck.js');

/* GET home page. */
router.get('/editentry/:idname/:id',authcheck, adminget.editentry);
router.get('/editsalesentry/:idname/:id',authcheck, adminget.editsalesentry);

router.post('/edit-bill',authcheck, (req, res, next) => {
    // Check the value of req.body.billtype

    if (req.body.billtype === 'Sales') {
      // If billType is 'sales', route to generatesalesreport
      adminget.editsales(req, res);
    } else {
      // For any other value or if not specified, route to generatepurchasereport
      adminget.editpurchase(req, res);

    }
});

router.get('/viewcurrentreport',authcheck,  (req, res) => {
    // Check the value of req.query.status
    if (req.query.status === 'Purchase') {
        adminget.viewcurrentpurchasereport(req, res);

        // If status is 'Purchase', render the current purchase report
        // Render your current purchase report template
    } else {
        adminget.viewcurrentsales(req, res);

        // If status is not 'Purchase', assume it's for sales report
        // Render your current sales report template
    }
});
router.post('/updateproduct',authcheck, adminget.updateproduct);
router.post('/deleteproduct',authcheck, adminget.deleteproduct);
router.post('/updaterefferencedefault',authcheck, adminget.updaterefferencedefault);
router.post('/editvariables',authcheck, adminget.editvariables);
router.post('/updatestock',authcheck, adminget.updatestock);


router.post('/editseller',authcheck, adminget.editseller);
router.post('/editagent',loginMiddleware, adminget.editagent);

router.post('/deliverymarked',loginMiddleware, adminget.deliverymarked);
router.post('/updateloadinworkDetails',loginMiddleware, adminget.updateloadinworkDetails);

module.exports = router;
