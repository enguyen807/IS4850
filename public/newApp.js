//Login
// https://github.com/T00rk/bootstrap-material-datetimepicker
// http://stackoverflow.com/questions/19847412/call-a-function-every-hour
// http://stackoverflow.com/questions/12309019/javascript-how-to-do-something-every-full-hour
// https://www.npmjs.com/package/node-schedule
// http://senthilraj.github.io/TimePicki/features.html
// https://github.com/firebase/functions-samples/blob/master/quickstarts/email-users/functions/index.js#L40-L43
//http://www.codingforums.com/javascript-programming/183335-javascript-program-airline-reservations-system.html
//http://listjs.com/examples/table/
//http://stackoverflow.com/questions/30021133/how-do-you-save-a-date-field-in-firebase-using-angularfire
//https://myreservationsystem.com/
//https://www.reddit.com/r/javascript/comments/5f13xl/items_per_hours/?st=j1ea3smr&sh=57c5ac6c
//https://demos.scotch.io/angular-scheduling/demos/
//https://github.com/timekit-io/booking-js
//https://igorescobar.github.io/jQuery-Mask-Plugin/
// http://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs
// http://stackoverflow.com/questions/26099487/smtp-using-nodemailer-in-nodejs-without-gmail?rq=1
// https://coderwall.com/p/g0la1q/emails-from-node-js-simple-maybe-too-simple
// https://www.npmjs.com/package/fire-mail



var txtEmail = document.getElementById('login-form-email');
var txtPassword = document.getElementById('login-form-psw');
var btnLogin = document.getElementById('btnLogin-modal');
var pswRstEmail = document.getElementById('pswResetEmail');

//Sign Up
var txxtEmail = document.getElementById('signup-form-accemail');
var txxtPassword = document.getElementById('signup-form-psw');
var rePassword = document.getElementById('signup-form-repsw');
var fName = document.getElementById('signup-form-frstname');
var LName = document.getElementById('signup-form-lastname');
var phnNum = document.getElementById('signup-form-phnnum');
var btnSignUp = document.getElementById('btnSignUp-modal');
var myModal = document.getElementById('signUp-modal');
var hideStuff = document.getElementById('userisLoggedIn');

var glyphName = document.getElementById('glyphName');
var glyphEmail = document.getElementById('glyphEmail');
var glyphPhone = document.getElementById('glyphPhone');
var userAccEmail = document.getElementById('userNavName');

  var resvFullName = document.getElementById('onpage-form-resvname');
  var resvEmail = document.getElementById('onpage-form-resvemail');
  var resvPhone = document.getElementById('onpage-form-resvphone');

//Other Buttons
var pswResetbtn = document.getElementById('btnResetPsw');
var btnLogout = document.getElementById('btnLogout');
var btnWelcomeUser = document.getElementById('btnWelcomeUser');
var btnResv = document.getElementById('onpage-form-btnResv');
var navbtnLogin = document.getElementById('nav-btnLogin');
var navbtnSignUp = document.getElementById('nav-btnSignUp')

var uReskey = [];
var gReskey = [];

// Home Page
var database;

