// Checker Script
//
// Copyright 2006-2011 Otto de Voogd - http://www.7is7.com/otto/
// Original URL: http://www.7is7.com/software/games/checkers/
//
// Feedback is always appreciated.

// -- SETTINGS --

// Site dependant settings
var cookiepath='C:/Users/hichem/Desktop/games/checkers';
var cookiedomain='C:/Users/hichem/Desktop/games/checkers';

// Default Level of difficulty and max depths:
var level=2;
var max_depth_phase=[2,4,4,4,5,6]
setLevel(2)

// Show log (for testing)
var show_log=0;

// -- GLOBAL VARIABLES --

var lt=unescape('%3C');
var gt=unescape('%3E');
var nbsp=unescape('%A0');

// Statuses
var game_over=0;
var moves_undone=false;
var show_alert=false;
var msgarea_str='';
var MsgAreaTimeoutID=0;
var plyr_turn=1;
var plyr_started=1;
var selected=0;
var double_jump=false;
var from_i=-1;
var from_j=-1;
var max_depth=4;
var random_number=getRandomNumber();
var games_won_fx=0;
var games_won_ie=0;
var games_drawn=0;
var total_moves=0;
var last_value_change=0;
var curr_board_value=0;
var prev_board_value=0;
var game_log='';
var lang='en-us';
//var active_area_i=[0,0,0,0,0,0,0,0];
//var active_area_j=[0,0,0,0,0,0,0,0];
//var endboard_log='';
//var endboard_rep='';

// Original board
var total_pcs_plyr=12;
var total_pcs_comp=12;
// Displayed as on board
var start_board = [
[0,-1,0,-1,0,-1,0,-1],
[-1,0,-1,0,-1,0,-1,0],
[0,-1,0,-1,0,-1,0,-1],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[1,0,1,0,1,0,1,0],
[0,1,0,1,0,1,0,1],
[1,0,1,0,1,0,1,0]
];


// Internal representation of board (inversed axes)
var board = [
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0]
];

// -- PREPARE THINGS --

// Check Settings
// Clear cookiepath and cookiedomain if clearly an error
if (-1==location.href.indexOf(cookiepath,0)) { cookiepath='' };
if (-1==location.href.indexOf(cookiedomain,0)) { cookiedomain='' };

// Preload Images
// fx?.png = Fx Images (Player)
// ie?.png = IE Images (Computer)
// 1=normal, 2=normal selected, 3=king, 4=king selected
var imgs = ["fx1.png","fx2.png","fx3.png","fx4.png","ie1.png","ie2.png","ie3.png","ie4.png","black.png"];
var preloaded_imgs = new Array();

for (var i=0; i<imgs.length; i++) {
 preloaded_imgs[i]=new Image();
 preloaded_imgs[i].src=imgs[i];
}

// -- BASIC FUNCTIONS --

// Return sign
function sign(value) {
 return (value)?(value>0)?1:-1:0;
}

// Return sign
function signSymbol(value) {
 return (value)?(value>0)?'+':'-':'';
}

// Replace text
function replaceTextById(id,str) {
 if (
  document.getElementById(id)
  // document.getElementById(id) &&
  // document.getElementById(id).firstChild
 ) {
  // document.getElementById(id).firstChild.nodeValue=unescape(str);
  document.getElementById(id).innerHTML=unescape(str);
 }
}

// Replace an attribute
function replaceAttrById(id,attr,val) {
 if (
  document.getElementById(id) &&
  document.getElementById(id).getAttribute(attr)
 ) {
  document.getElementById(id).setAttribute(attr,val);
 }
}

// Get the value of an argument in a string (generic function).
// We are trying to match the entire name.
function getObjVal(obj,pre,sep,name) {
 name=name+"=";
 var start=obj.indexOf(name,0);
 if (start==-1) return start;
 if (start!=0) {
  name=pre+name;
  var start=obj.indexOf(name,0)
  if (start==-1) return start;
 }
 start+=name.length;
 var end=obj.indexOf(sep,start);
 if (end==-1) end=obj.length;
 return obj.substring(start,end);
}

// Use getObjVal to extract a value from the Query String.
function getQsVal (name) {
 return getObjVal (location.search.substring(1),"&","&",name);
}

// Use getObjVal to extract a cookie value.
function getCookieVal(name) {
 var value=getObjVal(document.cookie,"; ",";",name);
 return value;
}

// Set cookie (expires in 1 year)
function setCookie(name,value) {
 var expdate=new Date();
 expdate.setTime (expdate.getTime() + 31622400000);
 document.cookie=name+'='+escape(value) +
 ((cookiepath)?'; path='+cookiepath:'') +
 ((cookiedomain)?'; domain='+cookiedomain:'') +
 '; expires='+expdate.toGMTString();
}

// Set selected item in select option
function setSelected(obj,val) {
 for(var i=0; i<obj.options.length; i++) {
  if(obj.options[i].value==val) {
   obj.options[i].selected=true;
   return true;
  }
 }
 return false;
}

// Set global random number (between 100 and 999)
// I prefer this to Math.random
function getRandomNumber() {
 var now = new Date();
 random_number = (Math.floor(now.getTime()/100) % 900) + 100;
 return random_number;
}

// -- SCORES --

// Load scores (force numerical by substracting 0)
function loadScores() {
 games_won_fx=getCookieVal('won_fx')-0;
 games_won_ie=getCookieVal('won_ie')-0;
 games_drawn=getCookieVal('drawn')-0;
 if (-1==games_won_fx) { games_won_fx=0; }
 if (-1==games_won_ie) { games_won_ie=0; }
 if (-1==games_drawn) { games_drawn=0; }
}

// Reset Scores
function resetScores() {
 if (!show_alert) {
  // if (!game_over) {
   confirmResetScores();
  //}
 }
}

// Reset scores
function resetScoresConfirmed() {
 games_won_fx=0;
 games_won_ie=0;
 games_drawn=0;
 setCookie('won_fx',games_won_fx);
 setCookie('drawn',games_drawn);
 setCookie('won_ie',games_won_ie);
 showScores();
}

