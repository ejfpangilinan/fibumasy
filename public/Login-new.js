
function newRedirect(newURL){
    // window.location.assign(newURL)
}

function onSignIn(googleUser) {
}




function sayHello() {
    console.log('Hello')
    let form = $("#sign-up").serializeArray()
    console.log(form);
    let name =  form[0].value
    let email =  form[1].value
    let password = form[2].value

    var db_email = email.split('.').join(',');
    const dbRef = firebase.database().ref();

    firebase.database().ref('/users/'+db_email).set({
        name: name,
        password : password
    });
}
