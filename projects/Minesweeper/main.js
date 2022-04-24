//my constants
const sizeBoarding = {
    's': 9,
    'l': 17
}

const numberMines = {
    's': 11,
    'l': 40,
}

//my app's state variables
let theBoard;
let theSeconds = 0;
let theInterval = null;
let theSize;
let newGames = true;
let finishedGame = false;
let interval;

//my cached elements
let boardGameEl = document.getElementById('boardGame');
let h3El = document.querySelector('h3');
let minestoLeftEl = document.getElementById('minestoLeft');
let timerEl = document.getElementById('timer');
let easyDifEl = document.getElementById('s');
let hardDifEl = document.getElementById('l');
let myButtonsEl = document.getElementById('mybuttons');

//my event listeners
boardGameEl.addEventListener('click', handleClick);
boardGameEl.addEventListener('contextmenu', handler);
easyDifEl.addEventListener('click', init);
hardDifEl.addEventListener('click', init);
document.getElementById('reset').addEventListener('click', resetBtn);

//my functions below
function init(e) {
    size = e.target.id;
    finishedGame = false;

    styleboardGame(size);
    createBoardGameDivs(size);
    createBoardGameArray(size);
}

//Whichever level a player chooses, the game changes from easy to hard / the level changes
function styleboardGame(size) {
    myButtonsEl.style.display = 'none';
    boardGameEl.innerHTML = '';

    boardGameEl.style.backgroundColor = '#FABDD8';
    boardGameEl.style.border = '3px solid black';
    boardGameEl.style.display = 'grid';
    boardGameEl.style.marginTop = '39px';
    boardGameEl.style.textAlign = 'center';
    boardGameEl.style.justifyContent = 'center';
    boardGameEl.style.margin = '31px auto';

    if (size === 's') {
        boardGameEl.style.width = '245px';
        boardGameEl.style.gridTemplateColumns = 'repeat(9, 27px)';
        boardGameEl.style.gridTemplateRows = 'repeat(9, 27px)';
        h3El.innerText = 'you better win...';
    }
    if (size === 'l') {
        boardGameEl.style.width = '433px';
        boardGameEl.style.gridTemplateColumns = 'repeat(16, 27px)';
        boardGameEl.style.gridTemplateRows = 'repeat(16, 27px)';
        h3El.innerText = `...you're gonna need it`
    }
    minestoLeftEl.innerText = numberMines[size];
    timerEl.innerText = `00:00`;
}

// game board increases here ( easy or hard )
//make board elements in the d.o.m. 
function createBoardGameDivs(size) {
    for (let i = 0; i < sizeBoarding[size]; i++) {
        for (let j = 0; j < sizeBoarding[size]; j++) {
            let newDiv = document.createElement('div');
            newDiv.id = `c${j}r${i}`;

            newDiv.style.border = '1px solid';
            newDiv.style.borderTopColor = 'white';
            newDiv.style.borderLeftColor = 'white';
            newDiv.style.fontSize = '24px';

            boardGameEl.appendChild(newDiv);
        }
    }
}

//make the board elements in a 2 D array consisting of objects
function createBoardGameArray(size) {
    board = [];
    for (let i = 0; i < sizeBoarding[size]; i++) {
        board[i] = [];
    }
    for (let i = 0; i < sizeBoarding[size]; i++) {
        for (let j = 0; j < sizeBoarding[size]; j++) {
            board[i][j] = {
                pos: `c${j}r${i}`,
                isMine: false,
                revealed: false,
                surroundsMines: 0,
                isEmpty: false,
                hasFlag: false
            }
        }
    }
}

//it grabs the square's div 
function render(c, r) {
    let squareEl = document.getElementById(`c${c}r${r}`);

    //render the squares depending on whether or not there are bombs present or not
    if (board[c][r].isMine) {
        if (board[c][r].hasFlag) {
            squareEl.removeChild(document.getElementById(`c${c}r${r}img`));
        }
        finishedGame = true;
        let bombImage = document.createElement('img');

        bombImage.src = 'https://i.imgur.com/rhHig5q.png';
        bombImage.style.width = '14px';
        bombImage.style.height = '14px';

        squareEl.append(bombImage);
    } else {
        board[c][r].revealed = true;

        squareEl.style.backgroundColor = '#F767A6';
        //shows other squares thats close by if the chosen square is empty
        if (board[c][r].isEmpty) {
            revealNearbyEmpties(c, r);
        } else {
            //Styles the numbers and squares after they are revealed
            styleNumbers(squareEl, c, r);
        }
    }
}

//each square is designed according to the number of mines nearby
function styleNumbers(squareEl, c, r) {
    squareEl.style.backgroundColor = '#F767A6';
    squareEl.style.borderRightColor = 'white';
    squareEl.style.borderBottomColor = 'white';

    squareEl.innerText = board[c][r].surroundsMines;

    if (board[c][r].surroundsMines === 1) {
        squareEl.style.color = 'red';
    }
    if (board[c][r].surroundsMines === 2) {
        squareEl.style.color = 'blue';
    }
    if (board[c][r].surroundsMines === 3) {
        squareEl.style.color = 'green';
    }
    if (board[c][r].surroundsMines === 4) {
        squareEl.style.color = 'purple';
    }
    if (board[c][r].surroundsMines === 5) {
        squareEl.style.color = 'orange';
    }
}

//the player wins if the squares that don't have mines are revealed
function checkWinner() {
    for (let i = 0; i < sizeBoarding[size]; i++) {
        for (let j = 0; j < sizeBoarding[size]; j++) {
            if (!(board[i][j].isMine) && !(board[i][j].revealed)) {
                return;
            }
        }
    }
    finishedGame = true;
    clearInterval(interval);
    // player wins!

    h3El.innerText = 'Congratulations!';
}


