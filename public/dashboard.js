// display modal
function displayBlock() {
  // document.getElementById("form").reset();
  document.getElementById("myModal").style.display = "block";
}

// hide modal
function displayNone() {
  document.getElementById("myModal").style.display = "none";
}

function signOut() {
    window.location.assign("/index.html");
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
      updates['/users/' + email + "/subscription"] = subscriptionData;

      dbRef.update(updates);
      displayValues();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });


}

function getImageLink(service){
  switch(service){
    case "Netflix":
      return "\"images/netflix.png\" width=\"50\" height=\"50\"";
      break;
    case "Spotify":
      return "\"images/spotify.png\" width=\"50\" height=\"50\"";
      break;
    case "YouTube Premium":
      return "\"images/youtube.png\" width=\"50\" height=\"10\"";
      break;
    case "Disney+":
      return "\"images/disney.png\" width=\"50\" height=\"30\"";
      break;
    case "Discord Nitro":
      return "\"images/discord.svg\" width=\"50\" height=\"40\"";
      break;
    case "Zoom":
      return "\"images/zoom.png\" width=\"50\" height=\"50\"";
      break;
    default:
      return "\"images/service.png\" width=\"50\" height=\"50\"";
  }
}

function payService(subscriptionData,e){
  var i = parseInt(e.querySelector('.pos').innerHTML);
  var pay = confirm("Pay P"+subscriptionData[i].price+" to "+subscriptionData[i].service+"?");
  if(pay){
    if(subscriptionData[i].type == "Monthly Subscription"){
      var next_due_date = new Date(subscriptionData[i].due_date);
      next_due_date.setMonth(next_due_date.getMonth()+1);
      subscriptionData[i].due_date = next_due_date.toISOString().slice(0, 10);
    }else{
      var next_due_date = new Date(subscriptionData[i].due_date);
      next_due_date.setFullYear(next_due_date.getFullYear()+1);
      subscriptionData[i].due_date = next_due_date.toISOString().slice(0, 10);
    }


    // update user subscription
    var email = localStorage.getItem("email");
    const dbRef = firebase.database().ref();
    dbRef.child("users").child(email).get().then((snapshot) => {
      if (snapshot.exists()) {
        
        let today = new Date().toISOString().slice(0, 10);
        var activitiesData = snapshot.val().activities;
        if(activitiesData){
          activitiesData.push({
              service: subscriptionData[i].service,
              type: subscriptionData[i].type,
              price: subscriptionData[i].price,
              date: today,
              status: "Completed"
            });
        }else{
          activitiesData = [
            {
              service: subscriptionData[i].service,
              type: subscriptionData[i].type,
              price:subscriptionData[i]. price,
              date: today,
              status: "Completed"
            }
          ]
        }

        var updates = {};
        updates['/users/' + email + "/subscription"] = subscriptionData;
        updates['/users/' + email + "/activities"] = activitiesData;

        dbRef.update(updates);
        displayValues();
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
}


function displayValues(){
  var email = localStorage.getItem("email");
  const dbRef = firebase.database().ref();
  dbRef.child("users").child(email).get().then((snapshot) => {
    if (snapshot.exists()) {
      var subscriptionData = snapshot.val().subscription;
      if(subscriptionData){
        subscriptionData = subscriptionData.sort(function(a,b){
          return new Date(a.due_date) - new Date(b.due_date);
        });
        document.getElementById('table1').innerHTML = "";
        for (var i = subscriptionData.length-1; i >=0; i--) {
          if(i==0){
            document.getElementById('urgent1').style.display = "block";
            document.getElementById('urgent1').innerHTML = "<div class=\"pos\" style=\"display:none\">"+i+"</div><div class=\"flex\"><img src=" +getImageLink(subscriptionData[i].service)+ " class=\"icons\"><div><div class=\"container-text\">"+subscriptionData[i].service+"</div><div class=\"due-date\">Due Date: "+subscriptionData[i].due_date+ "</div></div><div class=\"price\">P"+subscriptionData[i].price+"</div></div>";
            document.getElementById('urgent1').onclick = function(){payService(subscriptionData,this)};
          }else if(i==1){
            document.getElementById('urgent2').style.display = "block";
            document.getElementById('urgent2').innerHTML = "<div class=\"pos\" style=\"display:none\">"+i+"</div><div class=\"flex\"><img src=" +getImageLink(subscriptionData[i].service)+ " class=\"icons\"><div><div class=\"container-text\">"+subscriptionData[i].service+"</div><div class=\"due-date\">Due Date: "+subscriptionData[i].due_date+ "</div></div><div class=\"price\">P"+subscriptionData[i].price+"</div></div>";           
            document.getElementById('urgent2').onclick = function(){payService(subscriptionData,this)};
          }else{
            var row = document.getElementById('table1').insertRow(0);
            row.innerHTML = "<div class=\"pos\" style=\"display:none\">"+i+"</div><tr><td><img src="+getImageLink(subscriptionData[i].service) +"style=\"padding: 10px;\"></td><td>"+subscriptionData[i].service+"<br><br>P"+subscriptionData[i].price+"</td><td>"+subscriptionData[i].due_date+"</td></tr>";
            row.onclick = function(){payService(subscriptionData,this)}
          }
        }
      }

      var activitiesData = snapshot.val().activities;
      if(activitiesData){
        // clear tbody contents
        var table = document.getElementById('activities-table');
        table.innerHTML = "<tr><th>Service</th><th>Type</th><th>Amount</th><th>Date</th><th>Status</th></tr>";
        for (var i = 0; i < activitiesData.length; i++) {
          var row = table.insertRow(1);
          row.innerHTML = "<td>"+activitiesData[i].service+"</td><td>"+activitiesData[i].type+"</td><td>P"+activitiesData[i].price+"</td><td>"+activitiesData[i].date+"</td><td>"+activitiesData[i].status+"</td>"
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
}
