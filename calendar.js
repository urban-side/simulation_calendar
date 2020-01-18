/***************************************************************************************
カレンダー表示の関数群
***************************************************************************************/
var $window = $(window);
var $year = $('#js-year');
var $month = $('#js-month');
var $tbody = $('#js-calendar-body');

var today = new Date();
var currentYear = today.getFullYear(),
    currentMonth = today.getMonth();

$window.on('load',function(){
  calendarHeading(currentYear, currentMonth);
  calendarBody(currentYear, currentMonth, today);
});

function calendarBody(year, month, today){
  var todayYMFlag = today.getFullYear() === year && today.getMonth() === month ? true : false; // 本日の年と月が表示されるカレンダーと同じか判定
  var startDate = new Date(year, month, 1); // その月の最初の日の情報
  var endDate  = new Date(year, month + 1 , 0); // その月の最後の日の情報
  var startDay = startDate.getDay();// その月の最初の日の曜日を取得
  var endDay = endDate.getDate();// その月の最後の日の曜日を取得
  var textSkip = true; // 日にちを埋める用のフラグ
  var textDate = 1; // 日付(これがカウントアップされます)
  var tableBody =''; // テーブルのHTMLを格納する変数

  for (var row = 0; row < 6; row++){
    var tr = '<tr>';

    for (var col = 0; col < 7; col++) {
      if (row === 0 && startDay === col){
        textSkip = false;
      }
      if (textDate > endDay) {
        textSkip = true;
      }
      var addClass = todayYMFlag && textDate === today.getDate() ? 'is-today' : '';
      var textTd = textSkip ? '&nbsp;' : textDate++;
      var td = '<td class="'+addClass+'">'+textTd+'</td>';
      tr += td;
    }
    tr += '</tr>';
    tableBody += tr;
  }
  $tbody.html(tableBody);
}

function calendarHeading(year, month){
  $year.text(year);
  $month.text(month + 1);
}

/***************************************************************************************
ボタン処理の関数群
***************************************************************************************/
var run_status = false;
var start_date = null;

$('#submit').click(function() {
  start_date = $('#start-date').val().trim();
  start_time = $('#start-time').val().trim();
  if (!(start_date.match(/\d{4}.\d{2}.\d{2}/g) && start_time.match(/\d{2}:\d{2}/g))) {
    alert("日付を選んでください");
  } else if(run_status) {
    run_status = run_status;  // 何もしない
  } else {
    $('#start-date').hide();
    $('#start-time').hide();
    $('#start-date-label').text("開始日時："+start_date+" "+start_time);
    doReset();
    doStart();
  }
});

$('#stop').click(function(){
  var stop_botton = document.getElementById("stop").getAttribute("aria-pressed");
  if (stop_botton.indexOf("true") !== -1) {
    $('#stop').text('STOP');
    $('#submit').show();
    doStart();
  } else if (runStatusCheck()) {
    $('#stop').text('RESTART');
    $('#submit').hide();
    run_status = false;
  }
});

$('#reset').click(function() {
  var btn = window.confirm("止めてもよろしいですか？");
  if (btn) {
    doReset();
  }
});

function runStatusCheck(){
  if (!run_status) {
    alert("カウントが始まっていません");
    return false;
  }
  return true;
}

function doStart() {
  run_status = true;
  timer();
}

function doReset(){
  run_status = false;
  time = 0;
  $('#start-date-label').text("開始日時：");
  $('#start-date').show();
  $('#start-time').show();
  $('#start-date').val(start_date);
  $('#start-time').val(start_time);
  document.getElementById("stop").setAttribute("aria-pressed", "false");
  $('#submit').show();
  $('#stop').text('STOP');
  $('#timerLabel').text('00:00:00');
}

/***************************************************************************************
経過時間表示の関数群
***************************************************************************************/
var timerLabel = document.getElementById('timerLabel');
var time = 0;
var min = Math.floor(time/100/60);
var sec = Math.floor(time/100);
var mSec = time % 100;

function timer() {
  // ステータスが動作中の場合のみ実行
  if (run_status) {
    setTimeout( function() {
      time++;
      // 分が１桁の場合は、先頭に０をつける
      if (min < 10) min = "0" + min;
      // 秒が６０秒以上の場合　例）89秒→29秒にする
      if (sec >= 60) sec = sec % 60;
      // 秒が１桁の場合は、先頭に０をつける
      if (sec < 10) sec = "0" + sec;
      // ミリ秒が１桁の場合は、先頭に０をつける
      if (mSec < 10) mSec = "0" + mSec;
      // タイマーラベルを更新
      timerLabel.innerHTML = min + ":" + sec + ":" + mSec;

      // 再びtimer()を呼び出す
      timer();
    }, 10);
  }
}

/***************************************************************************************
仮装時刻表示の関数群
***************************************************************************************/
