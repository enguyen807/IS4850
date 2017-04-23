var config = {
  apiKey: "AIzaSyBpjiG-b8_7LtiGbcKgZbG5uCKrwU2U6H4",
  authDomain: "blueoceanrestaurant-f8f59.firebaseapp.com",
  databaseURL: "https://blueoceanrestaurant-f8f59.firebaseio.com",
  storageBucket: "blueoceanrestaurant-f8f59.appspot.com",
  messagingSenderId: "590954473444"
};
firebase.initializeApp(config);

(function() {
  // Get Elements
  var config = {
    apiKey: "AIzaSyBpjiG-b8_7LtiGbcKgZbG5uCKrwU2U6H4",
    authDomain: "blueoceanrestaurant-f8f59.firebaseapp.com",
    databaseURL: "https://blueoceanrestaurant-f8f59.firebaseio.com",
    storageBucket: "blueoceanrestaurant-f8f59.appspot.com",
    messagingSenderId: "590954473444"
  };
  firebase.initializeApp(config);


  //Login
  var txtEmail = document.getElementById('login-form-email');
  var txtPassword = document.getElementById('login-form-psw');
  var btnLogin = document.getElementById('btnLogin-modal');

  //Sign Up
  var txxtEmail = document.getElementById('signup-form-accemail');
  var txxtPassword = document.getElementById('signup-form-psw');
  var fName = document.getElementById('signup-form-frstname')
  var LName = document.getElementById('signup-form-lastname')
  var phnNum = document.getElementById("signup-form-phnnum")
  var btnSignUp = document.getElementById('btnSignUp-modal');

  var btnLogout = document.getElementById('btnLogout');
  var btnWelcomeUser = document.getElementById('btnWelcomeUser');

  var navbtnLogin = document.getElementById('nav-btnLogin');
  var navbtnSignUp = document.getElementById('nav-btnSignUp')


  // Add login event
  btnLogin.addEventListener('click', e => {
    // Get email and pass
    var loginEmail = txtEmail.value;
    var loginPass = txtPassword.value;

    var auth = firebase.auth();
    // Sign In
    var promise = auth.signInWithEmailAndPassword(loginEmail, loginPass);
    promise.catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        alert('Wrong Password');
      } else {
        alert(errorMessage);
      }
      console.log(error);

    });



  });

  btnSignUp.addEventListener('click', e => {
    // Get email and pass
    var createAccEmail = txxtEmail.value;
    var createAccPass = txxtPassword.value;
    var auth = firebase.auth();
    // Sign In
    var promise = auth.createUserWithEmailAndPassword(createAccEmail, createAccPass);
    promise
      .catch(e => console.log(e.message));

  });

  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });


  // Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      console.log(firebaseUser);
      btnWelcomeUser.classList.remove('hide');
      navbtnLogin.classList.add('hide');
      navbtnSignUp.classList.add('hide');
      document.getElementById("frontpage-user").innerHTML = firebaseUser.email;
    } else {
      console.log('not logged in');
      btnWelcomeUser.classList.add('hide');
      navbtnLogin.classList.remove('hide');
      navbtnSignUp.classList.remove('hide');

    }
  });




}());


(function() {
  // FirebaseUI config.
  var uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,

    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'

  };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);
}());