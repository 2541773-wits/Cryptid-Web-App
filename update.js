import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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

 const googleLogout = document.getElementById("google-signout-btn");
 googleLogout.addEventListener("click",function(){
    signOut(auth).then(() => {
        alert("User has successfully signed out");
        window.location.href = 'index.html';
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  })

 const user = auth.currentUser;

 function updateUserProfile(user){
   const userName = user.displayName;
   const userEmail = user.email;
   const userProfilePicture = user.photoURL;

   document.getElementById("userName").textContent = userName;
   document.getElementById("userEmail").textContent = userEmail;
   document.getElementById("userProfilePicture").src = userProfilePicture;
 }
 onAuthStateChanged(auth, (user)=>{
   if(user){
       updateUserProfile(user);
       const uid = user.uid;
        return uid;
    }else{
        console.log("Create Account and Login");
    }
 })
 

