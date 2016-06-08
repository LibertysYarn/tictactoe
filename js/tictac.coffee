pieces = [
    'O'
    'X'
]
player = undefined
ai = undefined
numberOfPlayers = undefined
winner = false
$bigBtn = $('.big-btn')
$xWin = $('.scoreX')
$oWin = $('.scoreO')
$alert = $('#alert-box')
$clearAll = $('#clearAll')
$primary = $('.X-primary')
$playerNumber = $('.playerNumber')
board = []
randomCell = undefined
turn = 0
xWins = 0
oWins = 0
# clears all text, values, and fields

reset = ->
    $bigBtn.text ''
    $bigBtn.button 'reset'
    turn = 0
    board = []
    winner = false
    $alert.text ' '
    return

# clears all fields and arrays on reset button click

###
// create an array for the board [0...8]
###

createBoard = ->
    board = Array(10).join('E').split('')
    return

###
// create array of available spaces on the board [E...E]
###

available = ->
    empty = []
    if empty.length == 0
        i = 0
        while i < 9
            if @board[i] == 'E'
                empty.push i
            i++
    empty

###
// checks rule and calls to checks for winner
###

play = (id, piece) ->
    # test space availability
    if board[id] == 'E'
        board[id] = piece
        console.log board[id]
        # assigns player piece to board index matching space location id
        $btn = $('#' + id).button()
        $btn.text piece
        checkWinner()
    return

###
//
###

aiTurn = ->
    ran = @available()
    len = ran.length
    randomCell = ran[Math.floor(Math.random() * len)]
    play randomCell, ai
    # $alert.text(ai + ' is catching up');
    return


setMinMaxPlayers = (maxPlayer, minPlayer) ->
  @minPlayer = player
  @maxPlayer = ai
  return

cloneBoard = (board) ->
  board.slice 0

findMove = (board) ->
  bestMoveValue = -100
  move = 0
  i = 0
  while i < board.length
    newBoard = @makeMove(i, @maxPlayer, board)
    if newBoard
      predictedMoveValue = @minValue(newBoard)
      if predictedMoveValue > bestMoveValue
        bestMoveValue = predictedMoveValue
        move = i
    i++
  move

makeMove = (move, player, board) ->
  newBoard = @cloneBoard(board)
  if newBoard[move] == 0
    newBoard[move] = player
    newBoard
  else
    null

minValue = (board) ->
  if @checkWinner(@maxPlayer, board)
    1
  else if @checkWinner(@minPlayer, board)
    -1
  else if @checkWinner(board)
    0
  else
    bestMoveValue = 100
    move = 0
    i = 0
    while i < board.length
      newBoard = @makeMove(i, @minPlayer, board)
      if newBoard
        predictedMoveValue = @maxValue(newBoard)
        if predictedMoveValue < bestMoveValue
          bestMoveValue = predictedMoveValue
          move = i
      i++
    bestMoveValue

maxValue = (board) ->
 if @checkWinner(@maxPlayer, board)
    1
  else if @checkWinner(@minPlayer, board)
    -1
  else if @checkWinner(board)
    0
  else
    bestMoveValue = -100
    move = 0
    i = 0
    while i < board.length
      newBoard = @makeMove(i, @maxPlayer, board)
      if newBoard
        predictedMoveValue = @minValue(newBoard)
        if predictedMoveValue > bestMoveValue
          bestMoveValue = predictedMoveValue
          move = i
      i++
    bestMoveValue


###
// pretty self-explanitory - checking for winning patterns
###

checkWinner = ->
    `var i`
    `var i`
    # check rows
    i = 0
    while i <= 6
        if board[i] != 'E' and board[i] == board[i + 1] and board[i] == board[i + 2]
            winner = true
            winScore board[i]
        i = i + 3
    # check columns
    i = 0
    while i <= 2
        if board[i] != 'E' and board[i] == board[i + 3] and board[i + 3] == board[i + 6]
            console.log 'winning column'
            winner = true
            winScore board[i]
        i++
    # check diagonals
    i = 0
    j = 4
    while i <= 2
        if board[i] != 'E' and board[i] == board[i + j] and board[i + j] == board[i + 2 * j]
            console.log 'winning diagonals'
            winner = true
            winScore board[i]
        i = i + 2
        j = j - 2
    # check for a draw
    open = available()
    if open.length == 0 and winner != true
        $alert.text 'It\'s a draw'
        return draw
    else
        winner = false
    return

###
// incriment the score to winning player and reset the board
###

winScore = (piece) ->
    if piece == 'X'
        xWins++
        $xWin.text xWins
        $alert.text piece + ' Wins!'
        setTimeout reset, 3000
    else if piece == 'O'
        oWins++
        $oWin.text oWins
        $alert.text piece + ' Wins!'
        setTimeout reset, 2000
    return

$clearAll.on 'click', reset
# declares number of players
$playerNumber.on 'click', ->
    numberOfPlayers = @id
    return
# user to choose player piece
$primary.on 'click', ->
    player = @id
    # assigns other piece to the ai
    ai = if player == 'X' then 'O' else 'X'
    # alerts user who goes first
    $alert.text player + ' goes first!'
    return

###
// when clicking on the board and mark with player piece
###

$bigBtn.on 'click', ->
    # test if piece is defined
    if player == undefined
        $alert.text 'You must choose a side'
    # print alert message
    if winner == false
        $alert.text 'nice move ' + player
    # call to create the board
    if turn == 0 then createBoard() else 0
    $btn = $(this).button()
    playerId = @id
    # $btn.text(player);
    # call to start play
    play playerId, player
    # incriment the turn number
    turn++
    # call ai to take a turn
    aiTurn()
    console.log 'current board: ' + board
    return

# ---
