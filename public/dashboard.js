// display modal
function displayBlock() {
  // document.getElementById("form").reset();
  document.getElementById("myModal").style.display = "block";
}

// hide modal
function displayNone() {
  document.getElementById("myModal").style.display = "none";
}

function getService() {
  var service = document.querySelector('input[name="service"]:checked');
  if(service){
    if(service.value=="other"){
        var other_service = document.getElementById('other-text').value;
        if(other_service==""){
          alert("Service name should not be empty");
          return "";
        }
        
        return other_service;
    }
    return service.value;
  }else{
    alert("Please select a service");
    return "";
  }
}

function getServiceType() {
  var type = document.querySelector('input[name="type"]:checked');
  if(type){
    return type.value;
  }else{
    alert("Please select a type of service");
    return "";
  }
}

function addSubscription(){
  displayNone();
  var service = getService();
  if(service=="") return;
  var type = getServiceType();
  if(type=="") return;
  var price = document.getElementById('price-text').value;
  if(price==""){
    alert("Please add a price");
    return;
  }
  var date = document.getElementById('payment-date').value;
  if(date==""){
    alert("Please select due date");
    return;
  }

  var email = localStorage.getItem("email");
  const dbRef = firebase.database().ref();
  dbRef.child("users").child(email).get().then((snapshot) => {
    if (snapshot.exists()) {
      var subscriptionData = snapshot.val().subscription;
      if(subscriptionData){
        subscriptionData.push({
            service: service,
            type: type,
            price: price,
            due_date: date
          });
      }else{
        subscriptionData = [
          {
            service: service,
            type: type,
            price: price,
            due_date: date
          }
        ]
      }
      var updates = {};
      updates['/users/' + email + "/subscription"] = subscriptionData;

      dbRef.update(updates);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function displayValues(){
  var email = localStorage.getItem("email");
  const dbRef = firebase.database().ref();
  dbRef.child("users").child(email).get().then((snapshot) => {
    if (snapshot.exists()) {
      var subscriptionData = snapshot.val().subscription;
      if(subscriptionData){
        let today = new Date();
        for (var i = subscriptionData.length - 1; i >= 0; i--) {
          var date = subscriptionData[i].due_date.split("-");
          console.log(date);
        }
      }
      
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}


function onLoad(){
  // Get the modal
  var modal = document.getElementById("myModal");

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  displayValues();

  var email = localStorage.getItem("email");
  
  const dbRef = firebase.database().ref();
  dbRef.child("users").child(email).get().then((snapshot) => {
    if (snapshot.exists()) {
        // set greeting
        document.getElementById("greeting1").innerHTML = "Hello, "+snapshot.val().name+"!";
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

  var row = document.getElementById('activities-table').insertRow(1);
  let today = new Date().toISOString().slice(0, 10);
  row.innerHTML = "<td>Netflix</td><td>Monthly Subscription</td><td>P149</td><td>"+today+"</td><td>Completed</td>"
}
