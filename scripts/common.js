/**
 * @return {string} The reCAPTCHA rendering mode from the configuration.
 */
 function getRecaptchaMode() {
    var config = parseQueryString(location.hash);
    return config['recaptcha'] === 'invisible' ?
        'invisible' : 'normal';
  }
  
  /**
   * @return {string} The email signInMethod from the configuration.
   */
  function getEmailSignInMethod() {
    var config = parseQueryString(location.hash);
    return config['emailSignInMethod'] === 'password' ?
        'password' : 'emailLink';
  }
  
  /**
   * @return {boolean} The disable sign up status from the configuration.
   */
  function getDisableSignUpStatus() {
    var config = parseQueryString(location.hash);
    return config['disableEmailSignUpStatus'] === 'true';
  }
  
  /**
   * @return {boolean} The admin restricted operation status from the configuration.
   */
  function getAdminRestrictedOperationStatus() {
    var config = parseQueryString(location.hash);
    return config['adminRestrictedOperationStatus'] === 'true';
  }
  
  
  /**
   * @param {string} queryString The full query string.
   * @return {!Object<string, string>} The parsed query parameters.
   */
  function parseQueryString(queryString) {
    // Remove first character if it is ? or #.
    if (queryString.length &&
        (queryString.charAt(0) == '#' || queryString.charAt(0) == '?')) {
      queryString = queryString.substring(1);
    }
    var config = {};
    var pairs = queryString.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      if (pair.length == 2) {
        config[pair[0]] = pair[1];
      }
    }
    return config;
  }



  //getting initial user data
  var myData = '';
  firebase.auth().onAuthStateChanged((user)=>{
    $('.loading').hide();
    if(user){
        db.ref('app/users/'+user.uid).on('value', snap=>{
           myData = {
            totalCorrect : snap.val().scores.totalCorrect,
            totalEmpt : snap.val().scores.totalEmpt,
            totalScore : snap.val().scores.totalScore,
            totalWrong : snap.val().scores.totalWrong,
            admission : snap.val().exams.admission,
            daily : snap.val().exams.daily,
            live : snap.val().exams.live,
            model : snap.val().exams.model,
            public : snap.val().exams.public,
            weekly : snap.val().exams.weekly,
            totalExams : snap.val().exams.total,
            createPermission: snap.val().createPermission,
            nickName: snap.val().nickName,
            group: snap.val().group,
            subscribed: snap.val().subscribed
           }
           localStorage.setItem('group', snap.val().group);

          $('.prName').text(myData.nickName);
          $('.prScore').html(`<i class="icofont-cop-badge"></i> <span>${myData.totalScore}</span>`);
           //Subscription remider
           
        });
        
    }
});



  //time & date picker
  (function ($) {
    'use strict';
    $.fn.dateTimePicker = function (options) {

        var settings = $.extend({
            selectData: "now",
            dateFormat: "YYYY-MM-DD HH:mm",
            showTime: true,
            locale: 'en',
            positionShift: { top: 20, left: 0},
            title: "Select Date and Time",
            buttonTitle: "Select"
        }, options);
        moment.locale(settings.locale);
        var elem = this;
        var limitation = {"hour": 23, "minute": 59};
        var mousedown = false;
        var timeout = 800;
        var selectDate = settings.selectData == "now" ? moment() : moment(settings.selectData, settings.dateFormat);
        if (selectDate < moment()) {
            selectDate = moment();
        }
        var startDate = copyDate(moment());
        var lastSelected = copyDate(selectDate);
        return this.each(function () {
            if (lastSelected != selectDate) {
                selectDate = copyDate(lastSelected);
            }
            elem.addClass("dtp_main");
            updateMainElemGlobal();
            //  elem.text(selectDate.format(settings.dateFormat));
            function updateMainElemGlobal() {
                var arrF = settings.dateFormat.split(' ');
                if (settings.showTime && arrF.length != 2) {
                    arrF.length = 2;
                    arrF[0] = 'DD/MM/YY';
                    arrF[1] = 'HH:mm';
                }
                var $s = $('<span>');
                $s.text(lastSelected.format(arrF[0]));
                elem.empty();
                elem.append($s);
                $s = $('<i>');
                $s.addClass('fa fa-calendar ico-size');
                elem.append($s);
                if (settings.showTime) {
                    $s = $('<span>');
                    $s.text(lastSelected.format(arrF[1]));
                    elem.append($s);
                    $s = $('<i>');
                    $s.addClass('fa fa-clock-o ico-size');
                    elem.append($s);
                }
            }
            elem.on('click', function () {
                var $win = $('<div>');
                $win.addClass("dtp_modal-win");
                var $body = $('body');
                $body.append($win);
                var $content = createContent();
                $body.append($content);
                var offset = elem.offset();
               // $content.css({top: (offset.top + settings.positionShift.top) + "px", left: (offset.left + settings.positionShift.left) + "px"});
                feelDates(selectDate);
                $win.on('click', function () {
                    $content.remove();
                    $win.remove();
                })
                if (settings.showTime) {
                    attachChangeTime();
                    var $fieldTime = $('#field-time');
                    var $hour = $fieldTime.find('#d-hh');
                    var $minute = $fieldTime.find('#d-mm');
                }

                function feelDates(selectM) {
                    var $fDate = $content.find('#field-data');
                    $fDate.empty();
                    $fDate.append(createMonthPanel(selectM));
                    $fDate.append(createCalendar(selectM));
                }

                function createCalendar(selectedMonth) {
                    var $c = $('<div>');
                    $c.addClass('dtp_modal-calendar');
                    for (var i = 0; i < 7; i++) {
                        var $e = $('<div>');
                        $e.addClass('dtp_modal-calendar-cell dtp_modal-colored');
                        $e.text(moment().weekday(i).format('ddd'));
                        $c.append($e);
                    }
                    var m = copyDate(selectedMonth);
                    m.date(1);
                    // console.log(m.format('DD--MM--YYYY'));
                    // console.log(selectData.format('DD--MM--YYYY'));
                    // console.log(m.weekday());
                    var flagStart = totalMonths(selectedMonth) === totalMonths(startDate);
                    var flagSelect = totalMonths(lastSelected) === totalMonths(selectedMonth);
                    var cerDay = parseInt(selectedMonth.format('D'));
                    var dayNow = parseInt(startDate.format('D'));
                    for (var i = 0; i < 6; i++) {
                        for (var j = 0; j < 7; j++) {
                            var $b = $('<div>');
                            $b.html('&nbsp;');
                            $b.addClass('dtp_modal-calendar-cell');
                            if (m.month() == selectedMonth.month() && m.weekday() == j) {
                                var day = parseInt(m.format('D'));
                                $b.text(day);
                                if (flagStart && day < dayNow) {
                                    $b.addClass('dtp_modal-grey');
                                }
                                else if (flagSelect && day == cerDay) {
                                    $b.addClass('dtp_modal-cell-selected');
                                }
                                else {
                                    $b.addClass('cursorily');
                                    $b.bind('click', changeDate);
                                }
                                m.add(1, 'days');
                            }
                            $c.append($b);
                        }
                    }
                    return $c;
                }

                function changeDate() {

                    var $div = $(this);
                    selectDate.date($div.text());
                    lastSelected = copyDate(selectDate);
                    updateDate();
                    var $fDate = $content.find('#field-data');
                    var old = $fDate.find('.dtp_modal-cell-selected');
                    old.removeClass('dtp_modal-cell-selected');
                    old.addClass('cursorily');
                    $div.addClass('dtp_modal-cell-selected');
                    $div.removeClass('cursorily');
                    old.bind('click', changeDate);
                    $div.unbind('click');
                    // console.log(selectDate.format('DD-MM-YYYY'));
                }

                function createMonthPanel(selectMonth) {
                    var $d = $('<div>');
                    $d.addClass('dtp_modal-months');
                    var $s = $('<i></i>');
                    $s.addClass('fa fa-angle-left cursorily ico-size-month hov');
                    //$s.attr('data-fa-mask', 'fas fa-circle');
                    $s.bind('click', prevMonth);
                    $d.append($s);
                    $s = $('<span>');
                    $s.text(selectMonth.format("MMMM YYYY"));
                    $d.append($s);
                    $s = $('<i></i>');
                    $s.addClass('fa fa-angle-right cursorily ico-size-month hov');
                    $s.bind('click', nextMonth);
                    $d.append($s);
                    return $d;
                }

                function close() {
                    if (settings.showTime) {
                        lastSelected.hour(parseInt($hour.text()));
                        lastSelected.minute(parseInt($minute.text()));
                        selectDate.hour(parseInt($hour.text()));
                        selectDate.minute(parseInt($minute.text()));
                    }
                    updateDate();
                    $content.remove();
                    $win.remove();
                }

                function nextMonth() {
                    selectDate.add(1, 'month');
                    feelDates(selectDate);
                }

                function prevMonth() {
                    if (totalMonths(selectDate) > totalMonths(startDate)) {
                        selectDate.add(-1, 'month');
                        feelDates(selectDate);
                    }
                }

                function attachChangeTime() {
                    var $angles = $($content).find('i[id^="angle-"]');
                    // $angles.bind('click', changeTime);
                    $angles.bind('mouseup', function () {
                        mousedown = false;
                        timeout = 800;
                    });
                    $angles.bind('mousedown', function () {
                        mousedown = true;
                        changeTime(this);
                    });
                }

                function changeTime(el) {
                    var $el = this || el;
                    $el = $($el);
                    ///angle-up-hour angle-up-minute angle-down-hour angle-down-minute
                    var arr = $el.attr('id').split('-');
                    var increment = 1;
                    if (arr[1] == 'down') {
                        increment = -1;
                    }
                    appendIncrement(arr[2], increment);
                    setTimeout(function () {
                        autoIncrement($el);
                    }, timeout);
                }

                function autoIncrement(el) {
                    if (mousedown) {
                        if (timeout > 200) {
                            timeout -= 200;
                        }
                        changeTime(el);
                    }
                }

                function appendIncrement(typeDigits, increment) {

                    var $i = typeDigits == "hour" ? $hour : $minute;
                    var val = parseInt($i.text()) + increment;
                    if (val < 0) {
                        val = limitation[typeDigits];
                    }
                    else if (val > limitation[typeDigits]) {
                        val = 0;
                    }
                    $i.text(formatDigits(val));
                }

                function formatDigits(val) {

                    if (val < 10) {
                        return '0' + val;
                    }
                    return val;
                }

                function createTimer() {
                    var $div = $('<div>');
                    $div.addClass('dtp_modal-time-mechanic');
                    var $panel = $('<div>');
                    $panel.addClass('dtp_modal-append');
                    var $i = $('<i>');
                    $i.attr('id', 'angle-up-hour');
                    $i.addClass('fa fa-angle-up ico-size-large cursorily hov');
                    $panel.append($i);
                    var $m = $('<span>');
                    $m.addClass('dtp_modal-midle');
                    $panel.append($m);
                    $i = $('<i>');
                    $i.attr('id', 'angle-up-minute');
                    $i.addClass('fa fa-angle-up ico-size-large cursorily hov');
                    $panel.append($i);
                    $div.append($panel);

                    $panel = $('<div>');
                    $panel.addClass('dtp_modal-digits');
                    var $d = $('<span>');
                    $d.addClass('dtp_modal-digit');
                    $d.attr('id', 'd-hh');
                    $d.text(lastSelected.format('HH'));
                    $panel.append($d);
                    $m = $('<span>');
                    $m.addClass('dtp_modal-midle-dig');
                    $m.html(':');
                    $panel.append($m);
                    $d = $('<span>');
                    $d.addClass('dtp_modal-digit');
                    $d.attr('id', 'd-mm');
                    $d.text(lastSelected.format('mm'));
                    $panel.append($d);
                    $div.append($panel);

                    $panel = $('<div>');
                    $panel.addClass('dtp_modal-append');
                    $i = $('<i>');
                    $i.attr('id', 'angle-down-hour');
                    $i.addClass('fa fa-angle-down ico-size-large cursorily hov');
                    $panel.append($i);
                    $m = $('<span>');
                    $m.addClass('dtp_modal-midle');
                    $panel.append($m);
                    $i = $('<i>');
                    $i.attr('id', 'angle-down-minute');
                    $i.addClass('fa fa-angle-down ico-size-large cursorily hov');
                    $panel.append($i);
                    $div.append($panel);
                    return $div;
                }

                function createContent() {
                    var $c = $('<div>');
                    if (settings.showTime) {
                        $c.addClass("dtp_modal-content");
                    }
                    else {
                        $c.addClass("dtp_modal-content-no-time");
                    }
                    var $el = $('<div>');
                    $el.addClass("dtp_modal-title");
                    $el.text(settings.title);
                    $c.append($el);
                    $el = $('<div>');
                    $el.addClass('dtp_modal-cell-date');
                    $el.attr('id', 'field-data');
                    $c.append($el);
                    if (settings.showTime) {
                        $el = $('<div>');
                        $el.addClass('dtp_modal-cell-time');
                        var $a = $('<div>');
                        $a.addClass('dtp_modal-time-block');
                        $a.attr('id', 'field-time');
                        $el.append($a);
                        var $line = $('<div>');
                        $line.attr('id', 'time-line');
                        $line.addClass('dtp_modal-time-line');
                        $line.text(lastSelected.format(settings.dateFormat));

                        $a.append($line);
                        $a.append(createTimer());
                        var $but = $('<div>');
                        $but.addClass('dpt_modal-button');
                        $but.text(settings.buttonTitle);
                        $but.bind('click', close);
                        $el.append($but);
                        $c.append($el);
                    }
                    return $c;
                }
                function updateDate() {
                    if (settings.showTime) {
                        $('#time-line').text(lastSelected.format(settings.dateFormat));
                    }
                    updateMainElem();
                    elem.next().val(selectDate.format(settings.dateFormat));
                    if (!settings.showTime) {
                        $content.remove();
                        $win.remove();
                    }
                }

                function updateMainElem() {
                    var arrF = settings.dateFormat.split(' ');
                    if (settings.showTime && arrF.length != 2) {
                        arrF.length = 2;
                        arrF[0] = 'DD/MM/YY';
                        arrF[1] = 'HH:mm';
                    }
                    var $s = $('<span>');
                    $s.text(lastSelected.format(arrF[0]));
                    elem.empty();
                    elem.append($s);
                    $s = $('<i>');
                    $s.addClass('icofont-rounded-up ico-size');
                    elem.append($s);
                    if (settings.showTime) {
                        $s = $('<span>');
                        $s.text(lastSelected.format(arrF[1]));
                        elem.append($s);
                        $s = $('<i>');
                        $s.addClass('ficofont-rounded-down ico-size');
                        elem.append($s);
                    }
                }

            });

        });

    };

    function copyDate(d) {
        return moment(d.toDate());
    }

    function totalMonths(m) {
        var r = m.format('YYYY') * 12 + parseInt(m.format('MM'));
        return r;
    }

}(jQuery));
// fa-caret-down

