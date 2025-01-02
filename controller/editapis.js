
require('../model/clientsmodal')
const mongoose = require('mongoose');
const ClientModel = mongoose.model('Client')
const CoffeeSchema = mongoose.model('CoffeeSchema');
const Reference = mongoose.model('Reference');
const PoductsSchema = mongoose.model('PoductsSchema')
const Transportagent = mongoose.model('Transportagent')
const Financialyear = mongoose.model('Financialyear')
const User = mongoose.model('User')
const Loadinwork = mongoose.model('Loadinwork')

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');
const pdfMaster = require("pdf-master");
const { Console } = require('console');
const { findOneAndUpdate } = require('../model/clientsmodal');

exports.editentry = async (req, res) => {
  const clientId = new mongoose.Types.ObjectId(req.params.id); // Convert id to ObjectId
  const clientName = req.params.idname;

  const client = await ClientModel.aggregate([
    {
      $match: { name: clientName } // Match the client by name
    },
    {
      $project: {
        coffee: {
          $filter: {
            input: '$coffee', // Array to filter
            as: 'coffee', // Variable to represent each element in the array
            cond: { $eq: ['$$coffee._id', clientId] } // Condition to match coffee id
          }
        }
      }
    }
  ])
    .exec();
  if (client.length > 0 && client[0].coffee.length == 1) {
    return res.render('editreport', { route: 'generatereport', coffee: client[0].coffee[0], status: 'Purchase' });
  } else {
    return
  }


};
exports.editsalesentry = async (req, res) => {
  const clientId = new mongoose.Types.ObjectId(req.params.id); // Convert id to ObjectId
  const clientName = req.params.idname;

  const client = await ClientModel.aggregate([
    {
      $match: { name: clientName } // Match the client by name
    },
    {
      $project: {
        despatch: {
          $filter: {
            input: '$despatch', // Array to filter
            as: 'despatch', // Variable to represent each element in the array
            cond: { $eq: ['$$despatch._id', clientId] } // Condition to match coffee id
          }
        }
      }
    }
  ])
    .exec();
  if (client.length > 0 && client[0].despatch.length == 1) {
    return res.render('editreport', { route: 'generatereport', coffee: client[0].despatch[0], status: 'Sales' });
  } else {
    return
  }


};


