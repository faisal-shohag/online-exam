

/**
 * @return {!Object} The FirebaseUI config.
 */
 function getUiConfig() {
    return {
      'callbacks': {
        // Called when the user has been successfully signed in.
        'signInSuccessWithAuthResult': function(authResult, redirectUrl) {
          if (authResult.user) {
            handleSignedInUser(authResult.user);
          }
          if(authResult.additionalUserInfo.isNewUser){
              let data = {
                  uid : authResult.user.uid,
                  name: authResult.user.displayName,
                  email: authResult.user.email,
                  photoURL: authResult.user.photoURL,
                  phone: {
                      number: "000-000",
                      status: true
                  },
                  scores: {
                    total: 0, bn: 0,en:0,bio: 0,mt:0,ph:0,ch:0,eco:0,ci:0,is:0,totalScore: 0, totalWrong:0, totalEmpt: 0, totalCorrect: 0
                  },
                  exams: {
                    total: 0, model:0,weekly:0,daily:0
                  },
                  examList: "",
                  details: false,
                  msg: "",
                  notifications: "",
                  createPermission: false,
                  create: {
                    history: {
                      status: false,
                    }
                  }

              }
              db.ref("app/users/"+authResult.user.uid).update(data);
              //console.log(authResult.additionalUserInfo);


          }
          if (authResult.additionalUserInfo) {
           $('#is-new-user').textContent =
                authResult.additionalUserInfo.isNewUser ?
                'New User' : 'Existing User';
          }
          // Do not redirect.
          return false;
        }
      },
      // Opens IDP Providers sign-in flow in a popup.
      'signInFlow': 'redirect',
      'signInOptions': [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable ID token credentials for this provider.
          clientId: CLIENT_ID
        },
      ],
      'tosUrl': '#',
      // Privacy policy url.
      'privacyPolicyUrl': 'https://www.google.com',
      'credentialHelper': CLIENT_ID && CLIENT_ID != 'YOUR_OAUTH_CLIENT_ID' ?
          firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
          firebaseui.auth.CredentialHelper.NONE,
      'adminRestrictedOperation': {
        status: getAdminRestrictedOperationStatus()
      }
    };
  }
  
  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.disableAutoSignIn();
  
  
  /**
   * @return {string} The URL of the FirebaseUI standalone widget.
   */
  function getWidgetUrl() {
    return '/widget#recaptcha=' + getRecaptchaMode() + '&emailSignInMethod=' +
        getEmailSignInMethod() + '&disableEmailSignUpStatus=' +
        getDisableSignUpStatus() + '&adminRestrictedOperationStatus=' +
        getAdminRestrictedOperationStatus();
  }

  
  
  /**
   * Displays the UI for a signed in user.
   * @param {!firebase.User} user
   */
  var handleSignedInUser = function(user) {
   $('#user-signed-in').show();
   $('#user-signed-out').hide();
   $('#name').textContent = user.displayName;
   $('#email').textContent = user.email;
   $('#phone').textContent = user.phoneNumber;
    if (user.photoURL) {
      var photoURL = user.photoURL;
     // console.log(photoURL);
    //   if ((photoURL.indexOf('googleusercontent.com') != -1) ||
    //       (photoURL.indexOf('ggpht.com') != -1)) {
    //     photoURL = photoURL + '?sz=' +
    //        $('#photo').clientHeight;
    //   }
     $('#photo').src = photoURL;
     $('#photo').show();
    } else {
     $('#photo').hide();
    }
  };
  
  
  /**
   * Displays the UI for a signed out user.
   */
  var handleSignedOutUser = function() {
   $('#user-signed-in').hide();
   $('#user-signed-out').show();
    ui.start('#firebaseui-container', getUiConfig());
  };
  
  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.
  firebase.auth().onAuthStateChanged(function(user) {
   $('#loading').hide();
   $('#loaded').show();
    user ? handleSignedInUser(user) : handleSignedOutUser();
  });
  
  /**
   * Deletes the user's account.
   */
  var deleteAccount = function() {
    firebase.auth().currentUser.delete().catch(function(error) {
      if (error.code == 'auth/requires-recent-login') {
        // The user's credential is too old. She needs to sign in again.
        firebase.auth().signOut().then(function() {
          // The timeout allows the message to be displayed after the UI has
          // changed to the signed out state.
          setTimeout(function() {
            alert('Please sign in again to delete your account.');
          }, 1);
        });
      }
    });
  };
  
  
  /**
   * Handles when the user changes the reCAPTCHA, email signInMethod or email
   * disableSignUp config.
   */
  function handleConfigChange() {
    // Reset the inline widget so the config changes are reflected.
    ui.reset();
    ui.start('#firebaseui-container', getUiConfig());
  }
  
  
  /**
   * Initializes the app.
   */
  var initApp = function() {
   $('#sign-out').click(function() {
      firebase.auth().signOut();
    });
   $('#delete-account').click(function() {
          deleteAccount();
        });
  
   
  };
  
  window.addEventListener('load', initApp);