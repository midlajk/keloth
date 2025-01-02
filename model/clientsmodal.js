const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const coffeeSchema = new Schema({
  date: Date,
  referenceselect: String,
  billTo: String,
  transportagent: String,
  lorry: String,
  billtype: String,
  delivery: String,
  remarks: String,
  item: String,
  bags: Number,
  quantity: Number,
  bagweight: Number,
  forignobject: Number,
  weightallowance: Number,
  outern: Number,
  huskpercentage: Number,
  huskcutting: Number,
  moisturepercentage: Number,
  moisturecutting: Number,
  bbpercentage: Number,
  bbcutting: Number,
  berryborepercentage: Number,
  berryborecutting: Number,
  other: Number,
  allowance: Number,
  lotnumber:String,
  netepweight:Number,
  netWeight:Number,
  eppercentage:Number,
  storage:Number,
  stat:String,
  deliverymarked:String

});
const despatch = new Schema({
  date: Date,
  referenceselect: String,
  billTo: String,
  transportagent: String,
  lorry: String,
  billtype: String,
  delivery: String,
  remarks: String,
  item: String,
  bags: Number,
  quantity: Number,
  bagweight: Number,
  forignobject: Number,
  weightallowance: Number,
  outern: Number,
  huskpercentage: Number,
  huskcutting: Number,
  moisturepercentage: Number,
  moisturecutting: Number,
  bbpercentage: Number,
  bbcutting: Number,
  berryborepercentage: Number,
  berryborecutting: Number,
  other: Number,
  allowance: Number,
  lotnumber:String,
  netepweight:Number,
  netWeight:Number,
  eppercentage:Number,
  storage:Number,
  stat:String,
  deliverymarked:String

});


const purchasecommitmentsschema = new Schema({
    item:String,
    name:String,
    date:Date,
    referance:String,
    id:String,
    weight:Number,
    eppercentage:Number,
    balanceweight:Number,
    balance:Number,
    rate:Number,
    additional:String,
    info:String
     // Price/Rate
});
const salescommitmentsschema = new Schema({
    item:String,
    name:String,
    date:Date,
    referance:String,
    id:String,
    weight:Number,
    eppercentage:Number,
    delivered:Number,
    balanceweight:Number,
    balance:Number,
    rate:Number,
    additional:String,
    info:String
     // Price/Rate
});
const purchasebillSchema = new Schema({
  // Define fields for the bill schema
  // Example fields:
  date: Date,
  item: String,
  invoice:String,
  uniqueid:String,
  commitment:String,
  lotnumber:String,
  qty:Number,
  weight:Number,

  amount: Number,
  subtotal:Number,
  tax:Number,
  total:Number,
  tds:Number
  // Add other fields as needed
});
const salesbillSchema = new Schema({
  // Define fields for the bill schema
  // Example fields:
  date: Date,
  item: String,
  invoice:String,
  uniqueid:String,
  commitment:String,
  lotnumber:String,
  weight:Number,
  qty:Number,
  amount: Number,
  subtotal:Number,
  sgst:Number,
  cgst:Number,
  igst:Number,
  total:Number,
  tds:Number
  // Add other fields as needed
});
const Transaction = new Schema({
  name:String,
  date: Date,
  refference: String,
  revievable:Number,
  payable:Number,
  medium:String,
  id:String,
  recieved:Number,
  paid:Number,
  bills:Array

  // Add other fields as needed
});
const clientSchema = new Schema({
    name: String,
    tds: String,
    address: String,
    phone: String,
    recievable: Number,
    payable: Number,
    paid:Number,
    recieved:Number,
    storein:Number,
    storeout:Number,
    coffee: [coffeeSchema],
    purchasecommitments:[purchasecommitmentsschema],
    salescommitmentsschema:[salescommitmentsschema],
    despatch:[despatch],
    purchasebillSchema:[purchasebillSchema],
    salesbillSchema:[salesbillSchema],
    transaction:[Transaction]
});

const referenceSchema = new mongoose.Schema({
    name: String,
    defaulted:Date
  });
  const financialyear = new mongoose.Schema({
    year: String,
    defaulted:Date
  });
  const productsSchema = new mongoose.Schema({
    itemtype:String,
    product: String,
    stockweight:Number,
    stockep:Number,
    stockpercentage:Number,
    byproduct:[]

  });
  const transportagent = new mongoose.Schema({
    agent: String,
    address:String,
    phone:String,
    strength:Number,
    accounttype:String,
     paid:Number,
     recieved:Number,
     
    loads:[],
    transaction:[Transaction]


  });
  const user = new mongoose.Schema({
    pbillid: Number,
    sbill: Number,
    creditnoteid: Number,
    debitnoteid: Number,
    purdbillid: Number,
    surdbillid: Number,
    pcomm: Number,
    scomm: Number,
    username:String,
    password:String,
    uid:String,
    accounttype:String,
    telegram:String,
    chatid:String,
    lastlogin:Date,
    resp:Boolean
  });
  const attendance = new mongoose.Schema({
    date: Date,
    attendance: [{
      id:String,
      wrokhour:Number,
      src:String
    }],
  });
  const Attendance = mongoose.model('Attendance', attendance); // Use a different variable name here
  const loadinwork = new mongoose.Schema({
    date: Date,
    work:String,
    unit:String,
    variables:Number,
    kooli:Number,
    total:Number,
    agents: [{
      agent:String,
      manpower:Number,
      bags:Number,
      kooli:Number,
      total:Number,

    }],
  });
  const Loadinwork = mongoose.model('Loadinwork', loadinwork);
const ClientModel = mongoose.model('Client', clientSchema); // Use a different variable name here
const CoffeeSchema = mongoose.model('CoffeeSchema', coffeeSchema); // Use a different variable name here

const Transportagent = mongoose.model('Transportagent', transportagent);

  // Create a model based on the schema
const PoductsSchema = mongoose.model('PoductsSchema', productsSchema);

const Reference = mongoose.model('Reference', referenceSchema);
const User = mongoose.model('User', user);
const Financialyear = mongoose.model('Financialyear', financialyear);

module.exports = ClientModel;
module.exports = Reference;
module.exports = PoductsSchema;
module.exports = Transportagent;
module.exports = CoffeeSchema;
module.exports = User;
module.exports = Financialyear;
module.exports = Attendance;
module.exports = Loadinwork;
const partydelete = new mongoose.Schema({
  date: Date,
  entrydate: String,
  party: String,
  deleteditem: String,
  refference: String,
  variables: String,
  user: String,
  reason: String,
});
const Partydelete = mongoose.model('Partydelete', partydelete);
const insidetrash = new mongoose.Schema({
  date: Date,
  entrydate: String,
  party: String,
  deleteditem: String,
  refference: String,
  variables: String,
  user: String,
  reason: String,
});
const Insidetrash = mongoose.model('Insidetrash', insidetrash);
