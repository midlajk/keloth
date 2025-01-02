const mongoose = require('mongoose');
const ClientModel = mongoose.model('Client')
const Reference = mongoose.model('Reference')
const PoductsSchema = mongoose.model('PoductsSchema')
const Transportagent = mongoose.model('Transportagent')
const Loadinwork = mongoose.model('Loadinwork')
const Attendance = mongoose.model('Attendance')

const XLSX = require('xlsx');
exports.downloadarrivals = async (req, res) => {
    try {
      const client = await ClientModel.findOne({ name: req.params.name });
      const coffee = client.coffee;
  
      // Define custom headings for the required fields
      const topHeading = [['From '+req.params.name + ' Purchase Reports']];
      const columnHeaders = [
        ['Date', 'Lorry', 'Item', 'Bags', 'Quantity', 'OUTURN', 'Net EP Weight']
      ];
  
      // Extract only the required fields from coffee data
      const data = coffee.map(coffeeEntry => [
        coffeeEntry.date,
        coffeeEntry.lorry,
        coffeeEntry.item,
        coffeeEntry.bags,
        coffeeEntry.quantity,
        coffeeEntry.eppercentage,  // This is "OUTURN"
        coffeeEntry.netepweight
      ]);
  
      // Combine top heading, column headers, and data
      const combinedData = topHeading.concat(columnHeaders).concat(data);
      
      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(combinedData);
  ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } } // Merge cells from A1 to G1
      ];
      
      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      // Generate binary string
      const wboutBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  
      // Send the file to the client
      res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(Buffer.from(wboutBinary, 'binary'));
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Error generating Excel file');
    }
  };

  exports.downloaddespatch = async (req, res) => {
    try {
      const client = await ClientModel.findOne({ name: req.params.name });
      const coffee = client.despatch;
      const topHeading = [['To '+req.params.name + ' Despatch Reports']];
    const columnHeaders = [
      ['Date', 'Lorry', 'Item', 'Bags', 'Quantity', 'OUTURN', 'Net EP Weight']
    ];

    // Extract only the required fields from coffee data
    const data = coffee.map(coffeeEntry => [
      coffeeEntry.date,
      coffeeEntry.lorry,
      coffeeEntry.item,
      coffeeEntry.bags,
      coffeeEntry.quantity,
      coffeeEntry.eppercentage,  // This is "OUTURN"
      coffeeEntry.netepweight
    ]);

    // Combine top heading, column headers, and data
    const combinedData = topHeading.concat(columnHeaders).concat(data);
    
      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(combinedData);
  ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } } // Merge cells from A1 to G1
      ];
      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      // Generate binary string
      const wboutBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  
      // Send the file to the client
      res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(Buffer.from(wboutBinary, 'binary'));
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Error generating Excel file');
    }
  };


  exports.downloadloaders = async (req, res) => {
    try {
        const fromDate = new Date(req.body.from);
        const toDate = new Date(req.body.to);

        // Fetch transaction data using aggregation
        const result = await Transportagent.aggregate([
            { $unwind: "$transaction" },
            {
              $match: {
                  "accounttype": "Loader"}},
            {
                $match: {
                    "transaction.date": { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    agent: { $first: "$agent" },
                    totalPayable: { $sum: "$transaction.payable" },
                    totalPaid: { $sum: "$transaction.paid" },
                    totalRecieved: { $sum: "$transaction.recieved" }
                }
            },
            { $sort: { agent: 1 } }
        ]);
        console.log(result)

        // Top heading
        const topHeading = [
            [`Loaders Reports: From ${req.body.from} To ${req.body.to}`]
        ];

        // Column headers
        const columnHeaders = [
            ['Loader', 'Payable', 'Recieved', 'Paid', 'Balance']
        ];

        // Map data into rows
        const data = result.map(agent => [
            agent.agent,
            agent.totalPayable,
            agent.totalRecieved,
            agent.totalPaid,
            agent.totalPayable + agent.totalRecieved - agent.totalPaid // Balance
        ]);

        // Combine everything into one array
        const combinedData = topHeading.concat(columnHeaders).concat(data);

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(combinedData);

        // Merge the top heading row
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } } // Merge cells for header
        ];

        // Append worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Write workbook to binary format
        const wboutBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Set response headers for file download
        res.setHeader('Content-Disposition', 'attachment; filename="loaders_report.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send the file
        res.send(Buffer.from(wboutBinary, 'binary'));
    } catch (error) {
        console.error('Error generating Excel file:', error);
        res.status(500).send('Error generating Excel file');
    }
};
exports.downloadtransport = async (req, res) => {
  try {
      const fromDate = new Date(req.body.from);
      const toDate = new Date(req.body.to);

      // Fetch transaction data using aggregation
      const result = await Transportagent.aggregate([
          { $unwind: "$transaction" },
          {
            $match: {
                "accounttype": "Delivery-Agent"}},
          {
              $match: {
                  "transaction.date": { $gte: fromDate, $lte: toDate }
              }
          },
          {
              $group: {
                  _id: "$_id",
                  agent: { $first: "$agent" },
                  totalPayable: { $sum: "$transaction.payable" },
                  totalPaid: { $sum: "$transaction.paid" },
                  totalRecieved: { $sum: "$transaction.recieved" }
              }
          },
          { $sort: { agent: 1 } }
      ]);
      console.log(result)

      // Top heading
      const topHeading = [
          [`Loaders Reports: From ${req.body.from} To ${req.body.to}`]
      ];

      // Column headers
      const columnHeaders = [
          ['Loader', 'Payable', 'Recieved', 'Paid', 'Balance']
      ];

      // Map data into rows
      const data = result.map(agent => [
          agent.agent,
          agent.totalPayable,
          agent.totalRecieved,
          agent.totalPaid,
          agent.totalPayable + agent.totalRecieved - agent.totalPaid // Balance
      ]);

      // Combine everything into one array
      const combinedData = topHeading.concat(columnHeaders).concat(data);

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(combinedData);

      // Merge the top heading row
      ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } } // Merge cells for header
      ];

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Write workbook to binary format
      const wboutBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      // Set response headers for file download
      res.setHeader('Content-Disposition', 'attachment; filename="transport_report.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      // Send the file
      res.send(Buffer.from(wboutBinary, 'binary'));
  } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Error generating Excel file');
  }
};



