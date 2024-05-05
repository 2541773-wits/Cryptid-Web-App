/**
 * @jest-environment jsdom
 */
const gameTest = require('./game.js')

test('Get board configurations from mapcode',()=>{
    const gameBoard = {
        tiles: [1,2,3,5,4,6],
        rotations: [6, 7, 2, 4, 9, 11],
        towers: [ [ 4, 7 ], [ 8, 6 ], [ 2, 1 ]], 
        shacks: [ [ 6, 11 ], [ 6, 4 ], [ 3, 3 ]] 
    };
    expect(gameTest.get_board_configuration("7835AC4786216B6433")).toStrictEqual(gameBoard)
})

test('Get board configurations from hard mapcode',()=>{
    const gameBoard = {
        tiles: [1,4,3,2,5,6],
        rotations: [6, 9, 8, 1, 4, 11],
        towers: [ [ 5, 2 ], [ 7, 9 ], [ 1, 10 ], [ 1, 3 ] ], 
        shacks: [ [ 1, 4 ], [ 4, 9 ], [ 8, 3 ], [ 2, 11 ] ] 
    };
    expect(gameTest.get_board_configuration("1A925C52791A131449832B")).toStrictEqual(gameBoard)
})

describe('get_game_config', () => {
    test('should return correct game configuration', () => {
        const map = { players: { 2: ['config1', 'config2'] } };
        expect(gameTest.get_game_config(map, 2, 1)).toBe('config1');
    });
});

describe('get_destination', () => {
    test('should return correct destination coordinates', () => {
        const gameConfigs = { destination: '1,2,3' };
        expect(gameTest.get_destination(gameConfigs)).toEqual([1, 2, 3]);
    });
});

describe('get_clues', () => {
    test('should return correct clues', () => {
        const gameConfigs = { rules: ['water_or_desert', 'within_forest'] };
        expect(gameTest.get_clues(gameConfigs)).toEqual(['The habitat is on water or desert', 'The habitat is within one space of forest']);
    });
});

describe('get_hint', () => {
    test('should return correct hint', () => {
        const gameConfigs = { hint: 'hint_not_1' };
        expect(gameTest.get_hint(gameConfigs)).toEqual('There are no within 1 clues');
    });
});

describe('getSubmatrix', () => {
    const board = [
        ["water", "water", "desert"],
        ["swamp", "swamp", "mountain"],
        ["forest", "forest", "bone"]
    ];

    test('should return correct submatrix', () => {
        expect(gameTest.getSubmatrix(0, 1, 0, 1)).toEqual([["water", "water"], ["swamp", "swamp"]]);
    });
});