// Game over, set the score
function gameOver(score,msg) {
 // Set game_over to block any further activity
 game_over=1;
 if (show_alert) {
  setTimeout('gameOver('+score+',"'+msg+'")',300);
 } else {
  if (score>0) {
   games_won_fx++; highlightScore('ScoreFx');
   // If we only want to count games where undo was not used:
   // if (!moves_undone) { games_won_fx++; highlightScore('ScoreFx'); }
   // else { showAlert(game_over_moves_undone); }
  }
  else if (score<0) { games_won_ie++; highlightScore('ScoreIE'); }
  else { games_drawn++; highlightScore('ScoreDraw'); }
  setCookie('won_fx',games_won_fx);
  setCookie('won_ie',games_won_ie);
  setCookie('drawn',games_drawn);
  // showScores();
  showMsg(msg,2);
  //showGameOver();
 }
}

// Display scores in respective fields
function showScores() {
 replaceTextById('ScoreFx',games_won_fx);
 replaceTextById('ScoreDraw',games_drawn);
 replaceTextById('ScoreIE',games_won_ie);
}

// Highlight a particular score
function highlightScore(scoreboard) {
 a=document.getElementById(scoreboard);
 a.className='scorehl';
 setTimeout('clearScoreHighlight("'+scoreboard+'")',6000);
}

// Clear score highlight
function clearScoreHighlight(scoreboard) {
 a=document.getElementById(scoreboard);
 a.className='scorenorm';
}

// -- POP-UP MESSAGES --

// Show popupOverlay
// type = 'yesno' or 'ok'
// action = function to call on Yes or OK
function showPopupOverlay(str,type,action) {
 if (!show_alert) {
  show_alert=true;
  replaceTextById('MsgArea',nbsp);
  replaceTextById('popup_text',str);
  if (type=='yesno') {
   document.getElementById('NoButton').style.display='inline';
   document.getElementById('YesButton').style.display='inline';
   document.getElementById('OkButton').style.display='none';
  } else {
   document.getElementById('NoButton').style.display='none';
   document.getElementById('YesButton').style.display='none';
   document.getElementById('OkButton').style.display='inline';
  }
  // Set button fucntions if needed
  if (action.length>4) {
   action = 'javascript:hidePopupOverlay();' + action;
  } else {
   action = 'javascript:hidePopupOverlay();';
  }
  replaceAttrById('YesButton','href',action);
  replaceAttrById('OkButton','href',action);
  // Leave a fraction of a second for player to comtemplate the board.
  setTimeout("document.getElementById('popup_msg').style.visibility='visible';",100);
 }
}

// Hide popupOverlay
function hidePopupOverlay() {
 document.getElementById('popup_msg').style.visibility='hidden';
 show_alert=false;
 replaceTextById('MsgArea',msgarea_str);
}

// Alert message
function showAlert(str) {
 showPopupOverlay(str,'ok','');
}

// Confirm resignation message
function confirmResign() {
 showPopupOverlay(confirm_resign,'yesno','resignConfirmed();');
}

// Confirm score reset message
function confirmResetScores() {
 showPopupOverlay(confirm_resetscores,'yesno','resetScoresConfirmed();');
}

// Confirm first cheat (undo)
function confirmFirstUndo() {
 showPopupOverlay(confirm_firstundo,'yesno','firstUndoConfirmed();');
}

// -- MESSAGE AREA --

// For displaying a message in the message area
// arg act: player must act = 1, info = 0
function showMsg(str,act) {
 if (show_alert) {
  replaceTextById('MsgArea',nbsp);
  setTimeout('showMsg("'+str+'")',200);
 } else {
  replaceTextById('MsgArea',str);
  msgarea_str=str;
  loadScores();
  showScores();
  if (act) {
   highlightMsgArea(act);
  } else {
   dimMsgArea();
  }
  if (document.getElementById('StatusArea')) {
   if (show_log) {
    replaceTextById('StatusArea','['+curr_board_value+'/'+total_moves+'/'+last_value_change+' '+total_pcs_plyr+'-'+total_pcs_comp+']\n'+log);
    document.getElementById('StatusArea').style.display='block';
   } else {
    replaceTextById('StatusArea','Status');
    document.getElementById('StatusArea').style.display='none';
   }
  }
 }
}

// Highlight MsgArea
function highlightMsgArea(act) {
 if (MsgAreaTimeoutID!=0) {clearTimeout(MsgAreaTimeoutID);}
 a=document.getElementById('MsgArea');
 a.className='highlight';
 if (act>1) {
  MsgAreaTimeoutID=setTimeout('dimMsgArea()',3000);
 }
}

// Clear MsgArea highlight
function dimMsgArea() {
 if (MsgAreaTimeoutID!=0) {clearTimeout(MsgAreaTimeoutID);}
 a=document.getElementById('MsgArea');
 a.className='dim';
 MsgAreaTimeoutID=0;
}

// -- NOTIFICATIONS (POP-UP MESSAGES) --

function showAbout() {
 var msg = '<div style="text-align:center;">';
 msg += '<strong>Browser War Checkers</strong><br>';
 msg += 'version '+checkers_version;
 msg += '<div style="margin-top:1em;">Copyright %A9 2006-2011 ';
 msg += '<a target="_blank" href="http://www.7is7.com/">Otto de Voogd</a>';
 msg += '</div></div>';
 showAlert(msg);
}

function showDifficulty() {
 var phase=calcGamePhase();
 var msg='Difficulty Depths: ';
 for(i=0;i<=5;i++) {
  msg+='Phase'+i+' = '+max_depth_phase[i]+', ';
 }
 msg+='Next Move (Phase'+phase+') = '+max_depth_phase[phase];
 showAlert(msg);
}

function showGameLog() {
 if (game_log.length>2) {
  showAlert(game_log);
 } else {
  showAlert(no_moves_made_yet);
 }
}

function showLastMove() {
 var last_move=prevMove();
 if (last_move.length>2) {
  showAlert(prevMove());
 } else {
  showAlert(no_moves_made_yet);
 }
}

// -- DISPLAYING PIECES --

// Display the piece at i,j according to board setting
function displayPiece(i,j) {
 var image;
 if (board[i][j]>=1) {
  if (board[i][j]==1) image='fx1.png';
  else if (board[i][j]==2) image='fx2.png';
  else if (board[i][j]==3) image='fx3.png';
  else if (board[i][j]==4) image='fx4.png';
 } else if (board[i][j]<=-1) {
  if (board[i][j]==-1) image='ie1.png';
  else if (board[i][j]==-2) image='ie2.png';
  else if (board[i][j]==-3) image='ie3.png';
  else if (board[i][j]==-4) image='ie4.png';
 } else {
  image='black.png';
 }
 document.images['i'+i+'j'+j].src=image;
}

