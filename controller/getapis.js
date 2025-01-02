
require('../model/clientsmodal')
const mongoose = require('mongoose');
const ClientModel = mongoose.model('Client')
const CoffeeSchema = mongoose.model('CoffeeSchema');
const Reference = mongoose.model('Reference');
const PoductsSchema = mongoose.model('PoductsSchema')
const Transportagent = mongoose.model('Transportagent')
const User = mongoose.model('User')

const Financialyear = mongoose.model('Financialyear')
const Attendance = mongoose.model('Attendance')
const Loadinwork = mongoose.model('Loadinwork')
const Partydelete = mongoose.model('Partydelete')
const Insidetrash = mongoose.model('Insidetrash');

exports.getclients = async (req, res) => {
  try {
      // Extract pagination parameters from the request
      const draw = parseInt(req.query.draw) || 1; // DataTables draw count
      const start = parseInt(req.query.start) || 0; // Starting index
      const length = parseInt(req.query.length) || 10; // Number of records to fetch
      const searchValue = req.query.search.value || ''; // Search value from DataTables

      // Create a regex for case-insensitive search
      const regex = new RegExp(searchValue, 'i');

      // Define query to filter clients based on the search value
      const query = {
          $or: [
              { name: regex },
          ]
      };

      // Define aggregation pipeline to compute the custom sort key
      const aggregationPipeline = [
          { $match: query },
          {
              // Add a calculated field that represents the custom sort key
              $addFields: {
                  customSortKey: {
                      $subtract: [
                          { $add: ['$recievable', '$paid'] },
                          { $add: ['$payable', '$recieved'] }
                      ]
                  }
              }
          },
          {
              // Sort the results based on the calculated custom sort key in descending order
              $sort: {
                  customSortKey: -1
              }
          },
          {
              // Skip the first 'start' documents
              $skip: start
          },
          {
              // Limit the number of documents to 'length'
              $limit: length
          }
      ];

      // Execute the aggregation pipeline to fetch sorted clients
      const clients = await ClientModel.aggregate(aggregationPipeline);

      // Count total records that match the search criteria
      const totalClients = await ClientModel.countDocuments(query);

      // Return the data in the format required by DataTables
      res.json({
          draw,
          recordsTotal: totalClients,
          recordsFiltered: totalClients,
          data: clients
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching clients');
  }
};

  exports.getnames = async (req, res) => {
    console.log('here')
    try {
      const searchTerm = req.query.term;
  if(!searchTerm){

    const clients = await ClientModel.aggregate([{ $sample: { size: 20 } }]);

    const names = clients.map(client => client.name);  
      res.json({ results: names })
  }else{

    const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

      const clients = await ClientModel.find({ name: { $regex: escapedSearchTerm, $options: 'i' } }, 'name');
  
      const names = clients.map(client => client.name);
      console.log(clients,'hhhh')
  
      res.json({ results: names });
      
  }
      
        
  
    
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
//     try {

//       const docs = await ClientModel.find()
// // 'i' flag for case-insensitive search
//       res.json(docs);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('An error occurred while fetching clients');
//     }
  };
  exports.getproducts = async (req, res) => {

    try {
      const searchTerm = req.query.term;
  if(!searchTerm){

    const products = await PoductsSchema.aggregate([{ $sample: { size: 20 } }]);

    const names = products.map(p => p.product);  
      res.json({ results: names })
  }else{

    const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

      const product = await PoductsSchema.find({ product: { $regex: escapedSearchTerm, $options: 'i' } }, 'product');
  
      const names = product.map(p => p.product);
  
      res.json({ results: names });
      
  }
      
        
  
    
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }

  };

  exports.getdetailedproductproducts = async (req, res) => {
    try {


    const products = await PoductsSchema.find();

    res.json(products);

        
  
    
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

  };

  exports.getuserslist = async (req, res) => {
    try {


    const products = await User.find();
console.log()
    res.json(products);

        
  
    
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }

  };
// exports.purchasecommitment = async (req, res) => {
//   try {
//       const draw = parseInt(req.query.draw) || 1;
//       const name = req.query.name; // Get the name parameter
//       const item = req.query.item; // Get the item parameter
//       const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
//       const length = parseInt(req.query.length) || 10; // Get the number of records per page

//       // Construct the aggregation pipeline
//       const countPipeline = [
//           {
//               $match: { name: name } // Match documents by name
//           },
//           {
//               $unwind: '$purchasecommitments' // Unwind the purchasecommitments array
//           }
//       ];

//       // If item parameter is provided, add match stage for item
//       if (item) {
//         countPipeline.push({
//               $match: { 'purchasecommitments.item': item } // Match documents by item
//           });
//       }
//       countPipeline.push(
//         {
//             $group: {
//                 _id: '$_id',
//                 totalCount: { $sum: 1 } // Count the total number of documents
//             }
//         }
//     );

//     const totalCountResult = await ClientModel.aggregate(countPipeline);
//     const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
//     countPipeline.pop()
//     const pipeline = [...countPipeline]; 
//     pipeline.push({ $sort: { 'purchasecommitments._id': -1 } });
//     // pipeline.push({ $sort: { 'purchasecommitments.date': -1 } }); 
//       // Add pagination stages
//       pipeline.push(
//           { $skip: start }, // Skip records for pagination
//           { $limit: length } // Limit records for pagination
//       );
      
//       pipeline.push({
//           $group: {
//               _id: '$_id',
//               name: { $first: '$name' },
//               purchasecommitments: { $push: '$purchasecommitments' } // Push matching purchasecommitments to array
//           }
//       });

//       const client = await ClientModel.aggregate(pipeline);
//       const purchasecommitments = client.length>0?client[0].purchasecommitments:[];
//       console.log(purchasecommitments)

//       if (!client || client.length === 0) {
//           // Handle case where client with the specified name is not found
//           return res.status(404).json({ error: 'Client with specified name not found' });
//       }

//       res.json({
//       draw,
//       recordsTotal: totalCount,
//       recordsFiltered: totalCount,
//       data: purchasecommitments,
//       });
//   } catch (error) {
//       console.error('Error fetching data:', error);
//       res.status(500).json({ error: 'Server error' });
//   }
// };
exports.purchasecommitment = async (req, res) => {
  try {
      const draw = parseInt(req.query.draw) || 1;
      const name = req.query.name; // Get the name parameter
      const item = req.query.item; // Get the item parameter
      const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
      const length = parseInt(req.query.length) || 10; // Get the number of records per page
      const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

      // Determine sorting criteria based on filter value
      let sortField = 'purchasecommitments._id'; // Default sorting by _id
      if (filter === 'date') {
          sortField = 'purchasecommitments.date'; // Sort by date if filter is 'date'
      }
      // Construct the aggregation pipeline
      const pipeline = [
          {
              $match: { name: name } // Match documents by name
          },
          {
              $unwind: '$purchasecommitments' // Unwind the salescommitmentsschema array
          }
      ];

      // If item parameter is provided, add match stage for item
      if (item) {
          pipeline.push({
              $match: { 'purchasecommitments.item': item } // Match documents by item
          });
      }

      // Count the total number of documents
      const countPipeline = [...pipeline, { $count: 'totalCount' }];
      const countResult = await ClientModel.aggregate(countPipeline);
      const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;
      pipeline.push({ $sort: { [sortField]: -1 } });

      // Add pagination stages
      pipeline.push(
          { $skip: start }, // Skip records for pagination
          { $limit: length } // Limit records for pagination
      );

      // Group the data
      pipeline.push({
          $group: {
              _id: '$_id',
              name: { $first: '$name' },
              purchasecommitments: { $push: '$purchasecommitments' } // Push matching salescommitmentsschema to array
          }
      });

      // Execute the aggregation pipeline
      const client = await ClientModel.aggregate(pipeline);
      const purchasecommitments = client.length > 0 ? client[0].purchasecommitments : [];
      console.log(totalCount)
      res.json({
          draw,
          recordsTotal: totalCount,
          recordsFiltered: totalCount,
          data: purchasecommitments,
      });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Server error' });
  }
};
exports.salescommitments = async (req, res) => {
  try {
      const draw = parseInt(req.query.draw) || 1;
      const name = req.query.name; // Get the name parameter
      const item = req.query.item; // Get the item parameter
      const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
      const length = parseInt(req.query.length) || 10; // Get the number of records per page
      const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

      // Determine sorting criteria based on filter value
      let sortField = 'salescommitmentsschema._id'; // Default sorting by _id
      if (filter === 'date') {
          sortField = 'salescommitmentsschema.date'; // Sort by date if filter is 'date'
      }
      // Construct the aggregation pipeline
      const pipeline = [
          {
              $match: { name: name } // Match documents by name
          },
          {
              $unwind: '$salescommitmentsschema' // Unwind the salescommitmentsschema array
          }
      ];

      // If item parameter is provided, add match stage for item
      if (item) {
          pipeline.push({
              $match: { 'salescommitmentsschema.item': item } // Match documents by item
          });
      }

      // Count the total number of documents
      const countPipeline = [...pipeline, { $count: 'totalCount' }];
      const countResult = await ClientModel.aggregate(countPipeline);
      const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;
      pipeline.push({ $sort: { [sortField]: -1 } });
      // Add pagination stages
      pipeline.push(
          { $skip: start }, // Skip records for pagination
          { $limit: length } // Limit records for pagination
      );

      // Group the data
      pipeline.push({
          $group: {
              _id: '$_id',
              name: { $first: '$name' },
              salescommitmentsschema: { $push: '$salescommitmentsschema' } // Push matching salescommitmentsschema to array
          }
      });

      // Execute the aggregation pipeline
      const client = await ClientModel.aggregate(pipeline);
      const salescommitmentsschema = client.length > 0 ? client[0].salescommitmentsschema : [];

      res.json({
          draw,
          recordsTotal: totalCount,
          recordsFiltered: totalCount,
          data: salescommitmentsschema,
      });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Server error' });
  }
};

 
    //////arrivals   ////////////
    exports.arrivals = async (req, res) => {
      try {
          const name = req.query.name;
          const draw = parseInt(req.query.draw) || 1;
          const start = parseInt(req.query.start) || 0;
          const length = parseInt(req.query.length) || 10;
          const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

          // Determine sorting criteria based on filter value
          // let sortField = 'coffee._id'; // Default sorting by _id
          // if (filter === 'date') {
          //     sortField = 'coffee.date'; // Sort by date if filter is 'date'
          // }

          let sortField = { 'coffee._id': -1 }; // Default sorting by _id

if (filter === 'date') {
    // Sort by date first, and if dates are the same, sort by _id
    sortField = { 'coffee.date': -1, 'coffee._id': -1 };
}
          let pipeline = [
              {
                  $unwind: "$coffee"
              },
             { $sort: sortField },
              {
                  $skip: start
              },
              {
                  $limit: length
              },
              {
                $group: {
                  _id: null,
                  coffee: { $push: '$coffee' } // Push matching salescommitmentsschema to array
              }}
          ];
  
          // If name is provided in the query, add a $match stage to filter by name
          
          let pipeline2 = [{ $unwind: "$coffee" }]
          // If name is provided in the query, add a $match stage to filter by name
          if (name) {
            pipeline.unshift({
              $match: { name: name }
          });
              pipeline2.unshift({
                $match: { name: name }
            });
          }
          const client = await ClientModel.aggregate(pipeline);
  
          // if (!client || client.length === 0) {
          //     res.status(404).json({ error: 'No client or coffee data found' });
          //     return;
          // }
  
          const totalclients = await ClientModel.aggregate(pipeline2);
  
          res.json({
              draw,
              recordsTotal: totalclients.length,
              recordsFiltered: totalclients.length,
              data: client.length>0?client[0].coffee:[],
          });
      } catch (error) {
          console.log('Error fetching data:', error);
          res.status(500).json({ error: 'Server error' });
      }
  };
  exports.despatch = async (req, res) => {
    try {
      const name = req.query.name;
      const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

      // Determine sorting criteria based on filter value
      let sortField = 'despatch._id'; // Default sorting by _id
      if (filter === 'date') {
          sortField = 'despatch.date'; // Sort by date if filter is 'date'
      }
        const draw = parseInt(req.query.draw) || 1;
        const start = parseInt(req.query.start) || 0;
        const length = parseInt(req.query.length) || 10;

        let pipeline = [
            {
                $unwind: "$despatch"
            },
            { $sort: { [sortField]: -1 } },

            {
                $skip: start
            },
            {
                $limit: length
            },
            {
              $group: {
                _id: null,
                despatch: { $push: '$despatch' } // Push matching salescommitmentsschema to array
            }}
        ];
        let pipeline2 = [{ $unwind: "$despatch" }]
        // If name is provided in the query, add a $match stage to filter by name
        if (name) {
            pipeline.unshift({
                $match: { name: name }
            });
            pipeline2.unshift({
              $match: { name: name }
          });
        }

        const client = await ClientModel.aggregate(pipeline);


        const totalclients = await ClientModel.aggregate(pipeline2);

        res.json({
            draw,
            recordsTotal: totalclients.length,
            recordsFiltered: totalclients.length,
            data: client.length>0?client[0].despatch:[],
        });
       
    } catch (error) {
        console.log('Error fetching data:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
   
      ///////////////////////////////////////////////////////////////// biills
      exports.salesbills  = (async (req, res) => {
        // Assuming you have already imported required modules and set up your Express app
        
        // API endpoint for paginated data
          try {
            const name = req.query.name;
            const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
            const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
            const length = parseInt(req.query.length) || 10;
            const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

            // Determine sorting criteria based on filter value
            let sortField = 'salesbillSchema._id'; // Default sorting by _id
            if (filter === 'date') {
                sortField = 'salesbillSchema.date'; // Sort by date if filter is 'date'
            } // Get the number of records per page
            // Fetch data from the database with pagination
            const client = await ClientModel.aggregate([
              {
                $match: { name: name } // Match documents by name
            },
              {
                  $unwind: "$salesbillSchema"
              },
              { $sort: { [sortField]: -1 } },

              {
                  $skip: start
              },
              {
                  $limit: start+length
              },
              {
              $group: {
                _id: '$_id',
                name: { $first: '$name' },
                salesbillSchema: { $push: '$salesbillSchema' } // Push matching salescommitmentsschema to array
            }}
              // {
              //     $project: {
              //         draw: { $literal: draw }, // Include the draw value in the result
              //         coffee: "$coffee"
              //     }
              // }
            
            ])
            const salesbills = client.length > 0 ? client[0].salesbillSchema : [];

          //   if (!client || client.length === 0) {
          //     // Handle case where no client or coffee data is found
          //     res.status(404).json({ error: 'No client or coffee data found' });
          //     return;
          // }
          const totalclients = await ClientModel.aggregate([
            {
              $match: { name: name } // Match documents by name
          },
            {
                $unwind: "$salesbillSchema"
            }])
          res.json({
              draw,
              recordsTotal: totalclients.length,
              recordsFiltered: totalclients.length,
              data: salesbills,
          });
          } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Server error' });
          }
        
        
        });
      
      
        exports.purchasebills  = (async (req, res) => {

          // Assuming you have already imported required modules and set up your Express app
          
          // API endpoint for paginated data
            try {
              const name = req.query.name;
              const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
              const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
              const length = parseInt(req.query.length) || 10; // Get the number of records per page
              // Fetch data from the database with pagination
              const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

              // Determine sorting criteria based on filter value
              let sortField = 'purchasebillSchema._id'; // Default sorting by _id
              if (filter === 'date') {
                  sortField = 'purchasebillSchema.date'; // Sort by date if filter is 'date'
              }
              const client = await ClientModel.aggregate([
                {
                  $match: { name: name } // Match documents by name
              },
                {
                    $unwind: "$purchasebillSchema"
                },
                { $sort: { [sortField]: -1 } },

                {
                    $skip: start
                },
                {
                    $limit: start+length
                },
                {
                $group: {
                  _id: '$_id',
                  name: { $first: '$name' },
                  purchasebillSchema: { $push: '$purchasebillSchema' } // Push matching salescommitmentsschema to array
              }}
                // {
                //     $project: {
                //         draw: { $literal: draw }, // Include the draw value in the result
                //         coffee: "$coffee"
                //     }
                // }
              
              ])
              const purchasebills = client.length > 0 ? client[0].purchasebillSchema : [];
            const totalclients = await ClientModel.aggregate([
              {
                $match: { name: name } // Match documents by name
            },
              {
                  $unwind: "$purchasebillSchema"
              }])
            
            res.json({
                draw,
                recordsTotal: totalclients.length,
                recordsFiltered: totalclients.length,
                data: purchasebills,
            });
            } catch (error) {
              console.LOG('Error fetching data:', error);
              res.status(500).json({ error: 'Server error' });
            }
          
          
          });
        
      ///////// storages

      exports.storein  = (async (req, res) => {
        // Assuming you have already imported required modules and set up your Express app
        
        // API endpoint for paginated data
          try {
            const name = req.query.name;
            const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
            const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
            const length = parseInt(req.query.length) || 10; // Get the number of records per page
            // Fetch data from the database with pagination
            const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

      // Determine sorting criteria based on filter value
      let sortField = 'coffee._id'; // Default sorting by _id
      if (filter === 'date') {
          sortField = 'coffee.date'; // Sort by date if filter is 'date'
      }
            const client = await ClientModel.aggregate([
              
              {
                $match: { name: name } // Match documents by name
            },
              {
                  $unwind: "$coffee"
              },
              {
                $match: { "coffee.item": req.query.item } // Match documents where coffee.storage is greater than 0
            },
              {
                $match: { "coffee.storage": { $gt: 0 } } // Match documents where coffee.storage is greater than 0
            },
            { $sort: { [sortField]: -1 } },

              {
                  $skip: start
              },
              {
                  $limit: start+length
              },
              
                {
                $group: {
                  _id: '$_id',
                  name: { $first: '$name' },
                  coffee: { $push: '$coffee' } // Push matching salescommitmentsschema to array
              }}
              // {
              //     $project: {
              //         draw: { $literal: draw }, // Include the draw value in the result
              //         coffee: "$coffee"
              //     }
              // }
            ])
            const coffee = client.length > 0 ? client[0].coffee : [];

          //   if (!client || client.length === 0) {
          //     // Handle case where no client or coffee data is found
          //     res.status(404).json({ error: 'No client or coffee data found' });
          //     return;
          // }
          const totalclients = await ClientModel.aggregate([
            {
              $match: { name: name } // Match documents by name
          },
            {
                $unwind: "$coffee"
            }
            ,
                {
                  $match: { "despatch.item": req.query.item } // Match documents where coffee.storage is greater than 0
              },
            {
              $match: { "coffee.storage": { $gt: 0 } } // Match documents where coffee.storage is greater than 0
          },])


          res.json({
              draw,
              recordsTotal: totalclients.length,
              recordsFiltered: totalclients.length,
              data: coffee,
          });
          } catch (error) {
            console.log('Error fetching data:', error);
            res.status(500).json({ error: 'Server error' });
          }
        
        
        });
        exports.storeout  = (async (req, res) => {
          // Assuming you have already imported required modules and set up your Express app
          
          // API endpoint for paginated data
            try {
              const name = req.query.name;
              const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
              const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
              const length = parseInt(req.query.length) || 10; // Get the number of records per page
              // Fetch data from the database with pagination
              const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

              // Determine sorting criteria based on filter value
              let sortField = 'despatch._id'; // Default sorting by _id
              if (filter === 'date') {
                  sortField = 'despatch.date'; // Sort by date if filter is 'date'
              }
              const client = await ClientModel.aggregate([
                {
                  $match: { name: name } // Match documents by name
              },
                {
                    $unwind: "$despatch"
                },
                {
                  $match: { "despatch.item": req.query.item } // Match documents where coffee.storage is greater than 0
              },
                {
                  $match: { "despatch.storage": { $gt: 0 } } // Match documents where coffee.storage is greater than 0
              },
              { $sort: { [sortField]: -1 } },

              
                {
                    $skip: start
                },
                {
                    $limit: start+length
                },
                {
                  $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    despatch: { $push: '$despatch' } // Push matching salescommitmentsschema to array
                }}
                // {
                //     $project: {
                //         draw: { $literal: draw }, // Include the draw value in the result
                //         coffee: "$coffee"
                //     }
                // }
              ])
             
            //   if (!client || client.length === 0) {
            //     // Handle case where no client or coffee data is found
            //     res.status(404).json({ error: 'No client or coffee data found' });
            //     return;
            // }
            const despatch = client.length > 0 ? client[0].despatch : [];

            const totalclients = await ClientModel.aggregate([
              {
                $match: { name: name } // Match documents by name
            },
              {
                  $unwind: "$despatch"
              },
            {
              $match: { "despatch.item": req.query.item } // Match documents where coffee.storage is greater than 0
          },
            {
              $match: { "despatch.storage": { $gt: 0 } } // Match documents where coffee.storage is greater than 0
          }])
            res.json({
                draw,
                recordsTotal: totalclients.length,
                recordsFiltered: totalclients.length,
                data: despatch,
            });
            } catch (error) {
              console.error('Error fetching data:', error);
              res.status(500).json({ error: 'Server error' });
            }
          
          
          });



      /////
      exports.transactions  = (async (req, res) => {
        // Assuming you have already imported required modules and set up your Express app
        
        // API endpoint for paginated data

        
          try {
            const name = req.query.name;
            const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
            const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
            const length = parseInt(req.query.length) || 10; // Get the number of records per page
            // Fetch data from the database with pagination
            const filter = req.query.filter || '_id'; // Get the filter type (default is '_id')

            // Determine sorting criteria based on filter value
            let sortField = { 'transaction._id': -1 }; // Default sorting by _id

            if (filter === 'date') {
                // Sort by date first, and if dates are the same, sort by _id
                sortField = { 'transaction.date': -1, 'transaction._id': -1 };
            }
            let pipeline = [
              {
                  $unwind: "$transaction"
              },
              { $sort: sortField },

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
            pipeline.splice(1, 0, { $match: { name: name } });
        } else {
            // If name is not provided, add additional condition to filter by medium
            pipeline.splice(1, 0, {
                $match: {
                    "transaction.medium": {
                        $nin: ["TDS", "Sale", "Purchase"]
                    }
                }
            });
        }
  
          const client = await ClientModel.aggregate(pipeline);
  
       
          const transaction = client.length > 0 ? client[0].transaction : [];
          let pipeline2 = [
            {
                $unwind: "$transaction"
            },
           
        ];

        // If name is provided in the query, add a $match stage to filter by name
        if (name) {
          pipeline2.splice(1, 0, { $match: { name: name } });
      } else {
          // If name is not provided, add additional condition to filter by medium
          pipeline2.splice(1, 0, {
              $match: {
                  "transaction.medium": {
                      $nin: ["TDS", "Sale", "Purchase"]
                  }
              }
          });
      }

          const totalclients = await ClientModel.aggregate(pipeline2)
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
        
        
        });
      /////
    exports.individualarrivals  = (async (req, res) => {
      // Assuming you have already imported required modules and set up your Express app
      
      // API endpoint for paginated data
        try {
          const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
          const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
          const length = parseInt(req.query.length) || 10; // Get the number of records per page
          // Fetch data from the database with pagination
          const client = await ClientModel.findOne({ name: req.query.name });
    
          if (!client) {
            // Handle case where client with the specified name is not found
            res.status(404).json({ error: 'Client not found' });
            return;
          }
          const coffee = client.coffee.slice(start, start + length);
          res.json({
            draw,
          recordsTotal: client.coffee.length,
          recordsFiltered: client.coffee.length,
          data: coffee,
          });
        } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).json({ error: 'Server error' });
        }
      
      
      });
      exports.individualdespatch  = (async (req, res) => {
        // Assuming you have already imported required modules and set up your Express app
        
        // API endpoint for paginated data
          try {
            const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
            const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
            const length = parseInt(req.query.length) || 10; // Get the number of records per page
            // Fetch data from the database with pagination
            const client = await ClientModel.findOne({ name: req.query.name });
      
            if (!client) {
              // Handle case where client with the specified name is not found
              res.status(404).json({ error: 'Client not found' });
              return;
            }
            const coffee = client.despatch.slice(start, start + length);
            res.json({
              draw,
            recordsTotal: client.despatch.length,
            recordsFiltered: client.despatch.length,
            data: coffee,
            });
          } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Server error' });
          }
        
        
        });



        exports.getrefference = async (req, res) => {
          try {
            const searchTerm = req.query.term;
        if(!searchTerm){
          const refferences = await Reference.aggregate([{ $sample: { size: 20 } }]);
          const names = refferences.map(reff => reff.name);  
            res.json({ results: names })
        }else{
          const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

            const refferences = await Reference.find({ name: { $regex: escapedSearchTerm, $options: 'i' } }, 'newRouteName');
        
            const names = refferences.map(reff => reff.name);
        
            res.json({ results: names });
            
        }
            
              
        
          
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    
        };

        
        exports.getfinancialyears = async (req, res) => {
          
          try {
            const searchTerm = req.query.term;
        if(!searchTerm){
          const refferences = await Financialyear.aggregate([{ $sample: { size: 20 } }]);
          const names = refferences.map(reff => reff.year);  
            res.json({ results: names })
        }else{
          const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

            const refferences = await Financialyear.find({ name: { $regex: escapedSearchTerm, $options: 'i' } }, 'newRouteName');
        
            const names = refferences.map(reff => reff.year);
        
            res.json({ results: names });
            
        }
            
              
        
          
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    
        };
        ///////////////////////////////////////////
      
        exports.getTransportAgent = async (req, res) => {
          try {
            const searchTerm = req.query.term;
        if(!searchTerm){
          const agents = await Transportagent.aggregate([    { $match: { accounttype: 'Delivery-Agent' } },
          { $sample: { size: 20 } }]);
      
          const names = agents.map(agent => agent.agent);  
            res.json({ results: names })
        }else{
          const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

            const agents = await Transportagent.find({ accounttype: 'Delivery-Agent' , agent: { $regex: escapedSearchTerm, $options: 'i' } }, 'agent');
        
            const names = agents.map(agent => agent.agent);
        
            res.json({ results: names });
            
        }
            
              
        
          
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    
        };

        exports.getotherallnames = async (req, res) => {
          try {
            const searchTerm = req.query.term;
        if(!searchTerm){
          const agents = await Transportagent.aggregate([{ $sample: { size: 20 } }]);
      
          const names = agents.map(agent => agent.agent);  
            res.json({ results: names })
        }else{
          const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

            const agents = await Transportagent.find({ agent: { $regex: escapedSearchTerm, $options: 'i' } }, 'agent');
        
            const names = agents.map(agent => agent.agent);
        
            res.json({ results: names });
            
        }
            
              
        
          
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    
        };


        ///////////////////// purchase bills /////////////
        exports.invoicebasepurchasebills = async (req, res) => {
          const { lotnumber } = req.query;
          try {
              const bills = await ClientModel.aggregate([
                  // Unwind the purchasebillSchema array to de-normalize it
                  { $unwind: "$purchasebillSchema" },
                  // Match documents where the lotnumber matches
                  { $match: { "purchasebillSchema.lotnumber": lotnumber } },
                  // Group to get back purchasebillSchema array
                  {
                      $group: {
                          _id: null,
                          purchasebillSchema: { $push: '$purchasebillSchema' }
                      }
                  },
                  // Project to include only the purchasebillSchema field
                  {
                      $project: {
                          _id: 0, // Exclude _id field
                          purchasebillSchema: 1
                      }
                  }
              ]);
              // Send the purchasebillSchema array as response
              res.json(bills.length > 0 ? bills[0].purchasebillSchema : []);
          } catch (error) {

              console.error(error);
              res.status(500).send('An error occurred while fetching purchase bills');
          }
      };
      exports.invoicesalesbill = async (req, res) => {
         console.log('here')
        const { lotnumber } = req.query;
        try {
            const bills = await ClientModel.aggregate([
                // Unwind the purchasebillSchema array to de-normalize it
                { $unwind: "$salesbillSchema" },
                // Match documents where the lotnumber matches
                { $match: { "salesbillSchema.lotnumber": lotnumber } },
                // Group to get back purchasebillSchema array
                {
                    $group: {
                        _id: null,
                        salesbillSchema: { $push: '$salesbillSchema' }
                    }
                },
                // Project to include only the purchasebillSchema field
                {
                    $project: {
                        _id: 0, // Exclude _id field
                        salesbillSchema: 1
                    }
                }
            ]);
            // Send the purchasebillSchema array as response
            res.json(bills.length > 0 ? bills[0].salesbillSchema : []);
        } catch (error) {

            console.error(error);
            res.status(500).send('An error occurred while fetching purchase bills');
        }
    };
    

     /////////////mac local changes //////////////////////////////////////


     exports.allpurchasebill = async (req, res) => {
      try {
          const draw = parseInt(req.query.draw) || 1;
          const start = parseInt(req.query.start) || 0;
          const length = parseInt(req.query.length) || 10;
  
          // let pipeline = [
          //     {
          //         $unwind: "$purchasebillSchema"
          //     },
          //     {
          //         $skip: start
          //     },
          //     {
          //         $limit: length
          //     },
          //     {
          //       $group: {
          //         _id: null,
          //         name: { $first: "$name" },                   
          //         purchasebillSchema: { $push: '$purchasebillSchema' } // Push matching salescommitmentsschema to array
          //     }}
          // ];
          let pipeline = [
            // Unwind the purchasebillSchema array to deconstruct it
            { $unwind: "$purchasebillSchema" },
            { $sort: { "purchasebillSchema._id": -1 } },
 
            // Skip the initial documents based on pagination start
            { $skip: start },
            
            // Limit the number of documents based on pagination length
            { $limit: length },
            
            // Project the fields you want to keep
            { $project: {
                _id: 0, // Exclude the _id field
                name: 1, // Include the name field
                purchasebillSchema: 1 // Include the purchasebillSchema field
            }}
        ];
          // If name is provided in the query, add a $match stage to filter by name
          // if (name) {
          //     pipeline.unshift({
          //         $match: { name: name }
          //     });
          // }
  
          const client = await ClientModel.aggregate(pipeline);
  
          const totalclients = await ClientModel.aggregate([{ $unwind: "$purchasebillSchema" }]);
          console.log(totalclients)
  
          res.json({
              draw,
              recordsTotal: totalclients.length,
              recordsFiltered: totalclients.length,
              data: client,
          });
         
      } catch (error) {
          console.log('Error fetching data:', error);
          res.status(500).json({ error: 'Server error' });
      }
  };
  exports.allsales = async (req, res) => {
    try {
        const draw = parseInt(req.query.draw) || 1;
        const start = parseInt(req.query.start) || 0;
        const length = parseInt(req.query.length) || 10;

        // let pipeline = [
        //     {
        //         $unwind: "$salesbillSchema"
        //     },
        //     {
        //         $skip: start
        //     },
        //     {
        //         $limit: length
        //     },
        //     {
        //       $group: {
        //         _id: null,
        //         name: { $first: "$name" },                 
        //         salesbillSchema: { $push: '$salesbillSchema' } // Push matching salescommitmentsschema to array
        //     }}
        // ];
        let pipeline = [
          // Unwind the purchasebillSchema array to deconstruct it
          { $unwind: "$salesbillSchema" },
          { $sort: { "salesbillSchema._id": -1 } },

          // Skip the initial documents based on pagination start
          { $skip: start },
          
          // Limit the number of documents based on pagination length
          { $limit: length },
          
          // Project the fields you want to keep
          { $project: {
              _id: 0, // Exclude the _id field
              name: 1, // Include the name field
              salesbillSchema: 1 // Include the purchasebillSchema field
          }}
      ];
        // If name is provided in the query, add a $match stage to filter by name
        // if (name) {
        //     pipeline.unshift({
        //         $match: { name: name }
        //     });
        // }

        const client = await ClientModel.aggregate(pipeline);


        const totalclients = await ClientModel.aggregate([{ $unwind: "$salesbillSchema" }]);

        res.json({
            draw,
            recordsTotal: totalclients.length,
            recordsFiltered: totalclients.length,
            data: client,
        });
       
    } catch (error) {
        console.log('Error fetching data:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



exports.arrivalsstorage = async (req, res) => {
  try {
      const name = req.query.name;
      const draw = parseInt(req.query.draw) || 1;
      const start = parseInt(req.query.start) || 0;
      const length = parseInt(req.query.length) || 10;

      let pipeline = [
          {
              $unwind: "$coffee"
          },
          {
            $match: { "coffee.storage": { $gt: 0 } } // Match documents where coffee.storage is greater than 0
        },
         { $sort: { 'coffee._id': -1 } },
          {
              $skip: start
          },
          {
              $limit: length
          },
          {
            $group: {
              _id: null,
              coffee: { $push: '$coffee' } // Push matching salescommitmentsschema to array
          }}
      ];

      // If name is provided in the query, add a $match stage to filter by name
      if (name) {
          pipeline.unshift({
              $match: { name: name }
          });
      }

      const client = await ClientModel.aggregate(pipeline);

      // if (!client || client.length === 0) {
      //     res.status(404).json({ error: 'No client or coffee data found' });
      //     return;
      // }

      const totalclients = await ClientModel.aggregate([{ $unwind: "$coffee" }]);

      res.json({
          draw,
          recordsTotal: totalclients.length,
          recordsFiltered: totalclients.length,
          data: client.length>0?client[0].coffee:[],
      });
  } catch (error) {
      console.log('Error fetching data:', error);
      res.status(500).json({ error: 'Server error' });
  }
};
exports.despatchstorage = async (req, res) => {
  console.log('sdsds')

try {
    const draw = parseInt(req.query.draw) || 1;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;

    let pipeline = [
        {
            $unwind: "$despatch"
        },
        {
          $match: { "despatch.storage": { $gt: 0 } } // Match documents where coffee.storage is greater than 0
      },
        { $sort: { 'despatch._id': -1 } },

        {
            $skip: start
        },
        {
            $limit: length
        },
        {
          $group: {
            _id: null,
            despatch: { $push: '$despatch' } // Push matching salescommitmentsschema to array
        }}
    ];

    // If name is provided in the query, add a $match stage to filter by name
    // if (name) {
    //     pipeline.unshift({
    //         $match: { name: name }
    //     });
    // }

    const client = await ClientModel.aggregate(pipeline);


    const totalclients = await ClientModel.aggregate([{ $unwind: "$despatch" }]);

    res.json({
        draw,
        recordsTotal: totalclients.length,
        recordsFiltered: totalclients.length,
        data: client.length>0?client[0].despatch:[],
    });
   
} catch (error) {
    console.log('Error fetching data:', error);
    res.status(500).json({ error: 'Server error' });
}
};


exports.detailedcommitmets = async (req, res) => {

try {
    const draw = parseInt(req.query.draw) || 1;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;

    let matchStage = {};
    
    // Filter by product if product is provided in the query
    if (req.query.product) {
        if (req.query.type === 'purchase') {
            matchStage = { $match: { 'purchasecommitments.item': req.query.product } };
        } else if (req.query.type === 'sale') {
            matchStage = { $match: { 'salescommitmentsschema.item': req.query.product } };
        }
    }
    
    let pipeline = [];
    
    // Dynamically adjust the pipeline based on type
    if (req.query.type === 'purchase') {
        pipeline = [
            { $unwind: "$purchasecommitments" },
            matchStage,
            { $sort: { 'purchasecommitments._id': -1 } },
            { $skip: start },
            { $limit: length },
            {
                $group: {
                    _id: null,
                    purchasecommitments: { $push: '$purchasecommitments' }
                }
            }
        ];
    } else if (req.query.type === 'sale') {
        pipeline = [
            { $unwind: "$salescommitmentsschema" },
            matchStage,
            { $sort: { 'salescommitmentsschema._id': -1 } },
            { $skip: start },
            { $limit: length },
            {
                $group: {
                    _id: null,
                    salescommitmentsschema: { $push: '$salescommitmentsschema' }
                }
            }
        ];
    }
    
    const client = await ClientModel.aggregate(pipeline);
    var pipelineb = []
    if (req.query.type === 'purchase') {
      pipelineb = [
          { $unwind: "$purchasecommitments" },
          matchStage,
          {
            $group: {
                _id: null,
                total: { $sum: 1 }
            }
        }
      ];
  } else if (req.query.type === 'sale') {
    pipelineb = [
          { $unwind: "$salescommitmentsschema" },
          matchStage,
          {
            $group: {
                _id: null,
                total: { $sum: 1 }
            }
        }
      ];
  }
    const totalclients = await ClientModel.aggregate(pipelineb);
    res.json({
        draw,
        recordsTotal: totalclients.length > 0 ? totalclients[0].total : 0,
        recordsFiltered: totalclients.length > 0 ? totalclients[0].total : 0,
        data: client.length > 0 ? (req.query.type === 'purchase' ? client[0].purchasecommitments : client[0].salescommitmentsschema) : [],
    });
    
   
} catch (error) {
    console.log('Error fetching data:', error);
    res.status(500).json({ error: 'Server error' });
}
};


exports.expencesandincome  = (async (req, res) => {
  // Assuming you have already imported required modules and set up your Express app
  
  // API endpoint for paginated data
  
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
        
    ];

    // If name is provided in the query, add a $match stage to filter by name
    if (name) {
        pipeline.unshift({
            $match: { agent: name }
        });
    }

    const client = await Transportagent.aggregate(pipeline);

   
    const transaction = client
    let pipeline2 = [
      {
          $unwind: "$transaction"
      },
     
  ];

  // If name is provided in the query, add a $match stage to filter by name
  if (name) {
    pipeline2.unshift({
          $match: { agent: name }
      });
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
  
  
  });

  
  exports.allcommitments = async (req, res) => {
    try {
        // Parse DataTables parameters from the request
        const draw = parseInt(req.query.draw) || 1;
        const start = parseInt(req.query.start) || 0;
        const length = parseInt(req.query.length) || 10;

        // Fetch purchase commitments
        const commitments = await ClientModel.aggregate([
            {
                $unwind: '$purchasecommitments'
            },
            
            {
                $sort: {
                  "purchasecommitments._id": -1
                }
            },
            {
                $skip: start // Skip records for pagination
            },
            {
                $limit: length // Limit the number of records for pagination
            }
        ]);

        

        const purchaseCommitmentsCount = await ClientModel.aggregate([
            {
                $project: {
                    count: {
                        $size: {
                            $ifNull: ['$purchasecommitments', []]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: '$count' }
                }
            }
        ]);


        // Calculate total purchase and sales commitments count
        const totalPurchaseCommitments = purchaseCommitmentsCount.length > 0 ? purchaseCommitmentsCount[0].totalCount : 0;

        // Calculate the total number of records
        const totalRecords = totalPurchaseCommitments ;

        // Respond with the data in the format DataTables expects
        res.json({
            draw,
            recordsTotal: totalRecords,
            recordsFiltered:totalRecords,
            data: commitments
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.allsalecommitments = async (req, res) => {
  try {
      // Parse DataTables parameters from the request
      const draw = parseInt(req.query.draw) || 1;
      const start = parseInt(req.query.start) || 0;
      const length = parseInt(req.query.length) || 10;

      // Fetch purchase commitments
      const commitments = await ClientModel.aggregate([
          {
              $unwind: '$salescommitmentsschema'
          },
          
          {
              $sort: {
                "salescommitmentsschema._id": -1
              }
          },
          {
              $skip: start // Skip records for pagination
          },
          {
              $limit: length // Limit the number of records for pagination
          }
      ]);

      

      const purchaseCommitmentsCount = await ClientModel.aggregate([
          {
              $project: {
                  count: {
                      $size: {
                          $ifNull: ['$salescommitmentsschema', []]
                      }
                  }
              }
          },
          {
              $group: {
                  _id: null,
                  totalCount: { $sum: '$count' }
              }
          }
      ]);


      // Calculate total purchase and sales commitments count
      const totalPurchaseCommitments = purchaseCommitmentsCount.length > 0 ? purchaseCommitmentsCount[0].totalCount : 0;

      // Calculate the total number of records
      const totalRecords = totalPurchaseCommitments ;

      // Respond with the data in the format DataTables expects
      res.json({
          draw,
          recordsTotal: totalRecords,
          recordsFiltered: totalRecords,
          data: commitments
      });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.productwisestorein  = (async (req, res) => {
  // Assuming you have already imported required modules and set up your Express app
  
  // API endpoint for paginated data
    try {
      const name = req.query.name;

      const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
      const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
      const length = parseInt(req.query.length) || 10; // Get the number of records per page
      // Fetch data from the database with pagination
      const productList = await PoductsSchema.find(); // Fetch all products to get their names/items

      // Collect the product names/items to match against
      const productItems = productList.map((product) => product.product);
  
      const results = await ClientModel.aggregate([
        {
          $match: { name: name }, // Match by client name
        },
        {
          $unwind: "$coffee", // Unwind the coffee array to work with individual items
        },
        {
          $match: {
            "coffee.storage": { $gt: 0 }, // Ensure storage is greater than 0
            "coffee.item": { $in: productItems }, // Match any of the product items
          },
        },
        {
          $project: {
            coffee: 1,
            item: "$coffee.item", // Include the coffee item name (product name)

            storage: "$coffee.storage", // Get storage
            // Calculate storage weight as (storage / eppercentage) * 100
            storageWeight: {
              $cond: {
                if: { $gt: ["$coffee.eppercentage", 0] }, // Avoid division by zero
                then: {
                  $round: [{ $multiply: [{ $divide: ["$coffee.storage", "$coffee.eppercentage"] }, 100] },2, // Round to 2 decimal places
                ],
              },
                else: 0, // Set to 0 if eppercentage is zero or less
              },
            },
          },
        },
        {
          $group: {
            _id: "$coffee.item", // Aggregate across all matching records
            totalStorageep: { $sum: "$storage" }, // Sum original storage values
            totalStorageWeight: { $sum: "$storageWeight" }, // Sum calculated storage weights
          },
        },
        {
          $project: {
            item: "$_id", 
            totalStorageep: 1,
            totalStorageWeight: 1,
            eppercentage: {
              $cond: {
                if: { $gt: ["$totalStorageWeight", 0] },
                then: {
                  $round: [
                    { $multiply: [{ $divide: ["$totalStorageep", "$totalStorageWeight"] }, 100] },
                    2, // Round to 2 decimal places
                  ],
                },
                else: null, // Set to null if totalStorageWeight is zero
              },
            },
          },
        },
      ]);
  

      const coffee = results.length > 0 ? results : [];

    res.json({
        draw,
        recordsTotal: results.length,
        recordsFiltered: results.length,
        data: coffee,
    });
    } catch (error) {
      console.log('Error fetching data:', error);
      res.status(500).json({ error: 'Server error' });
    }
  
  
  });
  exports.productwisestoreout  = (async (req, res) => {
    // Assuming you have already imported required modules and set up your Express app
    
    // API endpoint for paginated data
      try {
        const name = req.query.name;
  
        const draw = parseInt(req.query.draw) || 1; // Get the draw count (used by DataTables)
        const start = parseInt(req.query.start) || 0; // Get the starting index of the data to fetch
        const length = parseInt(req.query.length) || 10; // Get the number of records per page
        // Fetch data from the database with pagination
        const productList = await PoductsSchema.find(); // Fetch all products to get their names/items
        // Collect the product names/items to match against
        const productItems = productList.map((product) => product.product);
    
        const results = await ClientModel.aggregate([
          {
            $match: { name: name }, // Match by client name
          },
          {
            $unwind: "$despatch", // Unwind the coffee array to work with individual items
          },
          {
            $match: {
              "despatch.storage": { $gt: 0 }, // Ensure storage is greater than 0
              "despatch.item": { $in: productItems }, // Match any of the product items
            },
          },
          {
            $project: {
              despatch: 1,
              item: "$despatch.item", // Include the coffee item name (product name)
              storage: "$despatch.storage", // Get storage
              // Calculate storage weight as (storage / eppercentage) * 100
              storageWeight: {
                $cond: {
                  if: { $gt: ["$despatch.eppercentage", 0] }, // Avoid division by zero
                  then: {
                    $round: [{ $multiply: [{ $divide: ["$despatch.storage", "$despatch.eppercentage"] }, 100] },2, // Round to 2 decimal places
                  ],
                },
                  else: 0, // Set to 0 if eppercentage is zero or less
                },
              },
            },
          },
          {
            $group: {
              _id: "$despatch.item", // Aggregate across all matching records
              totalStorageep: { $sum: "$storage" }, // Sum original storage values
              totalStorageWeight: { $sum: "$storageWeight" }, // Sum calculated storage weights
            },
          },
          {
            $project: {
              item: "$_id", 
              totalStorageep: 1,
              totalStorageWeight: 1,
              eppercentage: {
                $cond: {
                  if: { $gt: ["$totalStorageWeight", 0] },
                  then: {
                    $round: [
                      { $multiply: [{ $divide: ["$totalStorageep", "$totalStorageWeight"] }, 100] },
                      2, // Round to 2 decimal places
                    ],
                  },
                  else: null, // Set to null if totalStorageWeight is zero
                },
              },
            },
          },
        ]);
    
  
        const coffee = results.length > 0 ? results : [];
  
      res.json({
          draw,
          recordsTotal: results.length,
          recordsFiltered: results.length,
          data: coffee,
      });
      } catch (error) {
        console.log('Error fetching data:', error);
        res.status(500).json({ error: 'Server error' });
      }
    
    
    });

    exports.agentxloads = async (req, res) => {
      try {
        const name = req.query.name;
        const draw = parseInt(req.query.draw) || 1;
        const start = parseInt(req.query.start) || 0;
        const length = parseInt(req.query.length) || 10;
        const loadtype = req.query.loadtype
        const unwindField = loadtype === 'Arrival' ? '$coffee' : '$despatch';
        const matchField = loadtype === 'Arrival' ? 'coffee.transportagent' : 'despatch.transportagent';
        const deliveryField = loadtype === 'Arrival' ? 'coffee.deliverymarked' : 'despatch.deliverymarked';

        // Pipeline to retrieve only the coffee subdocuments
        let pipeline = [
          {
            $unwind: unwindField
          },
          {
            $match: {
              [matchField]: name,
              [deliveryField]: { $ne: 'yes' } 
            }
          },
          {
            $skip: start
          },
          {
            $limit: length
          },
          {
            $replaceRoot: { newRoot: unwindField } // Replace the root with the coffee subdocument
          }
        ];
    
        // Pipeline to count total matching records
        let pipeline2 = [
          {
            $unwind: unwindField
          },
          {
            $match: {
              [matchField]: name,
              [deliveryField]: { $ne: 'yes' } 
            }
          },
          {
            $count: "totalRecords" // Count the number of matching documents
          }
        ];
    
        const client = await ClientModel.aggregate(pipeline);
        const totalRecordsResult = await ClientModel.aggregate(pipeline2);
    
        const totalRecords = totalRecordsResult.length > 0 ? totalRecordsResult[0].totalRecords : 0;
    
          res.json({
              draw,
              recordsTotal: totalRecords,
              recordsFiltered: totalRecords,
              data: client.length>0?client:[],
          });
      } catch (error) {
          console.log('Error fetching data:', error);
          res.status(500).json({ error: 'Server error' });
      }
  };


  
  exports.getallemployees = async (req, res) => {
    try {
      const docs = await Transportagent.find({
        accounttype: 'Labour',
      })
        res.json({
            data: docs
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



exports.getattendance = async (req, res) => {
  try {
    const date = new Date(req.params.data);
    const attendanceRecord = await Attendance.findOne({ date: date });

    if (attendanceRecord) {
        res.status(200).send(attendanceRecord);
    } else {

        res.status(404).send({ message: 'No attendance record found for this date.' });
    }
} catch (error) {
    res.status(500).send({ message: 'An error occurred while fetching attendance data.' });
}
};

exports.getTotalWorkHours = async (req, res) => {
  try {
    const { attendanceFrom, attendanceTo, employee } = req.body;

    // Find the employee by name to get the employee ID
    const employeeDoc = await Transportagent.findOne({ agent: employee });
    if (!employeeDoc) {
        return res.status(404).json({ error: 'Employee not found' });
    }

 
    const employeeId = employeeDoc._id.toString();

    // Aggregation pipeline to calculate total work hours
    const result = await Attendance.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(attendanceFrom),
                    $lte: new Date(attendanceTo)
                }
            }
        },
        {
            $unwind: '$attendance'
        },
        {
            $match: {
                'attendance.id': employeeId
            }
        },
        {
            $group: {
                _id: null,
                totalWorkHours: { $sum: '$attendance.wrokhour' }
            }
        }
    ]);

    // Extract total work hours from the result
    const totalWorkHours = result.length > 0 ? result[0].totalWorkHours : 0;

    // Send the response
    res.json({ totalWorkHours: totalWorkHours });


    // Calculate total work hours
   

} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
};

exports.getallattendance = async (req, res) => {
  try {
      const { from, to } = req.query;
      const fromDate = new Date(from);
      const toDate = new Date(to);
      console.log(req.query)

      // Aggregation pipeline
      const result = await Attendance.aggregate([
          {
              // Match records within the date range
              $match: {
                  date: { $gte: fromDate, $lte: toDate }
              }
          },
          {
              // Unwind the attendance array so each employee is treated as a document
              $unwind: "$attendance"
          },
          {
              // Group by employee id and sum their work hours
              $group: {
                  _id: "$attendance.id",
                  src: { $first: "$attendance.src" },
                  totalWorkHours: { $sum: "$attendance.wrokhour" }
              }
          }
      ]);

      res.json({ success: true, attendanceData: result });
  } catch (error) {
      console.error('Error fetching attendance with aggregation:', error);
      res.status(500).json({ success: false, message: 'Error fetching attendance' });
  }
};

exports.getkoolidetails = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Aggregation pipeline
    const result = await Transportagent.aggregate([
      {
        $match: {
          accounttype : 'Loader',}},
      {
        // Unwind the transaction array
        $unwind: "$transaction"
      },
      {
        // Match records within the date range
        $match: {
          "transaction.date": { $gte: fromDate, $lte: toDate }
        }
      },
      {
        // Group by agent's _id or name and calculate total paid and received
        $group: {
          _id: "$agent", // Group by agent name (use "$_id" for IDs)
          totalPaid: { $sum: "$transaction.paid" },
          totalReceived: { $sum: "$transaction.received" },
          totalPayable: { $sum: "$transaction.payable" },
          // transactions: { $push: "$transaction" } // Include all matching transactions for reference
        }
        
      },
      {
        // Add a computed field for balance
        $addFields: {
          balance: { 
            $subtract: [
              { $add: ["$totalPayable", "$totalReceived"] }, // totalPayable + totalReceived
              "$totalPaid" // Subtract totalPaid
            ]
          }
        }
      }
    ]);
console.log(result)
    res.json({ success: true, agentData: result });
  } catch (error) {
    console.error("Error fetching agent data with aggregation:", error);
    res.status(500).json({ success: false, message: "Error fetching agent data" });
  }
};

exports.getworkhourdetails = async (req, res) => {
  try {
    const { from, to, numvalue, senario, src } = req.query;

    // Validate and parse input
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const numericValue = Number(numvalue);
    // Determine the comparison condition for "attendance.wrokhour"
    let workHourMatch = {};
    if (senario === "gt") {
      workHourMatch = { $gt: numericValue };
    } else if (senario === "lt") {
      workHourMatch = { $lt: numericValue };
    } else {
      return res.status(400).json({ success: false, message: "Invalid scenario value" });
    }

    // Aggregation pipeline
    const result = await Attendance.aggregate([
      {
        // Match records within the date range
        $match: {
          date: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        // Unwind the attendance array to process each entry separately
        $unwind: "$attendance"
      },
      {
        // Match based on the source field
        $match: {
          "attendance.src": src
        }
      },
      {
        // Match based on the workhour condition
        $match: {
          "attendance.wrokhour": workHourMatch
        }
      },
      {
        // Project fields you want in the output
        $project: {
          _id: 0,
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" } // Convert date to "YYYY-MM-DD"
          }, // Include the main document's date field
          "attendance.src": 1, // Include the source
          "attendance.wrokhour": 1 // Include the work hours
        }
      }
    ]);
    // Respond with the filtered data
    res.json({ success: true, agentData: result });
  } catch (error) {
    console.error("Error fetching agent data with aggregation:", error);
    res.status(500).json({ success: false, message: "Error fetching agent data" });
  }
};


exports.getworkagents = async (req, res) => {
  try {
    const searchTerm = req.query.term;
    const accountTypeFilter = { accounttype: 'Loader' };

    if (!searchTerm) {
      // Fetch 20 random agents where accounttype is 'Loader'
      const agents = await Transportagent.aggregate([
        { $match: accountTypeFilter },
        { $sample: { size: 20 } }
      ]);

      const names = agents.map(agent => agent.agent);
      res.json({ results: names });
    } else {
      // Escape special regex characters in the search term
      const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

      // Find agents where accounttype is 'Loader' and agent name matches the search term
      const agents = await Transportagent.find(
        { agent: { $regex: escapedSearchTerm, $options: 'i' }, ...accountTypeFilter },
        'agent'
      );

      const names = agents.map(agent => agent.agent);
      res.json({ results: names });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getloadingworks = async (req, res) => {
  try {
    const page = req.query.start / req.query.length; // Calculate current page number
    const pageSize = parseInt(req.query.length);

    // Server-side pagination and filtering
    const data = await Loadinwork.find() 
    .sort({ _id: -1 }) // Sort by 'date' in descending order (-1)
    .skip(page * pageSize)
    .limit(pageSize);

    // Get the total count for pagination
    const totalRecords = await Loadinwork.countDocuments();

    res.json({
      draw: req.query.draw,
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords,
      docs: data, // This is the key where the data will be
    });
  } catch (error) {
      console.log('Error fetching data:', error);
      res.status(500).json({ error: 'Server error' });
  }
};

exports.getindividualloadingworks = async (req, res) => {
  try {
    const { name } = req.query; // Filter by agent name if provided
    const page = parseInt(req.query.start) || 0;
    const pageSize = parseInt(req.query.length) || 10;
    const draw = parseInt(req.query.draw) || 1;
    const decodedName = name.replace(/&amp;/g, '&');
    // Aggregation pipeline for paginated data
    const pipeline = [
      { $unwind: '$agents' }, // Flatten the agents array
      { $match: { 'agents.agent': decodedName } }, // Filter by agent name
      { $sort: { _id: -1 } }, // Sort by date in descending order
      { $skip: page * pageSize }, // Pagination
      { $limit: pageSize }, // Pagination
      {
        $project: {
          date: 1,
          work: 1,
          unit: 1,
          'agents.agent': 1,
          'agents.manpower': 1,
          'agents.bags': 1,
          'agents.kooli': 1,
          'agents.total': 1
        }
      }
    ];

    // Aggregation pipeline for total count
    const pipeline2 = [
      { $unwind: '$agents' }, // Flatten the agents array
      { $match: { 'agents.agent': decodedName } }, // Filter by agent name
      { $count: 'totalCount' } // Count the number of documents
    ];

    // Execute both pipelines
    const [totalCountResult, data] = await Promise.all([
      Loadinwork.aggregate(pipeline2), // Get total count
      Loadinwork.aggregate(pipeline) // Get paginated data
    ]);

    // Determine the total count
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
    console.log(totalCountResult)

    // Send response
    res.json({
      draw: draw,
      recordsTotal: totalCount,
      recordsFiltered: totalCount,
      data: data
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data', details: error.message });
  }
};
exports.notcalculatedloads = async (req, res) => {
  try {
    const name = req.query.name;
    const draw = parseInt(req.query.draw) || 1;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const decodedName = name.replace(/&amp;/g, '&');

    // Pipeline to retrieve only the coffee subdocuments
    let pipeline = [
      {
        $unwind: '$agents'
      },
      {
        $match: {
          'agents.agent' : decodedName,
         'agents.total': { $lte: 0 } 
        }
      },
      {
        $skip: start
      },
      {
        $limit: length
      },
      // {
      //   $replaceRoot: { newRoot: unwindField } // Replace the root with the coffee subdocument
      // }
    ];

    // Pipeline to count total matching records
    let pipeline2 = [
      {
        $unwind: '$agents'
      },
      {
        $match: {
          'agents.agent' : decodedName,
          'agents.total': { $lte: 0 } 
        }
      },
      {
        $count: "totalRecords" // Count the number of matching documents
      }
    ];

    const client = await Loadinwork.aggregate(pipeline);
    const totalRecordsResult = await Loadinwork.aggregate(pipeline2);

    const totalRecords = totalRecordsResult.length > 0 ? totalRecordsResult[0].totalRecords : 0;

      res.json({
          draw,
          recordsTotal: totalRecords,
          recordsFiltered: totalRecords,
          data: client.length>0?client:[],
      });
  } catch (error) {
      console.log('Error fetching data:', error);
      res.status(500).json({ error: 'Server error' });
  }
};


///////////trash outide ///////////



exports.trashoutside = async (req, res) => {
  try {
   
      const draw = parseInt(req.query.draw) || 1;
      const start = parseInt(req.query.start) || 0;
      const length = parseInt(req.query.length) || 10;

      let pipeline = [
        { $sort: { '_id': -1 } },
          {
              $skip: start
          },
          {
              $limit: length
          },
         
      ];
    
      // If name is provided in the query, add a $match stage to filter by name
    
      const client = await Partydelete.aggregate(pipeline);


      res.json({
          draw,
          recordsTotal: client.length,
          recordsFiltered: client.length,
          data: client.length>0?client:[],
      });
     
  } catch (error) {
      console.log('Error fetching data:', error);
      res.status(500).json({ error: 'Server error' });
  }
};


exports.gettrashinside = async (req, res) => {
  try {
   
      const draw = parseInt(req.query.draw) || 1;
      const start = parseInt(req.query.start) || 0;
      const length = parseInt(req.query.length) || 10;

      let pipeline = [
        { $sort: { '_id': -1 } },
          {
              $skip: start
          },
          {
              $limit: length
          },
         
      ];
    
      // If name is provided in the query, add a $match stage to filter by name
    
      const client = await Insidetrash.aggregate(pipeline);


      res.json({
          draw,
          recordsTotal: client.length,
          recordsFiltered: client.length,
          data: client.length>0?client:[],
      });
     
  } catch (error) {
      console.log('Error fetching data:', error);
      res.status(500).json({ error: 'Server error' });
  }
};
 