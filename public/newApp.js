//Login

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
var footerSignIn = document.getElementById('footer-signIn');
var footerSignOut = document.getElementById('footer-signUp');


//Other Buttons
var pswResetbtn = document.getElementById('btnResetPsw');
var btnLogout = document.getElementById('btnLogout');
var btnWelcomeUser = document.getElementById('btnWelcomeUser');
var btnResv = document.getElementById('onpage-form-btnResv');
var navbtnLogin = document.getElementById('nav-btnLogin');
var navbtnSignUp = document.getElementById('nav-btnSignUp');

var footSignIn = document.getElementById('footer-signIn');
var footSingUp = document.getElementById('footer-signUp');
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
			var admin = "6wVc5ilWqNcC2XHIKXWkTp5t55w1";
			var userRef = firebase.database().ref('queues/login').child(user.uid);
			var UAref = firebase.database().ref("accounts/" + user.uid)

			UAref.once("value")
				.then(function(snapshot) {
					var a = snapshot.val().firstname;
					var b = snapshot.val().lastname;
					var c = snapshot.val().email;
					var d = snapshot.val().loyalty;
					var e = snapshot.val().phonenumber;
					document.getElementById('onpage-form-resvfirstname').value = a;
					document.getElementById('onpage-form-resvlastname').value = b;
					document.getElementById('onpage-form-resvemail').value = c;
					document.getElementById('onpage-form-resvphone').value = e;

				})

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

			if (user.uid == admin) {
				console.log("is an admin")
				document.getElementById("btnAccManage").href = "adminAcc.html";

			} else {
				console.log("not an admin")
			}

			btnWelcomeUser.classList.remove('hide');
			navbtnLogin.classList.add('hide');
			navbtnSignUp.classList.add('hide');
			myModal.classList.add('hide');
			document.getElementById("frontpage-user").innerHTML = '<span> ' + user.email + ' </span>';
            footerSignIn.classList.add('hide');
            footerSignOut.classList.add('hide');
			$(myModal).modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();

			hideStuff.classList.add('hide');
		} else {
			// No user is signed in.
            
            footerSignIn.classList.remove('hide');
            footerSignOut.classList.remove('hide');
			console.log('not logged in');
			myModal.classList.remove('hide');
			btnWelcomeUser.classList.add('hide');
			navbtnLogin.classList.remove('hide');
			navbtnSignUp.classList.remove('hide');

			hideStuff.classList.remove('hide');


		}
	});


	document.getElementById('btnSignUp-modal').addEventListener('click', handleSignUp(), false);
	document.getElementById('btnLogin-modal').addEventListener('click', toggleSignIn(), false);
	document.getElementById('pswReset').addEventListener('click', sendPasswordReset(), false);
	document.getElementById('resvCancellation').addEventListener('click', CancelReservation(), false);
	document.getElementById('btnLogout').addEventListener('click', function() {
		firebase.auth().signOut();
		location.reload()
	}, false)
}