// Select a piece (the one to move)
function selectPiece(i,j) {
  board[i][j]+=sign(board[i][j]);
  from_i=i;
  from_j=j;
  selected=1;
  displayPiece(i,j);
}

// Unselect a piece (the one to move)
function unselectPiece(i,j) {
  board[i][j]-=sign(board[i][j]);
  from_i=-1;
  from_j=-1;
  selected=0;
  displayPiece(i,j);
}

// Change a square by Square Number (for undo)
function updSquare(s,v) {
 p=squareNumb2pos(s);
 i=Math.floor(p/10);
 j=p%10;
 // alert(i+' '+j);
 void(board[i][j]=v-0);
 displayPiece(i,j);
}

// Perform the move of a piece
function performMove(i,j) {
 var kinged=0;
 total_moves++;
 // Set destination to original piece.
 board[i][j]=board[from_i][from_j]-sign(board[from_i][from_j]);
 // If player arrived on row 0 we are kinged
 // If computer arrived on row 7 it is kinged
 if (0==j && board[i][j]>0 && board[i][j]<3) {board[i][j]=3;kinged=1;}
 if (7==j && board[i][j]<0 && board[i][j]>-3) {board[i][j]=-3;kinged=1;}
 // Remove the original piece
 board[from_i][from_j]=0;
 displayPiece(from_i,from_j);
 displayPiece(i,j);
 // Also write event to game_log
 game_log+=officialSquareNumb(from_i,from_j);
 if (Math.abs(from_i-i)==2) {
  // We have jumped over a piece so remove it.
  var jump_i=(from_i+i)/2;
  var jump_j=(from_j+j)/2;
  if (Math.abs(board[jump_i][jump_j])>=3) game_log+='X';
  else game_log+='x';
  board[jump_i][jump_j]=0;
  displayPiece(jump_i,jump_j);
 } else {
  game_log+='-';
 }
 game_log+=officialSquareNumb(i,j);
 if (kinged) { game_log+='k'; }
 // Continue to jump (unless we have just been kinged)
 if ((Math.abs(from_i-i)==2) && (!kinged) && (movePossible(board,i,j,2))) {
  game_log+='&';
  double_jump=true;
  from_i=i;
  from_j=j;
  selected=1;
  board[i][j]+=sign(board[i][j]);
  displayPiece(i,j);
 } else {
  game_log+=' ';
  double_jump=false;
  selected=0;
  from_i=-1;
  from_j=-1;
 }
 gameStatus();
}

// Reset the board
function resetBoard() {
 //total_pcs_plyr=12;
 //total_pcs_comp=12;
 selected=0;
 double_jump=false;
 from_i=-1;
 from_j=-1;
 total_moves=0;
 // moves_undone=false;
 setCheatStatus(false);
 last_value_change=0;
 //endboard_log='';
 //endboard_rep='';
 //curr_board_value=0;
 //prev_board_value=0;
 // Set up the internal board.
 for (j=0;j<=7;j++) {
  for (var i=(j+1)%2;i<=7;i+=2) {
   // Inversed cardinals.
   board[i][j]=start_board[j][i];
   displayPiece(i,j);
  }
 }
 // In case we start with a non standard board
 // set board values and count pieces
 // Initialize board values
 curr_board_value=calcBoardValue(board);
 prev_board_value=curr_board_value;
 // Set total_pcs_plyr and total_pcs_comp
 countPieces()
 game_over=0;
 game_log='';
 loadScores();
 if ((games_won_fx+games_drawn+games_won_ie)%2) {
  plyr_turn=0;
  setTimeout('prepareCompMove()',100);
 } else {
  plyr_turn=1;
  showMsg(select_a_piece,1);
 }
 plyr_started=plyr_turn;
}

// Board as string
//function board2string(board) {
 //var str='';
 //for (var j=0;j<=7;j++) {
  //for (var i=(j+1)%2;i<=7;i+=2) {
   //if (board[i][j]!=0) {
    //str+=signSymbol(board[i][j]);
    //str+=officialSquareNumb(i,j);
    //str+=(Math.abs(board[i][j])<3)?'':'K';
   //}
  //}
 //}
 //return str;
//}

// -- ANALYSIS OF BOARD AND MOVES --

// Check if there is anything left to play.
// Set global variables for totals
function countPieces() {
 total_pcs_plyr=0;
 total_pcs_comp=0;
 for (j=0;j<=7;j++) {
  for (var i=(j+1)%2;i<=7;i+=2) {
   if (board[i][j]>0) total_pcs_plyr++;
   else if (board[i][j]<0) total_pcs_comp++;
  }
 }
}

// Determine the status of the game,
// Are there any pieces left and moves left to make.
function gameStatus() {
 // Check if there is anything left to play.
 countPieces();
 if (!total_pcs_plyr) {
  showAlert(game_over_no_more_pieces_plyr);
  gameOver(-1,game_over_no_more_pieces_plyr);
 } else if (!total_pcs_comp) {
  showAlert(game_over_no_more_pieces_comp);
  gameOver(1,game_over_no_more_pieces_comp);
 } else if (
  !possibleMoveOnBoard(board,!plyr_turn,1) &&
  !possibleMoveOnBoard(board,!plyr_turn,2)
 ) {
  // The next player cannot make anymore moves.
  if (!plyr_turn) {
   showAlert(game_over_no_more_moves_plyr);
   gameOver(-1,game_over_no_more_moves_plyr);
  } else {
   showAlert(game_over_no_more_moves_comp);
   gameOver(1,game_over_no_more_moves_comp);
  }
 } else {
  // Game is not over
  game_over=0;
 }
 prev_board_value=curr_board_value;
 curr_board_value=calcRealBoardValue(board);
 if (Math.abs(prev_board_value-curr_board_value)>=1) {
  last_value_change=total_moves;
 }
 // Referee intervention only if 6 or less pieces on the board
 if (
  total_moves>=last_value_change+20 &&
  // total_pcs_plyr+total_pcs_comp < 7 &&
  game_log.length > 120
 ) {
  var pmove=prevMove();
  var lmoves=pmove.split(/ /);
  var endlog;
  if (game_log.length>240) {
   endlog=game_log.substring(game_log.length-240,game_log.length)
  } else {
   endlog=game_log;
  }
  var streaks0=endlog.split(lmoves[0]);
  var streaks1=endlog.split(lmoves[1]);
  // Move must occurr 3 or more times:
  if (streaks0.length > 3 && streaks1.length > 3 && streaks0.length+streaks1.length > 8) {
  //var board_str=board2string(board);
  //if (-1==endboard_log.indexOf(board_str)) {
   //endboard_log+=' '+board_str;
  //} else {
   //if (-1==endboard_rep.indexOf(board_str)) {
    //endboard_rep+=' '+board_str;
    //showAlert(referee_warning);
   //} else {
    // Third time on same positions
  //if (total_moves>=last_value_change+40) {
    var real_board_value=calcRealBoardValue(board);
    if (real_board_value>=1) {
     showAlert(referee_won_plyr);
     gameOver(1,game_over_referee_plyr);
    } else if (real_board_value<=-1) {
     showAlert(referee_won_comp);
     gameOver(-1,game_over_referee_comp);
    } else {
     showAlert(referee_draw);
     gameOver(0,game_over_referee_drawn);
    }
  //} else if (total_moves==last_value_change+20) {
   //showAlert(referee_warning);
   //}
  }
 }
}

