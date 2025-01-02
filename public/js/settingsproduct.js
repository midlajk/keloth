// function openmodel(p){   
//   console.log(p) 
//   var myModal = new bootstrap.Modal(document.getElementById('newitem'));
//       myModal.show();
// }
var byproducts = []
var itemtype
var id 
document.addEventListener('click', function(event) {
            const target = event.target;
            if (target.matches('#openModalButton')) {
              var myModal = new bootstrap.Modal(document.getElementById('newitem'));
              myModal.show();
                const productData = JSON.parse(target.dataset.product); 
                itemtype = productData.itemtype;
                id=productData._id
                document.getElementById('itemtype').value= productData.itemtype
                document.getElementById('currentitemname').innerText= productData.product

                var byproductsDiv = document.getElementById('byproducts');
        byproductsDiv.innerHTML = '';
        byproducts=productData.byproduct
        productData.byproduct.forEach((byproduct, index) => {
            // Create a table row
            var newRowHtml = '<div class="row byproduct-row"> \
                            <div class="col mb-3">'+byproduct.name+'\
                             \
                            </div> \
                            <div class="col mb-3"> \
                                '+byproduct.percentage+' \
                            </div> \
                            <div class="col mb-3"> \
                                <button type="button" class="btn btn-danger delete-row" data-index="' + index + '">Delete</button> \
                            </div> \
                        </div>';   
                        
                        
                        $("#byproducts").append(newRowHtml);

            // Append table row to byproducts div
        });

                // Now you can use the product data as needed
                // For example, open a modal with the product details
            }
        });
        function addproduct() {
    fetch('/updateproduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            item: itemtype,
            product: byproducts
        })
    })
    .then(response => {
      window.location.reload()
    })
    .catch(error => {
        console.error('Error updating product:', error);
        // Handle error if needed
    });
    
}

        function addByProductRow() {
     

     var byproductname = document.getElementById('byproductitem').value
     var byproductpercentage = document.getElementById('byproductpercentage').value
     if(byproductname&&byproductpercentage){

     var byProduct = {
    name: byproductname,
    percentage: byproductpercentage
};

byproducts.push(byProduct);
var rowIndex = byproducts.length - 1



      var newRowHtml = '<div class="row byproduct-row"> \
                            <div class="col mb-3">'+byproductname+'\
                             \
                            </div> \
                            <div class="col mb-3"> \
                                '+byproductpercentage+' \
                            </div> \
                            <div class="col mb-3"> \
                                <button type="button" class="btn btn-danger delete-row" data-index="' + rowIndex + '">Delete</button> \
                            </div> \
                        </div>';

      $("#byproducts").append(newRowHtml);
                      }else{
                        alert('cant add empty columns')
                      }

      
  }
  $('#newitem').on('shown.bs.modal', function () {
    $('.js-data-example-ajax-byproduct').select2({
            dropdownParent: $("#newitem"),
              ajax: {
                  url: '/getproducts',
                  dataType: 'json',
                  delay: 250, // Delay in milliseconds before making the request
                  processResults: function (data) {
                      return {
                          results: data.results.map(name => ({ id: name, text: name }))
                      };
                  },
                  cache: true // Enable caching to reduce server requests
              }
          });
});
$('#newitems').on('shown.bs.modal', function () {
    $('.js-data-example-ajax-byproduct').select2({
            dropdownParent: $("#newitems"),
              ajax: {
                  url: '/getproducts',
                  dataType: 'json',
                  delay: 250, // Delay in milliseconds before making the request
                  processResults: function (data) {
                      return {
                          results: data.results.map(name => ({ id: name, text: name }))
                      };
                  },
                  cache: true // Enable caching to reduce server requests
              }
          });
});
$(document).on('click', '.delete-row', function () {
        var index = $(this).data('index');
        if(index < byproducts.length-1){
          alert('delete the last item first')
        }else{ byproducts.splice(index, 1);
        $(this).closest('.byproduct-row').remove();
        console.log(byproducts)}
       
      });
      function handleItemTypeChange(event) {
    itemtype = event.target.value;
    console.log('Selected item type:', itemtype);
    // You can call any function here that needs to be updated based on the item type
}

// Adding event listener to the select element
document.getElementById('itemtype').addEventListener('change', handleItemTypeChange);
///// for new ////
var byproducte =[]
function addByProducta() {
     

    var byproductname = document.getElementById('byproductitemA').value
    var byproductpercentage = document.getElementById('byproductpercentageA').value
    if(byproductname&&byproductpercentage){

    var byProduct = {
   name: byproductname,
   percentage: byproductpercentage
};

byproducte.push(byProduct);
var rowIndex = byproducte.length - 1



     var newRowHtml = '<div class="row byproduct-rows"> \
                           <div class="col mb-3">'+byproductname+'\
                            \
                           </div> \
                           <div class="col mb-3"> \
                               '+byproductpercentage+' \
                           </div> \
                           <div class="col mb-3"> \
                               <button type="button" class="btn btn-danger delete-rows" data-index="' + rowIndex + '">Delete</button> \
                           </div> \
                       </div>';

     $("#byproductA").append(newRowHtml);
                     }else{
                       alert('cant add empty columns')
                     }

     
 }
$(document).on('click', '.delete-rows', function () {
    var index = $(this).data('index');

    if(index < byproducte.length-1){
      alert('delete the last item first')
    }else{ 
    byproducte.splice(index, 1);
    $(this).closest('.byproduct-rows').remove();
    }
  });
  function addprod(){

    var productname = document.getElementById("productname").value;
    var itemtype = document.getElementById("itemtypea").value;
    
    var data = {
    product: productname,
    itemtype:itemtype,
    byproduct : byproducte
    };
    
    if(productname){
    
    // Send a POST request to the server using Axios
    axios.post('/addproducts', data)
      .then(response => {
        // Handle the server response here
    
        // Close the modal on successful response
        if (response.data.success) {
        var closeButton = document.getElementById('closeaddproductmodal');
        document.getElementById("productname").value = ''
        document.getElementById("byproducts").innerHTML = '';
        byproducte = []
    // Trigger the click event on the button
    closeButton.click();
    window.location.reload()

        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
    }else{
      alert('Please enter a product name')
    }
    
    
    }

    function deleteproduct() {
        // Show confirmation dialog
        if (confirm("Are you sure you want to delete this product?")) {
            // If user clicks OK, proceed with deletion
            fetch('/deleteproduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                    })
                })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    // Handle error if needed
                });
        } else {
            // If user clicks Cancel, do nothing
            console.log("Deletion canceled by user.");
        }
    }
    