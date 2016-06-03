var user = ['O', 'X'];
var $bigBtn = $('.big-btn');
var $alert = $('#alert-box');
var $;
var board = [];
var turn = 0;
var playerWins = 0;
var aiWins = 0;

$('#clearAll').on('click', function () {
	$bigBtn.text('');
	$bigBtn.button('reset');
});

$('#optionX').on('click', function () {
	user.sort().reverse();
});

$('#optionO').on('click', function () {
	user.sort();
});

$bigBtn.on('click', function () {
	var $btn = $(this).button();
	$btn.text(user[0]);
	turn++;
	console.log(turn);
});

// TODO mark space as used ? remove it from a list of options
// TODO call machine to take turn
// TODO stop when all spaces used
// TODO function for machine to take turn
// TODO first turn can go in any available space