// Is a given move allowed
function legalMove(board,from_i,from_j,to_i,to_j) {
 var abs_dist_i = Math.abs(to_i-from_i);
 var abs_dist_j = Math.abs(to_j-from_j);
 // We must stay on the board, the destination must be free and
 // the move must be diagonal. We are either a king or moving forward.
 // We move either a distance of 1 or we jump over a piece of the other player.
 // Multiplying jumper and jumped over piece yields a negative number if they
 // are of opposing players (and thus the jump is allowed).
 if (
  from_i>=0 && from_i<=7 && from_j>=0 && from_j<=7 &&
  to_i>=0 && to_i<=7 && to_j>=0 && to_j<=7 &&
  board[to_i][to_j]==0 &&
  abs_dist_i==abs_dist_j &&
  (
   (Math.abs(board[from_i][from_j])>2) || 
   (board[from_i][from_j]>0 && (from_j>to_j)) ||
   (board[from_i][from_j]<0 && (to_j>from_j))
  ) &&
  (
   (abs_dist_i==1) ||
   (
    (abs_dist_i==2) &&
    (board[(from_i+to_i)/2][(from_j+to_j)/2]*board[from_i][from_j]<0)
   )
  )
 ) {
  return 1;
 } else {
  return 0;
 }
}

// Official Square number (for game log)
// Depends on who started
function officialSquareNumb(i,j) {
 var sqnum;
 if (plyr_started) { sqnum=(7-j)*4+(9-i-j%2)/2; }
 else { sqnum=j*4+(i+j%2+1)/2; }
 if (sqnum<10) { sqnum='0'+sqnum; }
 return sqnum;
}

// Return i,j value from official square number
// Depends on who started
function squareNumb2pos(sqnum) {
 var i;
 var j;
 var jabs=Math.floor((sqnum-1)/4);
 var iabs=(sqnum-jabs*4)*2-1-jabs%2;
 if (plyr_started) {
  i=7-iabs;
  j=7-jabs;
 } else {
  i=iabs;
  j=jabs;
 }
 return (i*10)+j;
}

// Value of a square on the board
// To prevent suicide a piece is worth a lot of points.
function squareValue(board,i,j) {
 if (board[i][j]) {
  if (Math.abs(board[i][j])<3) {
   // A normal piece is worth 100 points.
   // Take account of j position of pieces.
   //return ((board[i][j]>0)?107-j:-100-j);
   // Initial row should be defended a bit.
   return ((board[i][j]>0)?100+Math.abs(6-j):-100-Math.abs(j-1));
  } else {
   // A king is worth 120 points
   // Player king is worth 120.1 points to give the computer
   // incentive to remove it.
   // Position malus (negative bonus)
   //var pos_j=Math.abs(3.5-j);
   var pos_i=Math.abs(3.5-i);
   //var pos_m=((pos_i>pos_j)?pos_i:pos_j);
   // var pos_d=Math.abs(i-j);
   //var pos_c=(((i+j-1)*(i+j-13))==0)?8:0;
   //var pos_c=((Math.abs(i-j)<=1)?8:0);
   var pos_c=Math.abs(i-j);
   // var pos_malus=(((pos_i>pos_j)?pos_i:pos_j)-pos_c)/1000;
   //return ((board[i][j]>0)?120.1-(pos_m+pos_c)/5000:-120+(pos_m+pos_c)/10000);
   //return ((board[i][j]>0)?120.1-(pos_c)/100:-120+(pos_c)/1000);
   //return ((board[i][j]>0)?120.1-(pos_c+pos_i)/1000:-120+(pos_c+pos_i)/10000);
   //return ((board[i][j]>0)?120.1-(pos_c+pos_i)/500:-120);
   return ((board[i][j]>0)?120-(pos_c+pos_i)/500:-120+(pos_c+pos_i)/1000);
  }
 } else {
  return 0;
 }
}


// Real value of a square on the board
// Used for determining winner by referee
function realSquareValue(board,i,j) {
 if (board[i][j]) {
  if (Math.abs(board[i][j])<3) {
   // A normal piece is worth 100 points.
   // Take account of j position of pieces.
   return ((board[i][j]>0)?107-j:-100-j);
  } else {
   // A king is worth 120 points
   return ((board[i][j]>0)?120:-120);
  }
 } else {
  return 0;
 }
}

// Real value of the board, to determine who won (referee).
function calcRealBoardValue(board) {
 var board_value=0;
 for (var j=0;j<=7;j++) {
  for (var i=(j+1)%2;i<=7;i+=2) {
   board_value+=realSquareValue(board,i,j);
  }
 }
 return board_value;
}

// Value of the board, to determine if moves are good.
function calcBoardValue(board) {
 var board_value=0;
 for (var j=0;j<=7;j++) {
  for (var i=(j+1)%2;i<=7;i+=2) {
   board_value+=squareValue(board,i,j);
  }
 }
 return board_value.toFixed(6)-0;
}

// Value of the board difference between two boards.
function calcBoardValueDiff(old_board,new_board,old_board_value,from_i,from_j,to_i,to_j) {
 var new_board_value=old_board_value;
 var dist=Math.abs(to_i-from_i);
 var sgn_i=sign(to_i-from_i);
 var sgn_j=sign(to_j-from_j);
 for (var d=0;d<=dist;d++) {
  sq_i=from_i+d*sgn_i;
  sq_j=from_j+d*sgn_j;
  new_board_value-=squareValue(old_board,sq_i,sq_j);
  new_board_value+=squareValue(new_board,sq_i,sq_j);
  // Acive Area difference?
 }
 return new_board_value.toFixed(6)-0;
}

