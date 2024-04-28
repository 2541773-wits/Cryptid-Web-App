async function list() {
    const endpoint = '/data-api/rest/User';
    const response = await fetch(endpoint);
    const data = await response.json();
    return(data.value);
  }

    
    //console.log("inside login-registration.js")

   async function findUser(username, password) {
        const userLogin = await list();
        //console.table(userLogin);
        const foundUser = userLogin.find(user => 
          (user.username === username && user.password === password) || 
          (user.email === username && user.password === password)
        );
        //console.log("INSIDE FIND USER")
        //console.table(foundUser);
        return foundUser;
    }

  function closeSlide(){
    let popup = document.getElementById("popup");
    popup.classList.remove('open-slide');
    if(document.getElementById("result").style.visibility === "visible"){
        document.getElementById("result").innerHTML = "";
        document.getElementById("result").style.visibility = "hidden";
    }
  }

  function closeSlideUserNotFound(){
    let popup = document.getElementById("popupUserNotFound");
    popup.classList.remove('open-slide');
    if(document.getElementById("result").style.visibility === "visible"){
        document.getElementById("result").innerHTML = "";
        document.getElementById("result").style.visibility = "hidden";
    }
  }

  function login_validation(){
    let popup = document.getElementById("popup");
    let popupUserNotFound = document.getElementById("popupUserNotFound");
    //console.log(document.form1.Username.value);
    //console.log(document.form1.Password.value);
  
    findUser(document.form1.Username.value, document.form1.Password.value)
      .then(foundUser => {
        if (foundUser === undefined) {
            //console.log("USER NOT FOUND");
            popupUserNotFound.classList.add("open-slide");
          } else {
            //console.table(foundUser);
            popup.classList.add("open-slide");
          }
      })
      .catch(error => {
        console.error("Error while finding user:", error);
      });
  
    return false;
  }
