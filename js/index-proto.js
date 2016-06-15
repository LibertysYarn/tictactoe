var game;
var ui;
window.onload = function () {
	var pl = document.getElementsByName('player');
	var sq = document.getElementsByName('square');
	game = new Play(pl, sq);
	ui = new Ui(pl);
};

var Play = function (pl, sq) {
	this.player = pl;
	this.square = sq;
};

var Ui = function (pl, turn, board) {
	this.board = [];
	//this.player = pl;
	this.turn = 0;
};

var MiniMax = function () {};

var $bigBtn = $('.big-btn');
var $xWin = $('.scoreX');
var $oWin = $('.scoreO');
var $alert = $('#alert-box');
var $clearAll = $('#clearAll');
var $primary = $('.X-primary');

//clears all fields and arrays on reset button click
//$clearAll.on('click', reset);


Ui.prototype = function () {
	var createBoard = function (board) {
			this.board = Array(10).join('E').split('');
			//return board;
		},
		// clears all text, values, and fields
		reset = function () {
			// clears all fields and arrays on reset button click
			$bigBtn.text('');
			$bigBtn.button('reset');
			turn = 0;
			this.board = [];
			winner = false;
			$alert.text(' ');
		},
		setPlayer = function (piece) {
			player = piece;
			// assigns other piece to the ai
			//ai = player === 'X' ? 'O' : 'X';
			// alerts user who goes first
			$alert.text(player + ' goes first!');
			ui.createBoard();
		},
		setPlayerTest = function() {
			// test if piece is defined
			if (player === undefined) {
				$alert.text('You must choose a side');
				setTimeout(ui.reset, 1500);
			}
		};
	return {
		createBoard: createBoard,
		reset: reset,
		setPlayer: setPlayer,
		//setPlayerTest: setPlayerTest
	};
}();

Play.prototype = function () {
	var randomCell, player, piece;
	var ai = player === 'X' ? 'O' : 'X';
	var winner = false;
	var turn = 0;
	var xWins = 0;
	var oWins = 0;

	// create array of available spaces on the board [E...E]
	var aiTurn = function () {
			// make a random move
			console.log(ai);
			var openSquares = this.available();
			var len = openSquares.length;
			var randomCell = openSquares[Math.floor(Math.random() * len)];
			game.play(ai, randomCell);
		},
		available = function () {
			var empty = [];
			if (empty.length === 0) {
				for (var i = 0; i < 9; i++) {
					if (ui.board[i] === 'E') {
						empty.push(i);
					}
				}
			}
			return empty;
		},

		checkWinner = function () {
			var board = ui.board;
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
		},
		move = function (player, square) {
			if (0 >= ui.turn <= 8) {
				game.play(player, square);
				checkWinner();
				ui.turn++;
				game.aiTurn();
				console.log(ui.turn);
				console.log(ui.board);
				console.log(game.available());
			}
			// print alert message
			// else if (game.winner === false) {
			// 	$alert.text('nice move ' + player);
			// }
		},
		play = function (piece, square) {
			// test space availability
			console.log(ai);
			if (ui.board[square] === 'E') {
				ui.board[square] = piece;
				// assigns player piece to board index matching space location id
				var $btn = $('#' + square).button();
				$btn.text(piece);
			}
		},
		// incriment the score to winning player and reset the board
		winScore = function (piece) {
			if (piece === 'X') {
				xWins++;
				$xWin.text(xWins);
				$alert.text(piece + ' Wins!');
				setTimeout(ui.reset, 3000);
			} else {
				oWins++;
				$oWin.text(oWins);
				$alert.text(piece + ' Wins!');
				setTimeout(ui.reset, 3000);
			}
		};
	return {
		aiTurn: aiTurn,
		available: available,
		checkWinner: checkWinner,
		move: move,
		play: play,
		winScore: winScore
	};
}();

MiniMax.prototype = function () {
	var minPlayer, maxPlayer, board;
	var checkTie = function (board) {
			for (var i = 0; i < board.length; i++) {
				if (board[i] == 0) {
					return false;
				}
			}
			return true;
		},
		cloneBoard = function (board) {
			return board.slice(0);
		},
		findMove = function (board) {
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
		},
		makeMove = function (move, player, board) {
			var newBoard = this.cloneBoard(board);
			if (newBoard[move] == 0) {
				newBoard[move] = player;
				return newBoard;
			} else {
				return null;
			}
		},
		maxValue = function (board) {
			if (this.checkWinner(this.maxPlayer, board)) {
				return 1;
			} else if (this.checkWinner(this.minPlayer, board)) {
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
		},
		minValue = function (board) {
			if (this.checkWinner(this.maxPlayer, board)) {
				return 1;
			} else if (this.checkWinner(this.minPlayer, board)) {
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
		},
		setMinMaxPlayers = function () {
			minPlayer = ui.setPlayer;
			maxPlayer = minPlayer === 'X' ? 'O' : 'X';
		};

	return {
		checkTie: checkTie,
		cloneBoard: cloneBoard,
		findMove: findMove,
		makeMove: makeMove,
		maxValue: maxValue,
		minValue: minValue,
		setMinMaxPlayers: setMinMaxPlayers,
	};
}();
