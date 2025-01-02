const { ConnectionCheckOutFailedEvent } = require('mongodb');
const mongoose = require('mongoose');

const ClientModel = mongoose.model('Client')
const Reference = mongoose.model('Reference')
const PoductsSchema = mongoose.model('PoductsSchema')
const Transportagent = mongoose.model('Transportagent')
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');
const pdfMaster = require("pdf-master");
const { Console } = require('console');
const handlebars = require('handlebars');
const ejs = require('ejs');
const { connect } = require('http2');

async function purchasebill(req, res, client) {
  let payable;
  let recievable;
  let paid;
  let recieved;
  let existingClient
  if (client) {
    existingClient = client;
    payable = req.body.payable
    recievable = req.body.recievable;
    paid = req.body.paid
    recieved = req.body.recieved
  } else {
    payable = 0
    recievable = 0;
    paid = 0
    recieved = 0
    existingClient = await ClientModel.findOne({ name: req.body.name });
  }
  // Push the new sales bill document to the client's salesbillSchema array
  existingClient.purchasebillSchema.push({
    date: req.body.date,
    item: req.body.item,
    invoice: req.body.billid,
    uniqueid: req.body.uniqueid,
    commitment: req.body.id,
    lotnumber: req.body.lotnumber,
    weight: parseInt((req.body.quantity * 100) / req.body.eppercentage),
    qty: req.body.quantity,
    amount: req.body.rate,
    subtotal: req.body.total,
    tax: req.body.tax,
    total: parseInt(parseFloat(req.body.total) + req.body.total * parseFloat(req.body.tax) / 100),
    tds: (existingClient.tds == 'YES'? parseInt(req.body.total * 0.1 / 100) : 0)
  });
  // const payable = (existingClient.payable||0) + req.body.total
  // const recievable = (existingClient.recievable||0) + 0
  // const paid = (existingClient.paid||0) + payable>5000000?parseInt(req.body.total*0.1/100):0
  // const recieved = (existingClient.recieved||0) + 0
  payable = parseInt(parseFloat(req.body.total) + req.body.total * parseFloat(req.body.tax) / 100)
  recievable = recievable
  paid = (existingClient.tds == 'YES'? parseInt(req.body.total * 0.1 / 100) : 0)
  recieved = recieved + 0


  existingClient.transaction.push({
    name: req.body.name,
    date: new Date(req.body.date),
    refference: req.body.item + ' ' + parseFloat((req.body.quantity * 100) / req.body.eppercentage).toFixed(1)+ '*'+req.body.eppercentage +'% *' + req.body.rate,
    revievable: 0,
    payable: parseInt(parseFloat(req.body.total) + req.body.total * parseFloat(req.body.tax) / 100),
    medium: existingClient.tds == 'YES'? 'TDS' : 'Purchase',
    id: req.body.uniqueid,
    recieved: 0,
    paid: existingClient.tds == 'YES'? parseInt(req.body.total * 0.1 / 100) : 0,
    bills:[req.body.uniqueid]
    // Add other fields as needed
  });



  const purchasecommitment = existingClient.purchasecommitments.find(commitment => commitment.id === req.body.id);

  if (purchasecommitment) {
    // Calculate the new balance by subtracting the delivered quantity from the total quantity
    const newBalance = purchasecommitment.balanceweight - parseInt((req.body.quantity * 100) / req.body.eppercentage);
    // Update the balance in the sales commitment object
    purchasecommitment.balanceweight = newBalance <= 0 ? 0 : newBalance;
    purchasecommitment.balance = newBalance <= 0 ? 0 : parseInt(newBalance * purchasecommitment.eppercentage / 100);

  }
  const coffee = existingClient.coffee.find(data => data.lotnumber == req.body.lotnumber);
  if (coffee) {
    coffee.storage = coffee.storage - parseFloat(req.body.quantity)

  }
  const storeout = parseFloat(existingClient.storeout || 0) + 0
  const storein = parseFloat(existingClient.storein || 0) - (parseFloat(req.body.quantity))
  existingClient.storeout = storeout;
  existingClient.storein = storein;
  if (client) {

    return { existingClient: existingClient, payable: payable, recievable: recievable, recieved: recieved, paid: paid }

  } else {
    existingClient.payable = (existingClient.payable || 0) + payable;
    existingClient.recievable = (existingClient.recievable || 0) + recievable;
    existingClient.paid = (existingClient.paid || 0) + paid;
    existingClient.recieved = (existingClient.recieved || 0) + recieved;
    await existingClient.save();
  }
  res.status(201).json({ message: 'Form submitted successfully' });

}


