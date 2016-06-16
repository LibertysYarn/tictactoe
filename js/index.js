// Initiate all the variables!!!
var player, ai, randomCell;
var winner = false;
var board = [];
var turn = 0;
var xWins = 0;
var oWins = 0;

// Jquery shorthand
var $bigBtn = $('.big-btn');
var $scoreX = $('.scoreX');
var $scoreO = $('.scoreO');
var $alert = $('#alert-box');
var $clearAll = $('#clearAll');
var $primary = $('.X-primary');
var $playerNumber = $('.playerNumber');

// clears all fields and arrays on reset button click
$clearAll.on('click', reset);

// user to choose player piece
$primary.on('click', setPlayer);

// when clicking on the board and mark with player piece
$bigBtn.on('click', move);

// create an array for the board [0...8]
function createBoard() {
	board = Array(10).join('E').split('');
}

// create array of available spaces on the board [E...E]
function available() {
	var empty = [];
	if (empty.length === 0) {
		for (var i = 0; i < 9; i++) {
			if (this.board[i] === 'E') {
				empty.push(i);
			}
		}
	}
	return empty;
}

// clears all text, values, and fields
function reset() {
	$bigBtn.text('');
	$bigBtn.button('reset');
	turn = 0;
	board = [];
	winner = false;
	$alert.text('Please choose a side.');
	console.log('board now reset');
}

// grabs the button id and assigns it to the player and gives the other to the ai
function setPlayer() {
	player = this.id;
	// assigns other piece to the ai
	ai = player === 'X' ? 'O' : 'X';
	minPlayer = player === 'X' ? 1 : 2;
	maxPlayer = ai === 'O' ? 2 : 1;
	// alerts user who goes first
	$alert.text(player + ' goes first!');
	console.log('This is the player piece: ' + player + ' and this is the minPlayre: ' + minPlayer);
	console.log('This is the ai piece: ' + ai + ' and this is the maxPlayer: ' + maxPlayer);
}

//TODO create object for state, turns, open squares, and player pieces
// game logic of a sorts
function move() {

	//TODO needs its own function
	// test if piece is defined
	if (player === undefined) {
		$alert.text('You must choose a side');
		setTimeout(reset, 1500);
	}

	//TODO new function with funny alert messages
	// print alert message
	else if (winner === false) {
		$alert.text('nice move ' + player);
	}

	//TODO this needs to go in it's own init function
	// call to create the board
	turn === 0 ? createBoard() : 0;

	//grabs the id of the square clicked and and passes to play function
	var playerId = this.id;
	play(playerId, player);
	checkWinner();

	//TODO incriment turns in game object
	turn++;

	aiTurn();
	console.log('The game is on turn number: ' + turn);
}

// checks rule and calls to checks for winner
function play(id, piece) {
	// test space availability
	if (board[id] === 'E') {
		board[id] = piece;
		// assigns player piece to board index matching space location id
		var $btn = $('#' + id).button();
		$btn.text(piece);
	}
	console.log('player: ' + piece + ' to square: ' + id);
	console.log('this is the current board: ' + board);
}

// TODO make a button so player can choose to play on random or with minimax
function aiTurn() {
	// make a random move
	var openSquares = this.available();
	len = openSquares.length;
	randomCell = openSquares[Math.floor(Math.random() * len)];
	// play(randomCell, ai);

	//TODO fix the minimax
	// make a minimax move
	var emptySquares = this.available();
	console.log('These are the current empty sqaures ' + emptySquares);
	var aiMove = findMove(emptySquares);
	play(aiMove, ai);
}


