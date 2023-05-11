// How to use these functions in your html:

// 1. Add the following to your html file:
// <!-- Add amazon sdk -->
// <script src="https://rawgit.com/aws/amazon-cognito-identity-js/master/dist/aws-cognito-sdk.min.js"></script>
// <script src="https://rawgit.com/aws/amazon-cognito-identity-js/master/dist/amazon-cognito-identity.min.js"></script>

// 2. Add the following to your html file:
// <script src="./cognito-auth.js"></script>

// 4. Add the following to your login page:
//    Make sure to change the id's of the input fields to match the ones in the code
// <div id="login">
//     <form id="login-form">
//         <input type="text" id="login-username" placeholder="Username" />
//         <input type="password" id="login-password" placeholder="Password" />
//         <input type="submit" value="Login" />
//     </form>
// </div>

// 5. Add the following to your register page:
//    Make sure to change the id's of the input fields to match the ones in the code
// <div id="register">
//     <form id="register-form">
//         <input type="text" id="register-username" placeholder="Username" />
//         <input type="password" id="register-password" placeholder="Password" />
//         <input type="email" id="register-email" placeholder="Email" />
//         <input type="submit" value="Register" />
//     </form>
// </div>

// 6. Add the following to your verify page:
//    Make sure to change the id's of the input fields to match the ones in the code
// <div id="verify">
//     <form id="verify-form">
//         <input type="text" id="verify-code" placeholder="Verification Code" />
//         <input type="submit" value="Verify" />
//     </form>
// </div>

// 7. Add the following to your html file:
//   Make sure to change the id's of the input fields to match the ones in the code
// <div id="logout">
//     <button id="logout">Logout</button>
// </div>

// 8. Add the following to your html file:
// <div id="dashboard">
//     <h1>Dashboard</h1>
// </div>

$(document).ready(function () {
  // Setting Amazon Cognito authentication

  if (typeof AWSCognito !== "undefined") {
    AWSCognito.config.region = "us-east-2";
  }

  var cognitoUser;
  var poolData = {
    UserPoolId: "us-east-2_9MqQXNJpy", // e.g. us-east-2_uXboG5pAb
    ClientId: "9u50ub46c90rlb0jci3868u4b", // Your client id here
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  if (typeof AWSCognito !== "undefined") {
    AWSCognito.config.region = "us-east-2";
  }

  // JQuery function to log in a user with Amazon Cognito
  // User must be redirected to /dashboard after successful login
  $("#login-form").submit(function (event) {
    event.preventDefault();
    var username = $("#login-username").val();
    var password = $("#login-password").val();
    var authenticationData = {
      Username: username,
      Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    var userData = {
      Username: username,
      Pool: userPool,
    };
    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        authToken = result.getIdToken().getJwtToken();
        window.location.href = "/dashboard";
      },
      onFailure: function (err) {
        alert(err);
      },
    });
  });

  // JQuery function to register a user with Amazon Cognito
  // User must be redirected to /verify after successful registration
  $("#register-form").submit(function (event) {
    event.preventDefault();
    var username = $("#register-username").val();
    var password = $("#register-password").val();
    var email = $("#register-email").val();
    var attributeList = [];
    var dataEmail = {
      Name: "email",
      Value: email,
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );
    attributeList.push(attributeEmail);
    userPool.signUp(
      username,
      password,
      attributeList,
      null,
      function (err, result) {
        if (err) {
          alert(err);
          return;
        }
        cognitoUser = result.user;
        window.location.href = "/verify";
      }
    );
  });

  // JQuery function to verify a user with Amazon Cognito
  // User must be redirected to /signin after successful verification
  $("#verify-form").submit(function (event) {
    event.preventDefault();
    var verificationCode = $("#verify-code").val();
    cognitoUser.confirmRegistration(
      verificationCode,
      true,
      function (err, result) {
        if (err) {
          alert(err);
          return;
        }
        window.location.href = "/signin";
      }
    );
  });

  // JQuery function to log out a user with Amazon Cognito
  // User must be redirected to / after successful logout
  $("#logout").click(function (event) {
    event.preventDefault();
    if (cognitoUser != null) {
      cognitoUser.signOut();
      window.location.href = "/";
    }
  });
});