function toggleSignIn() {
	if (firebase.auth().currentUser) {
		// 		btnLogout.addEventListener('click', function() {
		// 			firebase.auth().signOut();
		// 			window.location = 'index.html';

		// 		})

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
						alert('Email is not verified! Please check your inbox.');

						firebase.auth().signOut().then(function() {
							console.log('Signed Out');
						}, function(error) {
							console.error('Sign Out Error', error);
						});
						user.sendEmailVerification().then(function() {
							// Email sent.
							console.log('email sent');
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
		var txxtEmail = document.getElementById('signup-form-accemail').value;
		var txxtPassword = document.getElementById('signup-form-psw').value;
		var rePassword = document.getElementById('signup-form-repsw').value;
		var form = document.getElementById("signUpForm");
		var message = document.getElementById('confirmMessage');
		var userAccEmail = document.getElementById('userNavName');
		var termBox = document.getElementById("termcheckbox");
		
		if (fName == " ") {
			alert("Please enter a first name.");
			fName.focus();
			return false;
			
		}	else if (LName == " ") {
			alert("Please enter a last name.");
			LName.focus();
			return false;
			
		}	else if (phnNum == " ") {
			alert("Please enter a phone number.");
			phnNum.focus();
			return false;
			
		} else if (txxtEmail.length < 4 || txxtEmail == " ") {
			alert('Please enter an email address.');
			txxtEmail.focus();
			return false;
			
		} else if (txxtPassword.length < 6) {
			alert('Password must have more than 6 characters.');
			
		} else if (termBox.checked == false) {
			alert('You must agree to the terms first.');
    	return false;
			
		}else if (txxtPassword.value != rePassword.value) {
			alert('Passwords must match');
			
		} else {
			firebase.auth().createUserWithEmailAndPassword(txxtEmail, txxtPassword)
				.then(function(user) {
					this.displayName = user.displayName;
					this.photoURL = user.photoURL;
					firebase.database().ref('accounts/' + user.uid).set({
							firstname: fName,
							lastname: LName,
							phonenumber: phnNum,
							email: txxtEmail,
							loyalty: 0,

						})
						.then(function() {
							user.sendEmailVerification().then(function() {
								// Email sent.
								firebase.auth().signOut();
								if (!alert('An email verification email has been sent to you. Please check your inbox.')) {
									window.location.reload();
								}
							}, function(error) {
								// An error happened.
							});
						})
				}).catch(function(error) {
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

	pswResetbtn.addEventListener("click", function() {


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

function CancelReservation() {
	var cancelReservation = document.getElementById('btnCancelresv');

	cancelReservation.addEventListener('click', function() {
		//Grab value from input
		var resvDateID = document.getElementById('resvCancelDate').value;
		var resvConfirmID = document.getElementById('resvCancelID').value;
		// Time In Unix
		var dateObject = moment(resvDateID).unix();
		//console.log("UNIX: " + dateObject);

		var curr = moment.unix(dateObject).format("DD MMM YYYY hh:mm a");
		var dateNohour = moment.unix(dateObject).format("DD MMMM YYYY");
		//Parse out pieces of date in to sections
		var hh = moment.unix(dateObject).format("LT");
		var yyyy = moment.unix(dateObject).format("YYYY");
		var mmmm = moment.unix(dateObject).format("MMMM");
		var dddd = moment.unix(dateObject).format("DD");
		//Convert dateObject to a string 
		var date2String = moment(dateNohour).toString();
		var countRef = firebase.database().ref("ReservationDates").child(date2String).child("Count");

		//Set Range for first time slot 1050am - 1150am Includes time 11, 1115, 1130, 1145
		var srtInterval1 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 10,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval1 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 11,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 1150am - 1250pm Includes time 12, 1215, 1230, 1245
		var srtInterval2 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 11,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval2 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 12,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 1250pm - 150pm Includes time 1, 115, 130, 145
		var srtInterval3 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 12,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval3 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 13,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 150pm - 250pm		Includes time 2, 215, 230, 245
		var srtInterval4 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 13,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval4 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 14,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 250pm - 350pm		Includes time 3, 315, 330, 345
		var srtInterval5 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 14,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval5 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 15,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 350pm - 450pm		Includes time 4, 415, 430, 445		
		var srtInterval6 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 15,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval6 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 16,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 450pm - 550pm		Includes time 5, 515, 530, 545
		var srtInterval7 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 16,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval7 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 17,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 550pm - 650pm		Includes time 6, 615, 630, 645
		var srtInterval8 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 17,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval8 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 18,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 650pm - 750pm		Includes time 7, 715, 730, 745
		var srtInterval9 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 18,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval9 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 19,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Set Range for first time slot 750pm - 850pm		Includes time 8, 815, 830, 845
		var srtInterval10 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 19,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");
		var endInterval10 = moment().set({
			'year': yyyy,
			'month': mmmm,
			'date': dddd,
			'hour': 20,
			'minute': 50
		}).format("DD MMM YYYY hh:mm a");

		//Create reference to database 
		var resvCancelref = firebase.database().ref('ReservationDates/').child(date2String).child(resvConfirmID);
		resvCancelref.once("value")
			.then(function(snapshot) {
				var a = snapshot.hasChildren();

				if (a === true) {
					console.log(a)
					resvCancelref.once('value')
						.then(function(snapshot) {
							var id = snapshot.child("id").val();
							console.log(id)
							//Guest Cancellation 
							var ResvgInfo = firebase.database().ref('Reservation/guest/' + id)
							ResvgInfo.once("value")
								.then(function(snapshot) {
									//Check to see if the Reservation Data exists
									var a = snapshot.exists();
									if (a !== null) {
										var ResvDate = snapshot.val().Reservation_Date;
										if (ResvDate !== null) {
											
											if (moment(ResvDate).isBetween(srtInterval1, endInterval1)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().FirstHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		FirstHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})

											} else if (moment(ResvDate).isBetween(srtInterval2, endInterval2)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().SecondHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		SecondHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval3, endInterval3)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().ThirdHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		ThirdHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval4, endInterval4)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().FourthHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		FourthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval5, endInterval5)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().FifthHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		FifthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval6, endInterval6)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().SixthHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		SixthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval7, endInterval7)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().SeventhHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		SeventhHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval8, endInterval8)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().EighthHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		EighthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval9, endInterval9)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().NinethHour);
														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		NinethHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval10, endInterval10)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().TenthHour);

														ResvgInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		TenthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											}
										} else {
											console.log("Error1")
										}
									} else {
										console.log("a")
									}
								})
								//User Cancellation
							var ResvuInfo = firebase.database().ref('Reservation/user/' + id)
							ResvuInfo.once("value")
								.then(function(snapshot) {
									var b = snapshot.exists();

									if (b !== null) {
										var ResvDate = snapshot.val().Reservation_Date;
										console.log(ResvDate)
										if (ResvDate !== null) {

											if (moment(ResvDate).isBetween(srtInterval1, endInterval1)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().FirstHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		FirstHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval2, endInterval2)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().SecondHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		SecondHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval3, endInterval3)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().ThirdHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		ThirdHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval4, endInterval4)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().FourthHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		FourthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval5, endInterval5)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().FifthHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		FifthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval6, endInterval6)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().SixthHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		SixthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval7, endInterval7)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().SeventhHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		SeventhHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval8, endInterval8)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().EighthHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		EighthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval9, endInterval9)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().NinethHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		NinethHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											} else if (moment(ResvDate).isBetween(srtInterval10, endInterval10)) {
												countRef.once('value')
													.then(function(snapshot) {
														var a = parseInt(snapshot.val().TenthHour);
														ResvuInfo.remove()
															.then(function() {
																a++;
																countRef.update({
																		TenthHour: a
																	})
																	.then(function() {
																		resvCancelref.remove();
																		alert("Your Reservation has been cancelled.")
																	})
															})
													})
											}
										} else {
											console.log("Error B")
										}
									} else {
										console.log("b")
									}
								})
						})
				} else {
					console.log("Reservation does not exist.")
					$('#stuff-modal').modal('show');
					
				}
			})
	})
}

