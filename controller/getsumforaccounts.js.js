
require('../model/clientsmodal')
const mongoose = require('mongoose');
const ClientModel = mongoose.model('Client');
const PoductsSchema = mongoose.model('PoductsSchema')
const Transportagent = mongoose.model('Transportagent')

exports.getpurchasesum = async (req, res) => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    try {
        const result1 = await ClientModel.aggregate([
            { $unwind: '$transaction' },
            {
                $group: {
                    _id: null,
                    totalPayable: { $sum: '$transaction.payable' },
                    totalPaid: { $sum: '$transaction.paid' }
                }
            }
        ]);

        const result2 = await ClientModel.aggregate([
            { $unwind: '$coffee' },
            {
                $match: {
                    'coffee.item': { $ne: 'HUSK' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalNetepweight: { $sum: '$coffee.netepweight' }
                }
            }
        ]);

        const result3 = await ClientModel.aggregate([
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
                    totalAmount: { $sum: '$purchasebillSchema.total' }
                }
            }
        ]);

        res.json({
            data: {
                totalNetepweight: result2[0]?.totalNetepweight || 0,
                totalQty: result3[0]?.totalQty || 0,
                totalAmount: result3[0]?.totalAmount || 0,
                totalPayable: result1[0]?.totalPayable || 0,
                totalPaid: result1[0]?.totalPaid || 0
            }
        });
    } catch (error) {
        console.error('Error in aggregation:', error);
        res.status(500).json({ error: 'Error in aggregation' });
    }
};

exports.getsalessum = async (req, res) => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    try {
        const result1 = await ClientModel.aggregate([
            { $unwind: '$transaction' },
            {
                $group: {
                    _id: null,
                    totalRevievable: { $sum: '$transaction.revievable' },
                    totalRecieved: { $sum: '$transaction.recieved' }
                }
            }
        ]);

        const result2 = await ClientModel.aggregate([
            { $unwind: '$despatch' },
            {
                $match: {
                    'despatch.item': { $ne: 'HUSK' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalNetepweight: { $sum: '$despatch.netepweight' }
                }
            }
        ]);

        const result3 = await ClientModel.aggregate([
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
                    totalAmount: { $sum: '$salesbillSchema.total' }
                }
            }
        ]);
        res.json({
            data: {
                totalNetepweight: result2[0]?.totalNetepweight || 0,
                totalQty: result3[0]?.totalQty || 0,
                totalAmount: result3[0]?.totalAmount || 0,
                totalRevievable: result1[0]?.totalRevievable || 0,
                totalRecieved: result1[0]?.totalRecieved || 0
            }
        });
    } catch (error) {
        console.error('Error in aggregation:', error);
        res.status(500).json({ error: 'Error in aggregation' });
    }
};


exports.getcommitmentsum = async (req, res) => {
    try {
        // Define aggregation pipeline for purchase commitments
        const purchasePipeline = [
            { $unwind: '$purchasecommitments' },
            {
                $group: {
                    _id: null,
                    totalBalanceWeight: { $sum: '$purchasecommitments.balance' },
                    totalprice: {
                        $sum: {
                            $multiply: [
                                { $toDouble: '$purchasecommitments.balance' },
                                { $toDouble: '$purchasecommitments.rate' }
                            ]
                        }
                    }
                }
            }
        ];

        // Define aggregation pipeline for sales commitments
        const salesPipeline = [
            { $unwind: '$salescommitmentsschema' },
            {
                $group: {
                    _id: null,
                    totalBalanceWeight: { $sum: '$salescommitmentsschema.balance' },
                    totalprice: {
                        $sum: {
                            $multiply: [
                                { $toDouble: '$salescommitmentsschema.balance' },
                                { $toDouble: '$salescommitmentsschema.rate' }
                            ]
                        }
                    }
                }
            }
        ];

        // Execute the aggregation pipelines
        const [purchaseResult, salesResult] = await Promise.all([
            ClientModel.aggregate(purchasePipeline),
            ClientModel.aggregate(salesPipeline)
        ]);

        // Retrieve data from results and provide default values if necessary
        const purchasecombalance = purchaseResult[0]?.totalBalanceWeight || 0;
        const purchasecomtot = purchaseResult[0]?.totalprice || 0;
        const salescombalance = salesResult[0]?.totalBalanceWeight || 0;
        const salescomtot = salesResult[0]?.totalprice || 0;

        // Return the results in JSON format
        res.json({
            data: {
                purchasecombalance,
                purchasecomtot,
                salescombalance,
                salescomtot,
            }
        });
    } catch (error) {
        console.error('Error in aggregation:', error);
        res.status(500).json({ error: 'Error in aggregation' });
    }
};

