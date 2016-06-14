window.onload = function () {
	var eq = document.getElementById('tictactoe');
	tictac = new TicTacToe();
};

var TicTacToe = function () {
	//this.game = document.getElementById('tictactoe');
	this.begin();
};

var $bigBtn = $('.big-btn');
var $xWin = $('.scoreX');
var $oWin = $('.scoreO');
var $alert = $('#alert-box');
var $clearAll = $('#clearAll');
var $primary = $('.X-primary');



TicTacToe.prototype = function () {
	var randomCell, player, ai, piece, minPlayer, maxPlayer;
	var winner = false;
	var turn = 0;
	var xWins = 0;
	var oWins = 0;
	var board = [];

	// create array of available spaces on the board [E...E]
	var available = function () {
			var empty = [];
			if (empty.length === 0) {
				for (var i = 0; i < 9; i++) {
					if (this.board[i] === 'E') {
						empty.push(i);
					}
				}
			}
			return empty;
		},
		begin = function () {
			turn === 0 ? this.createBoard() : 0;
		},

		checkWinner = function (player, board) {
			// check rows
			for (var i = 0; i <= 6; i = i + 3) {
				if (board[i] !== 'E' && board[i] === board[i + 1] && board[i] === board[i + 2]) {
					console.log(board[i] + ' winning row');
					winScore(board[i]);
				}
				return true;
			}
			// check columns
			for (var i = 0; i <= 2; i++) {
				if (board[i] !== 'E' && board[i] === board[i + 3] && board[i + 3] === board[i + 6]) {
					console.log(board[i] + ' winning column');
					winScore(board[i]);
				}
				return true;
			}

			// check diagonals
			for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
				if (board[i] !== 'E' && board[i] == board[i + j] && board[i + j] === board[i + 2 * j]) {
					console.log(board[i] + ' winning diagonals');
					winScore(board[i]);
				}
				return true;
			}
			// check for a draw
			var open = available();
			if (open.length === 0 && winner !== true) {
				$alert.text("It's a draw");
				return 'draw';
			} else {
				return false;
			}
		},

		// create an array for the board [0...8]
		createBoard = function () {
			var board = Array(10).join('E').split('');
		},

		play = function (id, piece) {
			// test space availability
			if (board[id] === 'E') {
				board[id] = piece;
				// console.log(board[id]);
				// assigns player piece to board index matching space location id
				var $btn = $('#' + id).button();
				$btn.text(piece);

			}
		},
		// clears all text, values, and fields
		reset = function () {
			$clearAll.on('click', function () {
				// clears all fields and arrays on reset button click
				$bigBtn.text('');
				$bigBtn.button('reset');
				turn = 0;
				board = [];
				winner = false;
				$alert.text(' ');
			});
		},
		setPlayer = function () {
			$primary.on('click', function () {
				player = this.id;
				// assigns other piece to the ai
				ai = player === 'X' ? 'O' : 'X';
				// alerts user who goes first
				$alert.text(player + ' goes first!');
			});
		},
		// incriment the score to winning player and reset the board
		winScore = function (piece) {
			if (piece === 'X') {
				xWins + 1;
				$xWin.text(xWins);
				$alert.text(piece + ' Wins!');
				setTimeout(reset, 3000);
			} else {
				oWins + 1;
				$oWin.text(oWins);
				$alert.text(piece + ' Wins!');
				setTimeout(reset, 2000);
			}
		};
	return {
		available: available,
		begin: begin,
		checkWinner: checkWinner,
		createBoard: createBoard,
		play: play,
		reset: reset,
		setPlayer: setPlayer,
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
			minPlayer = tictac.setPlayer.player;
			maxPlayer = tictac.setPlayer.ai;
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
