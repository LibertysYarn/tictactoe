var pieces = ['O', 'X'];
var player;
var ai;
var $bigBtn = $('.big-btn');
var $xWin = $('.scoreX');
var $oWin = $('.scoreO');
var $alert = $('#alert-box');
var $clearAll = $('#clearAll');
var $primary = $('.X-primary');
var board = [];
var turn = 0;
var xWins = 0;
var oWins = 0;

$clearAll.on('click', function () {
	$bigBtn.text('');
	$bigBtn.button('reset');
	turn = 0;
	board = [];
});

$primary.on('click', function () {
	player = this.id;
	ai = player === 'X' ? 'O' : 'X';
	$alert.text(player + ' goes first!');
});

$bigBtn.on('click', function () {
	var $btn = $(this).button();
	$btn.text(player);
	turn == 0 ? createBoard() : 0;
	play(this.id);
	turn++;
	console.log(board);
});

function createBoard() {
	for (var i = 0; i < 9; i++) {
		board.push(i);
	}
}

function play(id) {
	// mark space as filled
	var i = board.indexOf(id - 1);
	board[i] = player;
	checkWinner();
}

// TODO call machine to take turn

function checkWinner() {
	// check rows
	// TODO row check broken
	for (var i = 0; i <= 6; i = i + 3) {
		if (board.slice(0, board.length - 6).every(elem => elem >= player) || board.slice(3, board.length - 3).every(elem => elem >= player) || board.slice(6, board.length).every(elem => elem >= player)) {
			console.log('winning row');
			winScore(player);
		}

		// check columns
		for (var i = 0; i <= 2; i++) {
			if (board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
				console.log('winning column');
				winScore(player);
			}
		}

		// check diagonals
		for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
			if (board[i] == board[i + j] && board[i + j] === board[i + 2 * j]) {
				console.log('winning diagonals');
				winScore(player);
			}
		}
	}
}

// TODO stop when all spaces used
// TODO first turn can go in any available space
// TODO force player to choose a piece
// TODO make it so X always goes first, initiates ai if needed

function winScore(player) {
	if (player === 'X') {
		xWins++;
		$alert.text('X Wins!');
		$xWin.text(xWins);
	} else if (player === 'O') {
		oWins++;
		$alert.text('O Wins!');
		$oWin.text(oWins);
	}
}
