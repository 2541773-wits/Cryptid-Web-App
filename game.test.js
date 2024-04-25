const get_board_configuration = require('./game')

test('Get board configurations from mapcode',()=>{
    const gameBoard = {
        tiles: [1,2,3,5,4,6],
        towers: [ [ 4, 7 ], [ 8, 6 ], [ 2, 1 ]], 
        shacks: [ [ 6, 11 ], [ 6, 4 ], [ 3, 3 ]] 
    };
    expect(get_board_configuration("7835AC4786216B6433")).toStrictEqual(gameBoard)
})

test('Get board configurations from hard mapcode',()=>{
    const gameBoard = {
        tiles: [1,4,3,2,5,6],
        towers: [ [ 5, 2 ], [ 7, 9 ], [ 1, 10 ], [ 1, 3 ] ], 
        shacks: [ [ 1, 4 ], [ 4, 9 ], [ 8, 3 ], [ 2, 11 ] ] 
    };
    expect(get_board_configuration("1A925C52791A131449832B")).toStrictEqual(gameBoard)
})
