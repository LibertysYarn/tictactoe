var user = ['O', 'X'];
var $bigBtn = $('.big-btn');

$('#optionX').on('click', function() {
  user.sort().reverse();
});

$('#optionO').on('click', function() {
  user.sort();
});

$bigBtn.on('click', function() {
  var $btn = $(this).button();
  $btn.text(user[0]);
});

$('#clearAll').on('click', function() {
  $bigBtn.text('');
  $bigBtn.button('reset');
})