function handleReservation() {

	var resvForm = document.getElementById('onpage-form-resv')
				var resvfirstName = document.getElementById('onpage-form-resvfirstname').value;
				var resvlastName = document.getElementById('onpage-form-resvlastname').value;
				var resvFullName = (resvfirstName + resvlastName);
	var resvEmail = document.getElementById('onpage-form-resvemail').value;
	var resvPhone = document.getElementById('onpage-form-resvphone').value;
	var resvDate = document.getElementById('onpage-form-resvdate').value;
	var resvPtySize = document.getElementById('onpage-form-resvgroup').value;
    var spcRequest = document.getElementById('resv-modal-comment').value;
    var termBox = document.getElementById("termcheckbox");
	// Time In Unix
	var dateObject = moment(resvDate).unix();
	console.log("UNIX: " + dateObject);

	var curr = moment.unix(dateObject).format("DD MMM YYYY hh:mm a");
	var dateNohour = moment.unix(dateObject).format("DD MMMM YYYY");
	//Parse out pieces of date in to sections
	var hh = moment.unix(dateObject).format("LT");
	var yyyy = moment.unix(dateObject).format("YYYY");
	var mmmm = moment.unix(dateObject).format("MMMM");
	var dddd = moment.unix(dateObject).format("DD");
	//Convert dateObject to a string 
	var date2String = moment(dateNohour).toString();
	// 	console.log("Chosen Time: " + curr);

	//Set Range for first time slot 1050am - 1150am Includes time 11, 1115, 1130, 1145
	var srtInterval1 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 10,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval1 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 11,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 1150am - 1250pm Includes time 12, 1215, 1230, 1245
	var srtInterval2 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 11,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval2 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 12,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 1250pm - 150pm Includes time 1, 115, 130, 145
	var srtInterval3 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 12,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval3 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 13,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 150pm - 250pm		Includes time 2, 215, 230, 245
	var srtInterval4 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 13,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval4 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 14,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 250pm - 350pm		Includes time 3, 315, 330, 345
	var srtInterval5 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 14,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval5 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 15,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 350pm - 450pm		Includes time 4, 415, 430, 445		
	var srtInterval6 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 15,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval6 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 16,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 450pm - 550pm		Includes time 5, 515, 530, 545
	var srtInterval7 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 16,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval7 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 17,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 550pm - 650pm		Includes time 6, 615, 630, 645
	var srtInterval8 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 17,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval8 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 18,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 650pm - 750pm		Includes time 7, 715, 730, 745
	var srtInterval9 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 18,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval9 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 19,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Set Range for first time slot 750pm - 850pm		Includes time 8, 815, 830, 845
	var srtInterval10 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 19,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");
	var endInterval10 = moment().set({
		'year': yyyy,
		'month': mmmm,
		'date': dddd,
		'hour': 20,
		'minute': 50
	}).format("DD MMM YYYY hh:mm a");

	//Reference the path
	var countRef = firebase.database().ref("ReservationDates").child(date2String).child("Count");
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	var user = firebase.auth().currentUser;

	if (user != null) {
		//user is signed in
		//Reference paths and store in variables for ease
		var uResvDataRef = firebase.database().ref('Reservation/user');
		var reservations = firebase.database().ref('ReservationDates/' + date2String);
		var rev = firebase.database().ref("ReservationDates/" + date2String);
		var reservationx = reservations;

		//Reservation Info 
		var userResv = {
			uid: user.uid,
			Name: resvFullName,
			Email: resvEmail,
			Phone_Number: resvPhone,
			Reservation_Date: resvDate,
			Number_of_Guests: resvPtySize
		};

		//Counter variables
		var rsCounter = {
				FirstHour: 4,
				SecondHour: 4,
				ThirdHour: 4,
				FourthHour: 4,
				FifthHour: 4,
				SixthHour: 4,
				SeventhHour: 4,
				EighthHour: 4,
				NinethHour: 4,
				TenthHour: 4,
			}
			//Form Validation
		if (resvFullName == " ") {
			alert("Please enter a name.");
			resvFullName.focus();
			return false;
		}
        
        if (termBox.checked == false) {
			alert('You must agree to the terms first.');
            termBox.focus();
    	   return false;
		}
        
		if (resvPhone == " ") {
			alert("Please enter a phone number.");
			resvPhone.focus();
			return false;
		}
		if (resvEmail == " " || !re.test(resvEmail)) {
			alert("Please enter your email address.");
			resvEmail.focus();
			return false;
		}
		if (resvDate == " ") {
			alert("Please pick a date and time.")
			resvDate.focus();
			return false;
		} else {

			if (moment(curr).isBetween(srtInterval1, endInterval1)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
								id: uReskey,
								Time: hh,
							}

							//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}

							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {

										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var a = parseInt(snapshot.val().FirstHour);
									if (a > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
											id: uReskey,
											Time: hh,
										}

										//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;

										a--;
										countRef.update({
											FirstHour: a
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}


										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {

													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})

									} else {
										if (!alert("We are very sorry but the time slot has been filled up.")) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval2, endInterval2)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var b = parseInt(snapshot.val().SecondHour);
									if (b > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										b--;
										countRef.update({
											SecondHour: b
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval3, endInterval3)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var c = parseInt(snapshot.val().ThirdHour);
									if (c > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										c--;
										countRef.update({
											ThirdHour: c
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})

									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval4, endInterval4)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var d = parseInt(snapshot.val().FourthHour);
									if (d > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										d--;
										countRef.update({
											FourthHour: d
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval5, endInterval5)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var e = parseInt(snapshot.val().FifthHour);
									if (e > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										e--;
										countRef.update({
											FifthHour: e
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {

										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval6, endInterval6)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var f = parseInt(snapshot.val().SixthHour);
									if (f > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										f--;
										countRef.update({
											SixthHour: f
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval7, endInterval7)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var g = parseInt(snapshot.val().SeventhHour);
									if (g > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										g--;
										countRef.update({
											SeventhHour: g
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval8, endInterval8)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var h = parseInt(snapshot.val().EighthHour);
									if (h > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										h--;
										countRef.update({
											EighthHour: h
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval9, endInterval9)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var i = parseInt(snapshot.val().NinethHour);
									if (i > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										i--;
										countRef.update({
											NinethHour: i
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval10, endInterval10)) {
				rev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationx.child('Count').update(rsCounter);
							//Push reservation info to database		
							var uReskey = uResvDataRef.push(userResv).key;
							var rsDate = {
									id: uReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = reservations.push(rsDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var j = parseInt(snapshot.val().TenthHour);
									if (j > 0) {
										//Push reservation info to database		
										var uReskey = uResvDataRef.push(userResv).key;
										var rsDate = {
												id: uReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = reservations.push(rsDate).key;
										j--;
										countRef.update({
											TenthHour: j
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											
										}
									}
								})
						}
					})
			}
			resvForm.reset();


		}

	} else {
		//no user is signed in
		//Reference paths and store in variables for ease 
		var gstResvRef = firebase.database().ref('Reservation/guest');
		var guestReservation = firebase.database().ref('ReservationDates/' + date2String);
		var Grev = firebase.database().ref("ReservationDates/" + date2String);
		var reservationy = guestReservation;
		var gstResv = {
				uid: "guest",
				Name: resvFullName,
				Email: resvEmail,
				Phone_Number: resvPhone,
				Reservation_Date: resvDate,
				Number_of_Guests: resvPtySize
			}
			//Time hh:mm


		//Counter variables
		var rsCounters = {
			FirstHour: 5,
			SecondHour: 5,
			ThirdHour: 5,
			FourthHour: 5,
			FifthHour: 5,
			SixthHour: 5,
			SeventhHour: 5,
			EighthHour: 5,
			NinethHour: 5,
			TenthHour: 5,
		}

		//Form Validation
		if (resvFullName == " ") {
			alert("Please enter a name.");
			resvFullName.focus();
			return false;
		}
		if (resvPhone == " ") {
			alert("Please enter a phone number.");
			resvPhone.focus();
			return false;
		}
		if (resvEmail == " " || !re.test(resvEmail)) {
			alert("Please enter your email address.");
			resvEmail.focus();
			return false;
		}
		if (resvDate == " ") {
			alert("Please pick a date and time.")
			resvDate.focus();
			return false;
		} else {


			if (moment(curr).isBetween(srtInterval1, endInterval1)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
								id: gReskey,
								Time: hh,
							}

							//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var a = parseInt(snapshot.val().FirstHour);
									if (a > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										a--;
										countRef.update({
											FirstHour: a
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										alert("We are very sorry but the time slot has been filled up.");
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval2, endInterval2)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var b = parseInt(snapshot.val().SecondHour);
									if (b > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										b--;
										countRef.update({
											SecondHour: b
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval3, endInterval3)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var c = parseInt(snapshot.val().ThirdHour);
									if (c > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										c--;
										countRef.update({
											ThirdHour: c
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval4, endInterval4)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var d = parseInt(snapshot.val().FourthHour);
									if (d > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										d--;
										countRef.update({
											FourthHour: d
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval5, endInterval5)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var e = parseInt(snapshot.val().FifthHour);
									if (e > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										e--;
										countRef.update({
											FifthHour: e
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval6, endInterval6)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var f = parseInt(snapshot.val().SixthHour);
									if (f > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										f--;
										countRef.update({
											SixthHour: f
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval7, endInterval7)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var g = parseInt(snapshot.val().SeventhHour);
									if (g > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										g--;
										countRef.update({
											SeventhHour: g
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval8, endInterval8)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var h = parseInt(snapshot.val().EighthHour);
									if (h > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										h--;
										countRef.update({
											EighthHour: h
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval9, endInterval9)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var i = parseInt(snapshot.val().NinethHour);
									if (i > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										i--;
										countRef.update({
											NinethHour: i
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			} else if (moment(curr).isBetween(srtInterval10, endInterval10)) {
				Grev.once("value")
					.then(function(snapshot) {
						//Check to see if counter already exists under the selected time and pushes one if one doesn't exist
						var z = snapshot.child("Count").hasChildren()
						if (z === false) {
							//Pushes reservation counter
							var pushCount = reservationy.child('Count').update(rsCounters);
							//Push reservation info to database		
							var gReskey = gstResvRef.push(gstResv).key;
							var rssDate = {
									id: gReskey,
									Time: hh,
								}
								//Push Reservation time to store under specific time	
							var pushDate = guestReservation.push(rssDate).key;
							var template_params = {
								resvFullName: resvFullName,
								resvEmail: resvEmail,
								resvPtySize: resvPtySize,
								resvDate: resvDate,
								uReskey: pushDate,
							}
							emailjs.send("gmail", "reservation_confirmation", template_params)
								.then(function(response) {
										console.log("SUCCESS", response);
										if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
											window.location.reload();
										}
									},
									function(error) {
										console.log("FAILED", error);
									})
						} else {
							//Counter already exists for that date 
							countRef.once('value')
								.then(function(snapshot) {
									var j = parseInt(snapshot.val().TenthHour);
									if (j > 0) {
										//Push reservation info to database		
										var gReskey = gstResvRef.push(gstResv).key;
										var rssDate = {
												id: gReskey,
												Time: hh,
											}
											//Push Reservation time to store under specific time	
										var pushDate = guestReservation.push(rssDate).key;
										j--;
										countRef.update({
											TenthHour: j
										})
										var template_params = {
											resvFullName: resvFullName,
											resvEmail: resvEmail,
											resvPtySize: resvPtySize,
											resvDate: resvDate,
											uReskey: pushDate,
										}
										emailjs.send("gmail", "reservation_confirmation", template_params)
											.then(function(response) {
													console.log("SUCCESS", response);
													if (!alert('Your reservation has been made! A confirmation email has been sent to you!')) {
														window.location.reload();
													}
												},
												function(error) {
													console.log("FAILED", error);
												})
									} else {
										if (!alert('We are very sorry but the time slot has been filled up.')) {
											window.location.reload();
										}
									}
								})
						}
					})
			}
			resvForm.reset();
		}
	}
}