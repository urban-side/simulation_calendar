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

// カレンダーの読み込み
$window.on('load',function(){
  calendarHeading(currentYear, currentMonth);
  calendarBody(currentYear, currentMonth, today);
});

/***************************************************************************************
ボタン処理の関数群
***************************************************************************************/
var run_status = false;
var start_date;
var start_time;
var date_counter;
var simulation_instance;

$('#set').click(function() {
  start_date = $('#start-date').val().trim();
  start_time = $('#start-time').val().trim();
  if (!(start_date.match(/\d{4}.\d{2}.\d{2}/g) && start_time.match(/\d{2}:\d{2}/g))) {
    alert("日付を選んでください");
  } else {
    $('#start-date').prop('disabled', true);
    $('#start-time').prop('disabled', true);
    $('#submit').prop('disabled', false);
    $('#stop').prop('disabled', false);
    $('#set').prop('disabled', true);
    $('.simulation-date').text(start_date);
    $('.simulation-time').text(start_time);
    sim_instance =  new UpdateSimulationTime(start_date, start_time);
  }
});

$('#submit').click(function() {
  doStart();
});

$('#stop').click(function(){
  var stop_botton = document.getElementById("stop").getAttribute("aria-pressed");
  if (stop_botton.indexOf("true") !== -1) {
    $('#stop').text('STOP');
    $('#submit').prop('disabled', false);
    doStart();
  } else {
    $('#stop').text('RESTART');
    $('#submit').prop('disabled', true);
    run_status = false;
    clearInterval(date_counter);
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
  clearInterval(date_counter);
  date_counter = setInterval("modelInstance()", interval_time);
  //timer();
}

function doReset(){
  clearInterval(date_counter);
  run_status = false;
  time = 0;
  $('#start-date').prop('disabled', false);
  $('#start-time').prop('disabled', false);
  $('#start-date').val(start_date);
  $('#start-time').val(start_time);
  document.getElementById("stop").setAttribute("aria-pressed", "false");
  $('#submit').prop('disabled', true);
  $('#stop').prop('disabled', true);
  $('#set').prop('disabled', false);
  $('#stop').text('STOP');
  //$('#timerLabel').text('00:00:00');
  $('.simulation-date').text('YYYY-MM-DD');
  $('.simulation-time').text('HH:MM');
}

/***************************************************************************************
仮装時刻の関数群
***************************************************************************************/
var interval_time = 10000/60;

function modelInstance() {
  sim_instance.calledConuter++;
  sim_instance.updateTime("minute");
  viewUpdate();
}

function viewUpdate() {
  $('.simulation-date').text(yyyymmdd(sim_instance.sim_year, sim_instance.sim_month, sim_instance.sim_day));
  $('.simulation-time').text(hhmm(sim_instance.sim_hour, sim_instance.sim_minute));
}

function yyyymmdd(y, m, d) {
    var y0 = ('000' + y).slice(-4);
    var m0 = ('0' + m+1).slice(-2);
    var d0 = ('0' + d).slice(-2);
    return y0+"-"+m0+"-"+d0;
}

function hhmm(h, m){
  var h0 = ('000' + h).slice(-2);
  var m0 = ('0' + m).slice(-2);
  return h0+":"+m0;
}

class UpdateSimulationTime {
  constructor(startDate, startTime) {
    this.sim_year = startDate.substr(0, 4)|0;
    this.sim_month = startDate.substr(6, 2)|0;
    this.sim_day = startDate.substr(-2)|0;
    this.sim_hour = startTime.substr(0, 2)|0;
    this.sim_minute = startTime.substr(-2)|0;
  }

  updateTime(category){
    switch (category) {
      case "hour":
        if (this.sim_hour == 23) {
          this.sim_hour = 0;
          this.updateDate("day");
        } else {
          this.sim_hour ++;
        }
        break;
      case "minute":
        if (this.sim_minute == 59) {
          this.sim_minute = 0;
          this.updateTime("hour");
        } else {
          this.sim_minute ++;
        }
        break;
      default:
        alert("! error ! category = "+category);
        clearInterval(date_counter);
        break;
    }
  }

  updateDate(category){
    switch (category) {
      case "year":
        this.sim_year ++;
        break;
      case "month":
        if (this.sim_month == 12) {
          this.sim_month = 1;
          this.updateTime("year");
        } else {
          this.sim_month ++;
        }
        break;
      case "day":
        if (this.sim_day == 30) {
          this.sim_day = 1;
          this.updateTime("month");
        } else {
          this.sim_day ++;
        }
        break;
      default:
        alert("! error ! category = "+category);
        clearInterval(date_counter);
        break;
    }
  }
}
