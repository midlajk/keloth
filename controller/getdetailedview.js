const mongoose = require('mongoose');
const ClientModel = mongoose.model('Client')
const Reference = mongoose.model('Reference');
const Transportagent = mongoose.model('Transportagent')

exports.individualpurchaseaccount = async (req, res) => {
    const client = await ClientModel.findOne({name:req.params.name})
    const reference = await Reference.findOne({})
    .sort({ defaulted: -1 }) 
    res.render('individualpurchase',{ route: 'accounts',name: req.params.name,data:client,reference:reference.name})
  
};


exports.getdetailedreport = async (req, res) => {
    const name = req.query.name;
    const client = await ClientModel.findOne({name:name})
    const result1 = await ClientModel.aggregate([
        {
            $match: { name: name } // Match documents by name
        },
        { $unwind: '$coffee' },
        {
            $group: {
                _id: null,
                arrival: { $sum: '$coffee.netepweight' },
                storage: { $sum: '$coffee.storage' },
                
            }
        }
    ]);
    const result3 = await ClientModel.aggregate([
        {
            $match: { name: name } // Match documents by name
        },
        { $unwind: '$purchasebillSchema' },
        {
            $match: {
                'purchasebillSchema.item': { $ne: 'HUSK' }
            }
        },
        {
            $group: {
                _id: null,
                totalQty: { $sum: '$purchasebillSchema.qty' },
                totalAmount: { $sum: '$purchasebillSchema.subtotal' }
            }
        }
    ]);
    const result2 = await ClientModel.aggregate([
        {
            $match: { name: name } // Match documents by name
        },
        { $unwind: '$purchasecommitments' },
        {
            $group: {
                _id: null,
                totalRevievable: { $sum: '$purchasecommitments.balance' },
            }
        }
    ]);
    const result4 = await ClientModel.aggregate([
        {
            $match: { name: name } // Match documents by name
        },
        { $unwind: '$despatch' },
        {
            $group: {
                _id: null,
                depatch: { $sum: '$despatch.netepweight' },
                storage: { $sum: '$despatch.storage' },
                
            }
        }
    ]);
    const result5 = await ClientModel.aggregate([
        {
            $match: { name: name } // Match documents by name
        },
        { $unwind: '$salesbillSchema' },
        {
            $match: {
                'salesbillSchema.item': { $ne: 'HUSK' }
            }
        },
        {
            $group: {
                _id: null,
                totalQty: { $sum: '$salesbillSchema.qty' },
                totalAmount: { $sum: '$salesbillSchema.subtotal' }
            }
        }
    ]);
    const result6 = await ClientModel.aggregate([
        {
            $match: { name: name } // Match documents by name
        },
        { $unwind: '$salescommitmentsschema' },
        {
            $group: {
                _id: null,
                totalRevievable: { $sum: '$salescommitmentsschema.balance' },
            }
        }
    ]);
    res.json({
        data: {
            balance : client.recievable+client.paid-client.recieved-client.payable,
            recievable : client.recievable,
            paid : client.paid,
            recieved : client.recieved,
            payable : client.payable,
            storein : result1[0]?.storage || 0,
            arrival : result1[0]?.arrival || 0,
            billedvalue:result3[0]?.totalAmount || 0,
            commitmentpurchase:result2[0]?.totalRevievable || 0,
            despatch : result4[0]?.depatch || 0,
            storeout : result4[0]?.storage || 0,
            salebilled:result5[0]?.totalAmount || 0,
            commitmentsale:result6[0]?.totalRevievable || 0,


        }})
  
};

exports.ieaccount = async (req, res) => {
    try {
        const name = req.query.name;
        const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
        const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
        const length = parseInt(req.query.length) || 10; // Get the number of records per page
        // Fetch data from the database with pagination
        const decodedName = name.replace(/&amp;/g, '&');

        let pipeline = [
          {
              $unwind: "$transaction"
          },
          { $sort: { 'transaction._id': -1 } },

          {
              $skip: start
          },
          {
              $limit: length
          },
          {
            $group: {
              _id: null,
              transaction: { $push: '$transaction' } // Push matching salescommitmentsschema to array
          }}
      ];

      // If name is provided in the query, add a $match stage to filter by name
      if (name) {
        pipeline.splice(1, 0, { $match: { agent: decodedName,$or: [
            { "transaction.recieved": { $ne: 0 } },
            { "transaction.paid": { $ne: 0 } }
          ] } });
    } 

      const client = await Transportagent.aggregate(pipeline);

   
      const transaction = client.length > 0 ? client[0].transaction : [];
      let pipeline2 = [
        {
            $unwind: "$transaction"
        },
       
    ];

    // If name is provided in the query, add a $match stage to filter by name
    if (name) {
      pipeline2.splice(1, 0, { $match: { agent: decodedName,$or: [
        { "transaction.recieved": { $ne: 0 } },
        { "transaction.paid": { $ne: 0 } }
      ] } });
  }

      const totalclients = await Transportagent.aggregate(pipeline2)
      res.json({
          draw,
          recordsTotal: totalclients.length,
          recordsFiltered: totalclients.length,
          data: transaction,
      });
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Server error' });
      }
  
};
exports.idaaccount = async (req, res) => {
        try {
            const name = req.query.name;
            const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
            const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
            const length = parseInt(req.query.length) || 10; // Get the number of records per page
            // Fetch data from the database with pagination
            let pipeline = [
              {
                  $unwind: "$transaction"
              },
              { $sort: { 'transaction._id': -1 } },
    
              {
                  $skip: start
              },
              {
                  $limit: length
              },
              {
                $group: {
                  _id: null,
                  transaction: { $push: '$transaction' } // Push matching salescommitmentsschema to array
              }}
          ];
    
          // If name is provided in the query, add a $match stage to filter by name
          if (name) {
            pipeline.splice(1, 0, { $match: { agent: name } });
        } 
    
          const client = await Transportagent.aggregate(pipeline);
    
       
          const transaction = client.length > 0 ? client[0].transaction : [];
          let pipeline2 = [
            {
                $unwind: "$transaction"
            },
           
        ];
    
        // If name is provided in the query, add a $match stage to filter by name
        if (name) {
          pipeline2.splice(1, 0, { $match: { agent: name } });
      }
    
          const totalclients = await Transportagent.aggregate(pipeline2)
          res.json({
              draw,
              recordsTotal: totalclients.length,
              recordsFiltered: totalclients.length,
              data: transaction,
          });
          } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Server error' });
          }
      
    };