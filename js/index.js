// #Done:20 fix alert logic so messages make sense
// #Done:60 stop game when all spaces used and declare a draw
// #Doing:0 don't allow one player to take two turns in a succession
// TODO:10 first turn can go in any available space
// #Done:50 add a pause after reset
// #Done:0 force player to choose a piece
// TODO:20 make it so X always goes first, initiates ai if needed
// #Done:10 set number of players 0-2
// #Done:40 keep player from using occupied space
// IDEA:10 create an array of encouraging/snarky alerts for during play
// IDEA:20 add Josua soundclip on page load
// #Doing:10 call machine to take turn
// #Done:30 refine player definition for winner check
// TODO:0 ai rules for different number of players

/* Initiate all the variables!!! */
var pieces = ['O', 'X'];
var player;
var ai;
var numberOfPlayers;
var winner = false;
var $bigBtn = $('.big-btn');
var $xWin = $('.scoreX');
var $oWin = $('.scoreO');
var $alert = $('#alert-box');
var $clearAll = $('#clearAll');
var $primary = $('.X-primary');
var $playerNumber = $('.playerNumber');
var board = [];
var randomCell;
var turn = 0;
var xWins = 0;
var oWins = 0;

/*
// create an array for the board [0...8] */
function createBoard () {
	board = Array(10).join('E').split('');
}

/*
// create array of available spaces on the board [E...E] */
function available () {
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
var reset = function () {
	$bigBtn.text('');
	$bigBtn.button('reset');
	turn = 0;
	board = [];
	winner = false;
	$alert.text(' ');
};

// clears all fields and arrays on reset button click
$clearAll.on('click', reset);

// declares number of players
$playerNumber.on('click', function () {
	numberOfPlayers = this.id;
});

// user to choose player piece
$primary.on('click', function () {
	player = this.id;
	// assigns other piece to the ai
	ai = player === 'X' ? 'O' : 'X';
	// alerts user who goes first
	$alert.text(player + ' goes first!');
});

/*
// when clicking on the board and mark with player piece */
$bigBtn.on('click', function () {
	// test if piece is defined
	if (player === undefined) {
		$alert.text('You must choose a side');
	}

	// print alert message
	if (winner === false) {
		$alert.text('nice move ' + player);
	}

	// call to create the board
	turn === 0 ? createBoard() : 0;

	var $btn = $(this).button();
	var playerId = this.id;
	// $btn.text(player);

	// call to start play
	play(playerId, player);

	// incriment the turn number
	turn++;

	// call ai to take a turn
	aiTurn();

	console.log('current board: ' + board);
});

/*
// checks rule and calls to checks for winner */
function play (id, piece) {
	// test space availability
	if (board[id] === 'E') {
		board[id] = piece;
		console.log(board[id]);
		// assigns player piece to board index matching space location id
		var $btn = $('#' + id).button();
		$btn.text(piece);
		checkWinner();
	}
}

/*
// */
function aiTurn () {
	var ran = this.available();
	var len = ran.length;
	randomCell = ran[Math.floor(Math.random() * len)];
	play(randomCell, ai);
	// $alert.text(ai + ' is catching up');
}

/*
// pretty self-explanitory - checking for winning patterns*/
function checkWinner () {
	// check rows
	for (var i = 0; i <= 6; i = i + 3) {
		if (board[i] !== 'E' && board[i] === board[i + 1] && board[i] === board[i + 2]) {
			winner = true;
			winScore(board[i]);
		}
	}
	// check columns
	for (var i = 0; i <= 2; i++) {
		if (board[i] !== 'E' && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
			console.log('winning column');
			winner = true;
			winScore(board[i]);
		}
	}

	// check diagonals
	for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
		if (board[i] !== 'E' && board[i] == board[i + j] && board[i + j] === board[i + 2 * j]) {
			console.log('winning diagonals');
			winner = true;
			winScore(board[i]);
		}
	}
	// check for a draw
	var open = available();
	if (open.length === 0 && winner !== true) {
		$alert.text("It's a draw");
	} else {
		winner = false;
	}
}

/*
// incriment the score to winning player and reset the board */
function winScore (piece) {
	if (piece === 'X') {
		xWins++;
		$xWin.text(xWins);
		$alert.text(piece + ' Wins!');
		setTimeout(reset, 3000);
	} else if (piece === 'O') {
		oWins++;
		$oWin.text(oWins);
		$alert.text(piece + ' Wins!');
		setTimeout(reset, 2000);
	}
}
