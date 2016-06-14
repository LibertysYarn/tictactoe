var game;
window.onload = function () {
	this.pl = document.getElementsByName('player');
	this.sq = document.getElementsByName('square');
  game = new TicTacToe(pl, sq);
};

var TicTacToe = function () {
 this.player = pl;
 this.square = sq;
};

var MiniMax = function () {};

var $bigBtn = $('.big-btn');
var $xWin = $('.scoreX');
var $oWin = $('.scoreO');
var $alert = $('#alert-box');
var $clearAll = $('#clearAll');
var $primary = $('.X-primary');

TicTacToe.prototype = function () {
	//var randomCell, player, ai, piece, minPlayer, maxPlayer;
	var winner = false;
	var turn = 0;
	var xWins = 0;
	var oWins = 0;
	var board = [];

	// create array of available spaces on the board [E...E]
		aiTurn = function () {
			// make a random move
			var openSquares = this.available();
			len = openSquares.length;
			randomCell = openSquares[Math.floor(Math.random() * len)];
			play(randomCell, ai);
		},
		available = function () {
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

		// create an array for the board [0...8]
		createBoard = function () {
			var board = Array(10).join('E').split('');
		},
		move = function (player, square) {
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
			this.play(square, player);

			checkWinner();
			turn++;
			this.aiTurn();

			// when clicking on the board and mark with player piece
			$bigBtn.on('click', move(player, square));

		},

		play = function (square, player) {
			// test space availability
			if (board[id] === 'E') {
				board[id] = player;
				console.log(board[id]);
				// assigns player piece to board index matching space location id
				var $btn = $('#' + square).button();
				$btn.text(player);
			}

		},
		// clears all text, values, and fields
		reset = function () {
			// clears all fields and arrays on reset button click
			$bigBtn.text('');
			$bigBtn.button('reset');
			turn = 0;
			board = [];
			winner = false;
			$alert.text(' ');

			// clears all fields and arrays on reset button click
			$clearAll.on('click', reset);

		},
		setPlayer = function (e) {
			game.begin();
			player = e.innerHTML;
			// assigns other piece to the ai
			ai = player === 'X' ? 'O' : 'X';
			// alerts user who goes first
			$alert.text(player + ' goes first!');

			// user to choose player piece
			$primary.on('click', setPlayer(this.id));
		},
		// incriment the score to winning player and reset the board
		winScore = function (piece) {
			if (piece === 'X') {
				xWins++;
				$xWin.text(xWins);
				$alert.text(piece + ' Wins!');
				setTimeout(reset, 3000);
			} else {
				oWins++;
				$oWin.text(oWins);
				$alert.text(piece + ' Wins!');
				setTimeout(reset, 2000);
			}
		};
	return {
		ai: ai,
		// available: available,
		// begin: begin,
		// checkWinner: checkWinner,
		// createBoard: createBoard,
		move: move,
		play: play,
		reset: reset,
		setPlayer: setPlayer,
		// winScore: winScore
	};
};

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
			minPlayer = tictac.setPlayer;
			maxPlayer = minPlayer === 'X' ? 'O' : 'X';;
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
