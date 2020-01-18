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

/*
ボタン処理関数群
*/
$(function() {
  var run_status = false;
  var start_date = null;
  $('#submit').click(function() {
    start_date = $('#start-date').val().trim();
    if (start_date.match(/\d{4}.\d{2}.\d{2}/g)) {
      $('#start-date').hide();
      $('#start-date-label').text("開始日時："+start_date);
      run_status = true;
    } else {
      alert("日付を選んでください");
    }
  });

	$('#stop').click(function(){
    var stop_botton = document.getElementById("stop").getAttribute("aria-pressed");
    if (runStatusCheck() && stop_botton.indexOf("false") !== -1) {
      $('#stop').text('RESTART');
    } else {
      $('#stop').text('STOP');
    }
	});

  $('#reset').click(function() {
    if (runStatusCheck()){
      var btn = window.confirm("止めてもよろしいですか？");
  		if (btn) {
        run_status = false;
        $('#start-date-label').text("開始日時：");
        $('#start-date').show();
        $('#start-date').val(start_date);
        document.getElementById("stop").setAttribute("aria-pressed", "false");
        $('#stop').text('STOP');
      }
    }
	});

  function runStatusCheck(){
    if (!run_status) {
      alert("カウントが始まっていません");
      return false;
    }
    return true;
  }
});