//TAGS

var tag = {
"a": "A level",
"cs": "CS",
  "hsc": "HSC",
  "sci" : "বিজ্ঞান",
  "com" : "ব্যাবসায় শিক্ষা",
  "hum" : "মানবিক",
  "topic" : "টপিক ভিত্তিক",
  "chapter" : "অধ্যায় ভিত্তিক",
  "subjec_final" : "সাবজেক্ট ফাইনাল",
  "model_test" : "মডেল টেস্ট",
  "public": "Public",
  "live": "Live",
  "admission" : "admission",
  "b1" : "বাংলা প্রথম পত্র",
  "b2" : "বাংলা দ্বিতীয় পত্র",
  "e" : "English Grammar",
  "phy1" : "পদার্থবিজ্ঞান ১ম পত্র",
  "phy2" : "পদার্থবিজ্ঞান ২য় পত্র",
  "chem1" : "রসায়ন ১ম পত্র",
  "chem2" : "রসায়ন ২য় পত্র",
  "math1" : "উচ্চতর গণিত ১ম পত্র",
  "math2" : "উচ্চতর গণিত ২য় পত্র",
  "bio1" : "জীববিজ্ঞান ১ম পত্র",
  "bio2" : "জীববিজ্ঞান ২য় পত্র",
  "ict" : "তথ্য ও যোগাযোগ প্রযুক্তি",
  "sco1": "সমাজবিজ্ঞান ১ম পত্র",
  "sco2" : "সমাজবিজ্ঞান ২য় পত্র",
  "civ1" : "পৌরনীতি ১ম পত্র ",
  "civ2"  : "পৌরনীতি ২য় পত্র",
  "eco1"  : "অর্থনীতি ১ম পত্র",
  "eco2"  : "অর্থনীতি ২য় পত্র",
  "his1"  : "ইতিহাস ১ম পত্র",
  "his2"  : "ইতিহাস ২য় পত্র",
  "psy1"  : "মনোবিজ্ঞান ১ম পত্র",
  "psy2"  : "মনোবিজ্ঞান ২য় পত্র",
  "a&c1"  : "",
  "a&c2"  : "",
  "geo1"  : "ভূগোল ১ম পত্র",
  "geo2"  : "ভূগোল ২য় পত্র",
  "gk1"  : "GK - বাংলাদেশ",
  "gk2"  : "GK - আন্তর্জাতিক",
  "bcs"  : "বিসিএস",
  "none"  : "অন্যান্য",
  "uni"  : "বিশ্ববিদ্যালয়",
  "med"  : "মেডিকেল",
  "eng"  : "ইঞ্জিনিয়ারিং",
  "model": "মডেল টেস্ট"
};
const sectionsTag = {
    "bngandlit": "বাংলা",
    "eng": "English",
    "bgk": "GK-বাংলাদেশ",
    "igk": "GK-আন্তর্জাতিক",
    "gsc": "সাধারণ বিজ্ঞান",
    "ict": "তথ্য ও যোগা...",
    "math": "গণিত",
    "geo": "ভুগল, পরিবেশ...",
    "moral": "নৈতিকতা, মূল্য..."
}
function firstLetter(str){
  return str[0];
}

