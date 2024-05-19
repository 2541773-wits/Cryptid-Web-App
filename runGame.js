// script.js
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeader = document.querySelector('.accordion-header');
    const accordionContent = document.querySelector('.accordion-content');

    accordionHeader.addEventListener('click', () => {
        // Toggle the display of the content section
        accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById("btnAsk").style.display = 'none';
    document.getElementById("btnSearch").style.display = 'none';
    document.getElementById("btnYes").style.display = 'none';
    document.getElementById("btnNo").style.display = 'none';
    document.getElementById("getSelectedValueBtn").style.display = 'none';
    
});


class game{
    constructor(numPlayers){
        this.numPlayers = numPlayers;
        this.currPlayer = 0;
        this.prevPlayer=0;
        this.playerDiscs = Array.from({ length: this.numPlayers }, () => new Set()); // To track player discs on the board
        this.playerCubes = Array.from({ length: this.numPlayers }, () => new Set()); // To track player discs on the board
    }

    getNumPlayers(){
        return this.numPlayers
    }

    getCurrPlayer(){
        return this.currPlayer;
    }

    nextPlayer(){
        this.prevPlayer = this.currPlayer;
        if (this.currPlayer<this.numPlayers-1){
            this.currPlayer++;
        }
        else{
            this.currPlayer = 0;
        }
    }//nextPlayer()


    changePlayer(player){
        this.prevPlayer = this.currPlayer;
        this.currPlayer = player-1;
    }//changePlayer(player)

    goToCurrPlayer(){
        this.currPlayer = this.prevPlayer;
        if (this.currPlayer===0){
            this.prevPlayer = this.numPlayers - 1;
        }
        else{
            this.prevPlayer = this.currPlayer-1;
        }
    }

    

    
}

class boardInfo {
    constructor(gameInstance){
        this.gameInstance = gameInstance;
    }

