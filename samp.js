action="/submit-bill" method="post"
//   // Function to handle form submission
// // Function to handle form submission
// // async function submitForm() {
// //   // Remove 'const' before 'form' to use the one declared in the outer scope
// //   const invoicenumber = document.getElementById('invoicenumber').value
// //  const billto = document.getElementById('billto').value
// //  const dateOfIssue = document.getElementById('dateOfIssue').value
// //  const gst = document.getElementById('gst').value
// //  const billToAddress = document.getElementById('billToAddress').value
// //  const lorry = document.getElementById('lorry').value
// //  const billtype = document.getElementById('billtype').value
// //  const commitment = document.getElementById('commitment').value
// //  const item = document.getElementById('item').value
// //  const bags = document.getElementById('bags').value
// //  const quantity = document.getElementById('quantity').value
// //  const price = document.getElementById('price').value
// //  const cgst = document.getElementById('cgst').value
// //  const sgst = document.getElementById('sgst').value
// //  const igst = document.getElementById('igst').value
// //  const notes = document.getElementById('notes').value
// //  const outern = document.getElementById('outern').value
// //  const moisture = document.getElementById('moisture').value
// //  const blacks = document.getElementById('blacks').value
// //  const husk = document.getElementById('husk').value
// //  const aaa = document.getElementById('aaa').value
// //  const aa = document.getElementById('a').value
// //  const a = document.getElementById('a').value
// //  const b = document.getElementById('b').value
// //  const c = document.getElementById('c').value
// //  const pberry = document.getElementById('pberry').value
 

// //   try {
// //     console.log('here')
// //     const response = await fetch('/submit-bill', {
// //       method: 'POST',
// //       body: {
// //         invoicenumber,
// //         billto,
// //         dateOfIssue,
// //         gst,
// //         billToAddress,
// //         lorry,
// //         billtype,
// //         commitment,
// //         item,
// //         bags,
// //         quantity,
// //         price,
// //         cgst,
// //         sgst,
// //         igst,
// //         notes,
// //         outern,
// //         moisture,
// //         blacks,
// //         husk,
// //         aaa,
// //         aa,
// //         a,
// //         b,
// //         c,
// //         pberry
// //       },
// //     });

// //     if (response.ok) {
// //       alert('Form submitted successfully');
// //       // You can redirect or perform any other action here
// //     } else {
// //       alert('Error submitting the form');
// //     }
// //   } catch (error) {
// //     console.log('Error:', error);
// //     alert('Error submitting the form');
// //   }
// // }