// exports.commitmenttotal = async (req, res) => {
  
//   try {
//       const draw = parseInt(req.query.draw) || 1;
//       const start = parseInt(req.query.start) || 0;
//       const length = parseInt(req.query.length) || 10;
//       const products = await PoductsSchema.find()
//       console.log(products)
//       var  alldata = [];
//       products.forEach(async product => {
        

//                 const data = await ClientModel.aggregate([
//                                 {
//                                     $unwind: "$purchasecommitments" // Unwind the purchasecommitments array
//                                 },
//                                 {
//                                     $match: {
//                                         "purchasecommitments.item": product.product // Filter for purchase commitments with item matching "rc"
//                                     }
//                                 },
//                                 {
//                                     $group: {
//                                         _id: null,
//                                         name: { $first: "$purchasecommitments.item" },                                        totalBalanceWeight: { $sum: "$purchasecommitments.balanceweight" },
//                                         totalprice: { 
//                                             $sum: {
//                                                 $multiply: ["$purchasecommitments.balance", "$purchasecommitments.rate"] 
//                                             } 
//                                         },
//                                         totalBalance: { $sum: "$purchasecommitments.balance" }
//                                     }
//                                 },
//                                 {
//                                     $project: {
//                                         _id: 0, // Exclude _id field from the output
//                                         totalBalanceWeight: 1,
//                                         totalBalance: 1,
//                                         totalprice : 1,
//                                         name:1
//                                     }
//                                 }
                       
//                 ])
//                 const sdata = await ClientModel.aggregate([
//                     {
//                         $unwind: "$salescommitmentsschema" // Unwind the purchasecommitments array
//                     },
//                     {
//                         $match: {
//                             "salescommitmentsschema.item": product.product // Filter for purchase commitments with item matching "rc"
//                         }
//                     },
//                     {
//                         $group: {
//                             _id: null,
//                             sname: { $first: "$salescommitmentsschema.item" },                                        
//                             totalsBalanceWeight: { $sum: "$salescommitmentsschema.balanceweight" },
//                             totalsprice: { 
//                                 $sum: {
//                                     $multiply: ["$salescommitmentsschema.balance", "$salescommitmentsschema.rate"] 
//                                 } 
//                             },
//                             totalsBalance: { $sum: "$salescommitmentsschema.balance" }
//                         }
//                     },
//                     {
//                         $project: {
//                             _id: 0, // Exclude _id field from the output
//                             totalsBalanceWeight: 1,
//                             totalsBalance: 1,
//                             totalsprice : 1,
//                             sname:1
//                         }
//                     }])
//                     let sdataDefaults = {
//                         totalsBalanceWeight: 0,
//                         totalsBalance: 0,
//                         totalsprice: 0
//                     };
//                     let pdataDefaults = {
//                         totalBalanceWeight: 0,
//                         totalBalance: 0,
//                         totalprice: 0
//                     };
//                     if (sdata.length > 0) {
//                         // If sdata is not empty, extract the object part
//                         sdataDefaults = sdata[0];
//                     }
//                     if (data.length > 0) {
//                         // If sdata is not empty, extract the object part
//                         pdataDefaults = data[0];
//                     }
//                     const combinedData = {
//                         product:product.product,
//                         ...sdataDefaults, // Spread operator to merge properties of sdataDefaults
//                         ...pdataDefaults   // Spread operator to merge properties of data[0]
//                     };
//                     alldata.push(combinedData)
                



//     })
//     //   let pipeline = [
//     //       {
//     //           $unwind: "$despatch"
//     //       },
//     //       {
//     //         $match: { "despatch.storage": { $gt: 0 } } // Match documents where coffee.storage is greater than 0
//     //     },
//     //       { $sort: { 'despatch._id': -1 } },
  