exports.downloadallaccounts = async (req, res) => {
  console.log('here')
  try {
    const topHeading = [];
      // Fetch transaction data using aggregation
      const pipeline = [
        { $unwind: "$transaction" }
    ];
    // Add date filtering only if `from` and `to` are present
    if (req.body.from && req.body.to) {
        const fromDate = new Date(req.body.from);
        const toDate = new Date(req.body.to);
        topHeading.push([`Party Report: From ${req.body.from} To ${req.body.to}`]);

        pipeline.push({
            $match: {
                "transaction.date": { $gte: fromDate, $lte: toDate }
            }
        });
    }else{
      topHeading.push([`Party Report`]);

    }
    
    // Add grouping stage
    pipeline.push(
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                totalPayable: { $sum: "$transaction.payable" },
                totalPaid: { $sum: "$transaction.paid" },
                totalRecieved: { $sum: "$transaction.recieved" },
                totalRecievable: { $sum: "$transaction.revievable" }
            }
        },
        {
            $addFields: {
                netBalance: {
                    $subtract: [
                        { $add: ["$totalPaid", "$totalRecievable"] },
                        { $add: ["$totalPayable", "$totalRecieved"] },
                    ]
                }
            }
        },
        { $sort: { netBalance: -1 } } // Sort by computed value
    );
    
    // Add filtering by `netBalance` if `payable` and `recievable` are present
    if (req.body.payable && req.body.recievable) {
        const payable = parseFloat(req.body.payable);
        const recievable = parseFloat(req.body.recievable);
        console.log(payable,recievable)
    
        pipeline.push({
          $match: {
            $or: [
                { netBalance: { $lte: -payable } },
                { netBalance: { $gte: recievable } }
            ]
        }
        });
    }
    
    // Execute the aggregation
    const result = await ClientModel.aggregate(pipeline);
      console.log(result)

      // Top heading
  
      // Column headers
      const columnHeaders = [
          ['Party', 'Debit', 'Credit', 'Balance']
      ];

      // Map data into rows
      const data = result.map(party => [
        party.name,
        party.totalRecievable+party.totalPaid,
        party.totalPayable+party.totalRecieved,
        party.netBalance,
      ]);

      // Combine everything into one array
      const combinedData = topHeading.concat(columnHeaders).concat(data);

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(combinedData);

      // Merge the top heading row
      ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } } // Merge cells for header
      ];

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Write workbook to binary format
      const wboutBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      // Set response headers for file download
      res.setHeader('Content-Disposition', 'attachment; filename="allaccounts_report.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      // Send the file
      res.send(Buffer.from(wboutBinary, 'binary'));
  } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Error generating Excel file');
  }
};

