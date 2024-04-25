function get_board_configuration(mapCode){
    //Get tile characters
    const board = mapCode.slice(0,6);

    //Convert board config to numerical values
    const numbers = board.split('').map(number=>{
        if (/[ABC]/.test(number)) {
            switch (number) {
                case 'A':
                    return 10;
                case 'B':
                    return 11;
                case 'C':
                    return 12;
            }
        }
        else{
            return parseInt(number);
        }
    });

    //Shift number back one - wrap around
    const sub1 = numbers.map(number=>{
        if(number===1){
            return 6
        } else {
            return number-1
        }
    });

    const sub5 = sub1.map(number=>{
        if (number<=5){
            return number +1;
        }else{
            return number -5
        }
    })

    //Check if map code is hard
    let input = mapCode;
    if (mapCode.length===18){
        input = mapCode.slice(6,18);   
    }
    else{
        input = mapCode.slice(6,22);
    }

    //Get tower and shack coordinates
    const coordinates = [];
    for (let i = 0; i < input.length; i += 2) {
        const lat = parseInt(input[i], 36);
        const lon = parseInt(input[i + 1], 36);
        coordinates.push([lat, lon]);
    }

    const towers = coordinates.slice(0,coordinates.length/2)
    const shacks = coordinates.slice(coordinates.length/2,coordinates.length)
    
    //Return board configuration
    const boardConfig = {
        tiles: sub5,
        // wt gt bt xt
        towers, 
        //ws gs bs xs
        shacks
    };
    
    return boardConfig;
}

function get_game_config(jsonFile,numPlayers,gameNum){
    return jsonFile.players[numPlayers][gameNum-1];
}

function get_destination(gameConfigs){
    return gameConfigs.destination.split(',').map(Number);
}

function get_clues(gameConfigs){
    const dict = {
        "water_or_desert": "The habitat is on water or desert",
        "water_or_mountain": "The habitat is on water or mountain",
        "water_or_forest": "The habitat is on water or forest",
        "water_or_bone": "The habitat is on water or swamp",
        "forest_or_desert": "The habitat is on forest or desert",
        "forest_or_mountain": "The habitat is on forest or mountain",
        "forest_or_bone": "The habitat is on forest or swamp",
        "desert_or_mountain": "The habitat is on desert or mountain",
        "desert_or_bone": "The habitat is on desert or swamp",
        "mountain_or_bone": "The habitat is on mountain or swamp",
        "within_water": "The habitat is within one space of water",
        "within_forest": "The habitat is within one space of forest",
        "within_desert": "The habitat is within one space of desert",
        "within_mountain": "The habitat is within one space of mountain",
        "within_bone": "The habitat is within one space of swamp",
        "within_fissure": "The habitat is within one space of either animal territory",
        "within_pyramid": "The habitat is within two spaces of a standing stone",
        "within_colony": "The habitat is within two spaces of a shack",
        "within_dormant_fissure": "The habitat is within two spaces of a bear territory",
        "within_active_fissure": "The habitat is within two spaces of a cougar territory",
        "within_green": "The habitat is within three spaces of a green structure",
        "within_red": "The habitat is within three spaces of a white structure",
        "within_blue": "The habitat is within three spaces of a blue structure",
        "within_black": "The habitat is within three spaces of a black structure"
    };
    return gameConfigs.rules.map(rule => dict[rule] || 'Unknown rule');
}

function get_hint(gameConfigs){
    dict = {
        "hint_not_1": "There are no within 1 clues",
        "hint_not_on_on": "No hints available",
        "hint_water": "There are no clues which mention water",
        "hint_terrain": "There are no clues which mention terrain of any type",
        "hint_fissure": "There are no clues which mention animals",
        "hint_mountain": "There are no clues which mention mountain",
        "hint_forest": "There are no clues which mention forest",
        "hint_desert": "There are no clues which mention desert",
        "hint_bone": "There are no clues which mention swamp",
        "hint_not_2": "There are no within 2 clues",
        "hint_not_3": "There are no within 3 clues"
    };
    return dict[gameConfigs.hint]
}


module.exports = get_game_config;
module.exports = get_board_configuration;