function placeMines(e) {
    //put mines anywhere on the board
    let idOfEl = e.target.id;
    //finds the row and column of the div from the elements id    
    const ind = (idOfEl).indexOf('r');
    let col = parseInt((idOfEl).substring(1, ind));
    let row = parseInt((idOfEl).substring(ind + 1, (idOfEl).length));

    let mines1to10 = 1;
    let r = 0;
    let c = 0;

    while (mines1to10 <= numberMines[size]) {
        //finds 2 random numbers to place on a random board slot        
        r = Math.floor(Math.random() * sizeBoarding[size]);
        c = Math.floor(Math.random() * sizeBoarding[size]);

        //puts a mine on any random spot & calls asignNumbers       
        if ((!board[c][r].isMine) && (board[col][row] !== board[c][r])) {
            board[c][r].isMine = true;
            asignNumbers(c, r);
            mines1to10++;
        }

    }
}

//Finds all the empty spots on the board & then marks it
function findEmptySpaces() {
    for (let i = 0; i < sizeBoarding[size]; i++) {
        for (let j = 0; j < sizeBoarding[size]; j++) {
            if (board[i][j].surroundsMines === 0) {
                if (board[i][j].isMine === false) {
                    board[i][j].isEmpty = true;
                }
            }
        }
    }
}

//matched  numbers to nearby mines 
function asignNumbers(c, r) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(c + i < 0) && !(c + i > sizeBoarding[size] - 1)) {
                if (!(r + j < 0) && !(r + j > sizeBoarding[size] - 1)) {
                    board[c + i][j + r].surroundsMines++;
                }
            }
        }
    }
}

//shows all the empty spaces that are nearby
function revealNearbyEmpties(c, r) {
    var col = 0;
    var row = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            col = parseInt(c) + i;
            row = parseInt(r) + j;
            if (!(col < 0) && !(col > sizeBoarding[size] - 1)) {
                if (!(row < 0) && !(row > sizeBoarding[size] - 1)) {
                    if ((col !== c) || (row !== r)) {
                        if (board[col][row].revealed === false) {
                            if (board[col][row].isMine === false) {
                                render(col, row);

                            }
                        }
                    }
                }
            }
        }
    }
}


//the function for the handler activates when it detects a right click 
function handler(e) {
    e.preventDefault();
    switch (e.button) {
        case 0:
            handleRghtClick(e);
            break;

        case 2:
            handleClick(e);
            break;
    }
}

function handleClick(e) {
    let idEl = e.target.id;
    const ind = (idEl).indexOf('r');
    let col = parseInt((idEl).substring(1, ind));
    let row = parseInt((idEl).substring(ind + 1, (idEl).length));

    //the board is made as soon as the first click is activated     
    if (newGames) {
        newGames = false;
        //mines are made available 
        //looks for all the empty spots afterwards        
        placeMines(e);
        findEmptySpaces();
        //the then timer is set!
        interval = setInterval(formatTime, 1000);
    }
    //then afterwards looks for the div's rows and columns from the elementId


    //click handling and if the mine is clicked game is over. or else, gameboard renders 
    if ((!((board[col][row]).hasFlag)) && (!finishedGame)) {
        if (board[col][row].isMine) {
            for (let i = 0; i < sizeBoarding[size]; i++) {
                for (let j = 0; j < sizeBoarding[size]; j++) {
                    render(i, j);
                }
            }
            //when player activates the bomb, a message appears
            //the winner is announced!
            clearInterval(interval);
            h3El.innerText = 'You might want to try a little harder next time, just saying...';
        } else {
            render(col, row);
            checkWinner();
        }
    }
}

function handleRghtClick(e) {
    const ind = (e.target.id).indexOf('r');
    let col = parseInt((e.target.id).substring(1, ind));
    let row = parseInt((e.target.id).substring(ind + 1, (e.target.id).length));

    let squareEl = document.getElementById(`c${col}r${row}`);

    //If the square doesn't have a flag, place a flag on the board
    //Otherwise, remove the flag that's already there
    if ((!board[col][row].revealed) && (!finishedGame)) {
        if (!(board[col][row].hasFlag) && (parseInt(minestoLeftEl.innerText) > 0)) {

            let flagImage = document.createElement('img');
            flagImage.src = 'https://i.imgur.com/GPcHhIA.png';
            flagImage.style.width = '15px';
            flagImage.style.height = '15px';
            flagImage.id = `c${col}r${row}img`;

            board[col][row].hasFlag = true;

            squareEl.append(flagImage);

            minestoLeftEl.innerText = `${parseInt(minestoLeftEl.innerText) - 1}`;
        } else {
            board[col][row].hasFlag = false
            squareEl.removeChild(document.getElementById(`c${col}r${row}img`));

            minestoLeftEl.innerText = `${parseInt(minestoLeftEl.innerText) + 1}`;
        }
    }
}

//the game gets reset by the handles
//timer gets cleared 
//then the gameboard gets cleared as well
//now, a new game starts up again
function resetBtn() {
    clearInterval(interval);
    theSeconds = 0;
    boardGameEl.innerHTML = '';
    boardGameEl.removeAttribute('style');
    myButtonsEl.style.display = 'flex';
    h3El.innerText = 'Good Luck!';
    minestoLeftEl.innerText = '0';
    timerEl.innerText = `00:00`;
    newGames = true;
}

// structure the timer to show 00:00 
function formatTime() {
    theSeconds++;
    const mins = Math.floor(theSeconds / 60).toString().padStart(2, '0');
    const secs = (theSeconds % 60).toString().padStart(2, '0');
    timerEl.innerText = `${mins}:${secs}`;
}
