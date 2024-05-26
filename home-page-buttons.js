document.addEventListener("DOMContentLoaded", function(){
    const messages = [
        `First time playing? Press "Next" to get started` + 
        `Press x to close the tutorial. You can turn it back on in "Settings".`,
        "<p>Cryptid is a deduction boardgame for 3-5 players, which uses this site to generate scenarios and show clues to the players.</p>" +
        "<p>First thing, if you haven't already, have someone read the rules.</p>" + 
        "<p>Next, have each player take one of the bags of coloured pieces.</p>",
        "<p>Below you can see a box asking for number of players, and whether you want to use Advanced Mode.</p>"+
        `<p>Select how many people will be playing in the "Number of Players" dropdown.</p>`+
        "<p>Advanced Mode means you can get more complicated clues, and makes the game more challenging. For your first couple of games, leave this off. You can find more details about Advanced Mode in the rulebook, or by clicking the question mark</p>"+
        `<p>To start playing, press the "Start New Game" button.</p>`
    ];
    let currentMessageIndex = 0;
    const notificationMessage = document.getElementById("text-content");
    notificationMessage.textContent = messages[currentMessageIndex];

    const nextBtn = document.getElementById("show");
    const prevBtn = document.getElementById("previous");
    const closeBtn = document.getElementById("close");
    const explainBtn = document.getElementById("explanation");
    const noExplainBtn = document.getElementById("noExplain");
    const tutorialCheckbox = document.getElementById("showTut");

    const tutorial = document.getElementById("tutorial");
    const game = document.getElementById("game");
    let tutorialOffsetHeight = tutorial.offsetHeight;
    const gameOffsetHeight = game.offsetHeight;

    nextBtn.addEventListener("click", function() {
        currentMessageIndex++;
        notificationMessage.innerHTML = messages[currentMessageIndex];
        if(currentMessageIndex === 1){
            prevBtn.style.visibility = "visible";
        }
        if(currentMessageIndex === messages.length - 1){
            nextBtn.style.visibility = "hidden";

        }
    });

    prevBtn.addEventListener("click", function() {
        currentMessageIndex--;
        notificationMessage.innerHTML = messages[currentMessageIndex];
        if(currentMessageIndex === 0){
            prevBtn.style.visibility = "hidden";
        }
        if(currentMessageIndex === 1){
            nextBtn.style.visibility = "visible";
        }
    });

    closeBtn.addEventListener("click", function() {
        hideTut();
        tutorialCheckbox.checked = false;
        // const tutorialHeight = tutorial.offsetHeight;
    });

    explainBtn.addEventListener("click", function(){
        const explanation = document.getElementById("advance");
        explanation.style.visibility = "visible";
    });

    noExplainBtn.addEventListener("click", function(){
        const explanation = document.getElementById("advance");
        explanation.style.visibility = "hidden";
    });

    function showTut(){
        tutorial.style.visibility = "visible";
        nextBtn.style.visibility = "visible";
        prevBtn.style.visibility = "visible";
        game.style.marginTop = `0px`;
    }

    function hideTut(){
        tutorial.style.visibility = "hidden";
        nextBtn.style.visibility = "hidden";
        prevBtn.style.visibility = "hidden";
        tutorialOffsetHeight = tutorial.offsetHeight;
        game.style.marginTop = `-${tutorialOffsetHeight}px`;
        tutorialCheckbox.checked = false;
        localStorage.setItem('checkboxChecked', false);
    }


    tutorialCheckbox.addEventListener("change", function() {
        if(tutorialCheckbox.checked === true){
            showTut();
        }
        else if(tutorialCheckbox.checked === false){
            hideTut();
        }
    });

    const startBtn = document.getElementById("start");
    startBtn.addEventListener("click", () => {
        let selectElement = document.getElementById("num-plyers");
        let numPlayers = selectElement.options[selectElement.selectedIndex].value;
        let switchElement = document.getElementById("switch");
        let advanced = switchElement.checked;
        sessionStorage.setItem("advanced", advanced);
        sessionStorage.setItem("numPlayers", numPlayers);
        window.location.href = "game1.html";
    })




      

});
