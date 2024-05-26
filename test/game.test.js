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
        rotations: [0, 9, 8, 1, 4, 11],
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

describe('rotate', () => {
    test('rotates a 2x2 matrix', () => {
        const input = [
            [1, 2],
            [3, 4]
        ];
        const expected = [
            [4, 3],
            [2, 1]
        ];
        expect(gameTest.rotate(input)).toEqual(expected);
    });

    test('rotates a 3x3 matrix', () => {
        const input = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];
        const expected = [
            [9, 8, 7],
            [6, 5, 4],
            [3, 2, 1]
        ];
        expect(gameTest.rotate(input)).toEqual(expected);
    });
});

describe('mergeMatricesByRows', () => {
    test('merges two 2x2 matrices', () => {
        const matrix1 = [
            [1, 2],
            [3, 4]
        ];
        const matrix2 = [
            [5, 6],
            [7, 8]
        ];
        const expected = [
            [1, 2, 5, 6],
            [3, 4, 7, 8]
        ];
        expect(gameTest.mergeMatricesByRows(matrix1, matrix2)).toEqual(expected);
    });

    test('throws an error if matrices have different number of rows', () => {
        const matrix1 = [
            [1, 2],
            [3, 4]
        ];
        const matrix2 = [
            [5, 6]
        ];
        expect(() => gameTest.mergeMatricesByRows(matrix1, matrix2)).toThrow("Matrices must have the same number of rows.");
    });
});

describe('board_layout', () => {
    test('generates the correct board layout', () => {
        const gameBoard = gameTest.get_board_configuration("7835AC4786216B6433");

        const expected =[
            [
              'forest',   'desert',
              'desert',   'desert',
              'swamp',    'swamp',
              'desert',   'mountain',
              'mountain', 'mountain',
              'mountain', 'swamp'
            ],
            [
              'forest', 'forest',
              'desert', 'water',
              'swamp',  'swamp',
              'desert', 'desert',
              'desert', 'forest',
              'swamp',  'swamp'
            ],
            [
              'forest', 'forest',
              'water',  'water',
              'water',  'water',
              'forest', 'forest',
              'forest', 'forest',
              'forest', 'swamp'
            ],
            [
              'swamp',    'swamp',
              'forest',   'forest',
              'forest',   'water',
              'swamp',    'swamp',
              'swamp',    'mountain',
              'mountain', 'mountain'
            ],
            [
              'swamp',    'swamp',
              'forest',   'mountain',
              'water',    'water',
              'swamp',    'desert',
              'desert',   'water',
              'mountain', 'mountain'
            ],
            [
              'mountain', 'mountain',
              'mountain', 'mountain',
              'water',    'water',
              'desert',   'desert',
              'water',    'water',
              'water',    'water'
            ],
            [
              'forest', 'forest',
              'forest', 'desert',
              'desert', 'desert',
              'forest', 'water',
              'water',  'water',
              'water',  'mountain'
            ],
            [
              'water',    'water',
              'water',    'mountain',
              'desert',   'desert',
              'forest',   'forest',
              'swamp',    'swamp',
              'mountain', 'mountain'
            ],
            [
              'mountain', 'mountain',
              'mountain', 'mountain',
              'desert',   'desert',
              'forest',   'swamp',
              'swamp',    'swamp',
              'desert',   'desert'
            ]
          ]
        const expectedGameBoard = gameTest.board_layout(gameBoard);
        // console.log(expectedGameBoard);
        expect(expectedGameBoard).toStrictEqual(expected);
    });
});


describe('isBear', () => {
    test('returns true for bear at block 0, row 2, col 3', () => {
        expect(gameTest.isBear(0, 2, 3)).toBe(true);
    });

    test('returns true for bear at block 0, row 2, col 4', () => {
        expect(gameTest.isBear(0, 2, 4)).toBe(true);
    });

    test('returns true for bear at block 0, row 2, col 5', () => {
        expect(gameTest.isBear(0, 2, 5)).toBe(true);
    });

    test('returns true for bear at block 4, row 2, col 4', () => {
        expect(gameTest.isBear(4, 2, 4)).toBe(true);
    });

    test('returns true for bear at block 4, row 1, col 5', () => {
        expect(gameTest.isBear(4, 1, 5)).toBe(true);
    });

    test('returns true for bear at block 4, row 2, col 5', () => {
        expect(gameTest.isBear(4, 2, 5)).toBe(true);
    });

    test('returns false for other positions', () => {
        expect(gameTest.isBear(0, 0, 0)).toBe(false);
        expect(gameTest.isBear(0, 1, 1)).toBe(false);
        expect(gameTest.isBear(0, 2, 2)).toBe(false);
        // Add more negative test cases
    });
});

describe('isCougar', () => {
    test('returns true for cougar at block 1, row 0, col 0', () => {
        expect(gameTest.isCougar(1, 0, 0)).toBe(true);
    });

    test('returns true for cougar at block 1, row 0, col 1', () => {
        expect(gameTest.isCougar(1, 0, 1)).toBe(true);
    });

    test('returns true for cougar at block 1, row 0, col 2', () => {
        expect(gameTest.isCougar(1, 0, 2)).toBe(true);
    });

    test('returns true for cougar at block 2, row 1, col 0', () => {
        expect(gameTest.isCougar(2, 1, 0)).toBe(true);
    });

    test('returns true for cougar at block 2, row 1, col 1', () => {
        expect(gameTest.isCougar(2, 1, 1)).toBe(true);
    });

    test('returns true for cougar at block 2, row 2, col 0', () => {
        expect(gameTest.isCougar(2, 2, 0)).toBe(true);
    });

    test('returns false for other positions', () => {
        expect(gameTest.isCougar(1, 1, 1)).toBe(false);
        expect(gameTest.isCougar(1, 2, 2)).toBe(false);
        expect(gameTest.isCougar(2, 0, 0)).toBe(false);
        // Add more negative test cases
    });
});