// Init active area - used to keep pieces in general vicinity of each other
//function initActiveArea(board) {
 //active_area_i=[0,0,0,0,0,0,0,0];
 //active_area_j=[0,0,0,0,0,0,0,0];
 //for (var j=0;j<=7;j++) {
  //for (var i=(j+1)%2;i<=7;i+=2) {
   //active_area_i[i]+=(board[i][j]==0)?0:1;
   //active_area_j[j]+=(board[i][j]==0)?0:1;
  //}
 //}
//}

// Calculate Active Area
// Used to keep pieces in general vicinity of each other
// Returns a value between 2 and 16
function calcActiveArea(board) {
 active_area_i=[0,0,0,0,0,0,0,0];
 active_area_j=[0,0,0,0,0,0,0,0];
 for (var j=0;j<=7;j++) {
  for (var i=(j+1)%2;i<=7;i+=2) {
   active_area_i[i]+=(board[i][j]==0)?0:1;
   active_area_j[j]+=(board[i][j]==0)?0:1;
  }
 }
 var i1=0;
 var i2=0;
 for (var i=0;i<=7;i++) {
  if (active_area_i[i]!=0 && i1==0) {i1=i;i2=i;}
  else if (active_area_i[i]!=0 && i1!=0) {i2=i;}
 }
 var j1=0;
 var j2=0;
 for (var j=0;j<=7;j++) {
  if (active_area_j[j]!=0 && j1==0) {j1=j;j2=j;}
  else if (active_area_j[j]!=0 && j1!=0) {j2=j;}
 }
 return (i2-i1+1)+(j2-j1+1);
}

// Add to active area
//function addActiveAreaPos(board,i,j) {
 //if (board[i][j]!=0) {
  //active_area_i[i]++;
  //active_area_j[j]++;
 //}
//}

// Remove from active area
//function subActiveAreaPos(board,i,j) {
 //if (board[i][j]!=0) {
  //active_area_i[i]--;
  //active_area_j[j]--;
 //}
//}

// Can we make a move from this position of given distance?
// dist=1: move, dist=2: jump
function movePossible(board,i,j,dist) {
 return (
  legalMove(board,i,j,i-dist,j-dist)||
  legalMove(board,i,j,i+dist,j-dist)||
  legalMove(board,i,j,i-dist,j+dist)||
  legalMove(board,i,j,i+dist,j+dist)
 ) 
}

// Is there a move to be made on the board of given distance?
// dist=1: move, dist=2: jump
function possibleMoveOnBoard(board,plyr_turn,dist) {
 for (j=0;j<=7;j++) {
  for (var i=(j+1)%2;i<=7;i+=2) {
   if ((plyr_turn && board[i][j]>0) || (!plyr_turn && board[i][j]<0)) {
    if (movePossible(board,i,j,dist)) return 1;
   }
  }
 }
 return 0;
}


// -- FOR TESTING --

// Change the piece on a given square
function changeSquare() {
 var val=prompt('Square to change:');
 var sq=0; // Square to affect
 var p=1; // Player (1) or Computer (-1)
 var v=0; // Type of piece
 var num=val.match(/[0-9]+/g);
 if (num.length>0) {
  sq=num[0];
  if (num.length>1) {
   v=num[1];
  } else {
   // Switch sign if computer
   if (null!=val.match(/(-|comp|\bie|expl)/i)) { p=-1; v=-1; }
   else if (null!=val.match(/(-|player|fx|fire|fox)/i)) { p=1; v=1; }
   // Determine type of piece
   if (val.match(/piece/i)) { v=p; }
   else if (val.match(/king/i)) { v=3*p; }
   else if (val.match(/(clear|empty)/i)) { v=0; }
  }
 }
 if (1<=sq && 32>=sq && -4<=v && 4>=v) {
  updSquare(sq,v);
 } else {
  alert('Unable to understand or perform requested change!');
 }
}

// For testing and development (not used otherwise)
function boardRepresentation(board) {
 var rep='';
 for (var j=0;j<=7;j++) {
  for (var i=0;i<=7;i++) {
   if (board[i][j]>2) rep=rep+'X ';
   else if (board[i][j]>0) rep=rep+'x ';
   else if (board[i][j]<-2) rep=rep+'E ';
   else if (board[i][j]<0) rep=rep+'e ';
   else if ((i+j)%2) rep+='- ';
   else rep+='  ';
  }
  rep+='\n';
 }
 return(rep);
}

function appendToLog(board,depth,plyr_move,branch_board_value) {
 log+='\n\n'+boardRepresentation(board);
 log+='d='+depth+' fm='+plyr_move+' bv='+calcBoardValue(board)+' bbv='+branch_board_value;
}


// -- COMPUTER STRATEGY --

var best_board_value=10000;
var best_from_i=-1;
var best_from_j=-1;
var best_to_i=-1;
var best_to_j=-1;
var best_value_counter=0;
// For Testing
var log='';