exports.editpurchase = async (req, res, hi) => {
  console.log('herexx')

  try {
    let product = await PoductsSchema.findOne({product:req.body.item})

    let existingClient = await ClientModel.findOne({ name: req.body.billTo });
    if (existingClient) {
      // Find the coffee item with the specified lotnumber
      const coffeeItemToUpdate = existingClient.coffee.find(coffee => coffee.lotnumber === req.body.lotnumber);
        var  storeout =0
        var  storein =0
      if (coffeeItemToUpdate) {
        product.stockweight = (product.stockweight||0) - parseInt(coffeeItemToUpdate.netWeight)+ parseInt(req.body.netWeight)
        product.stockep = (product.stockep||0) - parseInt(coffeeItemToUpdate.netepweight)+ parseInt(req.body.netepweight)

        await product.save();
         storeout = existingClient.storeout + 0
         storein = existingClient.storein + (parseFloat(req.body.netepweight)) - (parseFloat(coffeeItemToUpdate.netepweight))
        // Update the properties of the found coffee item
        coffeeItemToUpdate.date = req.body.dateOfIssue;
        coffeeItemToUpdate.referenceselect = req.body.referenceselect;
        coffeeItemToUpdate.billTo = req.body.billTo;
        coffeeItemToUpdate.transportagent = req.body.transportagent;
        coffeeItemToUpdate.lorry = req.body.lorry;
        coffeeItemToUpdate.billtype = req.body.billtype;
        coffeeItemToUpdate.delivery = req.body.delivery;
        coffeeItemToUpdate.remarks = req.body.remarks;
        coffeeItemToUpdate.item = req.body.item;
        coffeeItemToUpdate.bags = req.body.bags;
        coffeeItemToUpdate.quantity = req.body.quantity;
        coffeeItemToUpdate.bagweight = req.body.bagweight;
        coffeeItemToUpdate.forignobject = req.body.forignobject;
        coffeeItemToUpdate.weightallowance = req.body.weightallowance;
        coffeeItemToUpdate.outern = req.body.outern;
        coffeeItemToUpdate.huskpercentage = req.body.huskpercentage;
        coffeeItemToUpdate.huskcutting = req.body.huskcutting;
        coffeeItemToUpdate.moisturepercentage = req.body.moisturepercentage;
        coffeeItemToUpdate.moisturecutting = req.body.moisturecutting;
        coffeeItemToUpdate.bbpercentage = req.body.bbpercentage;
        coffeeItemToUpdate.bbcutting = req.body.bbcutting;
        coffeeItemToUpdate.berryborepercentage = req.body.berryborepercentage;
        coffeeItemToUpdate.berryborecutting = req.body.berryborecutting;
        coffeeItemToUpdate.other = req.body.other;
        coffeeItemToUpdate.allowance = req.body.allowance;
        coffeeItemToUpdate.lotnumber = req.body.lotnumber;
        coffeeItemToUpdate.netepweight = req.body.netepweight;
        coffeeItemToUpdate.netWeight = req.body.netWeight;
        coffeeItemToUpdate.eppercentage = req.body.eppercentage;
        coffeeItemToUpdate.storage =  (parseFloat(req.body.netepweight)) - (parseFloat(req.body.billedquantity)); // Update storage value

        // Save the changes to the existingClient
      }

      
      existingClient.storeout = storeout;
      existingClient.storein = storein;
      await existingClient.save();

    }
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error submitting the form' });
  }
};
exports.editsales = async (req, res, hi) => {
  try {
    let existingClient = await ClientModel.findOne({ name: req.body.billTo });
    let product = await PoductsSchema.findOne({product:req.body.item})
    if (existingClient) {
      // Find the coffee item with the specified lotnumber
      const coffeeItemToUpdate = existingClient.despatch.find(coffee => coffee.lotnumber === req.body.lotnumber);

      if (coffeeItemToUpdate) {
        product.stockweight = (((product.stockweight||0) + parseInt(coffeeItemToUpdate.netWeight)- parseInt(req.body.netWeight))<=0?0:((product.stockweight||0) + parseInt(coffeeItemToUpdate.netWeight)- parseInt(req.body.netWeight)))
        product.stockep = (product.stockep||0) + parseInt(coffeeItemToUpdate.netepweight)- parseInt(req.body.netepweight)
        await product.save();
        
        var storeout = parseInt(existingClient.storeout)  + (parseFloat(req.body.netepweight)) - (parseFloat(coffeeItemToUpdate.netepweight))
        var storein = existingClient.storein + 0
        // Update the properties of the found coffee item
        coffeeItemToUpdate.date = req.body.dateOfIssue;
        coffeeItemToUpdate.referenceselect = req.body.referenceselect;
        coffeeItemToUpdate.billTo = req.body.billTo;
        coffeeItemToUpdate.transportagent = req.body.transportagent;
        coffeeItemToUpdate.lorry = req.body.lorry;
        coffeeItemToUpdate.billtype = req.body.billtype;
        coffeeItemToUpdate.delivery = req.body.delivery;
        coffeeItemToUpdate.remarks = req.body.remarks;
        coffeeItemToUpdate.item = req.body.item;
        coffeeItemToUpdate.bags = req.body.bags;
        coffeeItemToUpdate.quantity = req.body.quantity;
        coffeeItemToUpdate.bagweight = req.body.bagweight;
        coffeeItemToUpdate.forignobject = req.body.forignobject;
        coffeeItemToUpdate.weightallowance = req.body.weightallowance;
        coffeeItemToUpdate.outern = req.body.outern;
        coffeeItemToUpdate.huskpercentage = req.body.huskpercentage;
        coffeeItemToUpdate.huskcutting = req.body.huskcutting;
        coffeeItemToUpdate.moisturepercentage = req.body.moisturepercentage;
        coffeeItemToUpdate.moisturecutting = req.body.moisturecutting;
        coffeeItemToUpdate.bbpercentage = req.body.bbpercentage;
        coffeeItemToUpdate.bbcutting = req.body.bbcutting;
        coffeeItemToUpdate.berryborepercentage = req.body.berryborepercentage;
        coffeeItemToUpdate.berryborecutting = req.body.berryborecutting;
        coffeeItemToUpdate.other = req.body.other;
        coffeeItemToUpdate.allowance = req.body.allowance;
        coffeeItemToUpdate.lotnumber = req.body.lotnumber;
        coffeeItemToUpdate.netepweight = req.body.netepweight;
        coffeeItemToUpdate.netWeight = req.body.netWeight;
        coffeeItemToUpdate.eppercentage = req.body.eppercentage;
        coffeeItemToUpdate.storage = (parseFloat(req.body.netepweight)) - (parseFloat(req.body.billedquantity)) // Update storage value

        // Save the changes to the existingClient
      }

     
      existingClient.storeout = storeout;
      existingClient.storein = storein;
      await existingClient.save();
    }
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error submitting the form' });
  }
};
exports.viewcurrentpurchasereport = async (req, res, hi) => {
  console.log('here')

  try {
    let existingClient = await ClientModel.findOne({ name: req.query.billTo });
    if (existingClient) {
      // Find the coffee item with the specified lotnumber
      const coffee = existingClient.coffee.find(coffee => coffee.lotnumber === req.query.lotnumber);
      const bills = await ClientModel.aggregate([
        { $match: { "purchasebillSchema.lotnumber": req.query.lotnumber } }, // Match bills by lotnumber
        { $unwind: "$purchasebillSchema" }, // Unwind the purchasebillSchema array
        {
          $addFields: { // Add new field formatted_date to hold the formatted date
            "purchasebillSchema.formatted_date": {
              $dateToString: {
                format: "%d:%m:%Y", // Format date as dd:mm:YYYY
                date: "$purchasebillSchema.date" // Date field to format
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            subtotal: { $sum: "$purchasebillSchema.subtotal" },
            tax: { $sum: "$purchasebillSchema.tax" },
            total: { $sum: "$purchasebillSchema.total" },
            bills: { $push: "$purchasebillSchema" } // Push individual purchase bills into an array
          }
        }
      ]);

      var taxtotal = bills.length > 0 ? bills[0].tax : 0
      var total = bills.length > 0 ? bills[0].subtotal : 0
      var grandtotal = bills.length > 0 ? bills[0].total : 0
      var tax = (taxtotal && total) > 0 ? parseFloat((total / taxtotal) * 100) : 0
      var data = {
        companyname: 'HI TECH COFFEE',
        party: coffee.billTo,
        item: coffee.item,
        delivery: coffee.delivery,
        date: coffee.dateOfIssue,
        vehicleno: coffee.lorry,
        type: 'Purchase',
        bags: coffee.bags,
        quantity: coffee.quantity,
        bagweight: parseInt(coffee.bagweight * coffee.bags),
        netweights: parseInt(coffee.quantity - parseFloat(coffee.bagweight * coffee.bags)),
        forignobject: coffee.forignobject,
        weightallowance: parseFloat(coffee.quantity) - parseFloat(coffee.netWeight),
        huskpercentage: coffee.huskpercentage,
        outern: coffee.outern,
        huskcutting: coffee.huskcutting,
        moisturepercentage: coffee.moisturepercentage,
        moisturecutting: coffee.moisturecutting,
        bbpercentage: coffee.bbpercentage,
        bbcutting: coffee.bbcutting,
        berryborepercentage: coffee.berryborepercentage,
        berryborecutting: coffee.berryborecutting,
        other: coffee.other,
        allowance: coffee.allowance,
        lotnumber: coffee.lotnumber,
        netepweight: coffee.netepweight,
        eppercentage: parseFloat(coffee.eppercentage).toFixed(2),
        refference: coffee.referenceselect,
        netWeight: coffee.netWeight - coffee.huskcutting,
        status: coffee.stat,
        bill: bills.length > 0 ? bills[0].bills : [],
        tax: tax,
        taxtype: tax == 0 ? 'tax-exempt' : tax == 5 ? 'cgst 2.5% + sgst 2.5%' : 'cgst 2.5% + sgst 2.5% + igst 5%',
        taxtotal: taxtotal,
        total: total,
        grandtotal: grandtotal,
        cuttings: parseInt(coffee.epweight) - parseInt(coffee.netepweight)

      }

      let options = {
        // displayHeaderFooter: true,
        format: "A4",
        margin: { top: "60px", bottom: "100px" },
        // base: 'file://' + path.resolve('./public') + '/'

      };

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
        res.redirect('/report.html')

      })
    }else{
      res.redirect('/report.html')

    }

  } catch (error) {
    res.redirect('/report.html')
  }
};
exports.viewcurrentsales = async (req, res, hi) => {

  try {
    let existingClient = await ClientModel.findOne({ name: req.query.billTo });
    if (existingClient) {
      // Find the coffee item with the specified lotnumber
      const coffee = existingClient.despatch.find(coffee => coffee.lotnumber === req.query.lotnumber);
      const bills = await ClientModel.aggregate([
        { $match: { "salesbillSchema.lotnumber": req.query.lotnumber } }, // Match bills by lotnumber
        { $unwind: "$salesbillSchema" }, // Unwind the purchasebillSchema array
        {
          $addFields: { // Add new field formatted_date to hold the formatted date
            "salesbillSchema.formatted_date": {
              $dateToString: {
                format: "%d:%m:%Y", // Format date as dd:mm:YYYY
                date: "$salesbillSchema.date" // Date field to format
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            subtotal: { $sum: "$salesbillSchema.subtotal" },
            tax: { $sum: "$salesbillSchema.tax" },
            total: { $sum: "$salesbillSchema.total" },
            bills: { $push: "$salesbillSchema" } // Push individual purchase bills into an array
          }
        }
      ]);

      var taxtotal = bills.length > 0 ? bills[0].tax : 0
      var total = bills.length > 0 ? bills[0].subtotal : 0
      var grandtotal = bills.length > 0 ? bills[0].total : 0
      var tax = (taxtotal && total) > 0 ? parseFloat((total / taxtotal) * 100) : 0
      var data = {
        companyname: 'HI TECH COFFEE',
        party: coffee.billTo,
        item: coffee.item,
        delivery: coffee.delivery,
        date: coffee.dateOfIssue,
        vehicleno: coffee.lorry,
        type: 'Sales',
        bags: coffee.bags,
        quantity: coffee.quantity,
        bagweight: parseInt(coffee.bagweight * coffee.bags),
        netweights: parseInt(coffee.quantity - parseFloat(coffee.bagweight * coffee.bags)),
        forignobject: coffee.forignobject,
        weightallowance: parseFloat(coffee.quantity) - parseFloat(coffee.netWeight),
        huskpercentage: coffee.huskpercentage,
        outern: coffee.outern,
        huskcutting: coffee.huskcutting,
        moisturepercentage: coffee.moisturepercentage,
        moisturecutting: coffee.moisturecutting,
        bbpercentage: coffee.bbpercentage,
        bbcutting: coffee.bbcutting,
        berryborepercentage: coffee.berryborepercentage,
        berryborecutting: coffee.berryborecutting,
        other: coffee.other,
        allowance: coffee.allowance,
        lotnumber: coffee.lotnumber,
        netepweight: coffee.netepweight,
        eppercentage: parseFloat(coffee.eppercentage).toFixed(2),
        refference: coffee.referenceselect,
        netWeight: coffee.netWeight - coffee.huskcutting,
        status: coffee.stat,
        bill: bills.length > 0 ? bills[0].bills : [],
        tax: tax,
        taxtype: tax == 0 ? 'tax-exempt' : tax == 5 ? 'cgst 2.5% + sgst 2.5%' : 'cgst 2.5% + sgst 2.5% + igst 5%',
        taxtotal: taxtotal,
        total: total,
        grandtotal: grandtotal,
        cuttings: parseInt(coffee.epweight) - parseInt(coffee.netepweight)

      }

      let options = {
        // displayHeaderFooter: true,
        format: "A4",
        margin: { top: "60px", bottom: "100px" },
        // base: 'file://' + path.resolve('./public') + '/'

      };

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
        res.redirect('/report.html')

      })
    }else{
      res.redirect('/report.html')

    }

  } catch (error) {
    res.redirect('/report.html')
  }
};