// // // Add an event listener to the "Generate Invoice" button



  //   pdf.create(url, options).toFile(filePath, (err) => {
        // if (err) return console.error('Error generating PDF:', err);
        // console.log('PDF generated successfully:', filePath);

        //   });     
       
  
      // let PDF = await pdfMaster.generatePdf("template.hbs", { data }, options);

      // 
      // fs.writeFileSync(filePath, PDF);

    // const templatePath = path.join(__dirname, 'template.hbs');

    // // Compile Handlebars template
    // const template = fs.readFileSync(templatePath, 'utf8');
    // const compiledTemplate = handlebars.compile(template);
    // const html = compiledTemplate({ data });
    // console.log(html)
    
    // // Options for PDF generation
 
    // // Output PDF path
    // const pdfPath = path.join(__dirname, '..', 'public', 'report.pdf');
    
    // // Generate PDF from the compiled HTML
    // pdf.create(html, options).toFile(pdfPath, (err) => {
    //     if (err) return console.error('Error generating PDF:', err);
    //     console.log('PDF generated successfully:', pdfPath);

    // });        

  //   const html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');
    
  cdfdfsdfsd  
   // exports.createDailyReport = async (req, res) => {
  //   const reportDate = req.body.reportdate;
  
  //   // Set the start and end of the day
  //   const startOfDay = new Date(reportDate);
  //   startOfDay.setHours(0, 0, 0, 0);
  
  //   const endOfDay = new Date(reportDate);
  //   endOfDay.setHours(23, 59, 59, 999);
  
  //   // Match stage for the date range
  //   const matchStage = { "date": { $gte: startOfDay, $lte: endOfDay } };
  
  //   let data = {companyname: 'HI TECH COFFEE',
  //   reportdate:reportDate,
  //   openingaccount:req.body.openingBankBalance,
  //   openingcash:req.body.openingCashBalance,
  //   openingother:req.body.openingOtherBalance,
  //   openingtotal:parseInt(req.body.openingBankBalance)+parseInt(req.body.openingCashBalance)+parseInt(req.body.openingOtherBalance),
  // };

  // if (req.body.includeArrival == 'true') {
  //     const pipeline = [
  //       { $unwind: "$coffee" },
  //       { $match: { "coffee.date": { $gte: startOfDay, $lte: endOfDay } } },
  //       {
  //         $project: {
  //           name: 1,
  //           "coffee.billTo": 1,
  //           "coffee.item": 1,
  //           "coffee.lorry": 1,
  //           "coffee.bags": 1,
  //           "coffee.netWeight": 1,
  //           "coffee.eppercentage": 1,
  //           "coffee.netepweight": 1,
  //           "coffee.storage": 1,
  //           "coffee.stat": 1,
  //         },
  //       },
  //     ];
  //     const result = await ClientModel.aggregate(pipeline).exec();
  //     data = { ...data, arrivals: result };
  //   }
  
  //   if (req.body.includeDespatch== 'true') {
  //     const pipeline = [
  //       { $unwind: "$despatch" },
  //       { $match: { "despatch.date": { $gte: startOfDay, $lte: endOfDay } } },
  //       {
  //         $project: {
  //           name: 1,
  //           "despatch.billTo": 1,
  //           "despatch.item": 1,
  //           "despatch.lorry": 1,
  //           "despatch.bags": 1,
  //           "despatch.netWeight": 1,
  //           "despatch.delivery": 1,
  //           "despatch.eppercentage": 1,
  //           "despatch.netepweight": 1,
  //           "despatch.storage": 1,
  //           "despatch.stat": 1,
  //         },
  //       },
  //     ];
  //     const result = await ClientModel.aggregate(pipeline).exec();
  //     data = { ...data, despatch: result };
  //   }
  
  //   if (req.body.includeBills== 'true') {
  //     const salesPipeline = [
  //       { $unwind: "$salesbillSchema" },
  //       { $match: { "salesbillSchema.date": { $gte: startOfDay, $lte: endOfDay } } },
  //       {
  //         $project: {
  //           name: 1,
  //           "salesbillSchema.billTo": 1,
  //           "salesbillSchema.item": 1,
  //           "salesbillSchema.qty": 1,
  //           "salesbillSchema.weight": 1,
  //           "salesbillSchema.amount": 1,
  //           "salesbillSchema.total": 1,
  //         },
  //       },
  //     ];
  //     const salesResult = await ClientModel.aggregate(salesPipeline).exec();
  
  //     const purchasePipeline = [
  //       { $unwind: "$purchasebillSchema" },
  //       { $match: { "purchasebillSchema.date": { $gte: startOfDay, $lte: endOfDay } } },
  //       {
  //         $project: {
  //           name: 1,
  //           "purchasebillSchema.billTo": 1,
  //           "purchasebillSchema.item": 1,
  //           "purchasebillSchema.qty": 1,
  //           "purchasebillSchema.weight": 1,
  //           "purchasebillSchema.amount": 1,
  //           "purchasebillSchema.total": 1,
  //         },
  //       },
  //     ];
  //     const purchaseResult = await ClientModel.aggregate(purchasePipeline).exec();
  
  //     data = { ...data, salesBills: salesResult, purchaseBills: purchaseResult };
  //   }
  
  //   if (req.body.includeCommitments== 'true') {
  //     const salesCommitmentPipeline = [
  //       { $unwind: "$salescommitmentsschema" },
  //       { $match: { "salescommitmentsschema.date": { $gte: startOfDay, $lte: endOfDay } } },
  //       {
  //         $project: {
  //           name: 1,
  //           "salescommitmentsschema.name": 1,
  //           "salescommitmentsschema.item": 1,
  //           "salescommitmentsschema.weight": 1,
  //           "salescommitmentsschema.rate": 1,
  //           "salescommitmentsschema.info": 1,
  //         },
  //       },
  //     ];
  //     const salesCommitmentResult = await ClientModel.aggregate(salesCommitmentPipeline).exec();
  
  //     const purchaseCommitmentPipeline = [
  //       { $unwind: "$purchasecommitments" },
  //       { $match: { "purchasecommitments.date": { $gte: startOfDay, $lte: endOfDay } } },
  //       {
  //         $project: {
  //           name: 1,
  //           "purchasecommitments.name": 1,
  //           "purchasecommitments.item": 1,
  //           "purchasecommitments.weight": 1,
  //           "purchasecommitments.rate": 1,
  //           "purchasecommitments.info": 1,
  //         },
  //       },
  //     ];
  //     const purchaseCommitmentResult = await ClientModel.aggregate(purchaseCommitmentPipeline).exec();
  //     data = { ...data, salesCommitments: salesCommitmentResult, purchaseCommitments: purchaseCommitmentResult };
  //   }
  
  //   if (req.body.includeBalance== 'true') {
  //     const pipeline = [
  //       { $unwind: "$transaction" },
  //       { $match: { "transaction.date": { $gte: startOfDay, $lte: endOfDay } } }, 
  //               {
  //         $match: {
  //           $or: [
  //             { "transaction.recieved": { $gt: 0 } },
  //             { "transaction.paid": { $gt: 0 } },
  //           ],
  //         },
  //       },
  //       {
  //         $project: {
  //           name: 1,
  //           "transaction.name": 1,
  //           "transaction.refference": 1,
  //           "transaction.medium": 1,
  //           "transaction.recieved": 1,
  //           "transaction.paid": 1,
  //         },
  //       },
  //     ];
  //     const result = await ClientModel.aggregate(pipeline).exec();
  //     data = { ...data, transactions: result };
  //   }
  
  //   if (req.body.includeExpenses== 'true') {
  //     const pipeline = [
  //       { $unwind: "$transaction" },
  //       { $match: { "transaction.date": { $gte: startOfDay, $lte: endOfDay } } },        {
  //         $match: {
  //           $or: [
  //             { "transaction.recieved": { $gt: 0 } },
  //             { "transaction.paid": { $gt: 0 } },
  //           ],
  //         },
  //       },
  //       {
  //         $project: {
  //           agent: 1,
  //           "transaction.name": 1,
  //           "transaction.refference": 1,
  //           "transaction.medium": 1,
  //           "transaction.recieved": 1,
  //           "transaction.paid": 1,
  //         },
  //       },
  //     ];
  //     const result = await Transportagent.aggregate(pipeline).exec();
  //     data = { ...data, balances: result };
  //   }
  //   if (req.body.includepartybalance== 'true') {
  //     const pipeline = [
  //       // Step 1: Match documents based on the initial query        
  //       // Step 2: Add fields for adjustedRecievable and adjustedPayable
  //       {
  //           $addFields: {
  //               adjustedRecievable: { $subtract: ['$recievable', '$recieved'] },
  //               adjustedPayable: { $subtract: ['$payable', '$paid'] }
  //           }
  //       },
        
  //       // Step 3: Add a custom sort key for filtering
  //       {
  //           $addFields: {
  //               customSortKey: { $subtract: ['$adjustedRecievable', '$adjustedPayable'] },
  //               apayable: '$adjustedPayable',
  //               arecievable: '$adjustedRecievable'
  //           }
  //       },
        
  //       // Step 4: Filter documents where customSortKey is greater than 1000 or less than -1000
  //       {
  //           $match: {
  //               $or: [
  //                   { customSortKey: { $gt: 1000 } },
  //                   { customSortKey: { $lt: -1000 } }
  //               ]
  //           }
  //       }
  //   ];
    
  //     const result = await ClientModel.aggregate(pipeline).exec();
  //     data = { ...data, partybalance: result };
  //   }   
  //   if (req.body.includecommitmentbalance== 'true') {
  //     const pipeline = [
     
  //       { $unwind: "$purchasecommitments" },
  //       { $match: { "purchasecommitments.balance": { $gte: 499 } } }, 
        
  //       // Step 4: Filter documents where customSortKey is greater than 1000 or less than -1000
  //   ];
    
  //     const result1 = await ClientModel.aggregate(pipeline).exec();
  //     const pipeline2 = [
     
  //       { $unwind: "$salescommitmentsschema" },
  //       { $match: { "salescommitmentsschema.balance": { $gte: 499 } } }, 
        
  //       // Step 4: Filter documents where customSortKey is greater than 1000 or less than -1000
  //   ];
    
  //     const result2 = await ClientModel.aggregate(pipeline2).exec();
  //     data = { ...data, purchasecommitmentbalance: result1,salecommitmentbalance: result2,commitmentbalance:true };
  //   }     

  //   let options = {
  //     // displayHeaderFooter: true,
  //     format: "A4",
  //     margin: { top: "60px", bottom: "100px" },
  //     // base: 'file://' + path.resolve('./public') + '/'

  //   };

  //   // let PDF = await pdfMaster.generatePdf("template.hbs", { data }, options);

  //   // 
  //   // fs.writeFileSync(filePath, PDF);
    
  //   const templatePath = path.join(__dirname, 'dailyreport.hbs');

  //       const template = fs.readFileSync(templatePath, 'utf8');
  //   const compiledTemplate = handlebars.compile(template);
  //   const html = compiledTemplate({ data });
  //   fs.writeFile(path.join(__dirname, '..', 'public', 'dailyreport.html'), html,async (d) => {
  //     const htmlContent = html;
  //     // Use Puppeteer to geerate PDF
  //     const browser = await puppeteer.launch({
  //       headless: 'new',
  //       args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //   });
  //     const page = await browser.newPage();
  //     await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  //     // Generate a file name
  //     const fileName = `report_${req.body.reportdate}.pdf`;
  //     const filePath = path.join(__dirname, fileName);

  //     // Save PDF to file
  //     await page.pdf({ path: filePath, format: 'A4' });

  //     await browser.close();

  //     // Send the PDF file to the user
  //     bot.sendDocument(process.env.CHAT_ID, filePath).then(() => {
  //       // Unlink (delete) the file after sending it
  //       fs.unlink(filePath, (err) => {
          
  //       });
  //   }).catch((sendError) => {
  //       console.error('Error sending document:', sendError);
  //   });;
  //     res.status(201).json({ message: 'Form submitted successfully' });

  //   })
  // };
  ////////////////////////// dAily Report fragment /////////////////
 

  <script>
  var employee = '<%=employee%>'
  $(document).ready(function() {
    calculatesum()
    var loadtype = 'Despatch'
    
    var dataTable
  $('#loadswitchbtn').click(function(e) {
          e.preventDefault(); // Prevent the default action of the anchor tag
          dataTable.destroy();
          // Get the current text of the span
          var currentText = $('#loadtype').text();
          
          // Toggle the text between 'Despatch' and 'Arrival'
          if (currentText === 'Despatch') {
              $('#loadtype').text('Arrival');
              loadtype = 'Arrival'
          } else {
              $('#loadtype').text('Despatch');
              loadtype = 'Despatch'
          }
          viewtable()
      });
      $('#viewloadmodal').on('shown.bs.modal', function() {
        viewtable()
    });
    function viewtable(){
      dataTable = $('#loads-table').DataTable({
          "pageLength": 10,
          "dom": 'rtip',
  
        processing: true,
        serverSide: true,
        ajax: {
          url: '/agentxloads', // Replace with your API endpoint
          dataSrc: 'data', // Key that holds the array of data in the API response
          data: function (d) {
            d.name = employee;
            d.loadtype = loadtype; // Add the 'name' parameter to the data object
            return d;
            // Add any additional parameters you want to send to the server here
          },
          
        },
          columns: [
    
          {
            data: 'date',
            render: function (data, type, row) {
              // Format the date using moment.js
              return moment(data).format('DD/MM/YYYY');
            }
          },
          {
        data: 'delivery',
        render: function (data, type, row) {
          // If delivery is null, show billTo instead
          return data ? data : row.billTo;
        }
      },        { data: 'lorry' },
          { data: 'item' },
          { data: 'quantity' },
          {
        data: null,
        render: function (data, type, row) {
          // Render an input field with the value of 'trip'
          return `<input type="text" class="form-control trip-input" data-row-id="${row._id}" name="trip">`;
        }
      },
       
            {
              data: null,
              render: function (data, type, row) {
                return `<div class="dropdown">
                    <button type="button" class="btn btn-primary btn-sm add-btn" data-src='${JSON.stringify(row)}'>
          <i class="bx bx-plus"></i> Add
        </button>
                    
                  </div>`;
              },
            },
          ],
        });
        $('#loads-table').on('click', '.add-btn', function() {
          var rowData = $(this).data('src'); // Get the row data
      var tripValue = $(this).closest('tr').find('input.trip-input').val();
      dat = {
        loadtype:loadtype,
        id:rowData._id
      }
      axios.post('/deliverymarked', dat)
    .then(response => {
      // Handle the server response here
      dataTable.ajax.reload();
      addtrip(rowData,tripValue)
      $('#viewloadmodal').modal('hide');
      // closeButton.click();
      
      // Close the modal on successful response
      
    })
    .catch(error => {
      // Handle errors here
      console.log('Error:', error);
    });
      // Call the assignCommitment function with the retrieved arguments (row data and trip value)
      
  
      // Call the assignCommitment function with the retrieved arguments
  });
     
    }
     $('#viewloadmodal').on('hidden.bs.modal', function() {
          // Function to run when the modal is hidden (closed)
          dataTable.destroy();
            });
    })
    function markload() {
      // Retrieve the form element
      const form = document.getElementById('transportagentform');
      
      // Get form data using FormData API
      const formData = new FormData(form);
      
      // Convert FormData to an object
      const data = Object.fromEntries(formData.entries());
  
      // Construct the `src` object
      const src = {
          name: employee, // Assuming employee is a global variable or defined elsewhere
          delivery: data.distance, // Or another relevant field if distance isn't correct
          lorry: data.vehi,
          item: data.item,
          quantity: data.weight, // Assuming weight is the quantity
          date: data.tripdate,
          rate: data.rent // Assuming rent is the rate
      };
   if(src.delivery && src.date && src.rate){
    addtrip(src,src.rate)
   }else{
    alert('Please fill the fields')
   }
     
  }
    function addtrip(data,value){
      const src = {
          name: employee,
          trip: data.delivery || data.billTo,
          vehicle: data.lorry,
          item: data.item,
          quantity: data.quantity,
          date:data.date,
          rate:value
  
      };
  
      axios.post('/addtrip', src)
    .then(response => {
      // Handle the server response here
      thetatable.ajax.reload();
      $('#newagentmodal').modal('hide');
      calculatesum()
      // closeButton.click();
      
      // Close the modal on successful response
      
    })
    .catch(error => {
      // Handle errors here
      console.log('Error:', error);
    });
  
     
    }
    function calculatesum(){
      axios.get('/agentsum/'+employee)
              .then(function(response) {
                console.log(response)
                  var data = response.data.data;
                  document.getElementById('payabletotal').innerText = (data.totalPayable+data.totalrecieved)
                  document.getElementById('paidtotal').innerText = data.totalPaid
                  document.getElementById('balancetotal').innerText = (data.totalPayable+data.totalrecieved-data.totalPaid)
              })
     }
      </script>