
function registration_validation(username, email, password, confirmPassword) {
    let emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    

    if (username.length < 3) {
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "Username should be at least 3 characters";
        return false;
    }
    else if (!emailFormat.test(email)) {
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "Email is invalid!";
        return false;
    }
    else if (password.length < 8) {
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "Password needs to be at least 8 characters";
        return false;
    }
    else if (password !== confirmPassword) {
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "Password does not match";
        return false;
    }

    else if(password === confirmPassword){
        create(username,password,false,email);
        popup.classList.add("open-slide");
        return true;
    }
}

function closeSlide(){
    // let popup = document.getElementById("popup");
    popup.classList.remove('open-slide');
    if(document.getElementById("result").style.visibility === "visible"){
        document.getElementById("result").innerHTML = "";
        document.getElementById("result").style.visibility = "hidden";
    }
}

function validateRegistration() {
    const username = document.forms["form1"]["Username"].value;
    const email = document.forms["form1"]["Email"].value;
    const password = document.forms["form1"]["Password"].value;
    const confirmPassword = document.forms["form1"]["cPassword"].value;

    let popup = document.getElementById("popup");

    // Call registration_validation with form values
    const isValid = registration_validation(username, email, password, confirmPassword);

    if(!isValid){
        return false;
    }
    // If validation fails, prevent form submission
    return true;
}


async function create(userN,pWord,isA,em) {

    const data = {
      username: userN,
      password: pWord,
      is_admin: isA,
      email: em
    };
  
    const endpoint = `/data-api/rest/User/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
    //console.table(result.value);
  }


module.exports = {
    registration_validation: registration_validation,
    create: create,
};


