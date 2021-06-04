
//encrypt/decrypt fxn
const encrypt = (text) => {
	return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

const decrypt = (data) => {
	return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};
//global
let IS_AGREE = 0;

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
				if(decrypt(snapshot.val().password) == password){
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

function isTerms() {
	let checkbox = $("#terms");

	checkbox.change(function(event) {
		var checkbox = event.target;
		if (checkbox.checked) {
			IS_AGREE = 1;
		} else {
			IS_AGREE = 0;
		}
	});
}


function SignUp() {
    let form = $("#sign-up").serializeArray()
    console.log(form);
    let name =  form[0].value       // get the val of name
    let email =  form[1].value      // get val of email
    let password = form[2].value    // get val of password

    var query = firebase.database().ref("users");
    var cleanEmailKey =  email.split('.').join(',');


    //check if it is already in database using email
    var ref = firebase.database().ref("users");
    ref.once("value")
    .then(function(snapshot) {
        var hasAccount = snapshot.hasChild(cleanEmailKey); // check if account is already available
        if(hasAccount){
			console.log('You already have an account! Try Again Using different email')
            alert('You already have an account! Try Again Using different email')
        }else{
			if(!IS_AGREE) {
				alert('Please check \'I agree to the Terms and Conditions\'')
			}else{
				if(name!="" || email!="" || password!="" ){
					alert('Please fill up the required spaces')
				}else{
					console.log('saving to database')
					firebase.database().ref('/users/'+cleanEmailKey).set({ //save to database
						name: name,
						email : email,
						password : encrypt(password)
					}).then(alert('SUCCESS!'))
					console.log('saved to database')
				}
			}
        }
    });
}
