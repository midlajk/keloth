const { ConnectionCheckOutFailedEvent } = require('mongodb');
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELE_API;
const ClientModel = mongoose.model('Client')
const Reference = mongoose.model('Reference')
const PoductsSchema = mongoose.model('PoductsSchema')
const Transportagent = mongoose.model('Transportagent')
// const { purchasecommitmentcount, incrementPurchaseCommitmentCount, decrementPurchaseCommitmentCount } = require('../model/variables');
const Financialyear = mongoose.model('Financialyear')
const User = mongoose.model('User')
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');
const pdfMaster = require("pdf-master");
const Attendance = mongoose.model('Attendance')
const Loadinwork = mongoose.model('Loadinwork')

const handlebars = require('handlebars');

exports.addseller = async (req, res) => {
  const name = req.body.name.trim().toUpperCase();

  const existingClient = await ClientModel.findOne({ name: name });
  if (existingClient || name.length < 1) {
    res.json({ success: false, message: 'client already exist' });

  } else {
    const newClient = new ClientModel({
      name: name,
      tds: req.body.tds,
      address: req.body.address,
      phone: req.body.phone,
      recievable: 0,
      payable: 0,
      paid: 0,
      recieved: 0,
      storein: 0,
      storeout: 0,
    });

    await newClient.save();
    res.json({ success: true, message: 'Reference added successfully' });

  }
}
exports.addpurchasecommitment = async (req, res) => {


  try {

    const user = await User.findById(req.session.user._id)

    // Find the client by name
    const client = await ClientModel.findOne({ name: req.body.name });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    var number
    if (user) {
      number = user.pcomm
      user.pcomm = user.pcomm + 1
      await user.save()
    } else {
      var numnumber = client.purchasecommitments.length + 1

      number = `${numnumber}-${req.body.name}`
      // Get the first part of the item by trimming and splitting
    }
    const currentDate = new Date();
    const day = ('0' + currentDate.getDate()).slice(-2); // Get the day with leading zero if necessary
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Get the month with leading zero if necessary
    const formattedDate = `${month}-${day}`;
    const trimmedItem = req.body.pccomitem.trim().split(' ')[0];
    const uniqueId = `${formattedDate}-${trimmedItem}-${number}`;
    // Generate a unique ID using uuidv4 and include the reference
    // Add the new purchase commitment to the purchasecommitments array
    client.purchasecommitments.push({
      item: req.body.pccomitem,
      name: req.body.name,
      date: req.body.pccomdate,
      referance: req.body.reference,
      id: uniqueId,
      weight: req.body.pccomweight,
      eppercentage: req.body.pccomep,
      balanceweight: req.body.pccomweight,
      balance: parseInt(req.body.pccomweight * req.body.pccomep / 100),
      rate: req.body.pccomrate,
      additional: req.body.pccomAdditional,
      info: req.body.pccomInfo
    });

    // Save the updated client to the database
    await client.save();

    res.status(200).json({ message: 'Purchase commitment added successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.addsalecommitment = async (req, res) => {

  try {
    const user = await User.findById(req.session.user._id)

    const client = await ClientModel.findOne({ name: req.body.name });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    var number
    if (user) {
      number = user.scomm
      user.scomm = user.scomm + 1
      await user.save()
    } else {
      var numnumber = client.salescommitmentsschema.length + 1

      number = `${numnumber}-${req.body.name}`
      // Get the first part of the item by trimming and splitting
    }

    const currentDate = new Date();
    const day = ('0' + currentDate.getDate()).slice(-2); // Get the day with leading zero if necessary
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Get the month with leading zero if necessary


    const formattedDate = `${month}-${day}`;

    const trimmedItem = req.body.scitem.trim().split(' ')[0]; // Get the first part of the item by trimming and splitting

    const uniqueId = `${formattedDate}-${trimmedItem}-${number}`;
    // Add the new purchase commitment to the purchasecommitments array
    client.salescommitmentsschema.push({
      item: req.body.scitem,
      name: req.body.name,
      date: req.body.scdate,
      referance: req.body.reference,
      id: uniqueId,
      weight: req.body.scweight,
      eppercentage: req.body.scep,
      balanceweight: req.body.scweight,
      balance: parseInt(req.body.scweight * req.body.scep / 100),
      rate: req.body.scrate,
      additional: req.body.scAdditional,
      info: req.body.scInfo
    });

    // Save the updated client to the database
    await client.save();
    res.status(200).json({ message: 'Purchase commitment added successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.addfinancial = async (req, res) => {
  const year = req.body.year.trim().toUpperCase();

  try {
    const existingClient = await Financialyear.findOne({ year: year });
    if (existingClient) {
      res.json({ success: true, message: 'Reference added successfully' });

    } else {
      // Create a new reference document based on the request body
      const financialyear = new Financialyear({
        year: year,
        default: new Date()
      });

      // Save the reference document to MongoDB
      await financialyear.save();

      // Send a success response to the client
      res.json({ success: true, message: 'Reference added successfully' });
    }
  } catch (error) {
    // Handle errors and send an error response
    console.log('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.addrefference = async (req, res) => {
  const name = req.body.refference.trim().toUpperCase();

  try {
    const existingClient = await Reference.findOne({ name: name });
    if (existingClient) {
      res.json({ success: true, message: 'Reference added successfully' });

    } else {
      // Create a new reference document based on the request body
      const newReference = new Reference({
        name: name,
        defaulted: new Date()
      });

      // Save the reference document to MongoDB
      await newReference.save();

      // Send a success response to the client
      res.json({ success: true, message: 'Reference added successfully' });
    }
  } catch (error) {
    // Handle errors and send an error response
    console.log('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
exports.addproducts = async (req, res) => {
  const name = req.body.product.trim().toUpperCase();
  try {
    const existingClient = await PoductsSchema.findOne({ product: name });
    if (existingClient) {
      res.json({ success: true, message: 'Reference added successfully' });

    } else {
      // Create a new reference document based on the request body
      const newproduct = new PoductsSchema({
        itemtype: req.body.itemtype,
        product: name,
        byproduct: req.body.byproduct,
        stockweight: 0,
        stockep: 0,
        stockpercentage: 0,
      });

      // Save the newproduct document to MongoDB
      await newproduct.save();

      // Send a success response to the client
      res.json({ success: true, message: 'Reference added successfully' });
    }
  } catch (error) {
    // Handle errors and send an error response
    console.log('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }


}
exports.addtransportagent = async (req, res) => {
  const name = req.body.agent.trim().toUpperCase();

  try {
    const existingClient = await Transportagent.findOne({ agent: name });
    if (existingClient) {
      res.json({ success: true, message: 'Reference added successfully' });


    } else {
      // Create a new reference document based on the request body
      const newproduct = new Transportagent({
        agent: name,
        address: req.body.address,
        phone: req.body.phone,
        strength: req.body.strength,
        accounttype: req.body.accounttype
      });

      // Save the newproduct document to MongoDB
      await newproduct.save();

      // Send a success response to the client
      res.json({ success: true, message: 'Reference added successfully' });
    }
  } catch (error) {
    // Handle errors and send an error response
    console.log('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

////Transactions //////
exports.addTransactions = async (req, res) => {

  try {
    const client = await ClientModel.findOne({ name: req.body.name });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }


    client.transaction.push({
      name: req.body.name,
      date: new Date(req.body.date),
      refference: req.body.refference || 'Transaction',
      revievable: parseFloat(req.body.revievable) || 0,
      payable: parseFloat(req.body.payable) || 0,
      medium: req.body.medium,
      recieved: parseFloat(req.body.recieved) || 0,
      paid: parseFloat(req.body.paid) || 0
    });


    const paid = (client.paid || 0) + parseFloat(req.body.paid)
    const recieved = (client.recieved || 0) + parseFloat(req.body.recieved)
    client.paid = paid;
    client.recieved = recieved;
    await client.save();

    // Save the updated client to the database
    res.status(201).json({ message: 'Transaction saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


exports.addexpencesandincome = async (req, res) => {

  try {
    const client = await Transportagent.findOne({ agent: req.body.name });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }


    client.transaction.push({
      name: req.body.name,
      date: new Date(req.body.date),
      refference: req.body.refference,
      revievable: parseFloat(req.body.revievable) || 0,
      payable: parseFloat(req.body.payable) || 0,
      medium: req.body.medium,
      recieved: parseFloat(req.body.recieved) || 0,
      paid: parseFloat(req.body.paid) || 0
    });


    const paid = (client.paid || 0) + parseFloat(req.body.paid)
    const recieved = (client.recieved || 0) + parseFloat(req.body.recieved)
    client.paid = paid;
    client.recieved = recieved;
    await client.save();

    // Save the updated client to the database
    res.status(201).json({ message: 'Transaction saved successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
/////
function round(value, decimals) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}



// Example of usage
exports.addstoreinsettlement = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    let uniqueId = 0
    const client = await ClientModel.findOne({ name: req.body.name });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    if (req.body.sscommitment) {

      const purchasecommitment = client.purchasecommitments.find(commitment => commitment.id === req.body.sscommitment);
      if (purchasecommitment) {
        uniqueId = purchasecommitment.id
        // Calculate the new balance by subtracting the delivered quantity from the total quantity
        const newBalance = purchasecommitment.balanceweight - parseInt(req.body.ssweight);
        // Update the balance in the sales commitment object
        purchasecommitment.balanceweight = newBalance <= 0 ? 0 : newBalance;
        purchasecommitment.balance = newBalance <= 0 ? 0 : parseInt(newBalance * req.body.ssepp / 100);

      }
      await client.save();


    } else {
      var number
      if (user) {
        number = user.pcomm
        user.pcomm = user.pcomm + 1
        await user.save()
      } else {
        var numnumber = client.salescommitmentsschema.length + 1

        number = `${numnumber}-${req.body.name}`
        // Get the first part of the item by trimming and splitting
      }
      const currentDate = new Date();
      const day = ('0' + currentDate.getDate()).slice(-2); // Get the day with leading zero if necessary
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Get the month with leading zero if necessary
      const formattedDate = `${month}-${day}`;
      uniqueId = `${formattedDate}-Settlement-${number}`;
      // Decrement the coffee storage as needed

      // Add new purchase commitment
      client.purchasecommitments.push({
        item: req.body.ssitem,
        name: req.body.name,
        date: req.body.ssdate,
        referance: req.body.sscrop,
        id: uniqueId,
        weight: req.body.ssweight,
        eppercentage: req.body.ssepp,
        balanceweight: 0,
        balance: 0,
        rate: req.body.ssrate,
        additional: 'Settlement',
      });

      // let payable =0;
      //       let paid=0;
      //       payable = parseInt(req.body.sstotal )+ parseInt(req.body.sstotal  * parseFloat(req.body.ssreference||0) / 100)
      //       paid = (client.tds == 'YES'? parseInt(req.body.sstotal * 0.1 / 100) : 0)
      //       client.transaction.push({
      //         name: req.body.name,
      //         date: req.body.ssdate,
      //         refference: 'Settlement '+req.body.ssweight + '* ' + req.body.ssepp + '% *' + req.body.ssrate,
      //         revievable: 0,
      //         payable: payable,
      //         medium: client.tds == 'YES'? 'TDS' : 'Purchase',
      //         recieved: 0,
      //         paid: paid,

      //         // Add other fields as needed
      //       });

      //       client.payable = parseInt(client.payable || 0) + payable;
      //       client.paid = parseInt(client.paid || 0) + paid;
      await client.save();
    } // Save the client with updated data     
    let payable = 0;
    let paid = 0;
    payable = parseInt(req.body.sstotal) + parseInt(req.body.sstotal * parseFloat(req.body.ssreference || 0) / 100)
    paid = (client.tds == 'YES' ? parseInt(req.body.sstotal * 0.1 / 100) : 0)
    client.transaction.push({
      name: req.body.name,
      date: new Date(req.body.ssdate),
      refference: 'Settlement ' + req.body.ssweight + '* ' + req.body.ssepp + '% *' + req.body.ssrate,
      revievable: 0,
      payable: payable,
      medium: client.tds == 'YES' ? 'TDS' : 'Purchase',
      recieved: 0,
      paid: paid,
      id: uniqueId

      // Add other fields as needed
    });

    client.payable = parseInt(client.payable || 0) + payable;
    client.paid = parseInt(client.paid || 0) + paid;
    await client.save();
    const lastTransaction = client.transaction[client.transaction.length - 1];
    const lastTransactionId = lastTransaction._id;
    const remaining = await decrementCoffeeStorage(client._id, req.body, uniqueId,lastTransactionId);
    res.status(200).json({ message: 'Operation successful!' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const decrementCoffeeStorage = async (clientId, data, uniqueId,lastTransactionId) => {
  let remaining = data.ssep;

  while (remaining > 0) {
    try {
      // Find a client with coffee storage > 0 for the specified item
      const client = await ClientModel.findOne(
        {
          _id: clientId,
          coffee: {
            $elemMatch: {
              item: data.ssitem, // Matches the specific item
              storage: { $gt: 0 } // Ensures storage is greater than 0
            }
          }
          // "coffee.storage": { $gt: 0 },
          // "coffee.item": data.ssitem, // Ensures the right item
        },
        { "coffee.$": 1 } // Selects only the first matching coffee item
      );

      if (!client) break; // If no more items with storage > 0, exit the loop

      const coffeeItem = client.coffee[0]; // Get the first matching coffee item
      const currentStorage = coffeeItem.storage;
      const toSubtract = Math.min(currentStorage, remaining);

      remaining = round(remaining - toSubtract, 1);
      // Update the specific coffee item's storage
      await ClientModel.updateOne(
        {
          _id: clientId,
          "coffee._id": coffeeItem._id, // Identifies the specific coffee item to update
        },
        {
          $set: {
            "coffee.$.storage": round(currentStorage - toSubtract, 1), // Round to 1 decimal place
          },
        }
      );
      const calling = await purchasebill({ body: { ...data, tax: coffeeItem.tax, lotnumber: coffeeItem.lotnumber, uniqueId: uniqueId, weight: toSubtract, eppercentage: coffeeItem.eppercentage,lastTransactionId:lastTransactionId } });


      console.log("Updated coffee storage. Remaining:", remaining);
    } catch (error) {
      console.log("Error during update:", error); // Handle the error
      break; // Exit the loop if there's an error
    }
  }

  return remaining; // Return the remaining value after all updates
};
async function purchasebill(req) {

  try {

    let existingClient = await ClientModel.findOne({ name: req.body.name });
    var total = parseInt(req.body.ssrate * req.body.weight)
    const currentDate = new Date();

    // Get date components
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(2); // Get last two digits of the year

    // Get time components
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
const lotnumb = `${day}${month}${year}-${hours}${minutes}${seconds}${milliseconds}`;
    // Concatenate the components to form the unique ID
    existingClient.purchasebillSchema.push({
      date: req.body.ssdate,
      item: req.body.ssitem,
      invoice: req.body.lotnumber,
      uniqueid: lotnumb,
      commitment: req.body.uniqueId,
      lotnumber: req.body.lotnumber,
      weight: parseInt((req.body.weight * 100) / req.body.eppercentage),
      qty: req.body.weight,
      amount: req.body.ssrate,
      subtotal: total,
      tax: (req.body.tax || 0),
      total: total + (total * parseFloat(req.body.tax || 0) / 100),
      tds: (existingClient.tds == 'YES' ? parseInt(total * 0.1 / 100) : 0)
    });
    let transaction = existingClient.transaction.id(req.body.lastTransactionId); // req.body.transactionId contains the transaction _id

    if (transaction) {
      // Add the new element to the transaction's 'bill' array
      transaction.bills.push(lotnumb);
    }


    // existingClient.transaction.push({
    //   name: req.body.name,
    //   date: req.body.ssdate,
    //   refference: 'Settlement '+req.body.ssitem + ' ' + req.body.weight + '*' + req.body.ssrate,
    //   revievable: 0,
    //   payable: parseInt(total + total* parseFloat(req.body.tax||0) / 100),
    //   medium: existingClient.tds == 'YES'? 'TDS' : 'Purchase',
    //   id: lotnumber,
    //   recieved: 0,
    //   paid: existingClient.tds == 'YES'? parseInt(total* 0.1 / 100) : 0,

    //   // Add other fields as needed
    // });
    const storeout = parseFloat(existingClient.storeout || 0) + 0
    const storein = parseFloat(existingClient.storein || 0) - (parseFloat(req.body.weight))
    existingClient.storeout = storeout;
    existingClient.storein = storein;

    ///////////////////cganges ass 
    await existingClient.save();
    return { existingClient: existingClient }
  } catch (e) {
    console.log(e)
  }
}

exports.addstoreoutsettlement = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    let uniqueId = 0

    const client = await ClientModel.findOne({ name: req.body.name });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    if (req.body.sscommitment) {

      const salescommitmentsschema = client.salescommitmentsschema.find(commitment => commitment.id === req.body.sscommitment);
      if (salescommitmentsschema) {
        uniqueId = salescommitmentsschema.id
        // Calculate the new balance by subtracting the delivered quantity from the total quantity
        const newBalance = salescommitmentsschema.balanceweight - parseInt(req.body.ssweight);
        // Update the balance in the sales commitment object
        salescommitmentsschema.balanceweight = newBalance <= 0 ? 0 : newBalance;
        salescommitmentsschema.balance = newBalance <= 0 ? 0 : parseInt(newBalance * req.body.ssepp / 100);

      }
      await client.save();


    } else {
      var number
      if (user) {
        number = user.scomm
        user.scomm = user.scomm + 1
        await user.save()
      } else {
        var numnumber = client.salescommitmentsschema.length + 1

        number = `${numnumber}-${req.body.name}`
        // Get the first part of the item by trimming and splitting
      }
      const currentDate = new Date();
      const day = ('0' + currentDate.getDate()).slice(-2); // Get the day with leading zero if necessary
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Get the month with leading zero if necessary
      const formattedDate = `${month}-${day}`;
      uniqueId = `${formattedDate}-Settlement-${number}`;
      // Decrement the coffee storage as needed

      // Add new purchase commitment
      client.salescommitmentsschema.push({
        item: req.body.ssitem,
        name: req.body.name,
        date: req.body.ssdate,
        referance: req.body.sscrop,
        id: uniqueId,
        weight: req.body.ssweight,
        eppercentage: req.body.ssepp,
        balanceweight: 0,
        balance: 0,
        rate: req.body.ssrate,
        additional: 'Settlement',
      });
      await client.save();


    }
    let recievable = 0;
    let recieved = 0;
    recievable = parseInt(req.body.sstotal) + parseInt(req.body.sstotal * parseFloat(req.body.ssreference || 0) / 100);
    recieved = (client.tds == 'YES' ? parseInt(req.body.sstotal * 0.1 / 100) : 0);


    client.transaction.push({
      name: req.body.name,
      date: new Date(req.body.ssdate),
      refference: 'S-' +req.body.ssitem +' ' + req.body.ssweight + '* ' + req.body.ssepp + '% *' + req.body.ssrate,
      revievable: recievable,
      payable: 0,
      medium: client.tds == 'YES' ? 'TDS' : 'Purchase',
      recieved: recieved,
      paid: 0,
      id: uniqueId

      // Add other fields as needed
    })
    client.revievable = parseInt(client.revievable || 0) + recievable;
    client.recieved = parseInt(client.recieved || 0) + recieved;

    await client.save();
    const lastTransaction = client.transaction[client.transaction.length - 1];
    const lastTransactionId = lastTransaction._id;
    const remaining = await decrementcoffeeoutstorage(client._id, req.body, uniqueId,lastTransactionId);

    // Save the client with updated data
    res.status(200).json({ message: 'Operation successful!' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
async function salesbill(req) {
  try {
    // let recievable =0;
    // let recieved=0;
    let existingClient = await ClientModel.findOne({ name: req.body.name });
    var total = parseInt(req.body.ssrate * req.body.weight)
    const currentDate = new Date();

    // Get date components
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(2); // Get last two digits of the year

    // Get time components
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    // Concatenate the components to form the unique ID
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
    const lotnumb = `${day}${month}${year}-${hours}${minutes}${seconds}${milliseconds}`;
    existingClient.salesbillSchema.push({
      date: req.body.ssdate,
      item: req.body.ssitem,
      invoice: req.body.lotnumber,
      uniqueid: lotnumb,
      commitment: req.body.uniqueId,
      lotnumber: req.body.lotnumber,
      weight: parseInt((req.body.weight * 100) / req.body.eppercentage),
      qty: req.body.weight,
      amount: req.body.ssrate,
      subtotal: total,
      tax: (req.body.tax || 0),
      total: total + (total * parseFloat(req.body.tax || 0) / 100),
      tds: (existingClient.tds == 'YES' ? parseInt(total * 0.1 / 100) : 0)
    });
    let transaction = existingClient.transaction.id(req.body.lastTransactionId); // req.body.transactionId contains the transaction _id

    if (transaction) {
      // Add the new element to the transaction's 'bill' array
      transaction.bills.push(lotnumb);
    }


    // recievable = parseInt(total)+ parseInt(total * parseFloat(req.body.tax||0) / 100)
    // recieved = (existingClient.tds == 'YES'? parseInt(total * 0.1 / 100) : 0)


    // existingClient.transaction.push({
    //   name: req.body.name,
    //   date: req.body.ssdate,
    //   refference: 'Settlement '+req.body.ssitem + ' ' + req.body.weight + '*' + req.body.ssrate,
    //   revievable: recievable,
    //   payable: 0,
    //   medium: existingClient.tds == 'YES'? 'TDS' : 'Purchase',
    //   id: lotnumber,
    //   recieved: recieved,
    //   paid: 0,

    //   // Add other fields as needed
    // });
    const storeout = parseFloat(existingClient.storeout || 0) - (parseFloat(req.body.weight))
    const storein = parseFloat(existingClient.storein || 0) + 0
    existingClient.storeout = storeout;
    existingClient.storein = storein;
    // existingClient.revievable = parseInt(existingClient.revievable || 0) + recievable;
    // existingClient.recieved = parseInt(existingClient.recieved || 0) + recieved;

    await existingClient.save();
    return { existingClient: existingClient }
  } catch (e) {
    console.log(e)
  }
}
const decrementcoffeeoutstorage = async (clientId, data, uniqueId,lastTransactionId) => {
  let remaining = data.ssep;
console.log(data.ssitem)
  while (remaining > 0) {
    try {
      // Find a client with coffee storage > 0 for the specified item
      const client = await ClientModel.findOne(
        {
          _id: clientId,
          // "despatch.storage": { $gt: 0 },
          // "despatch.item": data.ssitem,
          despatch: {
            $elemMatch: {
              item: data.ssitem, // Matches the specific item
              storage: { $gt: 0 } // Ensures storage is greater than 0
            }
          }
           // Ensures the right item
        },
        { "despatch.$": 1 } // Selects only the first matching coffee item
      );

      if (!client) break; // If no more items with storage > 0, exit the loop

      const coffeeItem = client.despatch[0]; // Get the first matching coffee item
      const currentStorage = coffeeItem.storage;
      const toSubtract = Math.min(currentStorage, remaining);

      remaining = round(remaining - toSubtract, 1);
      // Update the specific coffee item's storage
      await ClientModel.updateOne(
        {
          _id: clientId,
          "despatch._id": coffeeItem._id, // Identifies the specific coffee item to update
        },
        {
          $set: {
            "despatch.$.storage": round(currentStorage - toSubtract, 1), // Round to 1 decimal place
          },
        }
      );
      const calling = await salesbill({ body: { ...data, tax: coffeeItem.tax, lotnumber: coffeeItem.lotnumber, uniqueId: uniqueId, weight: toSubtract, eppercentage: coffeeItem.eppercentage,lastTransactionId:lastTransactionId } });


      console.log("Updated coffee storage. Remaining:", remaining);
    } catch (error) {
      console.log("Error during update:", error); // Handle the error
      break; // Exit the loop if there's an error
    }
  }

  return remaining; // Return the remaining value after all updates
};

////////////////////////// dAily Report fragment /////////////////
exports.createDailyReport = async (req, res) => {

  var key = req.session.user.telegram || token
  var chatid = req.session.user.chatid || process.env.CHAT_ID

  const bot = new TelegramBot(key, { polling: true }); 

  try {
    const reportDate = req.body.reportdate;
    const startOfDay = new Date(reportDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reportDate);
    endOfDay.setHours(23, 59, 59, 999);

    const openingBalances = {
      bank: parseInt(req.body.openingBankBalance) || 0,
      cash: parseInt(req.body.openingCashBalance) || 0,
      other: parseInt(req.body.openingOtherBalance) || 0
    };

    let data = {
      companyname: 'HI TECH COFFEE',
      reportdate: reportDate,
      openingaccount: openingBalances.bank,
      openingcash: openingBalances.cash,
      openingother: openingBalances.other,
      openingtotal: openingBalances.bank + openingBalances.cash + openingBalances.other
    };

    // Create a map of operations to include
    const operations = {
      includeArrival: fetchArrivals,
      includeDespatch: fetchDespatches,
      includeBills: fetchBills,
      includeCommitments: fetchCommitments,
      includeBalance: fetchTransactions,
      includeExpenses: fetchExpenses,
      includepartybalance: fetchPartyBalances,
      includecommitmentbalance: fetchCommitmentBalances,
      incudestorage: fetchStorage,
      includestock: fetchStock,
      topurchaseorsale: fetchTopurchaseorsale,
      closingbalance: (startOfDay, endOfDay, data) => fetchclosing(startOfDay, endOfDay, data, openingBalances)
    };

    // Iterate over operations and execute those that are true
    for (const key in operations) {
      if (req.body[key] === 'true') {
        data = await operations[key](startOfDay, endOfDay, data);
      }
    }

    // Generate and send PDF report
    const filePath = await generatePdfReport(data, req.body.reportdate);
    await bot.sendDocument(chatid, filePath);

    // Delete the file after sending
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
      res.status(201).json({ message: 'Report created successfully' });
    });

  } catch (error) {
    console.error('Error creating daily report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch Arrivals
async function fetchArrivals(startOfDay, endOfDay, data) {
  const pipeline = [
    { $unwind: "$coffee" },
    { $match: { "coffee.date": { $gte: startOfDay, $lte: endOfDay } } },
    { $project: { name: 1, "coffee": 1 } }
  ];
  const result = await ClientModel.aggregate(pipeline).exec();
  return { ...data, arrivals: result };
}

// Fetch Despatches
async function fetchDespatches(startOfDay, endOfDay, data) {
  const pipeline = [
    { $unwind: "$despatch" },
    { $match: { "despatch.date": { $gte: startOfDay, $lte: endOfDay } } },
    { $project: { name: 1, "despatch": 1 } }
  ];
  const result = await ClientModel.aggregate(pipeline).exec();
  return { ...data, despatch: result };
}

// Fetch Bills
async function fetchBills(startOfDay, endOfDay, data) {
  const salesPipeline = [
    { $unwind: "$salesbillSchema" },
    { $match: { "salesbillSchema.date": { $gte: startOfDay, $lte: endOfDay } } },
    { $project: { name: 1, "salesbillSchema": 1 } }
  ];
  const purchasePipeline = [
    { $unwind: "$purchasebillSchema" },
    { $match: { "purchasebillSchema.date": { $gte: startOfDay, $lte: endOfDay } } },
    { $project: { name: 1, "purchasebillSchema": 1 } }
  ];
  const [salesResult, purchaseResult] = await Promise.all([
    ClientModel.aggregate(salesPipeline).exec(),
    ClientModel.aggregate(purchasePipeline).exec()
  ]);
  return { ...data, salesBills: salesResult, purchaseBills: purchaseResult };
}

// Fetch Commitments
async function fetchCommitments(startOfDay, endOfDay, data) {
  const salesCommitmentPipeline = [
    { $unwind: "$salescommitmentsschema" },
    { $match: { "salescommitmentsschema.date": { $gte: startOfDay, $lte: endOfDay } } },
    { $project: { name: 1, "salescommitmentsschema": 1 } }
  ];
  const purchaseCommitmentPipeline = [
    { $unwind: "$purchasecommitments" },
    { $match: { "purchasecommitments.date": { $gte: startOfDay, $lte: endOfDay } } },
    { $project: { name: 1, "purchasecommitments": 1 } }
  ];
  const [salesCommitmentResult, purchaseCommitmentResult] = await Promise.all([
    ClientModel.aggregate(salesCommitmentPipeline).exec(),
    ClientModel.aggregate(purchaseCommitmentPipeline).exec()
  ]);
  return { ...data, salesCommitments: salesCommitmentResult, purchaseCommitments: purchaseCommitmentResult };
}

// Fetch Transactions
async function fetchTransactions(startOfDay, endOfDay, data) {
  const pipeline = [
    { $unwind: "$transaction" },
    { $match: { "transaction.date": { $gte: startOfDay, $lte: endOfDay } } },
    { $match: { $or: [{ "transaction.recieved": { $ne: 0 } }, { "transaction.paid": { $ne: 0 } }] } },
    { $match: { "transaction.medium": { $not: { $regex: /^tds$/i } } } },
    {
      $project: {
        name: 1,
        "transaction.name": 1,
        "transaction.refference": 1,
        "transaction.medium": 1,
        "transaction.recieved": 1,
        "transaction.paid": 1,
      }
    }
  ];
  const result = await ClientModel.aggregate(pipeline).exec();
  return { ...data, transactions: result };
}

// Fetch Expenses
async function fetchExpenses(startOfDay, endOfDay, data) {
  const pipeline = [
    { $unwind: "$transaction" },
    { $match: { "transaction.date": { $gte: startOfDay, $lte: endOfDay } } },
    { $match: { $or: [{ "transaction.recieved": { $ne: 0 } }, { "transaction.paid": { $ne: 0 } }] } },
    {
      $project: {
        agent: 1, "transaction.name": 1,
        "transaction.refference": 1,
        "transaction.medium": 1,
        "transaction.recieved": 1,
        "transaction.paid": 1,
      }
    }
  ];
  const result = await Transportagent.aggregate(pipeline).exec();
  return { ...data, balances: result };
}
async function aggregateTransactions(model, startOfDay, endOfDay, additionalMatch = {}) {
  const pipeline = [
    { $unwind: "$transaction" }, // Deconstruct the transaction array
    { $match: { "transaction.date": { $gte: startOfDay, $lte: endOfDay } } }, // Match transactions within the date range
    {
      $match: {
        $or: [
          { "transaction.recieved": { $ne: 0 } },
          { "transaction.paid": { $ne: 0 } }
        ],
        ...additionalMatch // Additional match conditions
      }
    },
    {
      $group: {
        _id: null, // Group by null to aggregate all documents
        totalRecieved: { $sum: "$transaction.recieved" }, // Sum of recieved
        totalPaid: { $sum: "$transaction.paid" } // Sum of paid
      }
    },
    {
      $project: {
        _id: 0, // Exclude _id from the output
        totalRecieved: 1, // Include totalRecieved in the output
        totalPaid: 1 // Include totalPaid in the output
      }
    }
  ];

  return await model.aggregate(pipeline).exec();
}


async function fetchclosing(startOfDay, endOfDay, data, openingBalances) {
  // Aggregate transactions for ClientModel
  const clientResult = await aggregateTransactions(ClientModel, startOfDay, endOfDay);
  const transactionrecieved = clientResult?.[0]?.totalRecieved ?? 0;
  const transactionpaid = clientResult?.[0]?.totalPaid ?? 0;

  // Aggregate transactions for ProductsSchema
  const productsResult = await aggregateTransactions(Transportagent, startOfDay, endOfDay);
  const expense = productsResult?.[0]?.totalPaid ?? 0;
  const income = productsResult?.[0]?.totalRecieved ?? 0;

  // Additional aggregation for TDS
  const tdsResult = await aggregateTransactions(ClientModel, startOfDay, endOfDay, { "transaction.medium": { $regex: /^tds$/i } });
  const tdsrecievable = tdsResult?.[0]?.totalRecieved ?? 0;
  const tdspayable = tdsResult?.[0]?.totalPaid ?? 0;

  // Calculate closing balance
  const closingBalance = openingBalances.bank +
    openingBalances.cash +
    openingBalances.other +
    transactionrecieved +
    income -
    transactionpaid -
    expense +
    tdspayable -
    tdsrecievable;

  // Combine results with existing data
  return {
    ...data,
    recieved: transactionrecieved + income,
    paid: expense + transactionpaid,
    tdsrecievable,
    tdspayable,
    closebalance: closingBalance,
    closingbalance: true
  };
}


// Fetch Party Balances
async function fetchPartyBalances(startOfDay, endOfDay, data) {
  const pipeline = [
    { $addFields: { adjustedRecievable: { $subtract: ['$recievable', '$recieved'] }, adjustedPayable: { $subtract: ['$payable', '$paid'] } } },
    { $addFields: { customSortKey: { $subtract: ['$adjustedRecievable', '$adjustedPayable'] }, apayable: '$adjustedPayable', arecievable: '$adjustedRecievable' } },
    { $match: { $or: [{ customSortKey: { $gt: 1000 } }, { customSortKey: { $lt: -1000 } }] } }
    ,
    {
      $group: {
        _id: null,
        totalAdjustedRecievable: { $sum: '$adjustedRecievable' },
        totalAdjustedPayable: { $sum: '$adjustedPayable' },
        totalCustomSortKey: { $sum: '$customSortKey' },
        docs: { $push: '$$ROOT' } // Store matching documents for detailed output
      }
    },
  ];
  const result = await ClientModel.aggregate(pipeline).exec();
  if (result && result.length > 0) {
    // Retrieve data from the aggregation result
    const aggregatedData = result[0];

    // Safely extract the relevant data, ensuring defaults for null cases
    const partyBalance = aggregatedData.docs || [];
    const totalAdjustedRecievable = aggregatedData.totalAdjustedRecievable || 0;
    const totalAdjustedPayable = aggregatedData.totalAdjustedPayable || 0;
    const totalCustomSortKey = aggregatedData.totalCustomSortKey || 0;

    // Construct the final output object
    const output = {
      ...data,
      partybalance: partyBalance,
      totalAdjustedRecievable,
      totalAdjustedPayable,
      totalCustomSortKey
    };
    return output;
  } else {
    // Handle the case where no documents match the criteria
    const output = {
      ...data,
      partybalance: [],
      totalAdjustedRecievable: 0,
      totalAdjustedPayable: 0,
      totalCustomSortKey: 0
    };

    console.log('No matching documents found.');
    return output;
  }

}
// Fetch Commitment Balances
async function fetchCommitmentBalances(startOfDay, endOfDay, data) {
  const purchasePipeline = [
    { $unwind: "$purchasecommitments" },
    { $match: { "purchasecommitments.balance": { $gte: 499 } } }
  ];
  const salesPipeline = [
    { $unwind: "$salescommitmentsschema" },
    { $match: { "salescommitmentsschema.balance": { $gte: 499 } } }
  ];
  const [purchaseResult, salesResult] = await Promise.all([
    ClientModel.aggregate(purchasePipeline).exec(),
    ClientModel.aggregate(salesPipeline).exec()
  ]);
  return { ...data, purchasecommitmentbalance: purchaseResult, salecommitmentbalance: salesResult, commitmentbalance: true };
}
async function fetchStorage(startOfDay, endOfDay, data) {
  const purchasePipeline = [
    { $unwind: "$coffee" },
    { $match: { "coffee.storage": { $gte: 10 } } },
    {
      $group: {
        _id: {
          name: "$name",
          item: "$coffee.item"
        },
        totalPurchaseStorage: { $sum: "$coffee.storage" }
      }
    },
    {
      $project: {
        _id: 0,
        name: "$_id.name",
        item: "$_id.item",
        totalPurchaseStorage: 1
      }
    }
  ];

  const salesPipeline = [
    { $unwind: "$despatch" },
    { $match: { "despatch.storage": { $gte: 10 } } },
    {
      $group: {
        _id: {
          name: "$name",
          item: "$despatch.item"
        },
        totalSalesStorage: { $sum: "$despatch.storage" }
      }
    },
    {
      $project: {
        _id: 0,
        name: "$_id.name",
        item: "$_id.item",
        totalSalesStorage: 1
      }
    }
  ];

  const [PurchaseStorage, SalesStorage] = await Promise.all([
    ClientModel.aggregate(purchasePipeline).exec(),
    ClientModel.aggregate(salesPipeline).exec()
  ]);
  return { ...data, PurchaseStorage: PurchaseStorage, SalesStorage: SalesStorage, storagebalance: true };
}
async function fetchStock(startOfDay, endOfDay, data) {
  const result = await PoductsSchema.aggregate([{ $project: { product: 1, stockweight: 1, stockep: 1 } }]);
  return { ...data, stock: result };
}
async function fetchTopurchaseorsale(startOfDay, endOfDay, data) {
  // Step 1: Fetch primary products and get their product names
  const primaryProducts = await PoductsSchema.find({ itemtype: 'Primary' }, 'product').exec();
  const productNames = primaryProducts.map(p => p.product);

  // Step 2: Create aggregation pipelines
  const createPipeline = (field, matchField, sumField) => [
    { $unwind: `$${field}` },
    {
      $match: {
        [`${field}.${matchField}`]: { $in: productNames }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: `$${field}.${sumField}` }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1
      }
    }
  ];

  // Step 3: Execute pipelines and get results
  const pipelines = [
    { field: 'despatch', matchField: 'item', sumField: 'storage', model: ClientModel },
    { field: 'coffee', matchField: 'item', sumField: 'storage', model: ClientModel },
    { field: 'purchasecommitments', matchField: 'item', sumField: 'balance', model: ClientModel },
    { field: 'salescommitmentsschema', matchField: 'item', sumField: 'balance', model: ClientModel }
  ];

  const results = await Promise.all(
    pipelines.map(({ field, matchField, sumField, model }) =>
      model.aggregate(createPipeline(field, matchField, sumField)).exec()
    )
  );

  // Step 4: Extract and store results
  const [despatchResult, coffeeResult, purchaseCommitmentResult, salesCommitmentResult] = results;

  const totalDespatchStorage = despatchResult.length > 0 ? despatchResult[0].total : 0;
  const totalCoffeeStorage = coffeeResult.length > 0 ? coffeeResult[0].total : 0;
  const totalPurchaseCommitmentBalance = purchaseCommitmentResult.length > 0 ? purchaseCommitmentResult[0].total : 0;
  const totalSalesCommitmentBalance = salesCommitmentResult.length > 0 ? salesCommitmentResult[0].total : 0;

  // Step 5: Aggregate stockep from primary products
  const [{ totalStockEp = 0 } = {}] = await PoductsSchema.aggregate([
    { $match: { itemtype: "Primary" } },
    { $group: { _id: null, totalStockEp: { $sum: "$stockep" } } },
    { $project: { _id: 0, totalStockEp: 1 } }
  ]);


  return {
    ...data,
    totalStockEp: parseInt(totalStockEp),
    totalDespatchStorage: parseInt(totalDespatchStorage),
    totalCoffeeStorage: parseInt(totalCoffeeStorage),
    totalPurchaseCommitmentBalance: parseInt(totalPurchaseCommitmentBalance),
    totalSalesCommitmentBalance: parseInt(totalSalesCommitmentBalance),
    topurchaseorsale: parseInt(totalStockEp + totalDespatchStorage - totalCoffeeStorage + totalPurchaseCommitmentBalance - totalSalesCommitmentBalance),
    purchaseorsale: true
  };
}

// Generate PDF Report
async function generatePdfReport(data, reportDate) {

  const templatePath = path.join(__dirname, 'dailyreport.hbs');
  const template = fs.readFileSync(templatePath, 'utf8');
  const compiledTemplate = handlebars.compile(template);
  const html = compiledTemplate({ data });
  fs.writeFile(path.join(__dirname, '..', 'public', 'dailyreport.html'), html, async (d) => { })
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const fileName = `report_${reportDate}.pdf`;
  const filePath = path.join(__dirname, '..', 'public', fileName);
  await page.pdf({ path: filePath, format: 'A4' });
  await browser.close();

  return filePath;
}
////////////////////////// dAily Report fragment /////////////////
//////add trip

exports.addtrip = async (req, res) => {

  const client = await Transportagent.findOne({ agent: req.body.name });
  client.transaction.push({
    name: req.body.trip,
    date: new Date(req.body.date),
    refference: req.body.item + '  ' + req.body.quantity,
    payable: parseInt(req.body.rate || 0),
    medium: req.body.vehicle,
    id: new Date().toString(),
    revievable: 0,
    recieved: 0,
    paid: 0,
  });

  // Save the updated client to the database
  await client.save();
  res.status(200).json({ message: 'Purchase commitment added successfully!' });


}

exports.postattendance = async (req, res) => {

  try {
    const { date, attendance, src } = req.body;

    // Find the existing document by date
    let existingRecord = await Attendance.findOne({ date: new Date(date) });

    if (existingRecord) {
      // If the document exists, update the attendance array
      existingRecord.attendance = attendance;
      await existingRecord.save();
      res.status(200).send({ message: 'Attendance updated successfully.' });
    } else {
      // If the document doesn't exist, create a new one
      const newAttendance = new Attendance({
        date: new Date(date),
        attendance: attendance,

      });
      await newAttendance.save();
      res.status(201).send({ message: 'Attendance added successfully.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while processing your request.' });
  }
}


// exports.addsalary = async (req,res)=> {

//   const client = await Transportagent.findOne({ agent: req.body.name });
//   client.transaction.push({
//     name:req.body.type,
//     date: req.body.date,
//     refference: req.body.from + ' - ' + req.body.to,
//     payable:parseInt(req.body.payable || 0),
//     medium:req.body.medium,
//     id:new Date().toString(),
//     revievable:0,
//     recieved:0,
//     paid:0,
//   });

//   // Save the updated client to the database
//   await client.save();
//   res.status(200).json({ message: 'Purchase commitment added successfully!' });


// }

exports.addsalary = async (req, res) => {
  try {
    const reference = req.body.from + ' - ' + req.body.to;

    // Aggregation to check if the transaction with the given reference exists
    const client = await Transportagent.aggregate([
      {
        // Match the agent
        $match: { agent: req.body.name }
      },
      {
        // Unwind the transaction array so we can check each transaction
        $unwind: "$transaction"
      },
      {
        // Match if the transaction with the same reference exists
        $match: { "transaction.refference": reference }
      },
      {
        // Limit the result to 1 to avoid unnecessary full scans
        $limit: 1
      }
    ]);

    // If the aggregation found a matching transaction, return an error
    if (client.length > 0) {
      return res.status(400).json({ message: 'Transaction with this reference already exists' });
    }

    // If no matching reference was found, add the new transaction
    const foundClient = await Transportagent.findOne({ agent: req.body.name });
    if (!foundClient) {
      return res.status(404).json({ message: 'Transport agent not found' });
    }

    foundClient.transaction.push({
      name: req.body.type,
      date: new Date(req.body.date),
      refference: reference,
      payable: parseInt(req.body.payable || 0),
      medium: req.body.medium,
      id: new Date().toString(),
      revievable: 0,
      recieved: 0,
      paid: 0,
    });

    // Save the updated client to the database
    await foundClient.save();

    // Respond with success
    res.status(200).json({ message: 'Salary added successfully!' });

  } catch (error) {
    console.error('Error adding salary:', error);
    res.status(500).json({ message: 'Error adding salary' });
  }
};
exports.addLoadingPayment = async (req, res) => {
  try {
    const decodedName = req.body.agent.agent.replace(/&amp;/g, '&');
    console.log(req.body)
    // Find the transport agent by agent name
    const client = await Transportagent.findOne({ agent: decodedName });
    if (!client) {
      return res.status(404).json({ message: 'Agent not found.' });
    }
    // Add a transaction to the agent's transaction history
    client.transaction.push({
      name: decodedName,
      date: new Date(req.body.date),
      refference: req.body.work,
      payable: parseInt(req.body.agent.total),
      medium: `${req.body.agent.bags} ${req.body.unit} * ${req.body.agent.kooli}`,
      id: new Date().toString(),
      revievable: 0,
      recieved: 0,
      paid: 0,
    });
    await client.save();

    // If `fun` is not defined or false, save the client document
    if (!req.body.fun) {
      return res.status(200).json({ message: 'Payment added successfully!' });
    } else {
      return
    }

    // Otherwise, if `fun` is true, the client document is not saved here
  } catch (error) {
    console.error('Error adding loading payment:', error);
    res.status(500).json({ message: 'An error occurred while processing payment.' });
  }
};

// Controller for adding loading work
// Controller for adding loading work
exports.addLoadingWork = async (req, res) => {
  try {
    // Create a new Loadinwork document
    const newWork = new Loadinwork({
      date: new Date(req.body.date),
      work: req.body.work,
      unit: req.body.unit,
      variables: req.body.bags,
      kooli: req.body.basekooli,
      total: req.body.total,
      agents: req.body.agents,
    });

    // Save the new work document to MongoDB
    await newWork.save();

    // If the total is greater than 0, process each agent's loading payment
    if (req.body.total > 0) {
      const agentPayments = req.body.agents.map((agent) =>
        exports.addLoadingPayment({
          body: {
            agent: agent,
            fun: 'yes',
            work: req.body.work,
            date: req.body.date,
            unit: req.body.unit,
          }
        }, res) // Pass `res` if needed
      );

      // Wait for all the agent payments to complete
      await Promise.all(agentPayments);
    }

    res.status(200).json({ message: 'Loading work and payments processed successfully!' });
  } catch (error) {
    console.error('Error adding loading work:', error);
    res.status(500).json({ message: 'An error occurred while adding loading work.' });
  }
};

// Controller for adding/loading payment
