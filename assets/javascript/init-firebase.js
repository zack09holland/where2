// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
    //apiKey: "",
    //authDomain: "",
    //databaseURL: "",
    //projectId: "",
    //storageBucket: "",
    //messagingSenderId: "",
    //appId: ""
    apiKey: "AIzaSyBNpstskQf4JklIHw__h70G8JBi_ZvCSZc",
    authDomain: "where2-hollyw00d.firebaseapp.com",
    databaseURL: "https://where2-hollyw00d.firebaseio.com",
    projectId: "where2-hollyw00d",
    storageBucket: "",
    messagingSenderId: "714594318842",
    appId: "1:714594318842:web:502c8665f14c0695"
};
  
// Initialize Firebase
var defaultApplication = firebase.initializeApp(firebaseConfig);

/// Javascript Code Below
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'assets/html/landing.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
    console.log("User Authenticated")
  } else {
    // User is signed out.
    // ...
    console.log("User NOT Authenticated")
  }
});