exports.individualloadingworks = async (req, res) => {
  try {
    const fromDate = new Date(req.body.from);
    const toDate = new Date(req.body.to);
    const name = req.body.name;
    const decodedName = name.replace(/&amp;/g, '&');
    // Fetch transaction data using aggregation
    const result = await Loadinwork.aggregate([
       
      { $unwind: '$agents' }, // Flatten the agents array
      {
        $match: {
            "date": { $gte: fromDate, $lte: toDate }
        }
    },
      { $match: { 'agents.agent': decodedName } }, // Filter by agent name
      
      { $sort: { _id: -1 } }, // Sort by date in descending order
     
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
    ]);


    // Top heading
    const topHeading = [
        [`Loading Report of ${req.body.name} : From ${req.body.from} To ${req.body.to}`]
    ];

    // Column headers
    const columnHeaders = [
        ['Date', 'work', 'Unit', 'Man Power', 'Qty','Kooli','Total']
    ];

    // Map data into rows
    const data = result.map(agent => [
        agent.date,
        agent.work,
        agent.unit,
        agent.agents.manpower,
        agent.agents.bags,
        agent.agents.kooli,
        agent.agents.total,
    ]);

    // Combine everything into one array
    const combinedData = topHeading.concat(columnHeaders).concat(data);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    // Merge the top heading row
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } } // Merge cells for header
    ];

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook to binary format
    const wboutBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Set response headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename="loadingworks_report.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the file
    res.send(Buffer.from(wboutBinary, 'binary'));
} catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).send('Error generating Excel file');
}
};
exports.downloademployeereport = async (req, res) => {
  try {
    const fromDate = new Date(req.body.from);
    const toDate = new Date(req.body.to);

    // Fetch transaction and attendance data using aggregation
    const result = await Transportagent.aggregate([
      { $unwind: "$transaction" },
      {
        $match: {
          accounttype: "Labour",
        },
      },
      {
        $match: {
          "transaction.date": { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $lookup: {
          from: "attendances", // Collection name for attendance
          let: { agentId: "$_id" },
          pipeline: [
            {
              $unwind: "$attendance",
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$attendance.id", { $toString: "$$agentId" }] },
                    { $gte: ["$date", fromDate] },
                    { $lte: ["$date", toDate] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalWorkHours: { $sum: "$attendance.wrokhour" },
              },
            },
          ],
          as: "attendanceData",
        },
      },
      {
        $unwind: {
          path: "$attendanceData",
          preserveNullAndEmptyArrays: true, // To include agents with no attendance data
        },
      },
      {
        $group: {
          _id: "$_id",
          agent: { $first: "$agent" },
          totalPayable: { $sum: "$transaction.payable" },
          totalPaid: { $sum: "$transaction.paid" },
          totalRecieved: { $sum: "$transaction.recieved" },
          totalWorkHours: { $first: "$attendanceData.totalWorkHours" },
        },
      },
      { $sort: { agent: 1 } },
    ]);

    // Top heading
    const topHeading = [[`Employees Reports: From ${req.body.from} To ${req.body.to}`]];

    // Column headers
    const columnHeaders = [["Employee", "Payable", "Received", "Paid", "Balance", "Total Work Hours"]];

    // Map data into rows
    const data = result.map((agent) => [
      agent.agent,
      agent.totalPayable || 0,
      agent.totalRecieved || 0,
      agent.totalPaid || 0,
      (agent.totalPayable || 0) + (agent.totalRecieved || 0) - (agent.totalPaid || 0), // Balance
      agent.totalWorkHours || 0,
    ]);

    // Combine everything into one array
    const combinedData = topHeading.concat(columnHeaders).concat(data);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(combinedData);

    // Merge the top heading row
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }]; // Merge cells for header

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write workbook to binary format
    const wboutBinary = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Set response headers for file download
    res.setHeader("Content-Disposition", 'attachment; filename="employee_report.xlsx"');
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Send the file
    res.send(Buffer.from(wboutBinary, "binary"));
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).send("Error generating Excel file");
  }
};

exports.downloadincomeexpensereport = async (req, res) => {
  try {
      const fromDate = new Date(req.body.from);
      const toDate = new Date(req.body.to);

      // Fetch transaction data using aggregation
      const result = await Transportagent.aggregate([
          { $unwind: "$transaction" },
          {
            $match: {
                "accounttype": "Expence-income"}},
          {
              $match: {
                  "transaction.date": { $gte: fromDate, $lte: toDate }
              }
          },
          {
              $group: {
                  _id: "$_id",
                  agent: { $first: "$agent" },
                  totalPayable: { $sum: "$transaction.payable" },
                  totalPaid: { $sum: "$transaction.paid" },
                  totalRecieved: { $sum: "$transaction.recieved" }
              }
          },
          { $sort: { agent: 1 } }
      ]);
      console.log(result)

      // Top heading
      const topHeading = [
          [`Income-Expense Reports: From ${req.body.from} To ${req.body.to}`]
      ];

      // Column headers
      const columnHeaders = [
          ['Refference', 'Income', 'Expense', 'Balance']
      ];

      // Map data into rows
      const data = result.map(agent => [
          agent.agent,
          agent.totalPayable+agent.totalRecieved,
          agent.totalPaid,
          agent.totalPayable + agent.totalRecieved - agent.totalPaid // Balance
      ]);

      // Combine everything into one array
      const combinedData = topHeading.concat(columnHeaders).concat(data);

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(combinedData);

      // Merge the top heading row
      ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } } // Merge cells for header
      ];

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Write workbook to binary format
      const wboutBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      // Set response headers for file download
      res.setHeader('Content-Disposition', 'attachment; filename="expense_report.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      // Send the file
      res.send(Buffer.from(wboutBinary, 'binary'));
  } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).send('Error generating Excel file');
  }
};