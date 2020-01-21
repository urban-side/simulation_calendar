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
var cldr;

class Calendar {
  constructor(year, month) {
    this.startDate = new Date(year, month, 1); // その月の最初の日の情報
    this.endDate  = new Date(year, month + 1 , 0); // その月の最後の日の情報
    this.startDay = this.startDate.getDay();// その月の最初の日の曜日を取得
    this.endDay = this.endDate.getDate();// その月の最後の日の曜日を取得
    this.textSkip = true; // 日にちを埋める用のフラグ
    this.textDate = 1; // 日付(これがカウントアップされます)
    this.tableBody =''; // テーブルのHTMLを格納する変数
    this.drowCalender(this);
  }

  drowCalender(object){
    for (var row = 0; row < 6; row++){
      var tr = '<tr>';

      for (var col = 0; col < 7; col++) {
        if (row === 0 && object.startDay === col){
          object.textSkip = false;
        }
        if (object.textDate > object.endDay) {
          object.textSkip = true;
        }

        var addClass = object.textDate === today.getDate() ? 'is-today' : '';
        var textTd = object.textSkip ? '&nbsp;' : object.textDate++;
        var td = '<td class="'+'cldr-date '+addClass+'">'+textTd+'</td>';
        tr += td;
      }
      tr += '</tr>';
      object.tableBody += tr;
    }
    $tbody.html(object.tableBody);
  }

  // カレンダーの次の日にセット
  dayUpdate(){
    var today = sim_instance.sim_day;
    todayHighlightUpdate(undefined, undefined, today);
  }

  // カレンダーを次の月に更新し一日にセット
  monthUpdate(){
    cldr = new Calendar(sim_instance.sim_year, sim_instance.sim_month-1, today);
    todayHighlightUpdate(sim_instance.sim_year, sim_instance.sim_month, 1);
  }

  // シミュレーションを開始した（setした）時点の時間に戻す
  clearDate(){
    var start_Y = start_date.substr(0, 4)|0;
    var start_M = start_date.substr(5, 2)|0;
    var start_D = start_date.substr(-2)|0;
    today = new Date();
    cldr = new Calendar(start_Y, start_M-1);
    todayHighlightUpdate(start_Y, start_M, start_D);
  }

}

// カレンダーの赤いハイライト更新
function todayHighlightUpdate(year = $('#js-year').text(), month = $('#js-month').text(), date){
  $('.is-today').removeClass('is-today');
  $('.cldr-date').each(function(index, element){
    if ($(element).text() == date) {
      $(element).addClass('is-today');
      return false;
    }
  });
  $('#js-year').text(year);
  $('#js-month').text(month);
}

function calendarHeading(year, month){
  $year.text(year);
  $month.text(month + 1);
}

function makecalerderInstance() {
  cldr = new Calendar(currentYear, currentMonth, today);
}

// 起動時の処理
$window.on('load',function(){
  calendarHeading(currentYear, currentMonth);
  makecalerderInstance();
  $('#start-date').val(yyyymmdd(currentYear, currentMonth+1, today.getDate()));
  retinaCheck = window.devicePixelRatio;
  console.log("Retina check result: "+retinaCheck);
  if (retinaCheck >= 1) {
    console.log("This is Retina Display.");
  } else {
    console.log("This is not Retina.");
  }
});

/***************************************************************************************
ボタン処理の関数群
***************************************************************************************/
var run_status = false;
var start_date,
    start_time;
var date_counter;
var simulation_instance;