// We only call moveAnalysis if our move is legal
function moveAnalysis(board,board_value,depth,plyr_move,from_i,from_j,to_i,to_j) {
 var kinged=0;
 var double_jump=false;
 var branch_board_value=9999;
 if (plyr_move) branch_board_value=-9999;
 var test_board = [
 [0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0]
 ];
 // Copy the board for test purposes
 for (var j=0;j<=7;j++) {
  for (var i=(j+1)%2;i<=7;i+=2) {
   test_board[i][j]=board[i][j];
  }
 }
 // Move the piece. (Our move was legal).
 test_board[to_i][to_j]=test_board[from_i][from_j];
 test_board[from_i][from_j]=0;
 if (0==to_j && test_board[to_i][to_j]>0 && test_board[to_i][to_j]<3) {
  test_board[to_i][to_j]=3;kinged=1;
 }
 if (7==to_j && test_board[to_i][to_j]<0 && test_board[to_i][to_j]>-3) {
  test_board[to_i][to_j]=-3;kinged=1;
 }
 if (Math.abs(from_i-to_i)==2) {
  // Remove piece that was jumped over
  var jump_i=(from_i+to_i)/2;
  var jump_j=(from_j+to_j)/2;
  test_board[jump_i][jump_j]=0;
  // Can we make another move of distance 2?
  if (!kinged && movePossible(test_board,to_i,to_j,2)) {
   double_jump=true;
  }
 }
 // Calculate the new board value of the test board.
 test_board_value=calcBoardValueDiff(board,test_board,board_value,from_i,from_j,to_i,to_j);
 //if ((total_pcs_comp+total_pcs_plyr)<=6) {
  //initActiveArea(board);
  //test_board_value+=calcActiveArea()/10000;
 //}

 if (double_jump) {
  // A double jump is possible.
  // We add a bit to depth so it does not equal 1 (but it is part of prev move).
  branch_board_value=findBestMoveFrom(test_board,test_board_value,depth+.1,plyr_move,to_i,to_j,2);
 } else if (depth>=max_depth) {
  // We proceed trying to make jumps only.
  branch_board_value=compMoveTestRec(test_board,test_board_value,depth+1,2,!plyr_move);
  // If no jumps possible
  if (9999==Math.abs(branch_board_value)) {
   // Test if more moves possible for both plyr and comp
   if (!possibleMoveOnBoard(test_board,1,1)) {
    if (show_log) { log+='\nNo more moves plyr: depth='+depth; }
    branch_board_value=test_board_value-3000;
   } else if (!possibleMoveOnBoard(test_board,0,1)) {
    if (show_log) { log+='\nNo more moves comp: depth='+depth; }
    branch_board_value=test_board_value+3000;
   } else {
	// calculate Active Area (we are at a leaf)
    if ((total_pcs_comp+total_pcs_plyr)<=6) {
     test_board_value+=calcActiveArea(test_board)/10000;
    }
    branch_board_value=test_board_value;
   }
  }
 } else {
  branch_board_value=compMoveTestRec(test_board,test_board_value,depth+1,1,!plyr_move);
 }
 // TESTING
 //if (show_log) appendToLog(board,depth,plyr_move,branch_board_value);
 if (show_log) appendToLog(test_board,depth,plyr_move,branch_board_value);
 return branch_board_value;
}

// Find best move of given distance from position i,j.
function findBestMoveFrom(board,board_value,depth,plyr_move,from_i,from_j,dist) {
 var test_board_value;
 var branch_board_value=9999;
 if (plyr_move) branch_board_value=-9999;
 var to_i=-1;
 var to_j=-1;
 //var move_mult=plyr_move*2-1;
 for (var mj=-1;mj<=1;mj+=2) {
  for (var mi=-1;mi<=1;mi+=2) {
   to_i=from_i+dist*mi;
   to_j=from_j+dist*mj;
   if (legalMove(board,from_i,from_j,to_i,to_j)) {
    test_board_value=moveAnalysis(board,board_value,depth,plyr_move,from_i,from_j,to_i,to_j);
    // IE tries to lower the value and Fx tries to raise it.
    if (
     (!plyr_move && test_board_value<branch_board_value) ||
     (plyr_move && test_board_value>branch_board_value)
    ) {
     branch_board_value=test_board_value;
    }
   }
  }
 }
 return branch_board_value;
}

// Find a move to make
function compMoveTestRec(board,board_value,depth,min_dist,plyr_move) {
 var test_board_value;
 var branch_board_value=9999;
 var depth_penalty=depth/1000000;
 depth_penalty.toFixed(8);
 if (plyr_move) branch_board_value=-9999;
 // Look for moves
 for (var dist=2;dist>=min_dist;dist--) {
  for (var j=7;j>=0;j--) {
   for (var i=(j+1)%2;i<=7;i+=2) {
    if ((!plyr_move && board[i][j]<0)||(plyr_move && board[i][j]>0)) {
     test_board_value=findBestMoveFrom(board,board_value,depth,plyr_move,i,j,dist);
     // The player tries to lower the value and the computer tries to raise it.
     if (
      (!plyr_move && test_board_value<branch_board_value) ||
      (plyr_move && test_board_value>branch_board_value)
     ) {
      branch_board_value=test_board_value-depth_penalty;
     }
    }
   }
  }
  // We have found a legal move in this iteration
  // First iteration is with dist==2, must use if we find a move.
  if (Math.abs(branch_board_value)!=9999) { return branch_board_value; }
 }
 // There are no possible moves.
 //return calcBoardValue(board);
 if (min_dist<2) {
  if (show_log) log+='\nNo possible moves: depth='+depth+' min_dist='+min_dist;
  return branch_board_value+(plyr_move*2-1)*99;
 } else {
  return branch_board_value; // Is set to board_value by calling function.
 }
}

// Find a move (first level)
// If a jump was possible this was already performed by calcMoveComp
// So we test for normal first moves
// Purpose is to avoid unresponsive script problem
function compMoveTestDepthOne(board,board_value,double_jump,dist,i,j,mi,mj) {
 var to_i=-1;
 var to_j=-1;

 if (board[i][j]<0) {
  to_i=i+dist*mi;
  to_j=j+dist*mj;
  if (legalMove(board,i,j,to_i,to_j)) {
   var test_board_value=9999;
   test_board_value=moveAnalysis(board,board_value,1,0,i,j,to_i,to_j);
   // Computer tries to lower the board value.
   // Select the best move. Only set this for the next move (depth==1)
   if (test_board_value<best_board_value) {
    best_value_counter=1;
    best_board_value=test_board_value;
    best_from_i=i;
    best_from_j=j;
    best_to_i=to_i;
    best_to_j=to_j;
   } else if (test_board_value==best_board_value) {
    // Randomly decide whether to choose this alternative.
    best_value_counter++;
    if (random_number % best_value_counter == 0) {
     best_from_i=i;
     best_from_j=j;
     best_to_i=to_i;
     best_to_j=to_j;
    }
   }
  }
 }

 // Increment what needs to be incremented for next iteration
 if (mj<1) { mj+=2; }
 else if (mi<1) { mi+=2; mj=-1; }
 else if (double_jump) { j=-1; } // Skips next iteration.
 else {
  i+=2; mi=-1; mj=-1;
  if (i>7) { j--; i=(j+1)%2; }
 }

 if (j>=0) {
   // Show progress kind of - just for fun
   // replaceTextById('MsgArea',msgarea_str+' ['+(j*8+7-i)+']');
   // replaceTextById('MsgArea',msgarea_str+' ['+i+j+mi+mj+']');
   // Work out the next possible move
   setTimeout('compMoveTestDepthOne(board,'+board_value+','+double_jump+','+dist+','+i+','+j+','+mi+','+mj+')',10);
 } else {
  // Perform the chosen move
  if (double_jump) {
   setTimeout('completeCompMove('+best_to_i+','+best_to_j+')',500);
  } else {
   setTimeout('startCompMove('+best_from_i+','+best_from_j+','+best_to_i+','+best_to_j+')',50);
  }
 }
}


