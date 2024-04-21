function registration_validation(){
    let emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let popup = document.getElementById("popup");

    if(document.form1.Username.value.length < 3){
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "Username should be at least 3 characters";
        return false;
    }
    else if(!emailFormat.test(document.form1.Email.value)){
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "Email is invalid!";
        return false;
    }
    else if(document.form1.Password.value.length < 8){
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "Password needs to be at least 8 characters";
        return false;
    }
    else if(document.form1.Password.value !== document.form1.cPassword.value){
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "Password does not match";
        return false;
    }
    else if(document.form1.Password.value === document.form1.cPassword.value){
        popup.classList.add("open-slide");
        return false;
    }
}

function closeSlide(){
    let popup = document.getElementById("popup");
    popup.classList.remove('open-slide');
    if(document.getElementById("result").style.visibility === "visible"){
        document.getElementById("result").innerHTML = "";
        document.getElementById("result").style.visibility = "hidden";
    }
}

