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