// -- THE COMPUTER MOVES --

// Complete the computer's move
function completeCompMove(to_i,to_j) {
 performMove(to_i,to_j);
 if (double_jump) {
  // Search for the best jump
  best_board_value=10000;
  best_from_i=-1;
  best_from_j=-1;
  best_to_i=-1;
  best_to_j=-1;
  //findBestMoveFrom(board,calcBoardValue(board),1,0,to_i,to_j,2);
  compMoveTestDepthOne(board,calcBoardValue(board),true,2,to_i,to_j,-1,-1);
  // Complete the move
  //setTimeout('completeCompMove('+best_to_i+','+best_to_j+')',500);
 } else if (!game_over) {
  plyr_turn=1;
  showMsg(your_turn,1);
 }
}

// Start to move a piece for the computer
// Timeout is to keep selected piece highlighted for half a second.
function startCompMove(from_i,from_j,to_i,to_j) {
 showMsg(comp_move,0);
 selectPiece(from_i,from_j);
 setTimeout('completeCompMove('+to_i+','+to_j+')',500);
}

// Calculate the computer's move
// setTimeout is used to reduce script run time (not much in this case).
function calcCompMove() {
 var init_board_value=calcBoardValue(board);
 // If a jump is possible choose one (dist==2)
 // Work out the best move, also performs it
 if (possibleMoveOnBoard(board,0,2)) {
  compMoveTestDepthOne(board,init_board_value,false,2,0,7,-1,-1);
 } else {
  compMoveTestDepthOne(board,init_board_value,false,1,0,7,-1,-1);
 }
}

// Calculation maximum depth
function calcGamePhase() {
  var phase=0;
  // Possibility to look ahead further when there are less pieces.
  if ((total_pcs_comp+total_pcs_plyr)<=4) phase=5;
  else if ((total_pcs_comp+total_pcs_plyr)<=8) phase=4;
  else if (total_pcs_comp<=4 || total_pcs_plyr<=4) phase=3;
  else if (total_pcs_comp<=8 || total_pcs_plyr<=8) phase=2;
  else if (total_pcs_comp<=11) phase=1;
  else phase=0;
  return phase;
}

// Prepare for turn of computer
// To reduce the script run time we call calcCompMove with a setTimeout.
function prepareCompMove() {
 if (show_alert) {
  setTimeout('prepareCompMove()',200);
 } else {
  showMsg(wait_for_comp_move,1);
  max_depth=max_depth_phase[calcGamePhase()];
  // Reset vars to search for the best move
  best_board_value=10000;
  best_from_i=-1;
  best_from_j=-1;
  best_to_i=-1;
  best_to_j=-1;
  getRandomNumber();
  // For testing purposes we can create a log.
  log='';
  setTimeout('calcCompMove()',100);
 }
}

// -- PLAYER ACTIONS AND MOVES --

// Play again (resign if game not over)
function newGame() {
 if (!show_alert) {
  if (!game_over) {
   confirmResign();
  } else {
   resetBoard();
  }
 }
}

// Resignation confirmed
function resignConfirmed() {
  gameOver(-1,player_resigned);
  resetBoard();
}

// Extract previous move from log (for undoMove and showLastMove)
function prevMove() {
 if (game_log.length>0) {
  var moves=game_log.split(/ /);
  var last=moves.length-1;
  // usually the last character in game_log is a space (but not always):
  if (moves[last].length<2) { last--; }
  // Check that there were more than 1 moves, add a space at the end
  // for compatibility with undoMove.
  if (last>0) {
   return moves[last-1]+' '+moves[last]+' ';
  } else {
   return moves[last]+' ';
  }
 } else {
  return '';
 }
}

// Perfom undo move
function performUndoMove(uncrown,from_sq,action,to_sq) {
 var fr=squareNumb2pos(from_sq);
 var to=squareNumb2pos(to_sq);
 var fr_i=Math.floor(fr/10);
 var fr_j=fr%10;
 var to_i=Math.floor(to/10);
 var to_j=to%10;
 if (selected) {
  selected=0;
  unselectPiece(from_i,from_j);
 }
 board[to_i][to_j]=board[fr_i][fr_j]+(-uncrown*2+1)*sign(board[fr_i][fr_j]);
 board[fr_i][fr_j]=0;
 displayPiece(fr_i,fr_j);
 displayPiece(to_i,to_j);
 board[to_i][to_j]-=sign(board[to_i][to_j]);
 setTimeout('displayPiece('+to_i+','+to_j+')',500);
 if ("x"==action||"X"==action) {
  var a_i=(fr_i+to_i)/2;
  var a_j=(fr_j+to_j)/2;
  if ("x"==action) {
   board[a_i][a_j]=-sign(board[to_i][to_j]);
  } else if ("X"==action) {
   board[a_i][a_j]=-sign(board[to_i][to_j])*3;
  }
  displayPiece(a_i,a_j);
 }
 total_moves--;
}

// Undo the last move in the log
function undoMove() {
 if (!show_alert) {
  if (game_over) {
   // showMsg(game_already_over,2);
   showAlert(game_already_over);
  } else if (plyr_turn) {
   var pmove=prevMove();
   var move=pmove.split(/[ &]/);
   var time2wait=10;
   // Initial move by computer can't be undone.
   if (move.length>2) {
    if (moves_undone) {
     plyr_turn=0;
	 for (var i=move.length-2;i>=0;i--) {
      var uncrown=(move[i].charAt(5)=='k')?1:0;
      var pos1=move[i].substring(3,5);
      var act1=move[i].charAt(2);
      var pos2=move[i].substring(0,2);
      setTimeout('performUndoMove("'+uncrown+'","'+pos1+'","'+act1+'","'+pos2+'")',time2wait);
      time2wait+=700;
	 }
     game_log=game_log.substring(0,game_log.length-pmove.length);
     showMsg(move_undone,2);
     setTimeout('plyr_turn=1',time2wait+200);
    } else {
     confirmFirstUndo();
    }
   } else {
    showAlert(nothing_to_undo);
   }
  } else {
   showMsg(not_your_turn,2);
  }
 }
}

