const { game, boardInfo, GameRecord } = require('./runGame.js'); // Adjust this path if necessary

describe('game class', () => {
    let testGame;

    beforeEach(() => {
        testGame = new game(3, ["Clue 1", "Clue 2", "Clue 3"], "Hint");
    });

    test('should get number of players', () => {
        expect(testGame.getNumPlayers()).toBe(3);
    });

    test('should get current player', () => {
        expect(testGame.getCurrPlayer()).toBe(0);
    });

    test('should move to the next player', () => {
        testGame.nextPlayer();
        expect(testGame.getCurrPlayer()).toBe(1);
        testGame.nextPlayer();
        expect(testGame.getCurrPlayer()).toBe(2);
        testGame.nextPlayer();
        expect(testGame.getCurrPlayer()).toBe(0);
    });

    test('should change the current player', () => {
        testGame.changePlayer(2);
        expect(testGame.getCurrPlayer()).toBe(2);
    });
});

describe('boardInfo class', () => {
    let testGame;
    let testRecord;
    let testBoard;

    beforeEach(() => {
        testGame = new game(3, ["Clue 1", "Clue 2", "Clue 3"], "Hint");
        testRecord = new GameRecord();
        testBoard = new boardInfo(testGame, testRecord);
        document.body.innerHTML = `
            <div id="container"></div>
            <div id="instructions"></div>
            <button id="btnAsk"></button>
            <button id="btnSearch"></button>
            <button id="btnYes"></button>
            <button id="btnNo"></button>
            <button id="getSelectedValueBtn"></button>
            <select id="numberSelect"></select>
        `;
    });


    test('should listen for player selection', async () => {
        const select = document.getElementById('numberSelect');
        const btn = document.getElementById('getSelectedValueBtn');

        select.innerHTML = '<option value="1">1</option><option value="2">2</option>';
        select.value = "2";
        
        setTimeout(() => btn.dispatchEvent(new Event('click')), 100);
        const result = await testBoard.getPlayerToAsk();
        expect(result).toBe("2");
    });

    test('should listen for yes/no button clicks', async () => {
        const btnYes = document.getElementById('btnYes');
        const btnNo = document.getElementById('btnNo');

        setTimeout(() => btnYes.dispatchEvent(new Event('click')), 100);
        const result = await testBoard.yesNoButtonListener();
        expect(result).toBe("btnYes");

        setTimeout(() => btnNo.dispatchEvent(new Event('click')), 100);
        const result2 = await testBoard.yesNoButtonListener();
        expect(result2).toBe("btnNo");
    });

    test('should place a disc on the board', () => {
        document.body.innerHTML += '<div id="testTile"></div>';
        testBoard.placeDisc(0, 'testTile');
        const tile = document.getElementById('testTile');
        expect(tile.querySelector('img').src).toContain('disc.png');
    });

    test('should place a cube on the board', () => {
        document.body.innerHTML += '<div id="testTile"></div>';
        testBoard.placeCube(0, 'testTile');
        const tile = document.getElementById('testTile');
        expect(tile.querySelector('img').src).toContain('cube.png');
    });

    test('should place a pawn on the board', () => {
        document.body.innerHTML += '<div id="testTile"></div>';
        testBoard.placePawn('testTile');
        const tile = document.getElementById('testTile');
        expect(tile.querySelector('img').src).toContain('star.png');
    });

    test('should populate player select options correctly', () => {
        testBoard.populateSelect();
        const select = document.getElementById('numberSelect');
        expect(select.children.length).toBe(2);
        expect(select.children[0].value).toBe("2");
        expect(select.children[1].value).toBe("3");
    });
});

describe('GameRecord class', () => {
    let gameRecord;

    beforeEach(() => {
        gameRecord = new GameRecord();
    });

    test('should record a move', () => {
        gameRecord.recordMove(1, 'Asked question', 'A1');
        expect(gameRecord.moves.length).toBe(1);
        expect(gameRecord.moves[0].player).toBe(1);
        expect(gameRecord.moves[0].action).toBe('Asked question');
        expect(gameRecord.moves[0].location).toBe('A1');
    });

    test('should convert moves to JSON', () => {
        gameRecord.recordMove(1, 'Asked question', 'A1');
        const json = gameRecord.toJSON();
        expect(json).toBe(JSON.stringify([{ player: 1, action: 'Asked question', location: 'A1' }]));
    });
});