$( function() {

  $('#set').click(function() {
    start_date = $('#start-date').val().trim();
    start_time = $('#start-time').val().trim();
    if (!(start_date.match(/\d{4}.\d{2}.\d{2}/g) && start_time.match(/\d{2}:\d{2}/g))) {
      alert("日付・時刻を選んでください");
    } else {
      doSet();
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

  function doSet() {
    $('#start-date').prop('disabled', true);
    $('#start-time').prop('disabled', true);
    $('#submit').prop('disabled', false);
    $('#stop').prop('disabled', true);
    $('#set').prop('disabled', true);
    $('.simulation-date').text(start_date);
    $('.simulation-time').text(start_time);
    sim_instance =  new UpdateSimulationTime(start_date, start_time);
    cldr.clearDate();
    clockViewUpdate();
  }

  function doStart() {
    run_status = true;
    $('#stop').prop('disabled', false);
    doStartInstance(sim_instance.outdayTime);
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
    clockViewUpdate(0, 0);
    cldr.clearDate();
  }

});

function doStartInstance(out_dayTime){
  clearInterval(date_counter);
  if (out_dayTime) {
    date_counter = setInterval("modelInstance()", interval_time_out/60);
  } else {
    date_counter = setInterval("modelInstance()", interval_time/60);
  }
}

/***************************************************************************************
仮装時刻の関数群
***************************************************************************************/
var interval_time = 60000;  // 1時間あたりの秒数[ms]（営業時間中）
var interval_time_out = 7500;  // 1時間あたりの秒数[ms]（営業時間外）
var update_date = false;   // 日が変わった瞬間を知らせるフラグ
    update_month = false;   // 月が変わった瞬間を知らせるフラグ

// controller関数（こいつが色々指示を出す）
function modelInstance() {
  sim_instance.updateTime("minute");
  viewUpdate();
}

function viewUpdate() {
  degitalViewUpdate();
  clockViewUpdate();
  if (update_date){
    update_date = false;
    cldr.dayUpdate();
  }
  if (update_month) {
    update_month = false;
    cldr.monthUpdate();
  }
}

// 画面下部のデジタル表記を更新
function degitalViewUpdate() {
  // デジタル表記の更新
  $('.simulation-date').text(yyyymmdd(sim_instance.sim_year, sim_instance.sim_month, sim_instance.sim_day));
  $('.simulation-time').text(hhmm(sim_instance.sim_hour, sim_instance.sim_minute));
}

// アナログ時計の表示を更新（参考：http://myprogramming.hatenablog.com/entry/2017/06/25/195248）
function clockViewUpdate(hour = sim_instance.sim_hour, minute = sim_instance.sim_minute) {
    // アナログ時計の更新
    loc = " translate(-50%, 0%)"
    $("#hour").css("transform", loc+"rotate("+(hour*30 + minute*0.5)+"deg)");
    $("#minute").css("transform", loc+"rotate("+(minute*6)+"deg)");
    // $('#second').css("transform", "rotate("+(time.getSeconds()*6)+"deg)");
}

// 表示用の桁合わせ関数
function yyyymmdd(y, m, d) {
    var y0 = ('000' + y).slice(-4);
    var m0 = ('0' + m).slice(-2);
    var d0 = ('0' + d).slice(-2);
    return y0+"-"+m0+"-"+d0;
}

function hhmm(h, m){
  var h0 = ('000' + h).slice(-2);
  var m0 = ('0' + m).slice(-2);
  return h0+":"+m0;
}

// シミュレーションの仮想時刻を保持するクラス
class UpdateSimulationTime {
  constructor(startDate, startTime) {
    this.sim_year = startDate.substr(0, 4)|0;
    this.sim_month = startDate.substr(5, 2)|0;
    this.sim_day = startDate.substr(-2)|0;
    this.sim_hour = startTime.substr(0, 2)|0;
    this.sim_minute = startTime.substr(-2)|0;
    if (this.sim_hour >= 18 || (this.sim_hour < 10)) {
      this.outdayTime = true;
    } else {
      this.outdayTime = false;
    }
  }

  updateTime(category){
    switch (category) {
      case "hour":
        if (this.sim_hour == 23) {
          this.sim_hour = 0;
          update_date = true;
          this.updateDate("day");
        } else {
          this.sim_hour ++;
          if (this.sim_hour == 18) {
            this.outdayTime = true;
            viewUpdate();
            doStartInstance(this.outdayTime);
          } else if (this.sim_hour == 10) {
            this.outdayTime = false;
            viewUpdate();
            doStartInstance(this.outdayTime);
          }
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
          this.updateDate("year");
        } else {
          this.sim_month ++;
        }
        break;
      case "day":
        if (this.sim_day == (""+cldr.endDate).substr(8,2)|0) {  // cldr.endDate = Fri Ja 31 2020 ... で出てくるので、都合よくトリミング。
          this.sim_day = 1;
          update_month = true;
          this.updateDate("month");
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
