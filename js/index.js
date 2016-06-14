/* Initiate all the variables!!! */
var player, ai, randmoCell;
var winner = false;
var $bigBtn = $('.big-btn');
var $scoreX = $('.scoreX');
var $scoreO = $('.scoreO');
var $alert = $('#alert-box');
var $clearAll = $('#clearAll');
var $primary = $('.X-primary');
var $playerNumber = $('.playerNumber');
var board = [];
var turn = 0;
var xWins = 0;
var oWins = 0;

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
	$alert.text(' ');
	console.log('reset');
}

function setPlayer() {
	player = this.id;
	// assigns other piece to the ai
	ai = player === 'X' ? 'O' : 'X';
	// alerts user who goes first
	$alert.text(player + ' goes first!');
}


function move() {
	// test if piece is defined
	if (player === undefined) {
		$alert.text('You must choose a side');
		setTimeout(reset, 1500);
	}
	// print alert message
	else if (winner === false) {
		$alert.text('nice move ' + player);
	}
	// call to create the board
	turn === 0 ? createBoard() : 0;

	var $btn = $(this).button();
	var playerId = this.id;
	console.log(turn);
	// $btn.text(player);
	play(playerId, player);

	checkWinner();
	turn++;
	aiTurn();
}

// checks rule and calls to checks for winner
function play(id, piece) {
	// test space availability
	if (board[id] === 'E') {
		board[id] = piece;
		console.log(board[id]);
		// assigns player piece to board index matching space location id
		var $btn = $('#' + id).button();
		$btn.text(piece);
	}
}

//
function aiTurn() {
	// make a random move
	var openSquares = this.available();
	len = openSquares.length;
	randomCell = openSquares[Math.floor(Math.random() * len)];
	play(randomCell, ai);

}


/*
// pretty self-explanitory - checking for winning patterns*/
function checkWinner() {
	// check rows
	for (var i = 0; i <= 6; i = i + 3) {
		if (board[i] !== 'E' && board[i] === board[i + 1] && board[i] === board[i + 2]) {
			winner = true;
			console.log(board[i] + ' winning row');
			winScore(board[i]);
		}
	}
	// check columns
	for (var i = 0; i <= 2; i++) {
		if (board[i] !== 'E' && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
			console.log(board[i] + ' winning column');
			winner = true;
			winScore(board[i]);
		}
	}

	// check diagonals
	for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
		if (board[i] !== 'E' && board[i] == board[i + j] && board[i + j] === board[i + 2 * j]) {
			console.log(board[i] + ' winning diagonals');
			winner = true;
			winScore(board[i]);
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

/*
// incriment the score to winning player and reset the board */
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