exports.purchasebill = purchasebill;



exports.generatepurchasereport = async (req, res, hi) => {
  let payable = 0
  let recievable = 0;
  let paid = 0
  let recieved = 0
  try {
    let product = await PoductsSchema.findOne({product:req.body.item})
    let existingClient = await ClientModel.findOne({ name: req.body.billTo });

    if (existingClient) {
      // If the client exists, update the coffee array
      existingClient.coffee.push({
        date: req.body.dateOfIssue,
        referenceselect: req.body.referenceselect,
        billTo: req.body.billTo,
        transportagent: req.body.transportagent,
        lorry: req.body.lorry,
        billtype: req.body.billtype,
        delivery: req.body.delivery,
        remarks: req.body.remarks,
        item: req.body.item,
        bags: req.body.bags,
        quantity: req.body.quantity,
        bagweight: req.body.bagweight,
        forignobject: req.body.forignobject,
        weightallowance: req.body.weightallowance,
        outern: req.body.outern,
        huskpercentage: req.body.huskpercentage,
        huskcutting: req.body.huskcutting,
        moisturepercentage: req.body.moisturepercentage,
        moisturecutting: req.body.moisturecutting,
        bbpercentage: req.body.bbpercentage,
        bbcutting: req.body.bbcutting,
        berryborepercentage: req.body.berryborepercentage,
        berryborecutting: req.body.berryborecutting,
        other: req.body.other,
        allowance: req.body.allowance,
        lotnumber: req.body.lotnumber,
        netepweight: req.body.netepweight,
        netWeight: req.body.netWeight,
        eppercentage: req.body.eppercentage,
        storage: req.body.netepweight,
        stat: req.body.reportstatus


      });
      product.stockweight = (product.stockweight||0)+ parseInt(req.body.netWeight)
      product.stockep = (product.stockep||0)+ parseInt(req.body.netepweight)

      await existingClient.save();
      await product.save();

      const storeout = parseFloat(existingClient.storeout || 0) + 0
      const storein = parseFloat(existingClient.storein || 0) + (parseFloat(req.body.netepweight))
      existingClient.storeout = storeout;
      existingClient.storein = storein;
      await existingClient.save();

      if (req.body.bill.length > 0) {
        for (const bill of req.body.bill) {
          const calling = await purchasebill({ body: { ...bill, item: req.body.item, eppercentage: req.body.eppercentage, tax: req.body.tax, name: req.body.billTo, payable: payable, recievable: recievable, paid: paid, recieved: recieved } }, res, existingClient);
          existingClient = calling.existingClient
          payable += calling.payable;
          recievable += calling.recievable;
          paid += calling.paid;
          recieved += calling.recieved;

          //   // Push the new sales bill document to the client's salesbillSchema array
          //   existingClient.purchasebillSchema.push({
          //     date: bill.date,
          //     item: req.body.item,
          //     invoice: bill.billid,
          //     uniqueid: bill.uniqueid,
          //     commitment: bill.id,
          //     lotnumber: bill.lot,
          //     weight:parseInt((bill.quantity*100)/req.body.eppercentage),
          //     qty: bill.quantity,
          //     amount: bill.rate,
          //     subtotal: bill.total,
          //     tax: req.body.tax,
          //     total: (parseFloat(bill.total)+bill.total*parseFloat(req.body.tax)/100),
          //     tds: parseInt(bill.total*0.1/100)
          //   });

          //   payable = payable + parseFloat(bill.total)
          //   recievable = recievable + 0
          //   paid = paid+((existingClient.payable + payable)>5000000?parseInt(bill.total*0.1/100):0)
          //   recieved = recieved + 0

          //   existingClient.payable = payable;
          //   existingClient.recievable = recievable;
          //   existingClient.paid = paid;
          //   existingClient.recieved = recieved;
          //   existingClient.transaction.push({
          //     name:req.body.name,
          //     date: bill.date,
          //     refference: req.body.item + ' ' + bill.quantity + '*' + bill.rate,
          //     revievable:0,
          //     payable:bill.total,
          //     medium:payable>5000000?'TDS':'Bill',
          //     id:bill.uniqueid,
          //     recieved:0,
          //     paid:payable>5000000?parseInt(bill.total*0.1/100):0,

          //     // Add other fields as needed
          //   });



          //   const purchasecommitment = existingClient.purchasecommitments.find(commitment => commitment.id === bill.id);

          //   if (purchasecommitment) {
          //     // Calculate the new balance by subtracting the delivered quantity from the total quantity
          //     const newBalance = purchasecommitment.balance - parseInt((bill.quantity*100)/req.body.eppercentage) ;

          //     // Update the balance in the sales commitment object
          //     purchasecommitment.balance = newBalance<0?0:newBalance;
          // }

        }

      }
      
      existingClient.payable = (existingClient.payable || 0) + payable;
      existingClient.recievable = (existingClient.recievable || 0) + recievable;
      existingClient.paid = (existingClient.paid || 0) + paid;
      existingClient.recieved = (existingClient.recieved || 0) + recieved;
      await existingClient.save();

      var data = {
        companyname: 'HI TECH COFFEE',
        party: req.body.billTo,
        item: req.body.item,
        delivery: req.body.delivery,
        date: req.body.dateOfIssue,
        vehicleno: req.body.lorry,
        type: 'Purchase',
        bags: req.body.bags,
        quantity: req.body.quantity,
        bagweight: parseInt(req.body.bagweight * req.body.bags),
        netweights: parseInt(req.body.quantity - parseFloat(req.body.bagweight * req.body.bags)),
        forignobject: req.body.forignobject,
        weightallowance: parseFloat(req.body.quantity) - parseFloat(req.body.netWeight),
        huskpercentage: req.body.huskpercentage,
        outern: req.body.outern,
        huskcutting: req.body.huskcutting,
        moisturepercentage: req.body.moisturepercentage,
        moisturecutting: req.body.moisturecutting,
        bbpercentage: req.body.bbpercentage,
        bbcutting: req.body.bbcutting,
        berryborepercentage: req.body.berryborepercentage,
        berryborecutting: req.body.berryborecutting,
        other: req.body.other,
        allowance: req.body.allowance,
        lotnumber: req.body.lotnumber,
        netepweight: req.body.netepweight,
        eppercentage: parseFloat(req.body.eppercentage).toFixed(2),
        refference: req.body.referenceselect,
        netWeight: req.body.netWeight - req.body.huskcutting,
        status: req.body.reportstatus,
        bill: req.body.bill,
        tax: req.body.tax,
        taxtype: req.body.tax == 0 ? 'tax-exempt' : req.body.tax == 5 ? 'cgst 2.5% + sgst 2.5%' : 'cgst 2.5% + sgst 2.5% + igst 5%',
        taxtotal: parseInt(payable * req.body.tax / 100),
        total: payable,
        grandtotal: payable + parseInt(payable * req.body.tax / 100),
        cuttings: parseInt(req.body.epweight) - parseInt(req.body.netepweight)

      }

      // let options = {
      //   // displayHeaderFooter: true,
      //   format: "A4",
      //   margin: { top: "60px", bottom: "100px" },
      //   // base: 'file://' + path.resolve('./public') + '/'

      // };
      let options = {
        format: 'A4',
        orientation: 'portriat',
   
    }
    // let PDF = await pdfMaster.generatePdf("template.hbs", { data }, options);

      // 
      // fs.writeFileSync(filePath, PDF);
      req.session.workingdate= new Date(req.body.dateOfIssue);
    
    const templatePath = path.join(__dirname, 'template.hbs');

        const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ data });
    fs.writeFile(path.join(__dirname, '..', 'public', 'report.html'), html, (d) => {
      const url = `http://localhost:3000/report.html`
      res.status(201).json({ message: 'Form submitted successfully' });

    })

    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error submitting the form' });
  }
};