function initApp() {
  var config = {
    apiKey: "AIzaSyBpjiG-b8_7LtiGbcKgZbG5uCKrwU2U6H4",
    authDomain: "blueoceanrestaurant-f8f59.firebaseapp.com",
    databaseURL: "https://blueoceanrestaurant-f8f59.firebaseio.com",
    storageBucket: "blueoceanrestaurant-f8f59.appspot.com",
    messagingSenderId: "590954473444"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  firebase.auth().onAuthStateChanged(function(user) {
    this.user = user;

    if (user) {
      var userRef = firebase.database().ref('queues/login').child(user.uid);

      userRef.remove()
        .then(function() {
          return userRef.set({
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            displayName: user.displayName,
            timestamp: new Date().toString()
          });
        });

      console.log('user is signed in');
      console.log(user);
      
      btnWelcomeUser.classList.remove('hide');
      navbtnLogin.classList.add('hide');
      navbtnSignUp.classList.add('hide');
      myModal.classList.add('hide');
      document.getElementById("frontpage-user").innerHTML = '<span> ' + user.email + ' </span>';
      hideStuff.classList.add('hide');
      $(myModal).modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      


    } else {
      // No user is signed in.
      console.log('not logged in');
      myModal.classList.remove('hide');
      btnWelcomeUser.classList.add('hide');
      navbtnLogin.classList.remove('hide');
      navbtnSignUp.classList.remove('hide');
      hideStuff.classList.remove('hide');
      

    }
  });
  
   
  document.getElementById('btnSignUp-modal').addEventListener('click', handleSignUp(), false);
  document.getElementById('onpage-form-btnResv').addEventListener('click', handleReservation(), false);
  document.getElementById('btnLogin-modal').addEventListener('click', toggleSignIn(), false);
  document.getElementById('pswReset').addEventListener('click', sendPasswordReset(), false);
  document.getElementById('btnLogout').addEventListener('click', function() {firebase.auth().signOut()  }, false)
}

function toggleSignIn() {
  if (firebase.auth().currentUser) {


    // [END signout]
  } else {
    btnLogin.addEventListener("click", function() {

      var form = document.getElementById("loginForm");
      var loginEmail = txtEmail.value;
      var loginPass = txtPassword.value;
      if (loginEmail.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (loginPass.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]


      firebase.auth().signInWithEmailAndPassword(loginEmail, loginPass)
        .then(function(user) {
          if (user.emailVerified) {
            console.log('Email is verified');

          } else {
            console.log('Email is not verified');
            firebase.auth().signOut();
            alert('Email is not verified! Please check your inbox.');
            user.sendEmailVerification().then(function() {
              // Email sent.
              console.log('email sent')
            }, function(error) {
              // An error happened.
            });
          }

          

        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else if (errorCode === 'auth/user-not-found') {
            alert('There is no user corresponding to the given email.')
          } else {
            alert(errorMessage);
          }
          console.log(error);

          // [END_EXCLUDE]
        });
      // [END authwithemail]
      form.reset();
    });
  }


}

function handleSignUp() {

  btnSignUp.addEventListener("click", function() {

    var fName = document.getElementById('signup-form-firstname').value;
    var LName = document.getElementById('signup-form-lastname').value;
    var phnNum = document.getElementById("signup-form-phnnum").value;
    var createAccEmail = txxtEmail.value;
    const createAccPass = txxtPassword.value;
    const createRetypePass = rePassword.value;
    var form = document.getElementById("signUpForm");
    var message = document.getElementById('confirmMessage');
    var userAccEmail = document.getElementById('userNavName');
    
if (createAccEmail.length < 4) {
      alert('Please enter an email address.');
      form.reset();
    } else if (createAccPass.length < 6) {
      alert('Password must have more than 6 characters.');
      form.reset()
    } else if (txxtPassword.value != rePassword.value) {
      alert('Passwords must match');
      form.reset()
    } else {
      firebase.auth().createUserWithEmailAndPassword(createAccEmail, createAccPass)
        .then(function(user) {
          this.displayName = user.displayName;
          this.photoURL = user.photoURL;
          firebase.database().ref('accounts/' + user.uid).set ({
            firstname: fName,
            lastname: LName,
            phonenumber: phnNum,
            email: createAccEmail,
            loyalty: 0,
            
          })

//Time + 45m; Time - 45m; 15tables = x resverable; call in 

          user.sendEmailVerification().then(function() {
            // Email sent.
            alert('An email verification email has been sent to you. Please check your inbox.');
            console.log('email sent')
          }, function(error) {
            // An error happened.
          });
    
          firebase.auth().signOut();
          
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            form.reset()
            alert('The password is too weak.');
          } else if (errorCode == 'auth/email-already-in-use') {
            form.reset()
            alert('The email is already in use.');
          } else if (errorCode == 'auth/invalid-email') {
            form.reset()
            alert('Invalid Email.')
          }
          console.log(error);
        });

      form.reset()
    }
  });

}

function sendPasswordReset() {
  
  pswResetbtn.addEventListener("click", function(){
    
 
  var auth = firebase.auth();
  var pswRstEmail = document.getElementById('pswResetEmail').value;
  var formRstPsw = document.getElementById('form-pswReset');
  // [START sendpasswordemail]


  auth.sendPasswordResetEmail(pswRstEmail).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    console.log('Password Reset Email Sent!');
    alert('Password Reset Email Sent!');
    
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
    formRstPsw.reset();
     });
}

function handleReservation() {
  
  btnResv.addEventListener("click", function(){
    
  var resvForm = document.getElementById('onpage-form-resv')
  var resvFullName = document.getElementById('onpage-form-resvname').value;
  var resvEmail = document.getElementById('onpage-form-resvemail').value;
  var resvPhone = document.getElementById('onpage-form-resvphone').value;
  var resvDate = document.getElementById('onpage-form-resvdate').value;
  var resvPtySize = document.getElementById('onpage-form-resvgroup').value;
      
    
    
  var user = firebase.auth().currentUser;
    if (user != null) {
      //user is signed in

      var uResvDataRef = firebase.database().ref('Reservation/user');
     
      var userResv = {
        uid: user.uid,
        Name: resvFullName,
        Email:  resvEmail,
        Phone_Number: resvPhone,
        Reservation_Date: resvDate,
        Number_of_Guests: resvPtySize
        

      };
   var uReskey = uResvDataRef.push(userResv).key;
      
      
      resvForm.reset();
      alert('Your reservation has been made!');
     console.log('Reservation is made.' + uReskey );

    } else{
      //no user is signed in

     
      var gstResvRef = firebase.database().ref('Reservation/guest');
      var gstResv = {
        uid: "guest",
        Name: resvFullName,
        Email: resvEmail,
        Phone_Number: resvPhone,
        Reservation_Date: resvDate,
        Number_of_Guests: resvPtySize

      };
      
      
     var gReskey = gstResvRef.push(gstResv).key;
        
      resvForm.reset();
      alert('Your reservation has been made!');
      console.log('Reservation is made.' + gReskey);
    }

      


  });


}
// jQuery

$.getScript('resvMail.js', function()
{
  
  console.log("in send email ");
  var template_params = {
name: 'John',
reply_email: 'john@doe.com',
message: 'This is awesome!'
};

  emailjs.send("gmail","template_3xUFr7DO",{email: "e",message:"You have to check this out!"})
  //emailjs.send("gmail","template_3xUFr7DO",{name: "james", notes: "Check this out!"});
    // script is now loaded and executed.
    // put your dependent JS here.
});


                   