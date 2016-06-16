var game, ui, mmax;
var $bigBtn = $('.big-btn');
var $xWin = $('.scoreX');
var $oWin = $('.scoreO');
var $alert = $('#alert-box');
var $clearAll = $('#clearAll');
var $primary = $('.X-primary');

window.onload = function () {
	// var pl = document.getElementsByName('player');
	// var sq = document.getElementsByName('square');
	var ai, player, square;
	var board = [];
	var turn = 0;
	game = new Play(ai, player, square, turn);
	ui = new Ui(board);
	mmax = new MiniMax(board);
};

var Play = function (ai, player, sq, turn) {
	this.ai = ai;
	this.player = player;
	this.square = sq;
	this.turn = 0;
};

var Ui = function (board) {
	this.board = [];
	// this.player = pl;
};

var MiniMax = function (board) {
	this.board = game.empty();
	// this.empty = game.empty();
};

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
			game.turn = 0;
			ui.board = [];
			winner = false;
			$alert.text(' ');
		},
		setPlayer = function (piece) {
			player = piece;
			// assigns other piece to the ai
			ai = player === 'X' ? 'O' : 'X';
			// alerts user who goes first
			console.log('This is ai: ' + ai + '. And this is the player: ' + player);
			$alert.text(player + ' goes first!');
			ui.createBoard();
		},
		setPlayerTest = function () {
			// test if piece is defined
			if (player === undefined) {
				$alert.text('You must choose a side');
				setTimeout(reset, 1500);
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
	var ai, randomCell, player, piece;
	var ai = player === 'X' ? 'O' : 'X';
	var xWins = 0;
	var oWins = 0;
	var turn = 0;
	var winner = false;

	// create array of available spaces on the board [E...E]
	var aiTurn = function () {
			// make a random move
			console.log('This is the ai piece in aiTurn: ' + ai);
			// var openSquares = this.available();
			// var len = openSquares.length;
			// var randomCell = openSquares[Math.floor(Math.random() * len)];
			// game.play(ai, randomCell);
			var aiSq = mmax.findMove(game.empty);
			game.play(ai, aiSq);
			console.log('This is the square ai wants to use ' + aiSq);
		},
		empty = function () {
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
			var open = empty();
			if (open.length === 0 && winner !== true) {
				$alert.text("It's a draw");
				setTimeout(reset, 3000);
				return 'draw';
			} else {
				winner = false;
			}
		},
		move = function (player, square) {
			if (0 >= game.turn <= 8) {
				game.play(player, square);
				checkWinner();
				game.turn++;
				game.aiTurn(player, square);
				console.log('This is the current turn number: ' + game.turn);
				console.log('This is the current board array ' + ui.board);
				console.log('This is the current array of empty square: ' + game.empty());
			}
			// print alert message
			// else if (game.winner === false) {
			// 	$alert.text('nice move ' + player);
			// }
		},
		play = function (piece, square) {
			// test space availability
			console.log('This is the piece used by ai: ' + ai);
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
		empty: empty,
		checkWinner: checkWinner,
		move: move,
		play: play,
		winScore: winScore
	};
}();

MiniMax.prototype = function () {
	var minPlayer, maxPlayer;
	//var board = game.empty();
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
				var newBoard = makeMove(i, maxPlayer, board);
				if (newBoard) {
					var predictedMoveValue = minValue(newBoard);
					if (predictedMoveValue > bestMoveValue) {
						bestMoveValue = predictedMoveValue;
						move = i;
					}

				}
			}
			return move;
		},
		makeMove = function (move, ai, board) {
			var newBoard = cloneBoard(board);
			if (newBoard[move] == 0) {
				newBoard[move] = ai;
				return newBoard;
			} else {
				return null;
			}
		},
		maxValue = function (board) {
			if (game.checkWinner(maxPlayer, board)) {
				return 1;
			} else if (game.checkWinner(minPlayer, board)) {
				return -1;
			} else if (checkTie(board)) {
				return 0;
			} else {
				var bestMoveValue = -100;
				var move = 0;
				for (var i = 0; i < board.length; i++) {
					var newBoard = makeMove(i, maxPlayer, board);
					if (newBoard) {
						var predictedMoveValue = minValue(newBoard);
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
			if (game.checkWinner(maxPlayer, board)) {
				return 1;
			} else if (game.checkWinner(minPlayer, board)) {
				return -1;
			} else if (checkTie(board)) {
				return 0;
			} else {
				var bestMoveValue = 100;
				var move = 0;
				for (var i = 0; i < board.length; i++) {
					var newBoard = makeMove(i, this.minPlayer, board);
					if (newBoard) {
						var predictedMoveValue = maxValue(newBoard);
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
		// checkTie: checkTie,
		// cloneBoard: cloneBoard,
		findMove: findMove,
		makeMove: makeMove,
		// maxValue: maxValue,
		// minValue: minValue,
		setMinMaxPlayers: setMinMaxPlayers,
	};
}();
