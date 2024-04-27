document.addEventListener("DOMContentLoaded", function(){
    const messages = [
        `<p>First time playing? Press "Next" to get started</p>` + 
        `<p>Press x to close the tutorial. You can turn it back on in "Settings".</p>`,
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
    notificationMessage.innerHTML = messages[currentMessageIndex];

    const nextBtn = document.getElementById("show");
    const prevBtn = document.getElementById("previous");
    const closeBtn = document.getElementById("close");
    const explainBtn = document.getElementById("explanation");
    const noExplainBtn = document.getElementById("noExplain");

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
        const tutorial = document.getElementById("tutorial");
        const game = document.getElementById("game");
        tutorial.style.visibility = "hidden";
        nextBtn.style.visibility = "hidden";
        prevBtn.style.visibility = "hidden";
        const tutorialHeight = tutorial.offsetHeight;
        game.style.marginTop = `-${tutorialHeight}px`;
    });

    explainBtn.addEventListener("click", function(){
        const explanation = document.getElementById("advance");
        explanation.style.visibility = "visible";
    });

    noExplainBtn.addEventListener("click", function(){
        const explanation = document.getElementById("advance");
        explanation.style.visibility = "hidden";
    });
      

});