//     //       {
//     //           $skip: start
//     //       },
//     //       {
//     //           $limit: length
//     //       },
//     //       {
//     //         $group: {
//     //           _id: null,
//     //           despatch: { $push: '$despatch' } // Push matching salescommitmentsschema to array
//     //       }}
//     //   ];
  
//       // If name is provided in the query, add a $match stage to filter by name
//       // if (name) {
//       //     pipeline.unshift({
//       //         $match: { name: name }
//       //     });
//       // }
//     //   res.status(500).json({ error: 'Server error' });

//     //   const client = await ClientModel.aggregate(pipeline);
//   console.log(alldata)
  
//     //   const totalclients = await ClientModel.aggregate([{ $unwind: "$despatch" }]);
  
//       res.json({
//           draw,
//           recordsTotal: alldata.length,
//           recordsFiltered: alldata.length,
//           data: alldata.length>0?alldata:[],
//       });
     
//   } catch (error) {
//       console.log('Error fetching data:', error);
//       res.status(500).json({ error: 'Server error' });
//   }
//   };
// exports.commitmenttotal = async (req, res) => {
//     try {
//         const draw = parseInt(req.query.draw) || 1;
//         const start = parseInt(req.query.start) || 0;
//         const length = parseInt(req.query.length) || 10;
//         const products = await PoductsSchema.find();
//         console.log(products)

//         const alldata = await ClientModel.aggregate([
//             {
//                 $facet: {
//                     purchaseData: [
//                         {
//                             $unwind: "$purchasecommitments"
//                         },
//                         {
//                             $match: {
//                                 "purchasecommitments.item": { $in: products.map(p => p.product) }
//                             }
//                         },
//                         {
//                             $group: {
//                                 _id: null,
//                                 name: { $first: "$purchasecommitments.item" },  
//                                 totalBalanceWeight: { $sum: "$purchasecommitments.balanceweight" },
//                                 totalprice: { $sum: { $multiply: ["$purchasecommitments.balance", "$purchasecommitments.rate"] } },
//                                 totalBalance: { $sum: "$purchasecommitments.balance" }
//                             }
//                         }
//                     ],
//                     salesData: [
//                         {
//                             $unwind: "$salescommitmentsschema"
//                         },
//                         {
//                             $match: {
//                                 "salescommitmentsschema.item": { $in: products.map(p => p.product) }
//                             }
//                         },
//                         {
//                             $group: {
//                                 _id: null,
//                                 sname: { $first: "$salescommitmentsschema.item" },  
//                                 totalBalanceWeight: { $sum: "$salescommitmentsschema.balanceweight" },
//                                 totalprice: { $sum: { $multiply: ["$salescommitmentsschema.balance", "$salescommitmentsschema.rate"] } },
//                                 totalBalance: { $sum: "$salescommitmentsschema.balance" }
//                             }
//                         }
//                     ]
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     purchaseData: { $arrayElemAt: ["$purchaseData", 0] },
//                     salesData: { $arrayElemAt: ["$salesData", 0] }
//                 }
//             },
//             {
//                 $project: {
//                     product: { $ifNull: ["$purchaseData.name", "$salesData.sname"] },
//                     sproduct: { $ifNull: ["$salesData.sname", "$purchaseData.name"] },
//                     totalBalanceWeight: { $ifNull: ["$purchaseData.totalBalanceWeight", 0] },
//                     totalBalance: { $ifNull: ["$purchaseData.totalBalance", 0] },
//                     totalprice: { $ifNull: ["$purchaseData.totalprice", 0] },
//                     stotalBalanceWeight: { $ifNull: ["$salesData.totalBalanceWeight", 0] },
//                     stotalBalance: { $ifNull: ["$salesData.totalBalance", 0] },
//                     stotalprice: { $ifNull: ["$salesData.totalprice", 0] },
//                     ratio:{ $round: [{ $divide: ["$purchaseData.totalprice", "$purchaseData.totalBalance"] }, 2] } ,// If false, calculate the ratio and round to 2 decimal places


