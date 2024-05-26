class game{
    constructor(numPlayers,clues,hint){
        this.numPlayers = numPlayers;
        this.currPlayer = 0;
        this.playerDiscs = Array.from({ length: this.numPlayers }, () => new Set()); // To track player discs on the board
        this.playerCubes = Array.from({ length: this.numPlayers }, () => new Set()); // To track player discs on the board
        this.clues = clues;
        this.hint = hint;
    }

    //Get the number of players
    getNumPlayers(){
        return this.numPlayers
    }

    //Get the current player
    getCurrPlayer(){
        return this.currPlayer;
    }

    //Move to next player
    nextPlayer(){
        if (this.currPlayer<this.numPlayers-1){
            this.currPlayer++;
        }
        else{
            this.currPlayer = 0;
        }
    }//nextPlayer()

    //Change the current player
    changePlayer(player){
        this.currPlayer = player;
    }//changePlayer(player)
   
}

class boardInfo {
    constructor(gameInstance,recordInstance){
        this.gameInstance = gameInstance;
        this.recordInstance = recordInstance;
    }

    //Listen for option button clicks (Ask/Searchs)
    optionBtnListener() {
        const btnIds = ["btnAsk", "btnSearch"];
        return new Promise((resolve, reject) => {
            btnIds.forEach((btnId) => {
                const btn = document.getElementById(btnId);
                const clickHandler = async () => {
                    try {
                        let result;
                        if (btnId === "btnAsk") {
                            result = false; 
                            await this.askQuestion();
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
    
    //Listen for player selection to ask a question
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
    
    //Listen for yes/no button clicks
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

    //Ask a question
    async askQuestion() {
        //Hide buttons
        document.getElementById("btnAsk").style.display = 'none';
        document.getElementById("btnSearch").style.display = 'none';

        //Update instructions
        const info = document.getElementById("instructions");
        info.innerHTML = "Choose a tile";
        let clickedDivId = await this.tileListener();
        
        //Place pawn on the selected tile
        this.placePawn(clickedDivId);
        info.innerHTML ="Choose a player to ask";
        document.getElementById("getSelectedValueBtn").style.display = 'block';
        this.populateSelect();
        const selectElement = document.getElementById('numberSelect');
        selectElement.style.display='inline';

        try{
            //Get the current player and player to ask
            const currentPlayer = this.gameInstance.getCurrPlayer();
            const player = await this.getPlayerToAsk();
            //Record the move
            this.recordInstance.recordMove(this.gameInstance.getCurrPlayer(),"Asked player "+player,clickedDivId);
            //Change to other player
            this.gameInstance.changePlayer(player-1);
            this.nextClue(this.gameInstance.getCurrPlayer());
            selectElement.style.display='none';
            document.getElementById("getSelectedValueBtn").style.display = 'none';

            //Update instructions
            info.innerHTML = "Can the monster be here according to your clue? Choose below."
            document.getElementById("btnYes").style.display = 'block';
            document.getElementById("btnNo").style.display = 'block';
            
            const clickedButtonId = await this.yesNoButtonListener();
            document.getElementById("btnYes").style.display = 'none';
            document.getElementById("btnNo").style.display = 'none';
            
            if(clickedButtonId==="btnYes"){
                //Record move and change player
                this.recordInstance.recordMove(this.gameInstance.getCurrPlayer(),"Answered yes",clickedDivId);
                document.getElementById(clickedDivId).childNodes[0].src ="img/disc.png";
                this.gameInstance.changePlayer(currentPlayer);
            }
            else{
                //Record move, change player, and place cube
                this.recordInstance.recordMove(this.gameInstance.getCurrPlayer(),"Answered no",clickedDivId);
                this.gameInstance.changePlayer(currentPlayer);
                document.getElementById(clickedDivId).childNodes[0].src ="img/disc.png";
                this.nextClue(this.gameInstance.getCurrPlayer());

                info.innerHTML = "Player " + (this.gameInstance.getCurrPlayer()+1) + " please place a cube."
                clickedDivId = await this.tileListener();
                this.placeCube(this.gameInstance.getCurrPlayer(),clickedDivId);
                this.recordInstance.recordMove(this.gameInstance.getCurrPlayer(),"Placed a cube",clickedDivId);
            }

        }
        catch(error){
            console.error("Error:", error);
        }
        // Resolve the Promise after asking the question
        return Promise.resolve();
    }

    //Listen for tile clicks
    tileListener() {
        return new Promise((resolve, reject) => {
            const divContainer = document.getElementById("container");
    
            const clickHandler = (event) => {
                const clickedDivId = event.target.id;
                if (clickedDivId) {
                    divContainer.removeEventListener("click", clickHandler);
                    resolve(clickedDivId); // Resolve the Promise with the ID of the clicked div
                } else {
                    reject("No div ID found."); // Reject the Promise if no ID is found
                }
            };
    
            // Attach the event listener to the container
            divContainer.addEventListener("click", clickHandler);
        });
    }
    
    //Handle initial clicks to place cubes
    async handleInitialClicks() {
        const info = document.getElementById("instructions");
        const divContainer = document.getElementById("container");
        for (let k=0; k<(this.gameInstance.getNumPlayers()*2); k++) {
            try {
                info.innerHTML="Please place your cube player " + (this.gameInstance.getCurrPlayer()+1);
                this.nextClue(this.gameInstance.getCurrPlayer());
                const clickedDivId = await this.tileListener();
                this.recordInstance.recordMove(this.gameInstance.getCurrPlayer(),"Initial cube",clickedDivId);
                let div = document.getElementById(clickedDivId);

                if (div.querySelector('img')===null){
                    this.placeCube(this.gameInstance.getCurrPlayer(),clickedDivId);
                }
                
                //change accordion content
                this.gameInstance.nextPlayer();
                divContainer.removeEventListener("click", this.tileListener);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        this.nextClue(this.gameInstance.getCurrPlayer());
    }

    //Show next player's clue
    nextClue(player){
        const accordionHeader = document.querySelector('.accordion-header');
        const accordionContent = document.querySelector('.accordion-content');
        accordionHeader.innerHTML = "Player " + (player+1);
        accordionContent.innerHTML = this.gameInstance.clues[player];
        accordionContent.style.display = 'none';
    }

    //Who can be asked a question
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

    //Handle events when a search is declared
    async handleSearchClicks() {
        const originalSearcher = this.gameInstance.getCurrPlayer();
        let allYes = true;
    
        document.getElementById("btnAsk").style.display = 'none';
        document.getElementById("btnSearch").style.display = 'none';
    
        const info = document.getElementById("instructions");
        info.innerHTML = "Choose a tile for your search";
    
        try {
            let searchSpace = await this.tileListener();
            this.recordInstance.recordMove(originalSearcher, "Chose to search", searchSpace);
            this.placePawn(searchSpace);
    
            // Move to the next player and provide the next clue
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
                        this.recordInstance.recordMove(currentPlayer, "Answered yes to search", searchSpace);
                        document.getElementById(searchSpace).childNodes[0].src = "img/disc.png";
                        this.placeDisc(currentPlayer, searchSpace);
                    } else if (clickedButtonId === "btnNo") {
                        this.recordInstance.recordMove(currentPlayer, "Answered no to search", searchSpace);
                        allYes = false;
                        document.getElementById(searchSpace).childNodes[0].src = "img/cube.png";
                        this.placeCube(currentPlayer, searchSpace);
                        this.gameInstance.changePlayer(originalSearcher);
                        break;
                    } else {
                        console.log("Player passes their turn");
                    }
    
                    this.gameInstance.nextPlayer();
                } catch (error) {
                    console.error("Error during player response:", error);
                    break;
                }
            } //while

        } catch (error) {
            console.error("Error during tile selection:", error);
        }
    
        this.nextClue(this.gameInstance.getCurrPlayer());
    
        return allYes;
    }
        
    placeDisc(player,space){
        this.gameInstance.playerDiscs[player].add(space);
        const hex = document.getElementById(space);
    
        if (hex.querySelector('img')===null){
            let disc = document.createElement('img');
            disc.src = "img/disc.png"
            hex.appendChild(disc);
        }
            
    }

    placeCube(player,space){
            this.gameInstance.playerCubes[player].add(space);
            const hex = document.getElementById(space);
            if (hex.querySelector('img')===null){
                let cube = document.createElement('img');
                cube.src = "img/cube.png"
                hex.appendChild(cube);
            }
    }

    placePawn(space){
        const hex = document.getElementById(space);
            if (hex.querySelector('img')===null){
                let cube = document.createElement('img');
                cube.src = "img/star.png"
                hex.appendChild(cube);
            }
    }
}

//Run the actual game
async function runGame(numPlayers,clues,hint){
    const gameRecord = new GameRecord();
    const currGame = new game(numPlayers,clues,hint);
    const board = new boardInfo(currGame,gameRecord);
    
    let over = false;
    const info = document.getElementById("instructions");
    await board.handleInitialClicks();

    while(!over){
        document.getElementById("btnAsk").style.display = 'block';
        document.getElementById("btnSearch").style.display = 'block';

        info.innerHTML = "Would you like to ask a question or search?"
        const result = await board.optionBtnListener();
        if (result){
            info.innerHTML = "Player " + (currGame.getCurrPlayer()+1) + " is the winner!";
            over=true;
        }
        else{
            currGame.nextPlayer();
            board.nextClue(currGame.getCurrPlayer());
        }
    };//while
    
    gameRecord.saveJSON(gameRecord.toJSON(),"GameRecord");
}

class PlayerMove {
    constructor(player, action, location) {
        this.player = player;
        this.action = action;
        this.location = location;
    }
}

class GameRecord {
    constructor() {
        this.moves = [];
    }

    recordMove(player, action, location) {
        const move = new PlayerMove(player, action, location);
        this.moves.push(move);
    }

    toJSON() {
        return JSON.stringify(this.moves);
    }

    saveJSON(jsonData,filename){
        // Create a Blob from the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });

        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a link element
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;

        // Append the link to the document body and trigger a click event to start the download
        document.body.appendChild(a);
        a.click();

        // Clean up by removing the link and revoking the URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

module.exports = {
    game: game,
    boardInfo: boardInfo,
    PlayerMove: boardInfo,
    GameRecord: GameRecord,
};