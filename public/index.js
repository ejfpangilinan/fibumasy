function SignUp() {
    window.location.assign("/Login.html");
}

function LogIn() {
    // obtain user input of name and password
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    console.log(email + " " + password);

    if(email != ""){
        // check if email is in database
        var db_email = email.split('.').join(',');
        const dbRef = firebase.database().ref();
        dbRef.child("users").child(db_email).get().then((snapshot) => {
          if (snapshot.exists()) {
            // check if password is correct
            if(snapshot.val().password == password){
                // store email to be used on dashboard
                localStorage.setItem("email", db_email);
                window.location.assign("/dashboard.html");
            }
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
    }
}