//                     // { $divide: ["$purchaseData.totalprice", "$purchaseData.totalBalance"] },
//                     sratio: { $round: [{ $divide: ["$salesData.totalprice", "$salesData.totalBalance"] }, 2] } 
//                 }
//             }
//         ]);
//         console.log(alldata)

//         res.json({
//             draw,
//             recordsTotal: alldata.length,
//             recordsFiltered: alldata.length,
//             data: alldata
//         });
//     } catch (error) {
//         console.log('Error fetching data:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };
exports.commitmenttotal = async (req, res) => {
    try {
        const draw = parseInt(req.query.draw, 10) || 50;
        const start = parseInt(req.query.start, 10) || 0;
        const length = parseInt(req.query.length, 10) || 10;

        // Fetching product names from ProductsSchema
        const products = await PoductsSchema.find({}, 'product');
        const productNames = products.map(product => product.product);

        // Initialize an array to collect all data
        const alldata = [];

        // Iterate through each product name
        for (const productName of productNames) {
            // Aggregate data separately for each product name
            const data = await ClientModel.aggregate([
                {
                    $facet: {
                        purchaseData: [
                            { $unwind: "$purchasecommitments" },
                            { $match: { "purchasecommitments.item": productName } },
                            {
                                $group: {
                                    _id: null,
                                    totalBalanceWeight: { $sum: "$purchasecommitments.balanceweight" },
                                    totalPrice: { $sum: { $multiply: [{ $toDouble: "$purchasecommitments.balance" }, { $toDouble: "$purchasecommitments.rate" }] } },
                                    totalBalance: { $sum: { $toDouble: "$purchasecommitments.balance" } }
                                }
                            }
                        ],
                        salesData: [
                            { $unwind: "$salescommitmentsschema" },
                            { $match: { "salescommitmentsschema.item": productName } },
                            {
                                $group: {
                                    _id: null,
                                    totalBalanceWeight: { $sum: "$salescommitmentsschema.balanceweight" },
                                    totalPrice: { $sum: { $multiply: [{ $toDouble: "$salescommitmentsschema.balance" }, { $toDouble: "$salescommitmentsschema.rate" }] } },
                                    totalBalance: { $sum: { $toDouble: "$salescommitmentsschema.balance" } }
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 0,
                        product: productName,
                        purchaseData: { $arrayElemAt: ["$purchaseData", 0] },
                        salesData: { $arrayElemAt: ["$salesData", 0] }
                    }
                },
                {
                    $project: {
                        product: productName,
                        sproduct: productName,
                        totalBalanceWeight: { $ifNull: ["$purchaseData.totalBalanceWeight", 0] },
                        totalBalance: { $ifNull: ["$purchaseData.totalBalance", 0] },
                        totalprice: { $ifNull: ["$purchaseData.totalPrice", 0] },
                        stotalBalanceWeight: { $ifNull: ["$salesData.totalBalanceWeight", 0] },
                        stotalBalance: { $ifNull: ["$salesData.totalBalance", 0] },
                        stotalprice: { $ifNull: ["$salesData.totalPrice", 0] },
                        ratio: {
                            $round: [
                                {
                                    $cond: {
                                        if: { $eq: ["$purchaseTotalBalance", 0] },
                                        then: 0,
                                        else: { $divide: ["$purchaseTotalPrice", "$purchaseTotalBalance"] }
                                    }
                                },
                                2
                            ]
                        },
                        sratio: {
                            $round: [
                                {
                                    $cond: {
                                        if: { $eq: ["$salesTotalBalance", 0] },
                                        then: 0,
                                        else: { $divide: ["$salesTotalPrice", "$salesTotalBalance"] }
                                    }
                                },
                                2
                            ]
                        }
                    }
                }
            ]);

            // Push the data of the current product to the data array
            alldata.push(...data);
        }

        // Send the aggregated data as a JSON response
        res.json({
            draw,
            recordsTotal: alldata.length,
            recordsFiltered: alldata.length,
            data: alldata
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// exports.expenseincometotal = async (req, res) => {
//     try {
//       const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
//       const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
//       const length = parseInt(req.query.length) || 10; 
//       const searchValue = req.query.search.value || ''; // Get the search value
  
//       // Construct regex to search for any occurrence of the search value in agent field
//       const regex = new RegExp(searchValue, 'i');
  
//       // Fetch documents with pagination and filtering
//       const docs = await Transportagent.find({
//         accounttype: req.query.name,
//         $or: [
//           { agent: regex }
//         ]
//       }).sort({ _id: -1 }).skip(start).limit(length); 
  
//       // Fetch total count of documents matching the filter criteria
//       const totalCount = await Transportagent.countDocuments({
//         accounttype: req.query.name,
//         $or: [
//           { agent: regex }
//         ]
//       });
  
//       res.json({
//         draw,
//         recordsTotal: totalCount, // Total count without filtering
//         recordsFiltered: totalCount, // Count after filtering with pagination
//         docs // Documents to be displayed
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('An error occurred while fetching clients');
//     }
//   };
  
exports.expenseincometotal = async (req, res) => {
    try {
      const draw = parseInt(req.query.draw) || 1; // DataTables draw count
      const start = parseInt(req.query.start) || 0; // Start index for pagination
      const length = parseInt(req.query.length) || 10; // Number of records to fetch
      const searchValue = req.query.search?.value || ''; // Search value
      const regex = new RegExp(searchValue, 'i'); // Regex for search
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
      const pipeline = [
        // Match based on `accounttype` and optional search filter
        {
          $match: {
            accounttype: req.query.name,
            agent: regex
          }
        },
        // Unwind the `transaction` array to process each transaction separately
        {
          $unwind: {
            path: "$transaction",
            preserveNullAndEmptyArrays: true // Allow agents with no transactions
          }
        },
        // Filter transactions for the current month
        {
          $match: {
            $or: [
              { "transaction.date": { $gte: firstDayOfMonth, $lte: lastDayOfMonth } },
              { transaction: null } // Handle agents with no transactions
            ]
          }
        },
        // Group transactions by agent and calculate totals for the current month
        {
          $group: {
            _id: "$_id",
            agent: { $first: "$agent" },
            address: { $first: "$address" },
            phone: { $first: "$phone" },
            accounttype: { $first: "$accounttype" },
            totalPayable: { $sum: "$transaction.payable" },
            totalReceivable: { $sum: "$transaction.revievable" },
            totalPaid: { $sum: "$transaction.paid" },
            totalReceived: { $sum: "$transaction.recieved" }
          }
        },
        // Add computed fields: totalPayable + totalReceived and totalPaid + totalReceivable
        {
          $addFields: {
            totalIncome: { $add: ["$totalPayable", "$totalReceived"] },
            totalExpense: { $add: ["$totalPaid", "$totalReceivable"] }
          }
        },
        // Sort agents by `_id` in descending order
        {
          $sort: { _id: -1 }
        },
        // Paginate results
        {
          $facet: {
            paginatedResults: [
              { $skip: start },
              { $limit: length }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        }
      ];
  
      // Execute the aggregation pipeline
      const result = await Transportagent.aggregate(pipeline);
  console.log(result[0].paginatedResults)
      const docs = result[0].paginatedResults || [];
      const totalCount = result[0].totalCount[0]?.count || 0;
  
      // Send response
      res.json({
        draw,
        recordsTotal: totalCount,
        recordsFiltered: totalCount,
        docs // Documents with transaction summaries
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching agents');
    }
  };
  
 exports.agentsum = async (req, res) => {
    const decodedName = req.params.name .replace(/&amp;/g, '&');

    try {

        const result = await Transportagent.aggregate([
            {$match :  { agent: decodedName}},
            { $unwind: '$transaction' },
            {
                $group: {
                    _id: null,
                    totalPayable: { $sum: '$transaction.payable' },
                    totalPaid: { $sum: '$transaction.paid' },
                    totalrecieved: { $sum: '$transaction.recieved' }

                }
            }
        ]);
        res.json({
            data: {
                totalrecieved: result[0]?.totalrecieved || 0,
                totalPayable: result[0]?.totalPayable || 0,
                totalPaid: result[0]?.totalPaid || 0
            }
        });
   
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching clients');
    }
  };
  