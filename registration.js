import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

 const firebaseConfig = {
   apiKey: "AIzaSyDQ3jIzcDONPa7oN1gFpRsLJ0wHEZcj7LA",
   authDomain: "login-31be4.firebaseapp.com",
   projectId: "login-31be4",
   storageBucket: "login-31be4.appspot.com",
   messagingSenderId: "850573309078",
   appId: "1:850573309078:web:64580de5de08dc21963eb7"
 };


 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 auth.languageCode = 'en';
 const provider = new GoogleAuthProvider();

 const googleLogin = document.getElementById("google-login-btn");

 googleLogin.addEventListener("click",function(){
   signInWithPopup(auth, provider)
 .then((result) => {
   const user = result.user;
   console.log(user);
   window.location.href ="../Loggedin.html";
 }).catch((error) => {
   const errorCode = error.code;
   const errorMessage = error.message;
   
 });
 })

 