async function salesbill(req, res, client) {
  let payable;
  let recievable;
  let paid;
  let recieved;
  let existingClient
  if (client) {
    existingClient = client;
    payable = req.body.payable
    recievable = req.body.recievable;
    paid = req.body.paid
    recieved = req.body.recieved
  } else {
    payable = 0
    recievable = 0;
    paid = 0
    recieved = 0
    existingClient = await ClientModel.findOne({ name: req.body.name });
  }
  // Push the new sales bill document to the client's salesbillSchema array
  existingClient.salesbillSchema.push({
    date: req.body.date,
    item: req.body.item,
    invoice: req.body.billid,
    uniqueid: req.body.uniqueid,
    commitment: req.body.id,
    lotnumber: req.body.lotnumber,
    weight: parseInt((req.body.quantity * 100) / req.body.eppercentage),
    qty: req.body.quantity,
    amount: req.body.rate,
    subtotal: req.body.total,
    tax: req.body.tax,
    total: parseInt(parseFloat(req.body.total) + req.body.total * parseFloat(req.body.tax) / 100),
    tds: (existingClient.tds == 'YES' ? parseInt(req.body.total * 0.1 / 100) : 0)
  });
  // const payable = (existingClient.payable||0) + req.body.total
  // const recievable = (existingClient.recievable||0) + 0
  // const paid = (existingClient.paid||0) + payable>5000000?parseInt(req.body.total*0.1/100):0
  // const recieved = (existingClient.recieved||0) + 0
  payable = payable
  recievable = parseInt(parseFloat(req.body.total) + req.body.total * parseFloat(req.body.tax) / 100)
  paid = paid + 0
  recieved = (existingClient.tds == 'YES' ? parseInt(req.body.total * 0.1 / 100) : 0)

  existingClient.transaction.push({
    name: req.body.name,
    date: new Date(req.body.date),
    refference: req.body.item + ' ' + parseInt((req.body.quantity * 100) / req.body.eppercentage) + '*'+req.body.eppercentage+'% *' + req.body.rate,
    revievable: parseInt(parseFloat(req.body.total) + req.body.total * parseFloat(req.body.tax) / 100),
    payable: 0,
    medium: existingClient.tds == 'YES' ? 'TDS' : 'Sale',
    id: req.body.uniqueid,
    recieved: existingClient.tds == 'YES' ? parseInt(req.body.total * 0.1 / 100) : 0,
    paid: 0,
    bills:[req.body.uniqueid]
    // Add other fields as needed
  });



  const salescommitment = existingClient.salescommitmentsschema.find(commitment => commitment.id === req.body.id);

  if (salescommitment) {
    // Calculate the new balance by subtracting the delivered quantity from the total quantity
    const newBalance = salescommitment.balanceweight - parseInt((req.body.quantity * 100) / req.body.eppercentage);

    // Update the balance in the sales commitment object
    salescommitment.balanceweight = newBalance <= 0 ? 0 : newBalance;

    salescommitment.balance = newBalance <= 0 ? 0 : parseInt(newBalance * salescommitment.eppercentage / 100);


  }
  const coffee = existingClient.coffee.find(data => data.lotnumber == req.body.lotnumber);
  if (coffee) {
    coffee.storage = coffee.storage - parseFloat(req.body.quantity)

  }
  const storeout = parseFloat(existingClient.storeout || 0) -parseFloat(req.body.quantity)
  const storein = parseFloat(existingClient.storein || 0) - 0
  existingClient.storeout = storeout;
  existingClient.storein = storein;
  if (client) {

    return { existingClient: existingClient, payable: payable, recievable: recievable, recieved: recieved, paid: paid }

  } else {
    existingClient.payable = (existingClient.payable || 0) + payable;
    existingClient.recievable = (existingClient.recievable || 0) + recievable;
    existingClient.paid = (existingClient.paid || 0) + paid;
    existingClient.recieved = (existingClient.recieved || 0) + recieved;
    await existingClient.save();
  }
  res.status(201).json({ message: 'Form submitted successfully' });

}


