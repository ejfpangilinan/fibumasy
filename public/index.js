function SignUp() {
    window.location.assign("/Login.html");
}

const decrypt = (data) => {
	return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

function LogIn() {
	// obtain user input of name and password
	var email = document.getElementById("email").value;
	var password = document.getElementById("password").value;

	if(email != ""){
		// check if email is in database
		var db_email = email.split('.').join(',');
		const dbRef = firebase.database().ref();
		firebase.database().ref("users/"+db_email).get().then((snapshot) => {
			if (snapshot.exists()) {
			// check if password is correct
				if(decrypt(snapshot.val().Password) == password){
					// store email to be used on dashboard
					localStorage.setItem("email", db_email);
					window.location.assign("./dashboard.html");
				}else{
					alert('wrong password!')
				}
			}else{
				alert("No data available. Please SIGN UP!");
			}
		}).catch((error) => {
			console.error(error);
		});
	}
}