// Confirm first Undo (cheat warning)
function firstUndoConfirmed() {
 // Set moves undone to true.
 // moves_undone=true;
 setCheatStatus(true);
 undoMove();
}

// Set CheatStatus
function setCheatStatus(cheated) {
 moves_undone=cheated;
 replaceTextById('CheatStatus',moves_undone?status_cheat:status_clean);
}

// Destination to which to move a selected Fx piece.
function movePlyrPiece(i,j) {
 if ((i==from_i) && (j==from_j) && !double_jump) {
  // We are unselecting a selected piece
  unselectPiece(i,j);
  showMsg(select_a_piece,1);
 } else if (legalMove(board,from_i,from_j,i,j)) {
   if (plyr_turn && (Math.abs(from_i-i)==1) && possibleMoveOnBoard(board,plyr_turn,2)) {
    if (double_jump) {
     showMsg(must_complete_your_move,1);
    } else {
     board[from_i][from_j]-=sign(board[from_i][from_j]);
     displayPiece(from_i,from_j);
     double_jump=false;
     selected=0;
     from_i=-1;
     from_j=-1;
     showMsg(have_to_take_piece,1);
    }
   } else {
    performMove(i,j);
    if (double_jump) {
     showMsg(complete_your_move,1);
    } else if (!game_over) {
     plyr_turn=0;
     prepareCompMove();
    }
   }
 } else if (!double_jump) {
  // An illegal move has been selected
  board[from_i][from_j]-=sign(board[from_i][from_j]);
  displayPiece(from_i,from_j);
  selected=0;
  from_i=-1;
  from_j=-1;
  showMsg(move_not_allowed,2);
 } else {
  // We have a double jump situation
  showMsg(must_complete_your_move,1);
 }
}

// The player (Fx) clicked on a square
function plyrClicked(i,j) {
 if (!show_alert) {
  if (game_over) {
   //showMsg(game_already_over,2);
   showAlert(game_already_over);
  } else if (plyr_turn) {
   if (!selected) {
    if (board[i][j]>0) {
     selectPiece(i,j);
     showMsg(select_destination,1);
    } else {
     showMsg(select_own_piece,2);
    }
   } else {
    movePlyrPiece(i,j);
   }
  } else {
   showMsg(not_your_turn,2);
  }
 }
}

// -- SETUP & UPDATE LANGUAGE --

// Set level of difficulty (Easy(1), Hard(2))
// Phases:
// 0: First computer move (comp has 12 pieces)
// 1: Each side has more than 8 pieces
// 2: One side has 8 or less pieces
// 3: One side has 4 or less pieces
// 4: Total pieces on board 8 or less
// 5: Total pieces on board 4 or less
// The game can become very slow if max_depth is higher than 4.
function setLevel(newlevel) {
 if (!show_alert) {
  if (0==newlevel) {
   level=getQsVal('level');
   if (-1==level) { level=getCookieVal('level'); }
  } else {
   level=newlevel;
   setCookie('level',level);
  }
  if (1==level) {
   max_depth_phase=[2,2,3,4,4,4]
  } else if (2==level) {
   max_depth_phase=[2,4,4,4,5,6]
  //} else if (3==level) {
   //max_depth_phase=[2,4,4,5,6,8]
  }
  if (document.SelectLevel) { setSelected(document.SelectLevel.level,level); }
 } else {
  if (document.SelectLevel) { setSelected(document.SelectLevel.level,level); }
 }
}

// Set language
function setLanguage() {
 // Local version of lang
 var lang=getQsVal('lang');
 if (-1==lang) {
  lang=getCookieVal('lang');
 }
 if (-1==lang) {
  lang=navigator.language?navigator.language:navigator.userLanguage;
 }
 lang=lang.toLowerCase();

 if (
  ('en-us'!=lang) &&
  ('en-gb'!=lang) &&
  ('et-ee'!=lang) &&
  ('nl-nl'!=lang) &&
  ('fr-fr'!=lang)
 ) {
  var langcode=lang.substring(0,2);
  if ('en'==langcode) { lang='en-us'; }
  else if ('et'==langcode) { lang='et-ee'; }
  else if ('nl'==langcode) { lang='nl-nl'; }
  else if ('fr'==langcode) { lang='fr-fr'; }
  else { lang='en-us'; }
 }
 loadLanguage(lang);
}

// Load language file
function loadLanguage(newlang) {
 if (!show_alert) {
  var langfile = document.createElement("script");
  langfile.src = 'lang-'+newlang+'.js';
  langfile.type="text/javascript";
  document.getElementsByTagName("head")[0].appendChild(langfile);
  // Set global lang
  lang=newlang;
  setCookie('lang',lang);
 } else {
  if (document.SelectLang) { setSelected(document.SelectLang.lang,lang); }
 }
}

// Update page elements for alternative languages
function updatePageElements() {
 if (document.title) { document.title=unescape(header); }
 replaceTextById('Header',header);
 replaceTextById('GameBlurb',game_blurb);
 if (!game_over && plyr_turn) { showMsg(select_a_piece,1); }
 replaceTextById('PlayAgain',play_again);
 replaceTextById('ResetScores',reset_scores);
 replaceTextById('ShowLastMove',show_last_move);
 replaceTextById('UndoMove',undo_move);
 replaceTextById('ShowAbout',show_about);
 replaceTextById('Rules',rules);
 replaceAttrById('Rules','href','rules-'+lang+'.html');
 replaceTextById('ShowGameLog',show_game_log);
 replaceTextById('LevelLabel',level_label);
 replaceTextById('LevelHard',level_hard);
 replaceTextById('LevelEasy',level_easy);
 setCheatStatus(false);
 //if (document.SelectLevel) { setSelected(document.SelectLevel.level,level); }
 replaceTextById('LanguageLabel',language_label);
 if (document.SelectLang) { setSelected(document.SelectLang.lang,lang); }
 replaceTextById('LangDesc',lang_desc);
 replaceTextById('PlayGame',play_game);
 replaceTextById('NoButton',no_button);
 replaceTextById('YesButton',yes_button);
 replaceTextById('OkButton',ok_button);
}

var checkers_version='2.2.2.3m3';

// -- THE END --