exports.salesbill = salesbill;
exports.generatesalesreport = async (req, res) => {
  let payable = 0
  let recievable = 0;
  let paid = 0
  let recieved = 0
  try {
    let product = await PoductsSchema.findOne({product:req.body.item})

    let existingClient = await ClientModel.findOne({ name: req.body.billTo });

    if (existingClient) {
      // If the client exists, update the coffee array
      existingClient.despatch.push({
        date: req.body.dateOfIssue,
        referenceselect: req.body.referenceselect,
        billTo: req.body.billTo,
        transportagent: req.body.transportagent,
        lorry: req.body.lorry,
        billtype: req.body.billtype,
        delivery: req.body.delivery,
        remarks: req.body.remarks,
        item: req.body.item,
        bags: req.body.bags,
        quantity: req.body.quantity,
        bagweight: req.body.bagweight,
        forignobject: req.body.forignobject,
        weightallowance: req.body.weightallowance,
        outern: req.body.outern,
        huskpercentage: req.body.huskpercentage,
        huskcutting: req.body.huskcutting,
        moisturepercentage: req.body.moisturepercentage,
        moisturecutting: req.body.moisturecutting,
        bbpercentage: req.body.bbpercentage,
        bbcutting: req.body.bbcutting,
        berryborepercentage: req.body.berryborepercentage,
        berryborecutting: req.body.berryborecutting,
        other: req.body.other,
        allowance: req.body.allowance,
        lotnumber: req.body.lotnumber,
        netepweight: req.body.netepweight,
        netWeight: req.body.netWeight,
        eppercentage: req.body.eppercentage,
        storage: req.body.netepweight - req.body.billedquantity,
        stat: req.body.reportstatus
      });
      const storeout = parseFloat(existingClient.storeout || 0) + parseFloat(req.body.netepweight) 
      const storein = parseFloat(existingClient.storein || 0) + 0;
      existingClient.storeout = storeout;
      existingClient.storein = storein;
      product.stockweight = ((product.stockweight||0)- parseInt(req.body.netWeight))
      product.stockep = ((product.stockep||0)- parseInt(req.body.netepweight))
      await product.save();
      await existingClient.save();

      if (req.body.bill.length > 0) {
        for (const bill of req.body.bill) {
          const calling = await salesbill({ body: { ...bill, item: req.body.item, eppercentage: req.body.eppercentage, tax: req.body.tax, name: req.body.billTo, payable: payable, recievable: recievable, paid: paid, recieved: recieved } }, res, existingClient);
          existingClient = calling.existingClient
          payable += calling.payable;
          recievable += calling.recievable;
          paid += calling.paid;
          recieved += calling.recieved
          // Push the new sales bill document to the client's salesbillSchema array
          //   existingClient.salesbillSchema.push({
          //     date: bill.date,
          //     item: req.body.item,
          //     invoice: bill.billid,
          //     uniqueid: bill.uniqueid,
          //     commitment: bill.id,
          //     lotnumber: bill.lot,
          //     weight:parseInt((req.body.quantity*100)/req.body.eppercentage),
          //     qty: bill.quantity,
          //     amount: bill.rate,
          //     subtotal: bill.total,
          //     sgst: bill.sgst,
          //     cgst: bill.cgst,
          //     igst: bill.igst,
          //     total: bill.total,
          //     tds: bill.tds
          //   });   
          //    const salesCommitment = existingClient.salescommitmentsschema.find(commitment => commitment.id === bill.id);
          //   const payable = (existingClient.payable||0) + 0
          //   const recievable =( existingClient.recievable||0) + bill.total
          //   const paid = (existingClient.paid||0) + 0
          //   const recieved = (existingClient.recieved||0) + recievable>5000000?parseInt(bill.total*0.1/100):0

          //   existingClient.payable = payable;
          //   existingClient.recievable = recievable;
          //   existingClient.paid = paid;
          //   existingClient.recieved = recieved;
          //   existingClient.transaction.push({
          //     name:req.body.name,
          //     date: bill.date,
          //     refference: req.body.item + ' ' + bill.quantity + '*' + bill.rate,
          //     revievable:bill.total,
          //     payable:0,
          //     medium:recievable>5000000?'TDS':'Bill',
          //     id:bill.uniqueid,
          //     recieved:recievable>5000000?parseInt(bill.total*0.1/100):0,
          //     paid:0,

          //     // Add other fields as needed
          //   });



          //   if (salesCommitment) {
          //     // Calculate the new balance by subtracting the delivered quantity from the total quantity
          //     const newBalance = salesCommitment.balance - parseInt((bill.quantity*100)/req.body.eppercentage) ;

          //     // Update the balance in the sales commitment object
          //     salesCommitment.balance = newBalance<0?0:newBalance;
          // }

        }

      }
      existingClient.payable = (existingClient.payable || 0) + payable;
      existingClient.recievable = (existingClient.recievable || 0) + recievable;
      existingClient.paid = (existingClient.paid || 0) + paid;
      existingClient.recieved = (existingClient.recieved || 0) + recieved;
      await existingClient.save();
    }
    var data = {
      companyname: 'HI TECH COFFEE',
      party: req.body.billTo,
      item: req.body.item,
      delivery: req.body.delivery,
      date: req.body.dateOfIssue,
      vehicleno: req.body.lorry,
      type: 'Sales',
      bags: req.body.bags,
      quantity: req.body.quantity,
      bagweight: parseInt(req.body.bagweight * req.body.bags),
      netweights: parseInt(req.body.quantity - parseFloat(req.body.bagweight * req.body.bags)),
      forignobject: req.body.forignobject,
      weightallowance: parseFloat(req.body.quantity) - parseFloat(req.body.netWeight),
      huskpercentage: req.body.huskpercentage,
      outern: req.body.outern,
      huskcutting: req.body.huskcutting,
      moisturepercentage: req.body.moisturepercentage,
      moisturecutting: req.body.moisturecutting,
      bbpercentage: req.body.bbpercentage,
      bbcutting: req.body.bbcutting,
      berryborepercentage: req.body.berryborepercentage,
      berryborecutting: req.body.berryborecutting,
      other: req.body.other,
      allowance: req.body.allowance,
      lotnumber: req.body.lotnumber,
      netepweight: req.body.netepweight,
      eppercentage: parseFloat(req.body.eppercentage).toFixed(2),
      refference: req.body.referenceselect,
      netWeight: req.body.netWeight - req.body.huskcutting,
      status: req.body.reportstatus,
      tax: req.body.tax,
      taxtype: req.body.tax == 0 ? 'tax-exempt' : req.body.tax == 5 ? 'cgst 2.5% + sgst 2.5%' : 'cgst 2.5% + sgst 2.5% + igst 5%',
      taxtotal: parseInt(recievable * req.body.tax / 100),
      total: recievable,
      grandtotal: recievable + parseInt(recievable * req.body.tax / 100),
      bill: req.body.bill,
      cuttings: parseInt(req.body.epweight) - parseInt(req.body.netepweight)
    }

    let options = {
      // displayHeaderFooter: true,
      format: "A4",
      margin: { top: "60px", bottom: "100px" },
      // base: 'file://' + path.resolve('./public') + '/'

    };
    req.session.workingdate= new Date(req.body.dateOfIssue);

    // let PDF = await pdfMaster.generatePdf("template.hbs", { data }, options);

    // 
    // fs.writeFileSync(filePath, PDF);
    
    const templatePath = path.join(__dirname, 'template.hbs');

        const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ data });
    fs.writeFile(path.join(__dirname, '..', 'public', 'report.html'), html, (d) => {
      const url = `http://localhost:3000/report.html`
      res.status(201).json({ message: 'Form submitted successfully' });

    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting the form' });
  }
};