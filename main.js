const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field = [[]]){
        this._field = field;
        this._x = 0;
        this._y = 0;
    } 

    // create playing field
    static makeField(length, width, percentage) {
        const display = new Array(width).fill().map(element => new Array(length));
        // populate 2D array playing field
        for (let y = 0; y < length; y++) {
            for (let x = 0; x < width; x++) {
                let probability = Math.random();
                if (probability < percentage) {
                    display[y][x] = hole;
                } else if (probability >= percentage) {
                    display[y][x] = fieldCharacter;
                }
            }
        }
        
        // set initial player position
        display[0][0] = pathCharacter;

        // set hat location
        let randomX = Math.floor(Math.random() * width);
        let randomY = Math.floor(Math.random() * length);
        // verify that hat is not located at [0][0]
        while (randomX === 0 && randomY === 0) {
            randomX = Math.floor(Math.random() * width);
            randomY = Math.floor(Math.random() * length);
        }
        display[randomY][randomX] = hat;

        return display;
    }

    // converts the field into an easily viewable form in the terminal
    print() {
        const displayField = this._field.map(row => {
            return row.join('');}).join('\n');
        console.log(displayField);    
    }

    // gathers user input for moving the player character
    userInput() {
        let toggle = true;
        while (toggle) {
            const moveDir = prompt('Select next move. (U)p, (D)own, (L)eft, (R)ight: ').toUpperCase();
            if (moveDir === 'U') {
                this._y -= 1;
                toggle = false;
            } else if (moveDir === 'D') {
                this._y += 1;
                toggle = false;
            } else if (moveDir === 'L') {
                this._x -= 1;
                toggle = false;
            } else if (moveDir === 'R') {
                this._x += 1;
                toggle = false;
            } else {
                console.log('Please select a valid direction, (U)p, (D)own, (L)eft, (R)ight: ')
            }
        }
    }

    // check if move is within the playing field
    inBounds() {
        return (
            this._x >= 0 && 
            this._x < this._field.length &&
            this._y >= 0 &&
            this._y < this._field[0].length
            )
    }

    //check if move is in a hole
    inHole() {
        return (this._field[this._y][this._x] === hole);
    }

    foundHat() {
        return (this._field[this._y][this._x] === hat);
    }

    // method to initialize gameplay
    runGame() {
        let finished = false;
        while (!finished) {
            this.print();
            this.userInput();   
            if (!this.inBounds()) {
                console.log('\n    OOPSIE, That move is out of bounds!!! Game Over\n');
                finished = true;
                break;
            } else if (this.inHole()) {
                console.log('\n    OHHHH NOOO!!!! You fell in a hole!!! Game Over\n');
                finished = true;
                break;
            } else if (this.foundHat()) {
                console.log('\n    CONGRATULATIONS!!!! You found your hat!!! Good work\n');
                finished = true;
                break
            }

            this._field[this._y][this._x] = pathCharacter;
        }
    }    
};

const myField = new Field(Field.makeField(20, 20, 0.15));
myField.runGame();