//TODO dry up the winScore call
// pretty self-explanitory - checking for winning patterns
function checkWinner() {
	// check rows if
	for (var i = 0; i <= 6; i = i + 3) {
		if (board[i] !== 'E' && board[i] === board[i + 1] && board[i] === board[i + 2]) {
			winner = true;
			winScore(board[i]);
			console.log(board[i] + ' winning row');
		}
	}
	// check columns
	for (var i = 0; i <= 2; i++) {
		if (board[i] !== 'E' && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
			winner = true;
			winScore(board[i]);
			console.log(board[i] + ' winning column');
		}
	}

	// check diagonals
	for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
		if (board[i] !== 'E' && board[i] == board[i + j] && board[i + j] === board[i + 2 * j]) {
			winner = true;
			winScore(board[i]);
			console.log(board[i] + ' winning diagonals');
		}
	}

	// check for a draw
	var open = available();
	if (open.length === 0 && winner !== true) {
		$alert.text("It's a draw");
		setTimeout(reset, 3000);
		return 'draw';
	} else {
		winner = false;
	}
}

// TODO dry up the scoring
// incriment the score to winning player and reset the board
function winScore(piece) {
	if (piece === 'X') {
		xWins = xWins + 1;
		$scoreX.text(xWins);
		$alert.text(piece + ' Wins!');
		setTimeout(reset, 3000);
	} else {
		oWins = oWins + 1;
		$scoreO.text(oWins);
		$alert.text(piece + ' Wins!');
		setTimeout(reset, 3000);
	}
}

// TODO find the bug that is keeping it only incrimenting once
//Minimax

function cloneBoard(board) {
	return board.slice(0);
}

// Use separate implementation of check winner here for more portability.
// Most likely will use web workers here
function checkWinnerMM(player, board) {
	if (
		(board[0] == player && board[1] == player && board[2] == player) ||
		(board[3] == player && board[4] == player && board[5] == player) ||
		(board[6] == player && board[7] == player && board[8] == player) ||
		(board[0] == player && board[3] == player && board[6] == player) ||
		(board[1] == player && board[4] == player && board[7] == player) ||
		(board[2] == player && board[5] == player && board[8] == player) ||
		(board[0] == player && board[4] == player && board[8] == player) ||
		(board[2] == player && board[4] == player && board[6] == player)
	) {
		return true;
	} else {
		return false;
	}
}

function checkTie(board) {
	for (var i = 0; i < board.length; i++) {
		if (board[i] == 'E') {
			return false;
		}
	}
	return true;
}

function makeMove(move, player, board) {
	var newBoard = this.cloneBoard(board);
	if (newBoard[move] == 'E') {
		newBoard[move] = this.player;
		return newBoard;
	} else {
		return null;
	}
}

function findMove(board) {
	var bestMoveValue = -100;
	var move = 0;
	for (var i = 0; i < board.length; i++) {
		var newBoard = this.makeMove(i, this.maxPlayer, board);
		if (newBoard) {
			var predictedMoveValue = this.minValue(newBoard);
			if (predictedMoveValue > bestMoveValue) {
				bestMoveValue = predictedMoveValue;
				move = i;
			}
		}
	}
	return move;
}

function minValue(board) {
	if (this.checkWinnerMM(this.maxPlayer, board)) {
		return 1;
	} else if (this.checkWinnerMM(this.minPlayer, board)) {
		return -1;
	} else if (this.checkTie(board)) {
		return 0;
	} else {
		var bestMoveValue = 100;
		var move = 0;
		for (var i = 0; i < board.length; i++) {
			var newBoard = this.makeMove(i, this.minPlayer, board);
			if (newBoard) {
				var predictedMoveValue = this.maxValue(newBoard);
				if (predictedMoveValue < bestMoveValue) {
					bestMoveValue = predictedMoveValue;
					move = i;
				}
			}
		}
		return bestMoveValue;
	}
}

function maxValue(board) {
	if (this.checkWinnerMM(this.maxPlayer, board)) {
		return 1;
	} else if (this.checkWinnerMM(this.minPlayer, board)) {
		return -1;
	} else if (this.checkTie(board)) {
		return 0;
	} else {
		var bestMoveValue = -100;
		var move = 0;
		for (var i = 0; i < board.length; i++) {
			var newBoard = this.makeMove(i, this.maxPlayer, board);
			if (newBoard) {
				var predictedMoveValue = this.minValue(newBoard);
				if (predictedMoveValue > bestMoveValue) {
					bestMoveValue = predictedMoveValue;
					move = i;
				}
			}
		}
		return bestMoveValue;
	}
}
