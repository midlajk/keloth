function addrefferance(){

    var referance = document.getElementById("referance").value;
    console.log(referance)
    var data = {
    newRouteName: reference
  };
  var data = {
      newRouteName: referance
    };

    // Send a POST request to the server using Axios
    axios.post('/addreference', data)
      .then(response => {
        // Handle the server response here
        console.log(response.data);

        // Close the modal on successful response
        if (response.data.success) {
        var closeButton = document.getElementById('closeReferenceModalBtn');

// Trigger the click event on the button
closeButton.click();
        }
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
  

  }