////update product /////
  exports.updateproduct = async (req, res, hi) => {
    console.log('here')
  try {
      const { id, item, product } = req.body;
      console.log(req.body)

      // Find the product by id and update its itemtype and product fields
      const updatedProduct = await PoductsSchema.findByIdAndUpdate(id, {
          itemtype: item,
          byproduct: product
      }, { new: true });

      if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
      }

      res.json(updatedProduct); // Return the updated product
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.deleteproduct = async (req, res, hi) => {
try {
    const { id } = req.body;

    // Find the product by id and update its itemtype and product fields
    const updatedProduct = await PoductsSchema.findByIdAndDelete(id);

    if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct); // Return the updated product
} catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
};

exports.updaterefferencedefault = async (req, res, hi) => {
try {
    const { refference } = req.body;
    // Find the product by id and update its itemtype and product fields
    const updatedProduct = await Reference.findOneAndUpdate(
      { name: refference }, // Search criteria
      { defaulted: new Date() }, // Fields to update
      { new: true } // Options: return the modified document
  );
    if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct); // Return the updated product
} catch (error) {
    console.log('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
};
exports.updatefinancial = async (req, res, hi) => {
try {
    const { year } = req.body;
    // Find the product by id and update its itemtype and product fields
    const updatedProduct = await Financialyear.findOneAndUpdate(
      { year: year }, // Search criteria
      { defaulted: new Date() }, // Fields to update
      { new: true } // Options: return the modified document
  );
    if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct); // Return the updated product
} catch (error) {
    console.log('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
};
exports.editvariables = async (req, res, next) => {
  try {
    const { pbillno, sbillno, cnoteno,dnoteno, urdpbillno, pcommno,scommno,urdsbillno } = req.body;

    // Find the user document by some unique identifier, like 'uid'
    const user = await User.findById(req.session.user._id );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user document with the received variables
    user.pbillid =parseInt(pbillno);
    user.sbill = parseInt(sbillno);
    user.creditnoteid = parseInt(cnoteno);
    user.debitnoteid = parseInt(dnoteno);
    user.purdbillid = parseInt(urdpbillno);
    user.surdbillid = parseInt(urdsbillno);
    user.pcomm = parseInt(pcommno);
    user.scomm = parseInt(scommno);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.log('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.updatestock = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const stockValue = parseInt(req.body.stockValue);
    const curingValue = parseInt(req.body.curingValue);
    const epvalue = parseInt(req.body.epvalue);
    // Find the product by ID
    const product = await PoductsSchema.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const eppercentage = (epvalue/stockValue)*100
    const updatedep = parseInt(curingValue*(eppercentage/100));

    // Update the stock weight of the main product
      product.stockweight = stockValue ;
      product.stockep = epvalue 

      await product.save();
      for (const byproduct of product.byproduct) {
      const bproduct = await PoductsSchema.findOne({ product: byproduct.name });

      if (bproduct) {
        const percentage = parseFloat(byproduct.percentage);
        bproduct.stockweight = bproduct.stockweight+Math.round(updatedep * (percentage / 100));
        bproduct.stockep = bproduct.stockep+Math.round(updatedep * (percentage / 100));
        const epded = product.stockep - parseInt(updatedep * (percentage / 100));
        product.stockep = epded;
        product.stockweight = parseInt(epded*100/eppercentage)
        await product.save();
        await bproduct.save();
      }
    }

    // Save the updated product document
    await product.save();

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.log('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.editseller = async (req, res) => {
  const name = req.body.name.trim().toUpperCase();

  const existingClient = await ClientModel.findById(req.body.id);
  if (existingClient) {
    existingClient.name = name;
    existingClient.tds= req.body.tds;
        existingClient.address= req.body.address;
    existingClient.phone= req.body.phone;

    await existingClient.save();
    res.json({ success: true, message: 'Reference added successfully' });

  }else{
    res.json({ success: false, message: 'no client' });

   

  }
}

exports.editagent = async (req, res) => {
  const name = req.body.name.trim().toUpperCase();

  const existingClient = await Transportagent.findById(req.body.id);
  if (existingClient) {
    existingClient.agent = name;
        existingClient.address= req.body.address;
    existingClient.phone= req.body.phone;

    await existingClient.save();
    res.json({ success: true, message: 'Reference added successfully' });

  }else{
    res.json({ success: false, message: 'no client' });

   

  }
}


  exports.deliverymarked = async (req, res) => {
  const { loadtype, id } = req.body;
  try {
      // Determine the field to update based on loadtype
      const fieldToUpdate = loadtype === 'Arrival' ? 'coffee' : 'despatch';

      // Use $elemMatch to find the specific element within the array
      const updateQuery = {
          [`${fieldToUpdate}`]: { $elemMatch: { _id: id } }
      };

      // Use $set to update the deliverymarked field to "yes"
      const updateOperation = {
          $set: {
              [`${fieldToUpdate}.$.deliverymarked`]: 'yes'
          }
      };

      // Update the document in the database
      const result = await ClientModel.updateOne(updateQuery, updateOperation);
      res.status(200).json({ message: 'Purchase commitment added successfully!' });

  } catch (error) {
      console.log('Error updating delivery status:', error);
      res.status(500).send({ message: 'Server error.' });
  }
}


exports.updateloadinworkDetails = async (req, res) => {
  try {
    const { kooli, totalinput, id, agentid } = req.body;

    // Find the Loadinwork document
    const loadinworkDoc = await Loadinwork.findById(id);

    if (!loadinworkDoc) {
      return res.status(404).json({ message: 'Loadinwork not found.' });
    }

    // Update the specific agent's kooli and total
    const updatedLoadinwork = await Loadinwork.findOneAndUpdate(
      { _id: id, "agents._id": agentid }, // Find the document with matching ID and agent ID
      {
        $set: {
          "agents.$.kooli": kooli,           // Update kooli for the specific agent
          "agents.$.total": totalinput,      // Update total for the specific agent
          kooli: kooli,                      // Update kooli outside of agents array
          total: loadinworkDoc.variables * kooli, // Update total outside of agents array
        }
      },
      { new: true } // Return the updated document
    );

    if (!updatedLoadinwork) {
      return res.status(404).json({ message: 'Agent or work not found.' });
    }

    res.status(200).json({ message: 'Agent and work details updated successfully!', data: updatedLoadinwork });
  } catch (error) {
    console.error('Error updating agent and work details:', error);
    res.status(500).json({ message: 'An error occurred while updating agent and work details.' });
  }
};