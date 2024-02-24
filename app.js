const signUpForm = document.getElementById("signupform");
const signInForm = document.getElementById("signinform");
var currID;

if (window.location != "./dashboard.html") {
  localStorage.removeItem("signedInUser");
}

// if (
//   window.location == "./dashboard.html" &&
//   !localStorage.getItem("signedInUser")
// ) {
//   window.location == "./signup.html";
// }

if (signUpForm) {
  signUpForm.addEventListener("submit", submitForm);
}
if (signInForm) {
  signInForm.addEventListener("submit", submitForm);
}

function submitForm(event) {
  event.preventDefault();
}

function customSignUpSubmitFunc() {
  const users = JSON.parse(localStorage.getItem("usersLocalStorage")) || [];
  debugger;

  localStorage.removeItem("signedInUser");
  if (users.length > 0) {
    currID = users[users.length - 1].userId + 1;
  } else {
    currID = 1;
  }
  // console.log(currID);
  const nameRegex = /^[a-zA-Z ]{2,30}$/;
  const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const userFirstName = document.getElementById("fname").value;
  const userLastName = document.getElementById("lname").value;
  const userEmail = document.getElementById("email").value;
  const userPassword = document.getElementById("pwd").value;
  const userConfirmedPassword = document.getElementById("cnfpswd").value;
  const userInfo = {
    userId: currID,
    firstName: userFirstName,
    lastName: userLastName,
    email: userEmail,
    password: userPassword,
    confirmedPassword: userConfirmedPassword,
    messageHistory: [],
    lastActivityTime: new Date(),
  };
  if (
    !userFirstName ||
    !userLastName ||
    !userEmail ||
    !userPassword ||
    !userConfirmedPassword
  ) {
    alert("Field Empty");
    return;
  }
  if (!nameRegex.test(userFirstName)) {
    alert("Please enter a valid First name");
    return;
  }
  if (!nameRegex.test(userLastName)) {
    alert("Please enter a valid Last name");
    return;
  }
  if (!emailRegex.test(userEmail)) {
    alert("Please enter a valid email");
    return;
  }
  if (!passwordRegex.test(userPassword)) {
    alert(
      "Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, and 1 number)"
    );
    return;
  }
  if (userPassword != userConfirmedPassword) {
    alert("Passwords Dont Match");
    return;
  }
  for (let x of users) {
    if (userEmail === x.email) {
      alert("User already exists. Please change email id!");
      return;
    }
  }
  users.push(userInfo);
  localStorage.setItem("usersCount", JSON.stringify(users.length));
  localStorage.setItem("usersLocalStorage", JSON.stringify(users));
  window.location = "./signin.html";
  // const vals = document.querySelectorAll(".form-control");
  // for (let x of vals) {
  //   x.value = "";
  // }
}

function customSignInSubmitFunc() {
  const users = JSON.parse(localStorage.getItem("usersLocalStorage")) || [];
  localStorage.removeItem("signedInUser");
  const userEmail = document.getElementById("email-signin").value;
  const userPassword = document.getElementById("pwd-signin").value;
  if (!userEmail || !userPassword) {
    alert("Field Empty");
    return;
  }
  let check = false;
  for (let x of users) {
    if (userEmail === x.email && userPassword === x.password) {
      localStorage.setItem("signedInUser", JSON.stringify(x.userId));
      window.location = "./dashboard.html";
      check = true;
      break;
    }
  }
  for (let x of users) {
    if (userEmail === x.email && userPassword != x.password) {
      alert("Wrong Password for this userId");
      return;
    }
  }
  if (check == false) {
    alert("User does not exist. Please Create a new account.");
    return;
  }
  // const vals = document.querySelectorAll(".form-control");
  // for (let x of vals) {
  //   x.value = "";
  // }
}