var optionsTag = {
    "1" : "A",
    "2" : "B",
    "3" : "C",
    "4" : "D",
}

function date_formatter(date){
    //console.log(date);
  let d = date.split(" ");
   let months = {
     "Jan" : "জানুয়ারি",
     "Feb" : "ফেব্রুয়ারি",
     "Mar" : "মার্চ",
     "Apr" : "এপ্রিল",
     "May" : "মে",
     "Jun" : "জুন",
     "Jul" : "জুলাই",
     "Aug" : "আগস্ট",
     "Sep" : "সেপ্টেম্বর",
     "Oct" : "অক্টোবর",
     "Nov" : "নভেম্বর",
     "Dec" : "ডিসেম্বর"
   }

   let day = {
     "Fri" : "শুক্র",
     "Sat" : "শনি",
     "Sun" : "রবি",
     "Mon" : "সোম",
     "Tue" : "মঙ্গল",
     "Wed" : "বুধ",
     "Thu" : "বৃহস্পতি"
   }

  let time = d[4].split(":");
  
  if(parseInt(time[0]) > 12){
    time = parseInt(time[0])-12 + ":" + time[1] + "PM";
  }else{
    time = parseInt(time[0]) + ":" + time[1] + "AM";
  }

   return d[2] + " " + months[d[1]] + " " + d[3] + " ~ " + time; 

}

var negativeTag  ={
    "0" : 'No Negative',
    "0.25" :'<i class="icofont-arrow-down"></i>0.25',
    "0.50" : '<i class="icofont-arrow-down"></i>0.50'
}

var timer;

function countDownTimer(time,element, parentNode){
var countDownDate = new Date(time).getTime();
timer = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if(days!==0){
    $('#'+element).html( `${days} day ${hours} hr ${minutes} min ${seconds} sec`);
  }
 else if(hours===0 && minutes !== 0){
    $('#'+element).html( `${minutes} min ${seconds} sec`);
  }else if(hours===0 && minutes===0){
    $('#'+element).html( `${seconds}`);
  }else{
    $('#'+element).html( `${hours} hr ${minutes} min ${seconds} sec`);
  }
 
  if (distance < 0) {
    clearInterval(timer);
//    $($('#'+element)[0].parentNode).hide(200);
   $('.'+element).hide(50);
  }
}, 1000);
}

let ansOpt = {
    1: "A",
    2: "B",
    3: "C",
    4: "D"
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