    optionBtnListener() {
        const btnIds = ["btnAsk", "btnSearch"];
        return new Promise((resolve, reject) => {
            btnIds.forEach((btnId) => {
                const btn = document.getElementById(btnId);
                const clickHandler = async () => {
                    try {
                        let result;
                        if (btnId === "btnAsk") {
                            result = await this.askQuestion();
                        } else if (btnId === "btnSearch") {
                            result = await this.handleSearchClicks();
                        }
                        // Remove event listener after btn is clicked
                        btn.removeEventListener("click", clickHandler);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                };
                btn.addEventListener("click", clickHandler);
            });
        });
    }
    
    
    getPlayerToAsk() {
        return new Promise((resolve, reject) => {
            const getSelectedValueBtn = document.getElementById('getSelectedValueBtn'); // Define getSelectedValueBtn first
            const clickHandler = () => {
                const selectElement = document.getElementById('numberSelect');
                const selectedValue = selectElement.value;
                getSelectedValueBtn.removeEventListener('click', clickHandler);
                resolve(selectedValue); // Resolve the Promise with the selected value
            };
    
            getSelectedValueBtn.addEventListener('click', clickHandler);
        });
    }
    
    yesNoButtonListener() {
        const buttonIds = ["btnYes","btnNo"];
        return new Promise((resolve) => {
            const clickHandler = (event) => {
                const clickedButtonId = event.target.id;
                buttonIds.forEach(id => document.getElementById(id).removeEventListener('click', clickHandler));
                resolve(clickedButtonId);
            };

            buttonIds.forEach(id => {
                const button = document.getElementById(id);
                button.addEventListener('click', clickHandler);
            });
        });
    }

    async askQuestion() {
        document.getElementById("btnAsk").style.display = 'none';
        document.getElementById("btnSearch").style.display = 'none';

        const info = document.getElementById("instructions");
        
        info.innerHTML = "Choose a tile";
        let clickedDivId = await this.tileListener();
        info.innerHTML ="Choose a player to ask";
        document.getElementById("getSelectedValueBtn").style.display = 'block';
        this.populateSelect();
        const selectElement = document.getElementById('numberSelect');
        selectElement.style.display='inline';

        try{
            const player = await this.getPlayerToAsk();
            this.gameInstance.changePlayer(player);
            this.nextClue(this.gameInstance.getCurrPlayer());
            selectElement.style.display='none';
            document.getElementById("getSelectedValueBtn").style.display = 'none';
            info.innerHTML = "Can the monster be here according to your clue? Choose below."
            document.getElementById("btnYes").style.display = 'block';
            document.getElementById("btnNo").style.display = 'block';
            const clickedButtonId = await this.yesNoButtonListener();
            document.getElementById("btnYes").style.display = 'none';
            document.getElementById("btnNo").style.display = 'none';
            if(clickedButtonId==="btnYes"){
                //put disc on board
                this.gameInstance.goToCurrPlayer();
            }
            else{
                //put cube on board
                this.gameInstance.goToCurrPlayer();
                this.nextClue(this.gameInstance.getCurrPlayer());

                info.innerHTML = "Player " + (this.gameInstance.getCurrPlayer()+1) + " please place a cube."
                clickedDivId = await this.tileListener();
                //place cube
            }

        }
        catch(error){
            console.error("Error:", error);
        }
        


        
        // Resolve the Promise after asking the question
        return Promise.resolve();
    }


    tileListener() {
        return new Promise((resolve, reject) => {
            const divContainer = document.getElementById("divContainer");
            const clickHandler = (event) => {
                const clickedDivId = event.target.id;
                if (clickedDivId) {
                    resolve(clickedDivId); // Resolve the Promise with the ID of the clicked div
                    // Remove the event listener after the first click
                    divContainer.removeEventListener("click", clickHandler);
                } else {
                    reject("No div ID found."); // Reject the Promise if no ID is found
                }
            };
            divContainer.addEventListener("click", clickHandler);
        });
    }

    async handleInitialClicks() {
        const info = document.getElementById("instructions");
        for (let k=0; k<this.gameInstance.getNumPlayers()*2; k++) {
            try {
                info.innerHTML="Please place your cube player " + (this.gameInstance.getCurrPlayer()+1);
                this.nextClue(this.gameInstance.getCurrPlayer());
                const clickedDivId = await this.tileListener();
                this.placeCube(this.gameInstance.getCurrPlayer(),clickedDivId);
                //change accordion content
                console.log("Clicked on div with ID:", clickedDivId);
                this.gameInstance.nextPlayer();
            } catch (error) {
                console.error("Error:", error);
            }
        }
        this.nextClue(this.gameInstance.getCurrPlayer());
        console.log(this.gameInstance.playerCubes);
    }

    nextClue(player){
        const accordionHeader = document.querySelector('.accordion-header');
        const accordionContent = document.querySelector('.accordion-content');
        accordionHeader.innerHTML = "Player " + (player+1);
        accordionContent.style.display = 'none';
    }


    populateSelect(){
        const selectElement = document.getElementById('numberSelect');

        //clear exisitng options
        while (selectElement.firstChild) {
            selectElement.removeChild(selectElement.firstChild);
        };

        const numbers = Array.from({ length: this.gameInstance.getNumPlayers() }, (_, index) => index + 1) // Generate array of numbers
                            .filter(number => number !== (this.gameInstance.getCurrPlayer()+1)); // Exclude the specified number
    
        numbers.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });
    }

    canPlaceDisc(player,space){
        return !this.gameInstance.playerDiscs[player].has(space);
    }

    async handleSearchClicks() {
        const originalSearcher = this.gameInstance.getCurrPlayer();
        let allYes = true;  // Variable to track if all buttons clicked were "yes"
    
        document.getElementById("btnAsk").style.display = 'none';
        document.getElementById("btnSearch").style.display = 'none';
    
        // Place pawn and declare search
        const info = document.getElementById("instructions");
        info.innerHTML = "Choose a tile for your search";
        let searchSpace = await this.tileListener();
    
        // Ensure placement of player's own disc
        this.placeDisc(originalSearcher, searchSpace);
    
        // Move to the next player
        this.gameInstance.nextPlayer();
        this.nextClue(this.gameInstance.getCurrPlayer());
    
        while (originalSearcher !== this.gameInstance.getCurrPlayer()) {
            info.innerHTML = "Can the monster be here according to your clue?";
            const currentPlayer = this.gameInstance.getCurrPlayer();
            try {
                this.nextClue(currentPlayer);
    
                document.getElementById("btnYes").style.display = 'block';
                document.getElementById("btnNo").style.display = 'block';
    
                const clickedButtonId = await this.yesNoButtonListener();
                console.log("Clicked on button with ID:", clickedButtonId);
    
                document.getElementById("btnYes").style.display = 'none';
                document.getElementById("btnNo").style.display = 'none';
    
                if (clickedButtonId === "btnYes") {
                    if (this.canPlaceDisc(currentPlayer, searchSpace)) {
                        this.placeDisc(currentPlayer, searchSpace);
                    }
                } else if (clickedButtonId === "btnNo") {
                    allYes = false;
                    this.placeCube(currentPlayer, searchSpace);
                    break;
                } else {
                    console.log("Player passes their turn");
                }
    
                this.gameInstance.nextPlayer();
                console.log(this.gameInstance.getCurrPlayer());
            } catch (error) {
                console.error("Error:", error);
                break;
            }
        }
    
        // If a player placed a cube, ensure the next player after the original searcher is set
        if (!allYes) {
            // Move to the player immediately after the original searcher
            do {
                this.gameInstance.nextPlayer();
            } while (this.gameInstance.getCurrPlayer() !== originalSearcher);
            //this.gameInstance.nextPlayer();
        }
    
        // Ensure the final clue is given to the current player after the loop
        this.nextClue(this.gameInstance.getCurrPlayer());
    
        return allYes;  // Return the result
    }
    

    placeDisc(player,space){
        this.gameInstance.playerDiscs[player].add(space);
        //add disc to board
    }

    placeCube(player,space){
        this.gameInstance.playerCubes[player].add(space);
        //add cube to board
    }
    
}



async function runGame(){
    const currGame = new game(4);
    const board = new boardInfo(currGame);
    let over = false;
    document.getElementById('numberSelect').style.display='none';
    const info = document.getElementById("instructions");
    await board.handleInitialClicks();

    while(!over){
        document.getElementById("btnAsk").style.display = 'block';
        document.getElementById("btnSearch").style.display = 'block';

        info.innerHTML = "Would you like to ask a question or search?"
        const result = await board.optionBtnListener();
        if (result){
            info.innerHTML = "Winner!"
            console.log("winner")
            over=true;
        }
        else{
            currGame.nextPlayer();
            board.nextClue(currGame.getCurrPlayer());
            console.log("continue");
        }
        console.log("over!")
        //over = true;
        //document.getElementById("btnAsk").style.display = 'none';
       // document.getElementById("btnSearch").style.display = 'none';
    };//while
    console.log("end");
}
runGame();

