var router = new Navigo(null, true, '#!');
var app = document.querySelector("#app");
$(document).ready(function(){
  $('.modal').modal();
});



firebase.auth().onAuthStateChanged((user)=>{
  if(user){
    
    $('.top').show();
    $('.image').html(`<img src="${user.photoURL}"/>`);
    $('.imagexBig0').html(`<div class="navprogImg"><img src="${user.photoURL}"/></div>`);
    $('.myname').html(`${user.displayName}`);
    $('.myemail').html(`${user.email}`);
    $('.sign').hide();
// $('.deleteAc').click(function(){
//   window.location.reload()
// });

db.ref('app/users/'+user.uid).on('value', p=>{
  if(p.val().details == false){
    $('.details_form').show();
    $('.details_form').html(`
    <form id="get_info">
    <div class="get_info_title">Your Information</div>

    <div class="input_field">
    <input name="nick" type="text" placeholder="Nick Name" required/>
    </div>
    
    <div class="input-field col s12">
    <select name="sl_group_info" required>
      <option value="" disabled selected>Select Group</option>
      <option value="sci">Science</option>
      <option value="com">Commerce</option>
      <option value="hum">Humanity</option>
      <option value="none">Other/None</option>
      </select>
      </div>

      <div class="input_field">
      <input name="inst" type="text" placeholder="Institution" required/>
      </div>
     <div class="dist_list"></div>

     <div class="input_field">
     <input name="phone" type="number" placeholder="Phone" required/>
     </div>

     <div class="input_field">
     <input name="bio" type="text" placeholder="Bio" required/>
     </div>
<center><button type="submit" class="btn green">Submit</button></center>
  </form>
    `);

    fetch('./scripts/districts.json')
    .then(res=>res.json())
    .then(data=>{
      let html = `<div class="input-field col s12"><select name="sl_dist_info" required><option value="" disabled selected>জেলা</option>`;
      for(let i=0; i<data.districts.length; i++){
        html+=`
        <option value="${data.districts[i].bn_name}">${data.districts[i].bn_name}</option>
        `
      }
      html += ` </select></div>`;

      $('.dist_list').html(html);
      $(document).ready(function () {
        $("select").formSelect();
      });
    })

    $(document).ready(function () {
      $("select").formSelect();
    });


 const gi = document.getElementById('get_info');

 gi.addEventListener('submit', e=>{
   e.preventDefault();
   var data = {
     nickName: gi.nick.value,
     group: gi.sl_group_info.value,
     inst: gi.inst.value,
     district: gi.sl_dist_info.value,
     phone: gi.phone.value,
     bio: gi.bio.value,
     details: true
   }
   Swal.fire({
    title: 'Do you want to save the changes?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Save',
    denyButtonText: `Don't save`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire('Saved!', '', 'success');
      db.ref('app/users/'+user.uid).update(data);
      store.collection('globalScore').doc(user.uid).update({
        name: data.nickName,
        inst: data.inst +"|"+data.group
      });
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
   
 })

  }else{
    $('.details_form').hide();
  }
});
$('.app_loader').show();
(async()=>{
  console.log("%c Waiting for Database Response...", "color: red; font-size: 15px; font-family: Hind Siliguri; font-weight: bold;");
  await new Promise(resolve=>{
    let st = setInterval(()=>{
      let data = myData;
      if(data != ''){
        clearInterval(st);
        resolve();
      }
    }, 500);
  })


  console.log('%c Database is Ready!', "color: green; font-size: 15px; font-family: Hind Siliguri; font-weight: bold;")
  $('.app_loader').hide();


router.on({
"/": function(){
  $('.footer').show();
  // $('.app_loader').show();
  $('.footer').show();
  $('.footertext').hide();
  $('.footerIcon').removeClass('footerIconActive');
  if($('.hm')[0].classList[3] === undefined){
    $('.hm').addClass('footerIconActive');
    $($($('.hm')[0].parentNode)[0].lastElementChild).show();
  }
  $('.top_logo').html(`<div class="animate__animated animate__fadeIn top_app_title"><div class="top_dir"><img src="./images/puzzle.png" height="20px"></div> <div class="top_text">বৃত্ত</div></div>`);
  // $('.top_logo').html(`<divclass="top_app_title"><div class="animate__animated animate__fadeLeft top_dir"><i class="icofont-focus"></i></div> <div class="animate__animated animate__fadeIn top_text">Public Exams</div></div>`);
  app.innerHTML= `
  <div class="div-1 free-exams">
  <center> <div class="preloader-wrapper small active">
            <div class="spinner-layer spinner-red">
              <div class="circle-clipper left">
                <div class="circle"></div>
              </div><div class="gap-patch">
                <div class="circle"></div>
              </div><div class="circle-clipper right">
                <div class="circle"></div>
              
                </div>
            
              </div>
          </center> 
  </div>
<div class="sl">
<div class="sl_menu">
<a href="#!/subjects"> 
<div class="sl_item">
<div class="sl_icon"><img src="../images/book-stack.png"></div>
<div class="sl_name">বিষয় সমূহ</div>
</div>
</a>

<a href="#!/practice/subject/model"> 
<div class="sl_item">
<div class="sl_icon"><img src="../images/test.png"></div>
<div class="sl_name">মডেল টেস্ট</div>
</div>
</a>

</div>


</div>

<br/>
<div class="div-1">
<div class="menu_title"><img src="../images/together.png"> Recent Solution</div>

<div id="solution_cards" class="hoz-scroll"></div>


  `

solutionsCard('solution_cards');

  
  store.collection('public_exams').orderBy("publish_date", 'desc').limit(100).onSnapshot(snap=> {
    let rncount = 0, upcount=0, endcount=0 
    // $('.app_loader').hide();
    $('.free-exams').html(`<div class="h-menu">
    <div class="menu_title"><img src="../images/free-exam.png"> Free Exams</div>
  <div class="menu_items">
  <a href="#!/exams/public/running"><div class="item">
  <div class="item_name">Running</div> <div id="rn_count" class="c_num">0</div>
  </div></a>
  <a href="#!/exams/public/upcoming"><div class="item">
  <div class="item_name">Upcoming</div> <div id="up_count" class="c_num">0</div>
  </div></a>
  <a href="#!/exams/public/ended"><div class="item">
  <div class="item_name">Ended</div> <div id="end_count" class="c_num">0</div>
  </div></a>
    </div>
    </div>`)
    snap.forEach(doc=> {
      let data = doc.data();
      if(new Date(data.details.end_date) > new Date() && new Date(data.details.start_date) < new Date()){rncount++}
      if(new Date(data.details.start_date) > new Date()){upcount++;}
      if(new Date(data.details.end_date) < new Date()){endcount++;}
     })
    $('#rn_count').text(rncount);
    $('#up_count').text(upcount);
    $('#end_count').text(endcount);
  });
},
"/subjects": function(){
  $('.footer').hide();
  // $('.app_loader').show();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">বিষয় সমূহ</div></div>`);
      app.innerHTML = `
<div class="sl">
  <div class="sl_menu">
  <a href="#!/practice/subject/b1"> 
  <div class="sl_item">
  <div class="sl_icon"><img src="../images/literature.png"></div>
  <div class="sl_name">বাংলা ১ম পত্র</div>
  </div>
  </a>
  <a href="#!/practice/subject/b2">
  <div class="sl_item">
  <div class="sl_icon"><img src="../images/reading.png"></div>
  <div class="sl_name">বাংলা ২য়  পত্র</div>
  </div>
  </a>
  <a href="#!/practice/subject/e">
  <div class="sl_item">
  <div class="sl_icon"><img src="../images/grammar.png"></div>
  <div class="sl_name">English 2nd</div>
  </div>
  </a>

  <a href="#!/practice/subject/phy1">
<div class="sl_item">
<div class="sl_icon"><img src="../images/phy1.png"></div>
<div class="sl_name">পদার্থ ১ম</div>
</div>
</a>

<a href="#!/practice/subject/phy2">
<div class="sl_item">
<div class="sl_icon"><img src="../images/phy2.png"></div>
<div class="sl_name">পদার্থ ২য় </div>
</div>
</a>

<a href="#!/practice/subject/chem1">
<div class="sl_item">
<div class="sl_icon"><img src="../images/che1.png"></div>
<div class="sl_name">রসায়ন ১ম</div>
</div>
</a>

<a href="#!/practice/subject/chem2">
<div class="sl_item">
<div class="sl_icon"><img src="../images/che2.png"></div>
<div class="sl_name">রসায়ন ২য়</div>
</div>
</a>


<a href="#!/practice/subject/bio1">
<div class="sl_item">
<div class="sl_icon"><img src="../images/leaf.png"></div>
<div class="sl_name">জীববিজ্ঞান ১ম</div>
</div>
</a>

<a href="#!/practice/subject/bio2">
<div class="sl_item">
<div class="sl_icon"><img src="../images/zoology.png"></div>
<div class="sl_name">জীববিজ্ঞান ২য়</div>
</div>
</a>

<a href="#!/practice/subject/math1">
<div class="sl_item">
<div class="sl_icon"><img src="../images/math1.png"></div>
<div class="sl_name">উচ্চ. গণিত ১ম</div>
</div>
</a>

<a href="#!/practice/subject/math2">
<div class="sl_item">
<div class="sl_icon"><img src="../images/math2.png"></div>
<div class="sl_name">উচ্চ. গণিত ২য়</div>
</div>
</a>

<a href="#!/practice/subject/ict">
<div class="sl_item">
<div class="sl_icon"><img src="../images/ict.png"></div>
<div class="sl_name">ICT</div>
</div>
</a>

</div>
  </div>
      `
},
"/exams/:id/:id2": function(params){
  $('.footer').hide();
    $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Public Exams</div></div>`);
    $('.app_loader').show();
  
    app.innerHTML = `
    <div id="aaa+p"></div>
    <div class="menu_title" id="all_t"></div>
  <div class="examlist">
  </div>
  `;
 const examlist = document.querySelector('.examlist');
 store.collection(params.id+'_exams').orderBy("publish_date", 'desc').limit(20).onSnapshot(snap=> {
  examlist.innerHTML = "";
   clearInterval(timer);
   $('.app_loader').hide();
   let empty = true;
  snap.forEach(doc=> {
    let data = doc.data();
    function neg(n) {
      if(n=="0") return "";
      return "·-"+n;
    }

    if(params.id2==="running"){
    $('#all_t').html(`<i class="icofont-hand-drag1"></i> Running`)
    if(new Date(data.details.end_date) > new Date() && new Date(data.details.start_date) < new Date()){
      empty = false;
        examlist.innerHTML += `
        <a href="#!/exam/public/${doc.id}"><div id="${doc.id}+p" class="list_exam  ${doc.id}">
        <div class="list_name">${data.details.exam_name}</div>
        <div class="list_dur">${data.questions.length} Questions · ${data.details.sl_duration} minutes ${neg(data.details.negative_mark)}</div>
        <div class="timer"><i class="icofont-ui-clock"></i> Remaining: <span id="${doc.id}"> ${countDownTimer(data.details.end_date, doc.id, doc.id+"+p")}</span></div>
        <div class="maker"><b>Prepared by:</b>  <span>${data.details.maker}</span></div>
        <div class="chip red">${tag[data.details.sl_class]}</div>
        <div class="chip green">${tag[data.details.sl_subject]}</div>
        <div class="chip orange">${tag[data.details.sl_exam_type]}</div>
        </div></a>
        `
      
    }
  }else if(params.id2==="upcoming"){
    $('#all_t').html(`<i class="icofont-history"></i> Upcoming`)
      if(new Date(data.details.start_date) > new Date()){
        empty = false;
       
          examlist.innerHTML += `
          <div class="list_exam ${doc.id}">
          <div class="list_name">${data.details.exam_name}</div>
          <div class="list_dur">${data.questions.length} Questions · ${data.details.sl_duration} minutes</div>
          <div  class="timer"><i class="icofont-ui-clock"></i> Starting: <span id="${doc.id}">${countDownTimer(data.details.start_date, doc.id)}</span></div>
          <div class="maker"><b>Prepared by:</b>  <span>${data.details.maker}</span></div>
          <div class="chip red">${tag[data.details.sl_class]}</div>
          <div class="chip green">${tag[data.details.sl_subject]}</div>
          <div class="chip orange">${tag[data.details.sl_exam_type]}</div>
          </div>
`
      }
    }else{
        $('#all_t').html(`<i class="icofont-ui-check"></i> Ended`)
          if(new Date(data.details.end_date) < new Date()){
            empty = false;
              examlist.innerHTML += `
             <a href="#!/exam/public/${doc.id}"> <div class="list_exam">
              <div class="list_name">${data.details.exam_name}</div>
              <div class="list_dur">${data.questions.length} Questions · ${data.details.sl_duration} minutes ${neg(data.details.negative_mark)}</div>
              <div class="maker"><b>Prepared by:</b>  <span>${data.details.maker}</span></div>
              <div class="chip red">${tag[data.details.sl_class]}</div>
              <div class="chip green">${tag[data.details.sl_subject]}</div>
              <div class="chip orange">${tag[data.details.sl_exam_type]}</div>
              </div>  </a>`
          }
    }
  });

 
  if(empty){
    examlist.innerHTML = `
    <center><div class="big_no_exam animate_animated animate__bounceIn"><div class=""><i class="icofont-warning-alt"></i></div><div>পরীক্ষা নেই!</div></div></center>
    `
  }
 });
},
"/exam/:ida/:id": function(params){
  $('.footer').hide();
  $('.app_loader').show();
  $('.top_logo').html(`<div class="animate__animated animate__fadeInRight top_app_title"> </div>`);
  app.innerHTML=`<span class="exam-doc"></div>`;
  
  store.collection(params.ida+'_exams').doc(params.id).collection('leaderboard').orderBy("score", 'desc').onSnapshot(snap=> {
    $('.app_loader').hide();
    let taken = false;
    let pos = 0;
    let mtime = 0;
    let ladder = [];
    snap.forEach(l=>{
      ladder.push(l.data());
      if(l.data().id === user.uid){
       mtime =  l.data().time;
        taken = true;
      }
    });

    if(taken){
      $('.footer').show();
      $('.exam-doc').html(`
      <div class="ladder">
      <a href="#!/answersheet/${params.ida}/${params.id}|${mtime}"><div class="btn green">See Your Answer sheet</div></a>
      <div class="my_pos"><i class="icofont-focus"></i> Your Position: <span id="pos"></span></div>
      <div id="board" class="board"></div>
      <div id="page"></div>
      </div>
      `);
      
      
      $('#page').pagination({
        dataSource: ladder,
        pageSize: 20,
        callback: function(data, pagination) {
            var html = "";
            let k = 0;
            data.forEach(item=>{
              k++;
            let time = item.time;
            let min = parseInt(time/60);
            let sec = ('0' + time%60).slice(-2); 
            if(item.id === user.uid){
              $('#pos').text(k);
              html += `
              <div class="l" style="background-color: crimson; color:#fff; font-weight: bold;">
              <div class="pandn">
              <div class="u-pos">${k}</div>
              <div class="l-name">${item.username}</div>
              </div>
              <div class="sandt">
              <div class="l-score ldscore" style="color: #fff">${item.score}</div>
              <divname style="color: #fff" class="l-time">${min}:${sec}</div>
              </div>
              </div>
              `
            }else{
              html += `
              <div class="l">
              <div class="pandn">
              <div class="u-pos">${k}</div>
              <div class="l-name">${item.username}</div>
              </div>
              <div class="sandt">
              <div class="l-score ldscore">${item.score}</div>
              <divname class="l-time">${min}:${sec}</div>
              </div>
              </div>
              `
            }
            });
            $('#board').html(html);
        }
      });
    }else{
        store.collection(params.ida+'_exams').doc(params.id).get().then(doc=>{
          $('.countdown').show();
          let myexam = doc.data();
         if(new Date(myexam.details.end_date) > new Date() && new Date(myexam.details.start_date) < new Date()){
         
          $('.exam-doc').html(`
              <div class="exam-container">
             <div class="exam_top">
              <div class="exam-title">
              <div class="courseName">Britto Exam</div>
              ${myexam.details.exam_name}<br><small>সময়ঃ ${myexam.details.sl_duration}মিনিট | প্রশ্নঃ ${myexam.questions.length}টি</small></div>
              <small>by ${myexam.details.maker}</small>
              <div style="display: none;" class="score">
              <div class="mark"></div>
              <div class="score-wa"></div>
              <div class="score-na"></div>
              <div class="score-time"></div>
              </div>
              <div class="exam-nb"></div>
             </div>
             <div class="parc">
             <div>
             Obtained
             <div class="parcentage" id="correctP"></div>
             </div>
             <div>
             Wrong
             <div class="parcentage" id="wrongP"></div>
             </div>
             <div>
             Negative
             <div class="parcentage" id="negativeP"></div>
             </div>
             <div>
             Answered
             <div class="parcentage" id="answeredP"></div>
             </div>
             </div>
          
              <div class="questions"></div>
             
             <center> <div class="submit btn red" id="submit">সাবমিট করো! </div></center>
             
              </div>
          `);
          $('.parc').hide();
          var ans = [],
            exp = [],
            userAns = [],
            score = 0,
            wrong = 0,
            na = 0,
            neg = parseFloat(myexam.details.negative_mark);
          questions = myexam.questions;
          $(".exam-nb").html(`${myexam.details.notice}`);

           for (let q = 0; q <questions.length; q++) {
            $(".score").hide();
            ans.push(parseInt(questions[q].ans)+q*4);
            exp.push(questions[q].ex);
            var elem = document.querySelector(".exam-container .questions");
            document.querySelector(".exam-container .questions").innerHTML += `
               <div class="q-wrap">
                      <div class="q-logo"></div>
                  <div class="question">
                     ${q + 1}. ${questions[q].q}
                  </div>
                  <div class="option">
                      <div class="opt" id="${
                        q + 1 + q * 3
                      }"><div class="st"></div>${questions[q].opt[0]}</div>
                      <div class="opt" id="${
                        q + 2 + q * 3
                      }"><div class="st"></div>${questions[q].opt[1]}</div>
                      <div class="opt" id="${
                        q + 3 + q * 3
                      }"><div class="st"></div>${questions[q].opt[2]}</div>
                      <div class="opt" id="${
                        q + 4 + q * 3
                      }"><div class="st"></div>${questions[q].opt[3]}</div>
                  </div>
                  <div class="explanation" id="exp-${q}"></div>
              </div>
               `;
          }

          $(".opt").on("click", function () {
            userAns.push(parseInt($(this)[0].id));
            $($(this)[0].parentNode.children[0]).off("click");
            $($(this)[0].parentNode.children[1]).off("click");
            $($(this)[0].parentNode.children[2]).off("click");
            $($(this)[0].parentNode.children[3]).off("click");
            $($(this)[0]).css({
              background: "#384dc5",
              color: "var(--light)",
              "font-weight": "bold",
              "box-shadow" : "0px 2px 5px rgba(0,0,0,.2)"
            });
          });
          MathJax.typeset();

          //timer
          var sec = 0;
          var minute = myexam.details.sl_duration;
          var initialMin = myexam.details.sl_duration
         // console.log("exam: "+minute);
          // if(localStorage.getItem('sec') != null) sec = parseInt(localStorage.getItem('sec'));
          // if(localStorage.getItem('min') != null) minute = parseInt(localStorage.getItem('min'));
         // console.log("local: "+minute);
          var timer = setInterval(function () {
            if (sec === 0) {
              minute--;
              sec = 60;
            }
            sec--;
            let min=minute, secs=sec;
            if(minute<10) min = "0"+min;
            if(sec<10) secs = "0"+secs;

            if (minute <= 0 && sec <= 0) {
              $("#submit").click();
              clearInterval(timer);
              
            } else {
              $(".countdown").html(
                `<img src="../images/clock.png" height="30px"> <div>${min} : ${secs}</div>`
              );
            }
          }, 1000);

          jQuery(document).ready(function ($) {
            if (window.history && window.history.pushState) {
              $(window).on("popstate", function () {
                clearInterval(timer);
                $(".countdown").hide(20);
              });
            }
          });

          $("#submit")
            .off()
            .click(function () {
              // localStorage.removeItem('sec');
              // localStorage.removeItem('min');
              $('.parc').show();
                  Swal.fire({
                    title: `Are you sure?`,
                    text: `You won't undone this!`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      clearInterval(timer);
                      $("html, body").animate({ scrollTop: 0 }, "slow");
                      $("#submit").hide();
                      let e;
                      $(".explanation").show();
                   
                      let found;
                      for (let k = 0; k < ans.length; ++k) {
                        e = k;
                        e = "#exp-" + e;
                        $(e).html(
                          `<b style="color: green;">Solution:</b><br>${exp[k]}`
                        );
                        // $('#'+ans[k]).css({'background': 'var(--success)', 'color': 'var(--light)'});
                        $("#" + ans[k] + " .st").addClass("cr");
                        $(
                          $($($("#" + ans[k])[0].parentNode)[0].parentNode)[0]
                            .children[0]
                        ).html(
                          '<div class="not-ans"> <span class="material-icons">error</span></div>'
                        );
                      }

                      for (let i = 0; i < userAns.length; ++i) {
                        found = true;
                        for (let j = 0; j < ans.length; ++j) {
                          if (parseInt(userAns[i]) === ans[j]) { 
                            score++;
                            $("#" + userAns[i] + " .st").addClass("cr");
                            $(
                              $(
                                $($("#" + userAns[i])[0].parentNode)[0]
                                  .parentNode
                              )[0].children[0]
                            ).html(
                              '<div class="correct"> <span class="material-icons">verified</span> </div>'
                            );
                            found = true;
                            break;
                          } else found = false;
                        }

                        if (!found) {
                          wrong++;
                          $("#" + userAns[i] + " .st").addClass("wa");
                          $(
                            $(
                              $($("#" + userAns[i])[0].parentNode)[0].parentNode
                            )[0].children[0]
                          ).html(
                            '<div class="wrong"> <span class="material-icons">highlight_off</span>  </div>'
                          );
                        }
                      }

                      MathJax.typeset();

                      $(".score").show();
                      $(".mark").html(
                        `<i class="icofont-check-circled"></i><br>স্কোর</br> <small>সঠিক: ${score} </small> <br/> <span class="score-num">${score-(wrong*neg)}/${questions.length}</span>`
                      );
                      $(".score-wa").html(
                        `<i class="icofont-close-circled"></i><br/>ভুল </br><small>নেগেটিভ: ${wrong*neg}</small><br/> <span class="score-num">${wrong}</span>`
                      );
                      $(".score-na").html(
                        `<i class="icofont-warning-alt"></i><br />ফাঁকা </br> <span class="score-num">${
                          questions.length - (score + wrong)
                        }</span>`
                      );
                      $(".score-time").html(
                        `<i class="icofont-ui-clock"></i><br />সময় <br> <span class="score-num">${
                          initialMin - 1 - minute
                        }:${60 - sec}</span>`
                      );
                      
                      
                      $('#correctP').html(`${((score/questions.length)*100).toPrecision(3)}%
                      `)
                      $('#wrongP').html(`${((wrong/questions.length)*100).toPrecision(3)}%
                      `)
                      $('#negativeP').html(`${(((wrong*neg)/questions.length)*100).toPrecision(3)}%
                      `)
                      $('#answeredP').html(`${(100-(((questions.length - (score + wrong))/(questions.length))*100)).toPrecision(3)}%
                      `)                  
                     
              
                      // let data = {
                      //   score: score-(wrong*neg),
                      //   cr: score,
                      //   duration: myexam.details.duration,
                      //   questions: questions,
                      //   name: myexam.details.name,
                      //   myans: userAns,
                      //   type: myexam.details.type,
                      //   totalQ: questions.length,
                      //   wrong: wrong,
                      //   na: questions.length - (score + wrong),
                      //   time: {
                      //     min: initialMin - 1 - minute,
                      //     sec: 60 - sec,
                      //   }
                      // }
                       
                      store.collection('globalScore').doc(user.uid).update({id: user.uid, score: myData.totalScore +  (score-(wrong*neg))});
                      store.collection('public_exams').doc(params.id).collection('leaderboard').add({
                        id: user.uid,
                        username: myData.nickName,
                        score: (score-(wrong*neg)),
                        time: ((initialMin-1-minute)*60) + (60-sec)
                      });
                      let type = new Object();
                      type[myexam.details.sl_exam_type] = myData[myexam.details.sl_exam_type]+1;
                      type["total"] = myData["totalExams"]+1;
                      let myScores = {
                        totalCorrect: myData.totalCorrect + score,
                        totalEmpt: myData.totalEmpt + questions.length - (score + wrong),
                        totalScore: myData.totalScore +  (score-(wrong*neg)),
                        totalWrong: myData.totalWrong + wrong, 
                      } 
                      db.ref('app/users/'+user.uid+'/exams').update(type);
                      db.ref('app/users/'+user.uid+'/scores').update(myScores);
                      db.ref('app/users/'+user.uid+'/allExams/'+myexam.details.sl_exam_type+'/'+params.id).update({
                          userAns: userAns.join('-'),
                          examID: params.id,
                          name: myexam.details.exam_name                      
                      });

                      
                      Swal.fire("সাবমিট হয়েছে!", "", "success");
                    
                    }
            });
        
        })
      }else{
        $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Leaderboard</div></div>`);
        $('.footer').show();
        app.innerHTML = `
        <div class="ladder">
        <a class="btn green" href="#!/solutions/${params.ida}/${params.id}">See Questions & Solutions</a>
        <div class="my_pos" style="background: crimson; color: #fff; font-weigth: bold;"> <i class="icofont-ban"></i> Your didn't participated in this exam!</div>
        <div id="board" class="board"></div>
        <div id="page"></div>
        </div>
        `
        let k = 0;
        $('#page').pagination({
          dataSource: ladder,
          pageSize: 20,
          callback: function(data, pagination) {
              var html = "";
              data.forEach(item=>{
                k++;
              let time = item.time;
              let min = parseInt(time/60);
              let sec = ('0' + time%60).slice(-2); 
                html += `
                <div class="l">
                <div class="pandn">
                <div class="u-pos">${k}</div>
                <div class="l-name">${item.username}</div>
                </div>
                <div class="sandt">
                <div class="l-score ldscore">${item.score}</div>
                <divname class="l-time">${min}:${sec}</div>
                </div>
                </div>
                `
              });
              $('#board').html(html);
      }
    })
  }
  
      }).catch(err=> {
        console.log(err)
        Swal.fire("Error", "error");
      });
    

    }
  });
},
"/answersheet/:ida/:id": function(params) {
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Answersheet</div></div>`);
  $('.app_loader').show();
  $('.footer').hide();
  let ref = (params.id).split('|');
  let time = parseInt(ref[1]);
  let min = parseInt(time/60);
  let sec = ('0' + time%60).slice(-2); 
  store.collection(params.ida+'_exams').doc(ref[0]).onSnapshot(doc=>{
    db.ref('app/users/'+user.uid+'/allExams/'+params.ida+'/'+ref[0]).once('value', snap=>{  
      $('.app_loader').hide();
    let myexam = doc.data();
    app.innerHTML = `
        <div class="exam-container">
       <div class="exam_top">
        <div class="exam-title">
        <div class="courseName">Britto Exam</div>
        ${myexam.details.exam_name}<br><small>সময়ঃ ${myexam.details.sl_duration}মিনিট | প্রশ্নঃ ${myexam.questions.length}টি</small></div>
        <small>by ${myexam.details.maker}</small>
        <div style="display: none;" class="score">
        <div class="mark"></div>
        <div class="score-wa"></div>
        <div class="score-na"></div>
        <div class="score-time"></div>
        </div>
        <div class="exam-nb"></div>
       </div>
       <div class="parc">
       <div>
       Obtained
       <div class="parcentage" id="correctP"></div>
       </div>
       <div>
       Wrong
       <div class="parcentage" id="wrongP"></div>
       </div>
       <div>
       Negative
       <div class="parcentage" id="negativeP"></div>
       </div>
       <div>
       Answered
       <div class="parcentage" id="answeredP"></div>
       </div>
       </div
      </div>
      <div id="questions"></div>
    `;
    var ans = [],
      exp = [],
      userAns = (snap.val().userAns).split('-').map(Number),
      score = 0,
      wrong = 0,
      na = 0,
      neg = parseFloat(myexam.details.negative_mark);
      // console.log(userAns);
    questions = myexam.questions;
    $(".exam-nb").html(`${myexam.details.notice}`);
    var elem = "";
     for (let q = 0; q <questions.length; q++) {
      $(".score").hide();
      ans.push(parseInt(questions[q].ans)+q*4);
      exp.push(questions[q].ex);
     
      elem+= `
         <div class="q-wrap">
                <div class="q-logo"></div>
            <div class="question">
               ${q + 1}. ${questions[q].q}
            </div>
            <div class="option">
                <div class="opt" id="${
                  q + 1 + q * 3
                }"><div class="st"></div>${questions[q].opt[0]}</div>
                <div class="opt" id="${
                  q + 2 + q * 3
                }"><div class="st"></div>${questions[q].opt[1]}</div>
                <div class="opt" id="${
                  q + 3 + q * 3
                }"><div class="st"></div>${questions[q].opt[2]}</div>
                <div class="opt" id="${
                  q + 4 + q * 3
                }"><div class="st"></div>${questions[q].opt[3]}</div>
            </div>
            <div class="explanation" id="exp-${q}"></div>
        </div>
         `;
    }
    $('#questions').html(elem);

                $("html, body").animate({ scrollTop: 0 }, "slow");
                let e;
                $(".explanation").show();
             
                let found;
                for (let k = 0; k < ans.length; ++k) {
                  e = k;
                  e = "#exp-" + e;
                  $(e).html(
                    `<b style="color: green;">Solution:</b><br>${exp[k]}`
                  );
                  // $('#'+ans[k]).css({'background': 'var(--success)', 'color': 'var(--light)'});
                  $("#" + ans[k] + " .st").addClass("cr");
                  $(
                    $($($("#" + ans[k])[0].parentNode)[0].parentNode)[0]
                      .children[0]
                  ).html(
                    '<div class="not-ans"> <span class="material-icons">error</span></div>'
                  );
                }

                for (let i = 0; i < userAns.length; ++i) {
                  found = true;
                  for (let j = 0; j < ans.length; ++j) {
                    if (parseInt(userAns[i]) === ans[j]) { 
                      score++;
                      $("#" + userAns[i] + " .st").addClass("cr");
                      $(
                        $(
                          $($("#" + userAns[i])[0].parentNode)[0]
                            .parentNode
                        )[0].children[0]
                      ).html(
                        '<div class="correct"> <span class="material-icons">verified</span> </div>'
                      );
                      found = true;
                      break;
                    } else found = false;
                  }

                  if (!found) {
                    wrong++;
                    $("#" + userAns[i] + " .st").addClass("wa");
                    $(
                      $(
                        $($("#" + userAns[i])[0].parentNode)[0].parentNode
                      )[0].children[0]
                    ).html(
                      '<div class="wrong"> <span class="material-icons">highlight_off</span>  </div>'
                    );
                  }
                }

                $(".score").show();
                $(".mark").html(
                  `<i class="icofont-check-circled"></i><br>স্কোর</br> <small>সঠিক: ${score} </small> <br/> <span class="score-num">${score-(wrong*neg)}/${questions.length}</span>`
                );
                $(".score-wa").html(
                  `<i class="icofont-close-circled"></i><br/>ভুল </br><small>নেগেটিভ: ${wrong*neg}</small><br/> <span class="score-num">${wrong}</span>`
                );
                $(".score-na").html(
                  `<i class="icofont-warning-alt"></i><br />ফাঁকা </br> <span class="score-num">${
                    questions.length - (score + wrong)
                  }</span>`
                );
                $(".score-time").html(
                  `<i class="icofont-ui-clock"></i><br />সময় <br> <span class="score-num">${
                    min
                  }:${sec}</span>`
                );
                
                
                $('#correctP').html(`${((score/questions.length)*100).toPrecision(3)}%
                `)
                $('#wrongP').html(`${((wrong/questions.length)*100).toPrecision(3)}%
                `)
                $('#negativeP').html(`${(((wrong*neg)/questions.length)*100).toPrecision(3)}%
                `)
                $('#answeredP').html(`${(100-(((questions.length - (score + wrong))/(questions.length))*100)).toPrecision(3)}%
                `)                                        
              });
}, (err) => {
  console.log(err)
  Swal.fire("Error", "error");
})
 
},
"/practice/subject/:id": function(params){
  $('.footer').hide();
  $('.app_loader').show();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">${tag[params.id]}</div></div>`);
  app.innerHTML = `
  <div class="chapters">
  </div>
  `
  
  db.ref('app/practiceRef/'+params.id).once('value', snap=>{
    $('.app_loader').hide();
    let html = ``;
    let chapters = [];
    snap.forEach(item=>{
      chapters.push({
        i:item.val().i,
        name: item.val().name,
        author: item.val().author,
        key: item.key
      })
    });

    //sorting
    chapters.sort(function(a, b){
      return a.i - b.i;
    });

    for(let i=0; i<chapters.length; i++){
      html += `
      <a href="#!/practice/list/${params.id}/${chapters[i].key}/${chapters[i].name}"> <div  class="chap_item ${params.id}_list"><div><div class="name_logo">${firstLetter(chapters[i].name)}</div></div><div><div class="chapterName">${chapters[i].name}</div><div class="author">${chapters[i].author}</div></div></div></a>
      `
    }
    //  console.log(chapters)
    $('.chapters').html(html);
    if($('.chapters')[0].innerHTML === ""){
      $('.chapters').html('<center><div class="big_no_exam animate_animated animate__bounceIn"><div class=""><i class="icofont-warning-alt"></i></div><div>পরীক্ষা নেই!</div></div></center>');
    }
  })


},

"/practice/list/:subj/:chap/:chapName": function(params){
  $('.footer').hide();
  $('.app_loader').show();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">${params.chapName}</div></div>`);
  app.innerHTML = `
  <div class="chapters" id="chaps">
  </div>
  `
  store.collection('subjectExams').doc(params.subj).collection(params.chap).onSnapshot(snap=>{
    $('.app_loader').hide();
    const ex = document.querySelector('#chaps');
    ex.innerHTML="";
    
    snap.forEach(item=>{
      ex.innerHTML += `
      <a href="#!/practice/nb/${params.subj}/${params.chap}/${item.id}|${item.data().questions.length}"> <div class="chap_item ${params.subj}_list"><div><div class="name_logo">${firstLetter(item.data().details.exam_name)}</div></div><div><div class="chapterName">${item.data().details.exam_name}</div><div class="author">${item.data().questions.length}টি প্রশ্ন</div></div></div></a>
      `
    })
  })
},

"/practice/nb/:subj/:chap/:key": function(params){
  $('.footer').hide();
  // $('.app_loader').show();
  let key = (params.key).split('|');
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Before Exam</div></div>`);
  app.innerHTML = `
  <div class="prac_nb">
 <div class="nb-bdy">
 <div class="nb-t"> <i class="icofont-eye-open"></i> লক্ষ্য করো</div>
 <ul>
 <li>প্রাকটিস পরীক্ষার মার্ক র‍্যাঙ্ক এর সাথে যুক্ত হবে না।</li>
 <li>প্রাকটিস পরীক্ষাগুলি যেকোনো সময় দেয়া যাবে।</li>
 <li>প্রাকটিস পরীক্ষাগুলির সময় এবং নেগেটিভ মার্ক নিচে দেয়া অপশন থেকে নিজের মত বেঁছে নেয়া যাবে।</li>
 <li>সময় এবং নেগেটিভ মার্ক <b>বেঁছে না নিলে</b> স্বয়ংক্রিয়ভাবে <b>সময় (প্রশ্ন সংখ্যা/২) মিনিট</b> এবং <b>নেগেটিভ মার্ক 0</b> বলে গণ্য হবে।</li>
 <li>পরীক্ষাগুলির জন্য আপাতত কোনো লিডারবোর্ড থাকছে না।</li>
 </ul>
</div>
  

  <form id="chooseForm">
  <div class="nb-t"><i class="icofont-touch"></i> বেঁছে নাওঃ (Optional)</div>
 
  <div class="input_field">
  <input name="ch_time" placeholder="সময়" type="number">
  </div>
 
  <div class="input-field col s12">
     <select name="ch_neg">
       <option value="" disabled selected>ভুল উত্তরের জন্য নেগেটিভ মার্ক</option>
       <option value="0">No negative</option>
       <option value="0.25">0.25</option>
       <option value="0.50">0.50</option>
       <option value="1">1</option>
       <option value="1.25">1.25</option>
       <option value="1.50">1.50</option>
       <option value="1.75">1.75</option>
       <option value="2">2</option>
     </select>
   </div>
 <center><button id="sub" type="submit" class="btn red">শুরু করো</button></center>
 </form>
 </div>
  `
      let choose = document.getElementById('chooseForm');
      choose.addEventListener('submit', a=>{
        a.preventDefault();
        let chTime = parseInt(key[1])/2;
        let chNeg = 0;
        if(choose.ch_time.value != ""){
         chTime = choose.ch_time.value;
        }
        if(choose.ch_neg.value != ""){
          chNeg = choose.ch_neg.value;
         }
         router.navigate('practice/exam/'+params.subj +'/'+params.chap+'/'+key[0]+'/'+parseInt(chTime)+'~'+chNeg);
      });

      $(document).ready(function(){
        $('select').formSelect();
      });
},

"practice/exam/:subj/:chap/:key/:choice": function(params){
  $('.footer').hide();
  $('.app_loader').show();
  // $('#fullscr').click();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text"> </div></div>`);
  app.innerHTML=`<div class="exam-doc" id="practice-exam"></div>`;
  var ch = (params.choice).split('~');
  store.collection('subjectExams').doc(params.subj).collection(params.chap).doc(params.key).onSnapshot(snap=> {
    $('.app_loader').hide();
          $('.countdown').show();
          let myexam = snap.data();
          $('.exam-doc').html(`
              <div class="exam-container">
             <div class="exam_top">
              <div class="exam-title">
              <div class="exam_name">${myexam.details.exam_name}</div><small>সময়: ${ch[0]} মিনিট | নেগেটিভ: ${ch[1]} </small>
              </div>
              <div style="display: none;" class="score">
              <div class="mark"></div>
              <div class="score-wa"></div>
              <div class="score-na"></div>
              <div class="score-time"></div>
              </div>
              <div class="exam-nb"></div>
             </div>
             <div class="parc">
             <div>
             Obtained
             <div class="parcentage" id="correctP"></div>
             </div>
             <div>
             Wrong
             <div class="parcentage" id="wrongP"></div>
             </div>
             <div>
             Negative
             <div class="parcentage" id="negativeP"></div>
             </div>
             <div>
             Answered
             <div class="parcentage" id="answeredP"></div>
             </div>
             </div>
          
              <div class="questions"></div>
             
             <center> <div class="submit btn red" id="submit">সাবমিট করো! </div></center>
             
              </div>
          `);
          $('.parc').hide();
          var ans = [],
            exp = [],
            userAns = [],
            score = 0,
            wrong = 0,
            na = 0,
            neg = parseFloat(ch[1]);
          questions = myexam.questions;
          shuffle(questions);
          // console.log(questions);
          $(".exam-nb").html(`${myexam.details.notice}`);

           for (let q = 0; q <questions.length; q++) {
            $(".score").hide();
            ans.push(parseInt(questions[q].ans)+q*4);
            exp.push(questions[q].ex);
            var elem = document.querySelector(".exam-container .questions");
            document.querySelector(".exam-container .questions").innerHTML += `
               <div class="q-wrap">
                      <div class="q-logo"></div>
                  <div class="question">
                     ${q + 1}. ${questions[q].q}
                  </div>
                  <div class="option">
                      <div class="opt" id="${
                        q + 1 + q * 3
                      }"><div class="st"></div><div>${questions[q].opt[0]}</div></div>
                      <div class="opt" id="${
                        q + 2 + q * 3
                      }"><div class="st"></div><div>${questions[q].opt[1]}</div></div>
                      <div class="opt" id="${
                        q + 3 + q * 3
                      }"><div class="st"></div><div>${questions[q].opt[2]}</div></div>
                      <div class="opt" id="${
                        q + 4 + q * 3
                      }"><div class="st"></div><div>${questions[q].opt[3]}</div></div>
                  </div>
                  <div class="explanation" id="exp-${q}"></div>
              </div>
               `;
          }

          $(".opt").on("click", function () {
            userAns.push(parseInt($(this)[0].id));
            $($(this)[0].parentNode.children[0]).off("click");
            $($(this)[0].parentNode.children[1]).off("click");
            $($(this)[0].parentNode.children[2]).off("click");
            $($(this)[0].parentNode.children[3]).off("click");
            $($(this)[0]).css({
              background: "#384dc5",
              color: "var(--light)",
              "font-weight": "bold",
              "box-shadow" : "0px 2px 5px rgba(0,0,0,.2)"
            });
          });
          MathJax.typeset();

          //timer
          var sec = 0;
          var minute = parseInt(ch[0]);
          var initialMin = parseInt(ch[0]);
         // console.log("exam: "+minute);
          // if(localStorage.getItem('sec') != null) sec = parseInt(localStorage.getItem('sec'));
          // if(localStorage.getItem('min') != null) minute = parseInt(localStorage.getItem('min'));
         // console.log("local: "+minute);
        //  var timerAud = new Audio('./sounds/Sound-effect-Clock-Ticking-1.mp3');
          var timer = setInterval(function () {
            if (sec === 0) {
              minute--;
              sec = 60;
            }
            sec--;
            let min=minute, secs=sec;
            if(minute<10) min = "0"+min;
            if(sec<10) secs = "0"+secs;

            // if(minute === 0 && sec===30){
            //   timerAud.play();
            // }

            if (minute <= 0 && sec <= 0) {
              $("#submit").click();
              // localStorage.removeItem('sec');
              // localStorage.removeItem('min');
              clearInterval(timer);
              
            } else {
              // localStorage.setItem('sec', sec);
              // localStorage.setItem('min', min);
              // console.log(localStorage.getItem('sec'))
              $(".countdown").html(
                `<img src="../images/clock.png" height="30px"> <div> ${min} : ${secs}</div>`
              );
            }
          }, 1000);

          jQuery(document).ready(function ($) {
            if (window.history && window.history.pushState) {
              $(window).on("popstate", function () {
                clearInterval(timer);
                $(".countdown").hide(20);
              });
            }
          });

          $("#submit")
            .off()
            .click(function () {
              $('.parc').show();
                      clearInterval(timer);
                      $("html, body").animate({ scrollTop: 0 }, "slow");
                      $("#submit").hide();
                      let e;
                      $(".explanation").show();
                   
                      let found;
                      for (let k = 0; k < ans.length; ++k) {
                        e = k;
                        e = "#exp-" + e;
                        $(e).html(
                          `<b style="color: green;">Solution:</b><br>${exp[k]}`
                        );

                        $("#" + ans[k] + " .st").addClass("cr");

                        $(
                          $($($("#" + ans[k])[0].parentNode)[0].parentNode)[0]
                            .children[0]
                        ).html(
                          '<div class="not-ans"> <span class="material-icons">error</span></div>'
                        );
                      }

                      for (let i = 0; i < userAns.length; ++i) {
                        found = true;
                        for (let j = 0; j < ans.length; ++j) {
                          if (parseInt(userAns[i]) === ans[j]) { 
                            score++;
                            $("#" + userAns[i] + " .st").addClass("cr");
                            $(
                              $(
                                $($("#" + userAns[i])[0].parentNode)[0]
                                  .parentNode
                              )[0].children[0]
                            ).html(
                              '<div class="correct"> <span class="material-icons">verified</span> </div>'
                            );
                            found = true;
                            break;
                          } else found = false;
                        }

                        if (!found) {
                          wrong++;
                          $("#" + userAns[i] + " .st").addClass("wa");
                          $(
                            $(
                              $($("#" + userAns[i])[0].parentNode)[0].parentNode
                            )[0].children[0]
                          ).html(
                            '<div class="wrong"> <span class="material-icons">highlight_off</span>  </div>'
                          );
                        }
                      }
                      MathJax.typeset();

                      $(".score").show();
                      $(".mark").html(
                        `<i class="icofont-check-circled"></i><br>স্কোর</br> <small>সঠিক: ${score} </small> <br/> <span class="score-num">${score-(wrong*neg)}/${questions.length}</span>`
                      );
                      $(".score-wa").html(
                        `<i class="icofont-close-circled"></i><br/>ভুল </br><small>নেগেটিভ: ${wrong*neg}</small><br/> <span class="score-num">${wrong}</span>`
                      );
                      $(".score-na").html(
                        `<i class="icofont-warning-alt"></i><br />ফাঁকা </br> <span class="score-num">${
                          questions.length - (score + wrong)
                        }</span>`
                      );
                      $(".score-time").html(
                        `<i class="icofont-ui-clock"></i><br />সময় <br> <span class="score-num">${
                          initialMin - 1 - minute
                        }:${59 - sec}</span>`
                      );
                      
                      
                      $('#correctP').html(`${((score/questions.length)*100).toPrecision(3)}%
                      `)
                      $('#wrongP').html(`${((wrong/questions.length)*100).toPrecision(3)}%
                      `)
                      $('#negativeP').html(`${(((wrong*neg)/questions.length)*100).toPrecision(3)}%
                      `)
                      $('#answeredP').html(`${(100-(((questions.length - (score + wrong))/(questions.length))*100)).toPrecision(3)}%
                      `)                                 
                  Swal.fire("সাবমিট হয়েছে!", "", "success");
        })
  })
},

"/solutions/:ida/:id": function (params) {

  $('.footer').hide();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Solution</div></div>`);
  $('.app_loader').show();
  store.collection(params.ida + '_exams').doc(params.id).onSnapshot(doc=>{
  $('.app_loader').hide();
  var myexam = doc.data();
  app.innerHTML=`
  <div class="exam_top">
  <div class="exam-title">
  <div class="courseName">Britto Exam</div>
  ${myexam.details.exam_name}<br><small>সময়ঃ ${myexam.details.sl_duration}মিনিট | প্রশ্নঃ ${myexam.questions.length}টি</small></div>
  <small>by ${myexam.details.maker}</small>
  </div>
  <div class="questions"></div>
  `
  
  var ans = [];
  for(let i=0; i<myexam.questions.length; i++){
    ans.push(parseInt(myexam.questions[i].ans)+i*4);
    document.querySelector('.questions').innerHTML += `
    <div class="q-wrap">
<div class="question">
   ${i+1}. ${myexam.questions[i].q}
</div>
<div class="option">
    <div class="opt" id="${i+1+i*3}"><div class="st"></div>${myexam.questions[i].opt[0]}</div>
    <div class="opt" id="${i+2+i*3}"><div class="st"></div>${myexam.questions[i].opt[1]}</div>
    <div class="opt" id="${i+3+i*3}"><div class="st"></div>${myexam.questions[i].opt[2]}</div>
    <div class="opt" id="${i+4+i*3}"><div class="st"></div>${myexam.questions[i].opt[3]}</div>
</div>
<div class="solution"><b>Solution:</b></br> ${myexam.questions[i].ex}</div>
</div>`
}
  for(let a=0; a<ans.length; a++){
       $("#" + ans[a] + " .st").addClass("cr");
     }

     MathJax.typeset();
  
})
},
"/examsolution/:exam_name/:id": function(params) {
  $('.footer').hide();
  // $('.app_loader').show();
  // $('#fullscr').click();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text"> ${params.exam_name} </div></div>`);
  app.innerHTML = `
  <div id="sol_head"></div>
  <div id="sol_body"><div>
  `;
  SingleSolutionCard(params.id, 'sol_head');
  getSolution(params.id, 'sol_body', user.uid);
},
"/add_solution/:doc/:tag/:questionLength": function(params) {
  $('.footer').hide();
  $('.app_loader').show();
  // $('#fullscr').click();
let len;
store.collection('solutions').doc(params.doc).onSnapshot(item=>{
  len = Object.entries(item.data().questions).length;
  $('.app_loader').hide();


  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text"> Add solution </div></div>`);
  app.innerHTML = `
  <h5>${sectionsTag[params.tag]}</h5>
    <form id="question_form">
<div class="input-field create-q">
<textarea name="question" type="text" placeholder="Write Question..."></textarea>
</div>

<div class="form_option create-q" >
<div class="input-field">
<div class="opt"><textarea name="a" placeholder="অপশন A"></textarea></div>
<div class="opt"><textarea name="b" placeholder="অপশন B"></textarea></div>
<div class="opt"><textarea name="c" placeholder="অপশন C"></textarea></div>
<div class="opt"><textarea name="d" placeholder="অপশন D"></textarea></div>
</div>
</div>
<div class="input-field">
      <select name="select_ans">
        <option class="dis" value="" disabled selected>উত্তর</option>
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
        <option value="4">D</option>
      </select>
    </div>

<div class="create-q">
    <textarea name="explanation" id="create-ex" placeholder="ব্যাখ্যা/সমাধান"></textarea>
</div>
<center><button type="submit" class="btn red">Add Question</button><center>
</form>
    `
    $(document).ready(function () {
      $("select").formSelect();
    });
    const question_form = document.querySelector('#question_form');
question_form.addEventListener('submit', e=> {
  e.preventDefault();
  let optArr = [question_form.a.value, question_form.b.value, question_form.c.value, question_form.d.value];
  let ansText = `${ansOpt[parseInt(question_form.select_ans.value)]}. ${optArr[parseInt(question_form.select_ans.value)-1]}`;
  let question = {
      q: (question_form.question.value).replace(/(?:\r\n|\r|\n)/g, '<br>'),
      opt: [question_form.a.value, question_form.b.value, question_form.c.value, question_form.d.value],
      ans: question_form.select_ans.value,
      ex: question_form.explanation.value === "" ? ansText : ansText + "<br>"+question_form.explanation.value,
      tag: params.tag
  }
  // console.log(question);
    store.collection('solutions').doc(params.doc).set({
      questions: {
        [len]: question
      }
    }, {merge: true}).then(()=>{
      Swal.fire(
        'success',
        'Done!'
      )
    });
});

});
},
 "/rank" : function(){
  $('.app_loader').show();
  $('.footer').show();
  $('.footertext').hide();
  $('.footerIcon').removeClass('footerIconActive');
  if($('.rnk')[0].classList[3] === undefined){
    $('.rnk').addClass('footerIconActive');
    $($($('.rnk')[0].parentNode)[0].lastElementChild).show();
    $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeIn top_dir"><img src="../images/bottom-nav/rank.png" height="30px"></div> <div class="animate__animated animate__fadeIn top_text">Rank</div></div>`);
  }

  app.innerHTML = `<span class="rank-doc"></div>`;
  store.collection("globalScore").orderBy("score", 'desc').onSnapshot(snap=> {
    $('.app_loader').hide();
 $('.rank-doc').html(`
  <div class="ladder">
  <div class="top3content">
  <center>
  <div class="preloader-wrapper big active">
  <div class="spinner-layer spinner-blue">
    <div class="circle-clipper left">
      <div class="circle"></div>
    </div><div class="gap-patch">
      <div class="circle"></div>
    </div><div class="circle-clipper right">
      <div class="circle"></div>
    </div>
  </div>
</center>

  </div>
  <div class="my_pos"><img src="../images/position.png" height="30px"> Your Merit: <span id="pos"></span>/<span class="tp"></span></div>
  <div id="board" class="board"></div>
  <div id="page"></div>
  </div>
 `);

  let i=0;
  let ladder = [];
  snap.forEach(l=>{
    i++;
    ladder.push(l.data());
    if(l.data().id === user.uid) $('#pos').text(i);
  })

  $('.tp').text(i);


db.ref('app/users').on('value', data=>{
  $('.top3content').html(`
  <div class="twrap"><div class="top2"><img src="${data.val()[ladder[1].id].photoURL}"></div> <div class="topName">${data.val()[ladder[1].id].nickName}</div></div>
  <div class="twrap"><div class="top1"><img src="${data.val()[ladder[0].id].photoURL}"></div> <div class="topName">${data.val()[ladder[0].id].nickName}</div> <div class="crown"><img src="../images/crown.png"></div></div>
  <div class="twrap"><div class="top3"><img src="${data.val()[ladder[2].id].photoURL}"></div> <div class="topName">${data.val()[ladder[2].id].nickName}</div></div>
  `)
 });

  let board = document.getElementById('board');
  $('#page').pagination({
    dataSource: ladder,
    pageSize: 20,
    callback: function(data, pagination) {
       board.innerHTML = ``;
        let k = 0;
        data.forEach(item=>{
          let inst = (item.inst).split('|');
          k++;
        if(k===1){
          board.innerHTML += `
          <a href="#!/profile/${item.id}">
          <div class="l">
          <div style="display:flex; gap: 10px;">
          <div class="pandn">
          <div class="top-pos"><img src="../images/badge1.png" height="30px"></div>
          </div>

          <div class="s-info">
          <div class="l-name">${item.username}</div>
          <div class="instName">${inst[0]}</div>
          </div>
          </div>


          <div class="sandt">
          <div class="l-score" >${item.score}</div>
          </div>
         
         
          </div>
          
          </a>
          `
        }
        else if(item.id === user.uid){
          board.innerHTML += `
          <a href="#!/myprofile">
          <div class="l" style="background: crimson; color: #fff">
          <div style="display:flex; gap: 10px;">
          <div class="pandn">
          <div class="u-pos">${k}</div>
          </div>

          <div class="s-info">
          <div class="l-name">${item.username}</div>
          <div class="instName">${inst[0]}</div>
          </div>
          </div>


          <div class="sandt">
          <div class="l-score" style="color: #fff">${item.score}</div>
          </div>
         
         
          </div>
          
          </a>
          `
        }else{
          board.innerHTML += `
          <a href="#!/profile/${item.id}">
          <div class="l">
          <div style="display:flex; gap: 10px;">
          <div class="pandn">
          <div class="u-pos">${k}</div>
          </div>

          <div class="s-info">
          <div class="l-name">${item.username}</div>
          <div class="instName">${inst[0]}</div>
          </div>
          </div>


          <div class="sandt">
          <div class="l-score" >${item.score}</div>
          </div>
         
         
          </div>
          </a>
          `
        }
        });
    }
  });
});
},

"/create" : function(){
    $('.app_loader').show();
    $('.footer').hide();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Create</div></div>`);
  app.innerHTML = `<span class="create-doc"></div>`;
   
  if(myData.createPermission == false){
    $('.app_loader').hide();
$('.create-doc').html(`
<div class="warn">
<div>
<div class="warn-icon animate__bounceIn"><i class="icofont-warning"></i></div>
You have no permission to create exam!
</div>
</div>
`)
  }else{
  db.ref('app/users/'+user.uid+'/create').on('value', snap=>{
    $('.app_loader').hide();
  if(snap.val().history.status===false){
  $('.create-doc').html(`
  <div class="page1">
  <form id="details_form">
  <div class="input-field">
  <input name="exam_name" type="text" autocomplete="off" required/>
  <label for="exam_name">Exam Name</label>
  </div>

  <div class="input-field col s12">
  <select name="sl_exam_type" required>
    <option value="" disabled selected>Select Exam Type</option>
    <option value="topic">Particular Topic</option>
    <option value="chapter">Particular Chapter</option>
    <option value="subject_final">Subject Final</option>
    <option value="model_test">Model Test</option>
    <option value="model_test">Model Test</option>
    <option value="public">Public</option>
    <option value="live">Live</option>
    <option value="board">Board Exam Preparation</option>
    <option value="admission">Admission</option>
    <option value="bcs">BCS</option>
  </select>
</div>

<div class="input-field col s12">
<select name="sl_subject" requiredrequired>
  <option value="" disabled selected>Select Subject</option>
  <option value="b1">Bangla 1st Paper</option>
  <option value="b2">Bangla 2nd Paper</option>
  <option value="cs">Computer Science</option>
  <option value="e">English</option>
  <option value="phy1">Physics 1st Paper</option>
  <option value="phy2">Physics 2nd Paper</option>
  <option value="chem1">Chemistry 1st Paper</option>
  <option value="chem2">Chemistry 2nd Paper</option>
  <option value="math1">Mathematics 1st Paper</option>
  <option value="math2">Mathematics 2nd Paper</option>
  <option value="bio1">Biology 1st Paper</option>
  <option value="bio2">Biology 2nd Paper</option>
  <option value="ict">ICT</option>
  <option value="sco1">Sociology 1st Paper</option>
  <option value="sco2">Sociology 2nd Paper</option>
  <option value="civ1">Civics 1st Paper</option>
  <option value="civ2">Civics 2nd Paper</option>
  <option value="eco1">Economics 1st Paper</option>
  <option value="eco2">Economics 2nd Paper</option>
  <option value="his1">History 1st Paper</option>
  <option value="his2">History 2nd Paper</option>
  <option value="psy1">Psychology 1st Paper</option>
  <option value="psy2">Psychology 2nd Paper</option>
  <option value="a&c1">Art & Craft 1st Paper</option>
  <option value="a&c2">Art & Craft 2nd Paper</option>
  <option value="geo1">Geology 1st Paper</option>
  <option value="geo2">Geology 2nd Paper</option>
  <option value="gk1">GK-Bangladesh Affairs</option>
  <option value="gk2">GK-International Affairs</option>
  <option value="bcs">BCS Preliminary</option>
  <option value="none">None/Other</option>
</select>
</div>

<div class="input-field col s12">
<select name="sl_class" required>
  <option value="" disabled selected>Select Class</option>
  <option value="hsc">HSC</option>
  <option value="uni">University Admission</option>
  <option value="med">Medical Admission</option>
  <option value="eng">Engineering Admission</option>
  <option value="bcs">BCS</option>
  </select>
  </div>

  <div class="input-field col s12">
<select name="sl_group" required>
  <option value="" disabled selected>Select Group</option>
  <option value="sci">Science</option>
  <option value="a">A level</option>
  <option value="sci">Science</option>
  <option value="com">Commerce</option>
  <option value="hum">Humanity</option>
  <option value="none">Other/None</option>
  </select>
  </div>

<div class="input-field col s12">
<select name="sl_duration" required>
  <option value="" disabled selected>Duration</option>
  <option value="10">10 minutes</option>
  <option value="15">15 minutes</option>
  <option value="25">25 minutes</option>
  <option value="30">30 minutes</option>
  <option value="35">35 minutes</option>
  <option value="40">40 minutes</option>
  <option value="50">50 minutes</option>
  <option value="55">55 minutes</option>
  <option value="60">60 minutes</option>
  <option value="70">70 minutes</option>
  <option value="80">80 minutes</option>
  <option value="90">90 minutes</option>
  <option value="100">100 minutes</option>
  <option value="110">110 minutes</option>
  <option value="120">120 minutes</option>
  </select>
  </div>

  

  Select Start Date:
  <div style="width: 200px; margin: 10px auto;">
  <div id="picker"></div>
  <input name="start_date" type="hidden" id="result" value="" />
</div>

Select Expire Date:
<div style="width: 200px; margin: 10px auto;">
  <div id="picker2"></div>
  <input name="end_date" type="hidden" id="result" value="" />
</div>


  <div class="input-field">
  <input type="text" autocomplete="off" name="exam_password" minlength="5"/>
  <label for="password">Password(Optional)</label>
  </div>
  
  <div class="input-filed">
  Negative Mark:
  <label>
  <input name="group1" value="0" type="radio" checked/>
  <span>None</span>
</label>
<label>
<input name="group1" value="0.25" type="radio"/>
<span>0.25</span>
</label>
<label>
<input name="group1" value="0.50" type="radio" />
<span>0.50</span>
</label>
  </div>

  <div class="input-field">
  <textarea name="notice" type="text" autocomplete="off" name="notice" placeholder="Notice or Announcement" required></textarea>
  </div>

  <center><button class="btn green" type="submit">Next</button></center>
  </form>
  </div>
 
  `);


const detalisform = document.querySelector('#details_form');
  $(document).ready( function () {
    $('#picker').dateTimePicker();
    $('#picker-no-time').dateTimePicker({ showTime: false, dateFormat: 'DD/MM/YYYY', title: 'Select Date'});
})

$(document).ready( function () {
  $('#picker2').dateTimePicker();
  $('#picker-no-time').dateTimePicker({ showTime: false, dateFormat: 'DD/MM/YYYY', title: 'Select Date'});
});

   
detalisform.addEventListener('submit', e=>{
    e.preventDefault();
    let details = {
      exam_name: detalisform.exam_name.value,
      sl_exam_type: detalisform.sl_exam_type.value,
      sl_subject: detalisform.sl_subject.value,
      sl_class: detalisform.sl_class.value,
      sl_group: detalisform.sl_group.value,
      sl_duration: parseInt(detalisform.sl_duration.value),
      start_date: (new Date(detalisform.start_date.value)).toString(),
      end_date: (new Date(detalisform.end_date.value)).toString(),
      password: detalisform.exam_password.value,
      negative_mark: detalisform.group1.value,
      notice: detalisform.notice.value,
      makerID: user.uid,
      maker: user.displayName,
      
    }
    db.ref('app/users/'+user.uid+'/create/history').update({details: details, status: true});
  });
  $(document).ready(function () {
    $("select").formSelect();
  });
}else{
  $('.create-doc').html( `
<div class="head1">
<button class="btn red publish" id="publish_exam red"><i class="icofont-ui-clip-board left"></i></i> Publish</button>
<div class="cnt"><div class="counter">0</div> <div id="confirm" class="animate__animated animate__fadeIn"><div class="confirm"><i class="icofont-ui-check"></i></div></div></div>
<a href="#!/edit_exam"<button class="btn green"><i class="icofont-ui-edit left"></i> Edit</button></a>
</div>
<div class="page1">
<form id="question_form">
<div class="input-field create-q">
<textarea name="question" type="text" placeholder="Write Question..."></textarea>
</div>

<div class="form_option create-q" >
<div class="input-field">
<div class="opt"><textarea name="a" placeholder="অপশন A"></textarea></div>
<div class="opt"><textarea name="b" placeholder="অপশন B"></textarea></div>
<div class="opt"><textarea name="c" placeholder="অপশন C"></textarea></div>
<div class="opt"><textarea name="d" placeholder="অপশন D"></textarea></div>
</div>
</div>
<div class="input-field">
      <select name="select_ans">
        <option class="dis" value="" disabled selected>উত্তর</option>
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
        <option value="4">D</option>
      </select>
    </div>

    <div class="input-field">
      <select name="select_tag">
        <option class="dis" value="" disabled>ট্যাগ</option>
        <option value="bng">bng</option>
        <option value="bng2" selected>bng2</option>
        <option value="eng">eng</option>
        <option value="gk">gk</option>
        <option value="mth">mth</option>
        <option value="ict">ict</option>
        <option value="gsc">gsc</option>
        <option value=sco">sco</option>
      </select>
    </div>

<div class="create-q">
    <textarea name="explanation" id="create-ex" placeholder="ব্যাখ্যা/সমাধান"></textarea>
</div>
<center><button type="submit" class="btn red">Add Question</button><center>
</form>

</div>

`)



$('.publish').click(function(){
   let exam = snap.val().history;
   Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      store.collection(snap.val().history.details.sl_exam_type+'_exams').add({details: snap.val().history.details, questions: snap.val().history.questions, publish_date: (new Date()).toString()});
      Swal.fire(
        'Published',
        'Exam has been published!',
        'success'
      ).then(rs=> {
        if(rs.isConfirmed){
        }
      });
    }
  });
});


$(document).ready(function () {
  $("select").formSelect();
});



let count = 0;
if(snap.val().history.questions != null){
  count = snap.val().history.questions.length;
}
$('.counter').text(count);
const question_form = document.querySelector('#question_form');
question_form.addEventListener('submit', e=> {
  e.preventDefault();
  let optArr = [question_form.a.value, question_form.b.value, question_form.c.value, question_form.d.value];
  let ansText = `${ansOpt[parseInt(question_form.select_ans.value)]}. ${optArr[parseInt(question_form.select_ans.value)-1]}`;
  let question = {
      q: (question_form.question.value).replace(/(?:\r\n|\r|\n)/g, '<br>'),
      opt: [question_form.a.value, question_form.b.value, question_form.c.value, question_form.d.value],
      ans: question_form.select_ans.value,
      ex: ansText,
      tag: question_form.select_tag.value
  }
    db.ref('app/users/'+user.uid+'/create/history/questions/'+count).update(question);
    $('.counter').hide();
    $('#confirm').show();
    setTimeout(function(){
      $('#confirm').hide(310);
      $('.counter').show(320);
    }, 1500)
});

}
});
}
},

"/create2" : function(){
  $('.app_loader').show();
  $('.footer').hide();
$('.top_logo').html(`<div onclick="window.history.back()" class="animate__animated animate__fadeInRight top_app_title"><i class="icofont-simple-left"></i> Create v2</div>`);
app.innerHTML = `<span class="create-doc"></div>`;
 
if(myData.createPermission == false){
  $('.app_loader').hide();
$('.create-doc').html(`
<div class="warn">
<div>
<div class="warn-icon animate__bounceIn"><i class="icofont-warning"></i></div>
You have no permission to create exam!
</div>
</div>
`)
}else{
db.ref('app/users/'+user.uid+'/create2').on('value', snap=>{
  $('.app_loader').hide();
if(snap.val().history.status===false){
$('.create-doc').html(`
<div class="page1">
<form id="details_form">
<div class="input-field">
<input name="exam_name" type="text" autocomplete="off" required/>
<label for="exam_name">Exam Name</label>
</div>


<div class="input-field col s12">
<select name="sl_subject" requiredrequired>
<option value="" disabled selected>Select Subject</option>
<option value="model">Model Test</option>
<option value="b1">Bangla 1st Paper</option>
<option value="b2">Bangla 2nd Paper</option>
<option value="e">English</option>
<option value="phy1">Physics 1st Paper</option>
<option value="phy2">Physics 2nd Paper</option>
<option value="chem1">Chemistry 1st Paper</option>
<option value="chem2">Chemistry 2nd Paper</option>
<option value="math1">Mathematics 1st Paper</option>
<option value="math2">Mathematics 2nd Paper</option>
<option value="bio1">Biology 1st Paper</option>
<option value="bio2">Biology 2nd Paper</option>
<option value="ict">ICT</option>
<option value="sco1">Sociology 1st Paper</option>
<option value="sco2">Sociology 2nd Paper</option>
<option value="civ1">Civics 1st Paper</option>
<option value="civ2">Civics 2nd Paper</option>
<option value="eco1">Economics 1st Paper</option>
<option value="eco2">Economics 2nd Paper</option>
<option value="his1">History 1st Paper</option>
<option value="his2">History 2nd Paper</option>
<option value="psy1">Psychology 1st Paper</option>
<option value="psy2">Psychology 2nd Paper</option>
<option value="a&c1">Art & Craft 1st Paper</option>
<option value="a&c2">Art & Craft 2nd Paper</option>
<option value="geo1">Geology 1st Paper</option>
<option value="geo2">Geology 2nd Paper</option>
<option value="gk1">GK-Bangladesh Affairs</option>
<option value="gk2">GK-International Affairs</option>
<option value="bcs">BCS Preliminary</option>
<option value="none">None/Other</option>
</select>
</div>

<div class="input-field col s12">
<select name="sl_chapter" required>
<option value="" disabled selected>Select Chapter</option>
<option value="chap-1">Chapter 1</option>
<option value="chap-2">Chapter 2</option>
<option value="chap-3">Chapter 3</option>
<option value="chap-4">Chapter 4</option>
<option value="chap-5">Chapter 5</option>
<option value="chap-6">Chapter 6</option>
<option value="chap-7">Chapter 7</option>
<option value="chap-8">Chapter 8</option>
<option value="chap-9">Chapter 9</option>
<option value="chap-10">Chapter 10</option>
<option value="chap-11">Chapter 11</option>
<option value="chap-12">Chapter 12</option>
<option value="chap-13">Chapter 13</option>
<option value="chap-14">Chapter 14</option>
<option value="chap-15">Chapter 15</option>
<option value="chap-16">Chapter 16</option>
<option value="chap-17">Chapter 17</option>
<option value="chap-18">Chapter 18</option>
<option value="chap-19">Chapter 19</option>
<option value="chap-20">Chapter 20</option>
</select>
</div>

<div class="input-field">
<input name="chap_name" type="text" autocomplete="off" required/>
<label for="chap_name">Chapter Name</label>
</div>

<div class="input-field">
<input name="auth_name" type="text" autocomplete="off" required/>
<label for="auth_name">Author Name</label>
</div>


<div class="input-field col s12">
<select name="sl_class" required>
<option value="" disabled selected>Select Class</option>
<option value="hsc">HSC</option>
<option value="uni">University Admission</option>
<option value="med">Medical Admission</option>
<option value="eng">Engineering Admission</option>
<option value="bcs">BCS</option>
</select>
</div>

<div class="input-field col s12">
<select name="sl_group" required>
<option value="" disabled selected>Select Group</option>
<option value="all">All</option>
<option value="sci">Science</option>
<option value="com">Commerce</option>
<option value="hum">Humanity</option>
</select>
</div>

<div class="input-filed">
Negative Mark:
<label>
<input name="group1" value="0" type="radio" checked/>
<span>None</span>
</label>
<label>
<input name="group1" value="0.25" type="radio"/>
<span>0.25</span>
</label>
<label>
<input name="group1" value="0.50" type="radio" />
<span>0.50</span>
</label>
</div>

<div class="input-field">
<textarea name="notice" type="text" autocomplete="off" name="notice" placeholder="Notice or Announcement" required></textarea>
</div>

<center><button class="btn green" type="submit">Next</button></center>
</form>
</div>
`);

const detalisform = document.querySelector('#details_form');


detalisform.addEventListener('submit', e=>{
  e.preventDefault();
  let details = {
    exam_name: detalisform.exam_name.value,
    sl_exam_type: "practice",
    sl_subject: detalisform.sl_subject.value,
    sl_class: detalisform.sl_class.value,
    sl_group: detalisform.sl_group.value,
    sl_chapter: detalisform.sl_chapter.value,
    notice: detalisform.notice.value,
    makerID: user.uid,
    maker: user.displayName,
  }
  db.ref('app/users/'+user.uid+'/create2/history').update({details: details, status: true});

  db.ref('app/practiceRef/'+details.sl_subject+'/'+details.sl_chapter).update({
    name: detalisform.chap_name.value,
    author: detalisform.auth_name.value,
   });
});
$(document).ready(function () {
  $("select").formSelect();
});
}else{
$('.create-doc').html( `
<div class="head1">
<button class="btn red publish" id="publish_exam red"><i class="icofont-ui-clip-board left"></i></i> Publish</button>
<div class="cnt"><div class="counter">0</div> <div id="confirm" class="animate__animated animate__fadeIn"><div class="confirm"><i class="icofont-ui-check"></i></div></div></div>
<a href="#!/edit_exam2"<button class="btn green"><i class="icofont-ui-edit left"></i> Edit</button></a>
</div>
<div class="page1">
<form id="question_form">
<div class="input-field create-q">
<textarea name="question" type="text" placeholder="Write Question..."></textarea>
</div>

<div class="form_option create-q" >
<div class="input-field">
<div class="opt"><textarea name="a" placeholder="অপশন A"></textarea></div>
<div class="opt"><textarea name="b" placeholder="অপশন B"></textarea></div>
<div class="opt"><textarea name="c" placeholder="অপশন C"></textarea></div>
<div class="opt"><textarea name="d" placeholder="অপশন D"></textarea></div>
</div>
</div>
<div class="input-field">
    <select name="select_ans">
      <option class="dis" value="" disabled selected>উত্তর</option>
      <option value="1">A</option>
      <option value="2">B</option>
      <option value="3">C</option>
      <option value="4">D</option>
    </select>
  </div>

<div class="create-q">
  <textarea name="explanation" id="create-ex" placeholder="ব্যাখ্যা/সমাধান"></textarea>
</div>
<center><button type="submit" class="btn red">Add Question</button><center>
</form>
</div>

<center><div class="btn send">Send Ques</div></center>
`);

$('.send').click(function(e){
  fetch('../scripts/q.json')
  .then(response => response.json())
  .then(json => {
    console.log(json);
    db.ref('app/practiceRef/phy2/chap-10').set({
      name: "সেমিকন্ডাক্টর ও ইলেকট্রনিক্স"      ,
      author: "---",
      i: 10
    });

    db.ref('app/users/094Rbu13YbWc9On6KnuJIUv3QMx2/create2/history/details').update({
      exam_name: "সেমিকন্ডাক্টর ও ইলেকট্রনিক্স-০১",
      sl_chapter: "chap-10",
      notice: "“সফল হতে চাইলে তোমাকে সামনে আসা সব চ্যালেঞ্জ মোকাবিলা করতে হবে। বেছে বেছে চ্যালেঞ্জ নেয়া যাবে না” - মাইক গাফকা (লেখক ও উদ্যোক্তা)",
      sl_subject: "phy2"
    });

    db.ref('app/users/094Rbu13YbWc9On6KnuJIUv3QMx2/create2/history/questions').set(json)
  })
})



$('.publish').click(function(){
 let exam = snap.val().history;
 Swal.fire({
  title: 'Are you sure?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes'
}).then((result) => {
  if (result.isConfirmed) {
    store.collection('subjectExams').doc(snap.val().history.details.sl_subject).collection(snap.val().history.details.sl_chapter).add({details: snap.val().history.details, questions: snap.val().history.questions, publish_date: (new Date()).toString()});
    Swal.fire(
      'Published',
      'Exam has been published!',
      'success'
    ).then(rs=> {
      if(rs.isConfirmed){
      }
    });
  }
});
});


$(document).ready(function () {
$("select").formSelect();
});



let count = 0;
if(snap.val().history.questions != null){
count = snap.val().history.questions.length;
}
$('.counter').text(count);
const question_form = document.querySelector('#question_form');
question_form.addEventListener('submit', e=> {
e.preventDefault();
let optArr = [question_form.a.value, question_form.b.value, question_form.c.value, question_form.d.value];
let ansText = `${ansOpt[parseInt(question_form.select_ans.value)]}. ${optArr[parseInt(question_form.select_ans.value)-1]}<br>`;
let question = {
    q: (question_form.question.value).replace(/(?:\r\n|\r|\n)/g, '<br>'),
    opt: [question_form.a.value, question_form.b.value, question_form.c.value, question_form.d.value],
    ans: question_form.select_ans.value,
    ex: ansText + (question_form.explanation.value).replace(/(?:\r\n|\r|\n)/g, '<br>')
}
  db.ref('app/users/'+user.uid+'/create2/history/questions/'+count).update(question);
  $('.counter').hide();
  $('#confirm').show();
  setTimeout(function(){
    $('#confirm').hide(310);
    $('.counter').show(320);
  }, 1500)
});

}
});
}
},


"edit_exam2":function(){
  $('.app_loader').show();
  $('.footer').hide();
  $('.footertext').hide();
    $('.footerIcon').removeClass('footerIconActive');
    $('.top_logo').html(`<div onclick="window.history.back()" class="animate__animated animate__fadeInRight top_app_title"><i class="icofont-simple-left"></i> Edit</div>`);
    app.innerHTML= `
    <div class="details_view"></div>
    <div class="questions_view"></div>
    <center><div style="display: none;" class="btn dlt_history red">Delete</div></center>
    `
    const details_view = document.querySelector('.details_view');
    const question_view = document.querySelector('.questions_view');
    db.ref('app/users/'+user.uid+'/create2/history').on('value', snap=>{
      $('.app_loader').hide();
      let dt = snap.val();
      details_view.innerHTML = `
         <div class="exam_name">${dt.details.exam_name}</div>
         <div class="tag_list">
         <div class="chip red">${tag[dt.details.sl_class]}</div>
         <div class="chip pink">${tag[dt.details.sl_group]}</div>
         <div class="chip green">${tag[dt.details.sl_subject]}</div>
         <div class="chip orange">${tag[dt.details.sl_exam_type]}</div>
         </div>
         <a href="#modal2" class="modal-trigger btn-floating  waves-effect waves-light red"><i class="material-icons">edit</i></a>
      `
      const edit_det = document.querySelector('#edit_det');
      edit_det.addEventListener('submit', e=>{
        e.preventDefault();
        data = {
          exam_name: edit_det.edit_name.value,
        }
        Swal.fire({
          title: 'Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.isConfirmed) {
            db.ref("app/users/"+user.uid+"/create2/history/details").update(data);
            Swal.fire(
              'Saved',
              'Your data has been saved.',
              'success'
            ).then(rs=> {
              if(rs.isConfirmed){
                $(document).ready(function(){
                  $('.modal').modal();
                  $('#modal2').modal('close');
            });
              }
            })
          }
        });
       
      })
      var ans = [];
      for(let i=0; i<dt.questions.length; i++){
        ans.push(parseInt(dt.questions[i].ans)+i*4);
        question_view.innerHTML += `
        <div class="q-wrap">
    <div class="question">
       ${i+1}. ${dt.questions[i].q}
    </div>
    <div class="option">
        <div class="opt" id="${i+1+i*3}"><div class="st"></div>${dt.questions[i].opt[0]}</div>
        <div class="opt" id="${i+2+i*3}"><div class="st"></div>${dt.questions[i].opt[1]}</div>
        <div class="opt" id="${i+3+i*3}"><div class="st"></div>${dt.questions[i].opt[2]}</div>
        <div class="opt" id="${i+4+i*3}"><div class="st"></div>${dt.questions[i].opt[3]}</div>
    </div>
    <div class="solution"><b>Solution:</b></br> ${dt.questions[i].ex}</div>
    <center><a href="#!/edit_q/create2/${i}"><button class="btn green">Edit</button></a></center>
</div>`
  }
  MathJax.typeset();
      for(let a=0; a<ans.length; a++){
           $("#" + ans[a] + " .st").addClass("cr");
         }

         $('.dlt_history').show();
         $('.dlt_history').off().click(function(){
          Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
              db.ref('app/users/'+user.uid+'/create2/history').update({status: false});
           db.ref('app/users/'+user.uid+'/create2/history/details').remove();
           db.ref('app/users/'+user.uid+'/create2/history/questions').remove();
           window.history.back();
              Swal.fire(
                'Deleted',
                'All questions have been deleted from your history.',
                'success'
              ).then(rs=> {
                if(rs.isConfirmed){
              //     $(document).ready(function(){
              //       $('.modal').modal();
              //       $('#modal2').modal('close');
              // });
                }
              })
            }
          })

           
         })
});  

},

"edit_exam":function(){
  $('.app_loader').show();
  $('.footer').hide();
  $('.footertext').hide();
    $('.footerIcon').removeClass('footerIconActive');
    $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Edit Exam</div></div>`);
    app.innerHTML= `
    <div class="details_view"></div>
    <div class="questions_view"></div>
    <center><div style="display: none;" class="btn dlt_history red">Delete</div></center>
    `
    const details_view = document.querySelector('.details_view');
    const question_view = document.querySelector('.questions_view');
    db.ref('app/users/'+user.uid+'/create/history').on('value', snap=>{
      $('.app_loader').hide();
      let dt = snap.val();
      details_view.innerHTML = `
         <div class="exam_name">${dt.details.exam_name}</div>
         <div class="exam_duration">সময়ঃ ${dt.details.sl_duration} মিনিট | প্রশ্নঃ ${dt.questions.length}টি </div>
         <div class="details_time">শুরুঃ ${date_formatter(dt.details.start_date)} <br> শেষঃ ${date_formatter(dt.details.end_date)}</div>
         <div class="tag_list">
         <div class="chip red">${tag[dt.details.sl_class]}</div>
         <div class="chip pink">${tag[dt.details.sl_group]}</div>
         <div class="chip green">${tag[dt.details.sl_subject]}</div>
         <div class="chip orange">${tag[dt.details.sl_exam_type]}</div>
         </div>
         <a href="#modal2" class="modal-trigger btn-floating  waves-effect waves-light red"><i class="material-icons">edit</i></a>
      `
      const edit_det = document.querySelector('#edit_det');
      edit_det.edit_name.value = dt.details.exam_name;
      let sdate = dt.details.start_date;
      sdate = sdate.split(' ');
      edit_det.edit_start.value = sdate[1] + " " + sdate[2] + " " + sdate[3] + " " +sdate[4];
      
      sdate = dt.details.end_date;
      sdate = sdate.split(' ');var ans = [];
  

      question_view.innerHTML = '';

      for(let i=0; i<dt.questions.length; i++){
        console.log(i);
        ans.push(parseInt(dt.questions[i].ans)+i*4);
        
        question_view.innerHTML += `
        <div class="q-wrap">
    <div class="question">
       ${i+1}. ${dt.questions[i].q}
    </div>
    <div class="option">
        <div class="opt" id="${i+1+i*3}"><div class="st"></div>${dt.questions[i].opt[0]}</div>
        <div class="opt" id="${i+2+i*3}"><div class="st"></div>${dt.questions[i].opt[1]}</div>
        <div class="opt" id="${i+3+i*3}"><div class="st"></div>${dt.questions[i].opt[2]}</div>
        <div class="opt" id="${i+4+i*3}"><div class="st"></div>${dt.questions[i].opt[3]}</div>
    </div>
    <div class="solution"><b>Solution:</b></br> ${dt.questions[i].ex}</div>
    <center><a href="#!/edit_q/create/${i}"><button class="btn green">Edit</button></a></center>
</div>`

}
      for(let a=0; a<ans.length; a++){
           $("#" + ans[a] + " .st").addClass("cr");
         }

      edit_det.edit_end.value = sdate[1] + " " + sdate[2] + " " + sdate[3] + " " +sdate[4];
     
      edit_det.addEventListener('submit', e=>{
        e.preventDefault();
        data = {
          exam_name: edit_det.edit_name.value,
          start_date : (new Date(edit_det.edit_start.value)).toString(),
          end_date : (new Date(edit_det.edit_end.value)).toString(),
        }
        Swal.fire({
          title: 'Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.isConfirmed) {
            db.ref("app/users/"+user.uid+"/create/history/details").update(data);
            Swal.fire(
              'Saved',
              'Your data has been saved.',
              'success'
            ).then(rs=> {
              if(rs.isConfirmed){
                $(document).ready(function(){
                  $('.modal').modal();
                  $('#modal2').modal('close');
            });
              }
            })
          }
        });
       
      })
//       var ans = [];
//       for(let i=0; i<dt.questions.length; i++){
//         ans.push(parseInt(dt.questions[i].ans)+i*4);
//         question_view.innerHTML += `
//         <div class="q-wrap">
//     <div class="question">
//        ${i+1}. ${dt.questions[i].q}
//     </div>
//     <div class="option">
//         <div class="opt" id="${i+1+i*3}"><div class="st"></div>${dt.questions[i].opt[0]}</div>
//         <div class="opt" id="${i+2+i*3}"><div class="st"></div>${dt.questions[i].opt[1]}</div>
//         <div class="opt" id="${i+3+i*3}"><div class="st"></div>${dt.questions[i].opt[2]}</div>
//         <div class="opt" id="${i+4+i*3}"><div class="st"></div>${dt.questions[i].opt[3]}</div>
//     </div>
//     <div class="solution"><b>Solution:</b></br> ${dt.questions[i].ex}</div>
//     <center><a href="#!/edit_q/create/${i}"><button class="btn green">Edit</button></a></center>
// </div>`
//   }
//       for(let a=0; a<ans.length; a++){
//            $("#" + ans[a] + " .st").addClass("cr");
//          }

         $('.dlt_history').show();
         $('.dlt_history').off().click(function(){
          Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
              db.ref('app/users/'+user.uid+'/create/history').update({status: false});
           db.ref('app/users/'+user.uid+'/create/history/details').remove();
           db.ref('app/users/'+user.uid+'/create/history/questions').remove();
           window.history.back();
              Swal.fire(
                'Deleted',
                'All questions have been deleted from your history.',
                'success'
              ).then(rs=> {
                if(rs.isConfirmed){
              //     $(document).ready(function(){
              //       $('.modal').modal();
              //       $('#modal2').modal('close');
              // });
                }
              })
            }
          })

           
         })
});  

},

"/edit_q/:ref/:id" : function(params){
  $('.app_loader').show();
  $('.footer').hide();
    $('.footertext').hide();
      $('.footerIcon').removeClass('footerIconActive');
      $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Question Edit</div></div>`);
      app.innerHTML = `<span class="edit-q-doc"></span>`
  db.ref('app/users/'+user.uid+'/'+params.ref+'/history/questions/'+params.id).on('value', snap=>{
    $('.app_loader').hide();
    $('.edit-q-doc').html(`
    <div class="page1">
<form id="question_form">
<div class="input-field create-q" style="display: flex;">
<textarea name="question" type="text" placeholder="Write Question...">${snap.val().q}</textarea>
</div>

<div class="form_option create-q" >
<div class="input-field">
<div class="opt"><textarea name="a" placeholder="অপশন A">${snap.val().opt[0]}</textarea></div>
<div class="opt"><textarea name="b" placeholder="অপশন B">${snap.val().opt[1]}</textarea></div>
<div class="opt"><textarea name="c" placeholder="অপশন C">${snap.val().opt[2]}</textarea></div>
<div class="opt"><textarea name="d" placeholder="অপশন D">${snap.val().opt[3]}</textarea></div>
</div>
</div>
<div class="input-field">
      <select name="select_ans">
        <option class="dis" value="" disabled selected>উত্তর</option>
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
        <option value="4">D</option>
      </select>
    </div>
<h6>Answer: ${optionsTag[snap.val().ans]}</h6>
<div class="create-q">
    <textarea name="explanation" id="create-ex" placeholder="ব্যাখ্যা/সমাধান" required>${snap.val().ex}</textarea>
</div>
<center><button type="submit" class="btn red">Save</button><center>
</form>
</div>
    `);
    $(document).ready(function () {
      $("select").formSelect();
    });
    
    const question_form = document.querySelector('#question_form');
    question_form.addEventListener('submit', e=> {
      e.preventDefault();
      let ans="";
    if(question_form.select_ans.value==="") ans = snap.val().ans;
    else ans = question_form.select_ans.value;
      let question = {
          q: (question_form.question.value).replace(/(?:\r\n|\r|\n)/g, '<br>'),
          opt: [question_form.a.value, question_form.b.value, question_form.c.value, question_form.d.value],
          ans: ans,
          ex: (question_form.explanation.value).replace(/(?:\r\n|\r|\n)/g, '<br>')
      }

      Swal.fire({
          title: 'Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.isConfirmed) {
            db.ref('app/users/'+user.uid+'/'+params.ref+'/history/questions/'+params.id).update(question);
            Swal.fire(
              'Saved',
              'Your question has been saved.',
              'success'
            ).then(rs=> {
              if(rs.isConfirmed){
                window.history.back();
              }
            })
          }
        })
  });
  

});
},

"/donate" : function(){
    $('.footer').show();
  $('.footertext').hide();
    $('.footerIcon').removeClass('footerIconActive');
        if($('.dnt')[0].classList[3] === undefined){
    $('.dnt').addClass('footerIconActive');
    $($($('.dnt')[0].parentNode)[0].lastElementChild).show();
    $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeIn top_dir"><img src="../images/bottom-nav/pay.png" height="30px"></div> <div class="animate__animated animate__fadeIn top_text"> Pricing & Donation</div></div>`);
    }

    app.innerHTML = `
    <div class="donate">

    <div class="donate_card">
    This Page is under construction!
    </div>

    <div class="donate_card">
    </div>

    <div class="donate_card">
    </div>

    </div>
    `
  if(myData.subscribed.first === false){
    $('#isSubs').html(`<div id="Dosubs" class="subscribe_button">সাবস্ক্রাইব করো</div>`);
    $('#Dosubs').click(function(e){
      e.preventDefault();
      
Swal.fire({
  html:` 
  <div class="payWith">
  <img src="../images/BKash.png">
  <div>Send Money with bKash</div>
  </div>
  <center>প্রথমে বিকাশ থেকে <b style="color: crimson">Send Money</b> করো। এরপর <b style="color: crimson">Transaction ID</b> টি নিচে লিখে সাবমিট করো।
  </center>
  `,
  input: 'text',
  footer: 'যে কোনো সমস্যায় যোগাযোগ করো: +8801318067123 এই নম্বরে।',
  inputAttributes: {
    placeholder: 'TransxID',
    autocapitalize: 'off'
  },
  showCancelButton: true,
  confirmButtonText: 'সাবমিট',
  showLoaderOnConfirm: true,
  cancelButtonText: 'বাতিল',
}).then(result=>{
  if(result.isConfirmed) {
    Swal.fire({
      title:'সাবমিট করা হয়েছে!',
      html: '<b style="color: crimson">Transaction ID</b> টি সাবমিট হয়েছে! ৩-৫ঘণ্টার মধ্যে SMS এর মাধ্যমে কনফার্ম করা হবে।',
      icon: 'success',
      footer: 'যে কোনো সমস্যায় যোগাযোগ করো: +8801318067123 এই নম্বরে।',
    })
  }
})

    });
  }else if(myData.subscribed.first === "pending"){
    $('#isSubs').html(`<snap id="subs_btn"><div class="subscribe_button grn"><i class="icofont-ui-clock"></i> সাবস্ক্রাইব পেনডিং</div></span>`);
  }else{
    $('#isSubs').html(`<snap id="subs_btn"><div class="subscribe_button grn"><i class="icofont-check-circled"></i> সাবস্ক্রাইব করেছো!</div></span>`);
  }
},

"/myprofile" : function (){
  $('.app_loader').show();
    $('.footer').hide();
    $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Profile</div></div>`);
   app.innerHTML=`
   <center class="profile">
   <div id="prem">
   <a href="#!/edit_profile"><div class="prof-edit-icon animate__animated animate__backInRight animte__faster"><i class="icofont-pencil-alt-3"></i></div></a>
  <div id="logout" class="logout-icon  animate__animated animate__backInLeft animte__faster"><i class="icofont-logout"></i></div>
   <div class="img"><div class="grp">${tag[myData.group]}</div><div class="imagexbig"><img src="${user.photoURL}"/></div></div>
   <div class="displayName">${user.displayName}<span class="nick"></span><div class="subs_icon"></div></div>
   <div class="bio"></div>
   <div class="inst"> </div>
   <div class="dist"></div>
   <span id="subs"></span>
   </div>
   <div class="line"></div>
   <div class="score_card">
   <div class="rank cardXmed">
   <div class="number">...</div>
   <div class="text"><i class="icofont-group-students"></i> অবস্থান</div>
   </div>

   <div class="exam cardXmed">
   <div class="number">...</div>
   <div class="text"><i class="icofont-clip-board"></i> পরীক্ষা</div>
   </div>

   <div class="myscore cardXmed">
   <div class="number">...</div>
   <div class="text"><i class="icofont-star-shape"></i> স্কোর</div>
   </div>
   </div>

   </center>
   <div class="recent_list">
   <div class="title-n"><i class="icofont-checked"></i> Your Participation</div>
 <div class="r-tab">

   <div id="public" class="tab_item"><i class="icofont-people"></i> Public</div>
   <div id="live" class="tab_item"><i class="icofont-oscommerce"></i> Live</div>
   <div id="weekly" class="tab_item"><i class="icofont-calendar"></i> Weekly</div>
   <div id="special" class="tab_item"><i class="icofont-space"></i> Special</div>
   </div>
   <div class="r-list"></div>
   </div>
   `;

   $('#logout').click(function(){
    firebase.auth().signOut();
    router.navigate('/');
    window.location.reload()
  });

db.ref("app/users/"+user.uid).on('value', snap=>{
  $('#dash').html("");
  $(".exam .number").text(snap.val().exams.total);
  $(".myscore .number").text(snap.val().scores.totalScore);
  $('.nick').text("("+snap.val().nickName+")");
  $('.inst').html(`<i class="icofont-institution"></i> ${snap.val().inst}`)
  $('.dist').html(`<i class="icofont-building-alt"></i> ${snap.val().district}`);
  $('.bio').text(snap.val().bio);

 if(snap.val().subscribed.first === true){
   $('.subs_icon').html(`<i class="icofont-check-circled"></i>`);
   $('#prem').addClass('prem');
   console.log('%c Subscribed!', 'font-size: 15px; color: blue, font-weight:bold;');
 }else{
  $('.subs_icon').html(`<i class="icofont-warning-alt"></i>`);
  $('#prem').removeClass('prem');
  console.log('%c Unsubscribed!', 'font-size: 15px; color: blue, font-weight:bold;');
 }
  });


  store.collection("globalScore").orderBy("score", 'desc').onSnapshot(snap=> {
    $('.app_loader').hide();
    let i=0;
    snap.forEach(p=>{
      i++;
      if(p.data().id===user.uid) $('.rank .number').text(i);
    })
  });


  const list = document.querySelector('.r-list');
  let ids= ['public', 'live', 'weekly', 'special'];
  $(document).ready(function() {
    $('#public').trigger('click');
  })
  $('.tab_item').click(function() {
    let id = $(this)[0].id;
    for(let i=0; i<ids.length; i++){
      if($('#'+ids[i])[0].classList[1] === "r-tab-active"){
        $('#'+ids[i]).removeClass("r-tab-active");
      }
    }
    $('#'+id).addClass('r-tab-active');

  db.ref('app/users/'+user.uid+'/allExams/'+id).on('value', ex=>{
    list.innerHTML = "";
    if(ex.val() === null) list.innerHTML = `<center><div class="small_no_exam animate_animated animate__bounceIn"><i class="icofont-exclamation-circle"></i>এখনো কোনো পরীক্ষায় অংশগ্রহণ করো নি!</div></center>`;
  ex.forEach(item=>{
      list.innerHTML += `
      <a href="#!/exam/public/${item.val().examID}"><div class="r-item"><div class="small_logo">${firstLetter(item.val().name)}</div><div>${item.val().name}</div></div></href>
      `
    })

  })

  });
},

"/profile/:id" : function (params){
  $('.app_loader').show();
    $('.footer').hide();
    $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text" id="prof_name">Profile</div></div>`);
   app.innerHTML=`
   <center  class="profile">
   <div id="prem">
   <div class="img"><div class="grp"></div><div class="imagexbig"></div></div>
   <div class="displayName"><span class="name"></span><span class="nick"></span> <div class="subs_icon"></div></div>
   <div class="bio"></div>
   <div class="inst"> </div>
   <div class="dist"></div>
   </div>
   <div class="line"></div>
   <div class="score_card">
   <div class="rank cardXmed">   
   <div class="number">...</div>
   <div class="text"><i class="icofont-group-students"></i> অবস্থান</div>
   </div>

   <div class="exam cardXmed">
   <div class="number">...</div>
   <div class="text"><i class="icofont-clip-board"></i> পরীক্ষা</div>
   </div>

   <div class="myscore cardXmed">
   <div class="number">...</div>
   <div class="text"><i class="icofont-star-shape"></i> স্কোর</div>
   </div>
   </div>
   </center>
   `;

db.ref("app/users/"+params.id).on('value', snap=>{
  $('#dash').html("");
  $(".exam .number").text(snap.val().exams.total);
  $(".myscore .number").text(snap.val().scores.totalScore);
  $('.nick').text("("+snap.val().nickName+")");
  $('.inst').html(`<i class="icofont-institution"></i> ${snap.val().inst}`);
  $('.dist').html(`<i class="icofont-building-alt"></i> ${snap.val().district}`);
  $('.imagexbig').html(`<img src="${snap.val().photoURL}"/>`);
  $('.name').html(`${snap.val().name}`);
  $('#prof_name').text(snap.val().name);
  $('.bio').text(snap.val().bio);
  $('.nick').text("("+snap.val().nickName+")");
  $('.grp').html(`${tag[snap.val().group]}`);
  if(snap.val().subscribed.first === true){
    $('.subs_icon').html(`<i class="icofont-check-circled"></i>`);
    $('#prem').addClass('prem');
    console.log('%c Subscribed!', 'font-size: 15px; color: blue, font-weight:bold;');
  }else{
   $('.subs_icon').html(`<i class="icofont-warning-alt"></i>`);
   $('#prem').removeClass('prem');
   console.log('%c Unsubscribed!', 'font-size: 15px; color: blue, font-weight:bold;');
  }
  });


  store.collection("globalScore").orderBy("score", 'desc').onSnapshot(snap=> {
    $('.app_loader').hide();
    let i=0;
    snap.forEach(p=>{
      i++;
      if(p.data().id===params.id) $('.rank .number').text(i);
    })
  });

},

"/edit_profile": function(params) {
  $('.app_loader').show();
  $('.footer').hide();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Edit Profile</div></div>`);
app.innerHTML = `
<br>
<form id="edit_profile">
<small>Nick name</small>
<div class="input_field">
<input name="nick" type="text" placeholder="Nick Name" required/>
</div>

<div class="input-field col s12">
<small>Group</small>
<select name="sl_group_info" required>
  <option value="" disabled selected>Select Group</option>
  <option value="sci">Science</option>
  <option value="com">Commerce</option>
  <option value="hum">Humanity</option>
  <option value="none">Other/None</option>
  </select>
  </div>
  <small>Educational Institute</small>
  <div class="input_field">
  <input name="inst" type="text" placeholder="Institution" required/>
  </div>
 <div class="dist_list"></div>
 <small>Phone</small>
 <div class="input_field">
 <input name="phone" type="number" placeholder="Phone" required/>
 </div>
 <small>Bio</small>
 <div class="input_field">
 <input name="bio" type="text" placeholder="Bio" required/>
 </div>
<center><button type="submit" class="btn green">Edit</button></center>
</form>
`;
const gi = document.getElementById('edit_profile');

db.ref('app/users/'+user.uid).on('value', p=>{
  gi.nick.value = p.val().nickName;
  gi.sl_group_info.value = p.val().group;
 gi.inst.value = p.val().inst;
 gi.phone.value = p.val().phone;
  gi.bio.value = p.val().bio;
 


fetch('./scripts/districts.json')
.then(res=>res.json())
.then(data=>{
  $('.app_loader').hide();
  let html = `<div class="input-field col s12"><small>District</small><select name="sl_dist_info" required><option value="" disabled>জেলা</option>`;
  for(let i=0; i<data.districts.length; i++){
    if(p.val().district == data.districts[i].bn_name){
      html+=`
      <option value="${data.districts[i].bn_name}" selected>${data.districts[i].bn_name}</option>
      `
    }else{
    html+=`
    <option value="${data.districts[i].bn_name}">${data.districts[i].bn_name}</option>
    `}
  }
  html += ` </select></div>`;

  $('.dist_list').html(html);
  $(document).ready(function () {
    $("select").formSelect();
  });
})

$(document).ready(function () {
  $("select").formSelect();
});

});




gi.addEventListener('submit', e=>{
e.preventDefault();
var data = {
 nickName: gi.nick.value,
 group: gi.sl_group_info.value,
 inst: gi.inst.value,
 district: gi.sl_dist_info.value,
 phone: gi.phone.value,
 bio: gi.bio.value,
}
Swal.fire({
title: 'Do you want to save the changes?',
showDenyButton: true,
showCancelButton: true,
confirmButtonText: 'Save',
denyButtonText: `Don't save`,
}).then((result) => {
/* Read more about isConfirmed, isDenied below */
if (result.isConfirmed) {
  Swal.fire('Saved!', '', 'success');
  db.ref('app/users/'+user.uid).update(data);
  store.collection('globalScore').doc(user.uid).update({
    username: data.nickName,
    inst: data.inst +"|"+data.group
  });
  window.history.back();
} else if (result.isDenied) {
  Swal.fire('Changes are not saved', '', 'info');
  window.history.back();
}
})

})

},

"/resource":function(params){
 
  $('.footer').show();
  $('.footertext').hide();
    $('.footerIcon').removeClass('footerIconActive');
        if($('.rsc')[0].classList[3] === undefined){
    $('.rsc').addClass('footerIconActive');
    $($($('.rsc')[0].parentNode)[0].lastElementChild).show();
    $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeIn top_dir"><img src="../images/pencil-case.png" height="30px"></div> <div class="animate__animated animate__fadeIn top_text">Resources</div></div>`);
    }
  app.innerHTML = `
  <a href="#!/add_resources"><div class="floating-button"><img src="../images/plus.png"></div></a>
  <div class="search-bar">
  <div class="search-icon"><img src="../images/search (1).png"></div>
  <input autocomplete="off" id="search-book" placeholder="সার্চ করুন..." type="text" name="search">
  </div>

  <div id="search-result">
  <div class="search-result"></div>
  </div>

  <div class="resource-head">Newly Added</div>
  <div class="new-resources">
  <div class="progress">
  <div class="indeterminate red" ></div>
</div>
  </div>


  <div class="resource-head">All Resources</div>
  <div class="all-resources">
  <div class="resource-item">
  <div class="progress ">
  <div class="indeterminate red" ></div>
</div>
</div>

<div class="resource-item">
<div class="progress ">
<div class="indeterminate red" ></div>
</div>
</div>

<div class="resource-item">
<div class="progress ">
<div class="indeterminate red" ></div>
</div>
</div>

<div class="resource-item">
<div class="progress ">
<div class="indeterminate red" ></div>
</div>
</div>

<div class="resource-item">
<div class="progress ">
<div class="indeterminate red" ></div>
</div>
</div>

<div class="resource-item">
<div class="progress ">
<div class="indeterminate red" ></div>
</div>
</div>

  </div>
  `

  const newr = document.querySelector('.new-resources');
  store.collection('books').orderBy("creationTime", "desc").limit(6).onSnapshot(snap=>{
    newr.innerHTML = "";
    snap.forEach(item=>{
        newr.innerHTML += `
        <a target="_blank" href="${item.data().link}"><div class="resource-item">
        <div class="book-cat">${item.data().cat}</div>
        <div class="book-cover"><img src="${item.data().cover}"></div>
        <div class="book-title">${item.data().title}</div>
        <div class="book-size">${item.data().size}</div>
        <div class="book-author">${item.data().author}</div>
        </div></a>
        `
    });

  });

  const allr = document.querySelector('.all-resources');
  const search_result = document.querySelector('.search-result');
    store.collection('books').onSnapshot(snap=>{
      allr.innerHTML = "";
      search_result.innerHTML = "";
      snap.forEach(item=>{
        allr.innerHTML += `
        <a target="_blank" href="${item.data().link}"><div class="resource-item">
        <div class="book-cat">${item.data().cat}</div>
        <div class="book-cover"><img src="${item.data().cover}"></div>
        <div class="book-title">${item.data().title}</div>
        <div class="book-size">${item.data().size}</div>
        <div class="book-author">${item.data().author}</div>
        </div></a>
        `

        search_result.innerHTML += `
        <div id="search-item">
        <a target="_blank" href="${item.data().link}"><div class="search-item">
        <div class="book-cover-s"><img src="${item.data().cover}"></div>
        <div class="search-details">
        <div class="book-title-s">${item.data().title}</div>
        <div class="book-author">${item.data().author}</div>
        <div class="book-cat-s">${item.data().cat}</div>
        <div class="book-size">${item.data().size}</div>
        </div>
        </div></a></div>
        `
      })
    });

    //Searching books
    document.getElementById('search-book').addEventListener('keyup', e=>{
      if(e.key = 'Enter'){
        e.preventDefault();
        let filter = ($('#search-book')[0].value).toUpperCase();
        if(filter.length>0) $('.search-result').show();
        else $('.search-result').hide();
        let allPost = document.querySelectorAll('.book-title-s');
        for(let i=0; i<allPost.length; i++){
          s_tag = allPost[i].innerText.toUpperCase();
          
          if(s_tag.indexOf(filter) > -1) {
            allPost[i].parentNode.parentNode.parentNode.style.display = "block";
            // $('.search-result').hide();
          } else{
            allPost[i].parentNode.parentNode.parentNode.style.display = "none";
            // $('.search-result').show();
          }

        }
      }
    });
    if(user.uid !== '094Rbu13YbWc9On6KnuJIUv3QMx2') $('.floating-button').hide();

},

"add_resources": function(){
  // $('.app_loader').show();
  $('.footer').hide();
  $('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeInRight top_dir"><i class="icofont-simple-left"></i></div> <div class="animate__animated animate__fadeIn top_text">Add Resources</div></div>`);
  app.innerHTML = `
  <form id="add_book">
  <div class="input-field">
  <input type="text" name="title" required>
  <label for="title">বইয়ের নাম</label>
  </div>

  <div class="input-field">
  <input type="text" name="cover" required>
  <label for="cover">বইয়ের কভার ইমেজ লিঙ্ক</label>
  </div>

  <div class="input-field">
  <input type="text" name="author" required>
  <label for="author">বইয়ের লেখক বা প্রতিষ্ঠান বা প্রকাশনী</label>
  </div>


  <div class="input-field col s12">
<select name="cat" required>
  <option value="" disabled selected>বইয়ের ধরণ</option>
  <option value="টেক্সট বুক">টেক্সট বুক</option>
  <option value="দাগানো বই">দাগানো বই</option>
  <option value="নোট">নোট</option>
  <option value="কনসেপ্ট বুক">কনসেপ্ট বুক</option>
  <option value="ডাইজেস্ট">ডাইজেস্ট</option>
  <option value="সাজেশন">সাজেশন</option>
  <option value="এক্সট্রা ইনফো">এক্সট্রা ইনফো</option>
  </select>
  </div>

  <div class="input-field">
  <input type="text" name="link" required>
  <label for="link">বইয়ের লিঙ্ক</label>
  </div>

  <div class="input-field">
  <input type="text" name="size" required>
  <label for="size">বইয়ের সাইজ</label>
  </div>
  <center><button type="submit" class="btn green">সাবমিট করুন</button></center>
  </form>
  `

  $(document).ready(function () {
    $("select").formSelect();
  });
  const add_book = document.getElementById('add_book');
 
  add_book.addEventListener('submit', e=>{
    e.preventDefault();

    store.collection('books').add({
      creationTime: firebase.firestore.Timestamp.fromDate(
        new Date()),
      title: add_book.title.value,
      cover: add_book.cover.value,
      author: add_book.author.value,
      cat: add_book.cat.value,
      link: add_book.link.value,
      size: add_book.size.value
    }).then(()=>{
    Swal.fire(
      'সাবমিটেড!',
      'বইটি এখন ডেটাবেসে সংরক্ষিত!',
      'success'
    )
  })
    
  })



 

}


}).resolve();


    //Page not found!
    // router.notFound(function () {
    //   app.innerHTML = `404; Opps! You're in a wrong place!`;
    // });

   // Hooks
   router.hooks({
    before: function (done, params) {
      done();
    },
    after: function (params, query) {

    },
    leave: function (params) {
    },
  });

  //Random ID maker
  function makeID(len){
    var id = '';
    var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var keyLen = key.length;
    for(let i=0; i<len; i++){
      id += key.charAt(Math.floor(Math.random()*keyLen));
    }
    return id;
  } 


  let d = Math.abs(new Date(myData.subscribed) - (new Date()));
  //console.log(d);
  var totalseconds = d;
  var day = 86400000;
  var hour = 3600000;
  var minute = 60;
  
  var daysout = Math.floor(totalseconds / day);
  var hoursout = Math.floor((totalseconds - daysout * day)/hour);
  var minutesout = Math.floor((totalseconds - daysout * day - hoursout * hour)/minute);
  var secondsout = totalseconds - daysout * day - hoursout * hour - minutesout * minute;

  //console.log(daysout);
  if(daysout<=10 && (daysout !=0 && hoursout!=0)){
   Swal.fire({
       title: 'Your subscription will expire soon!',
       html: `<h5>${daysout} Day(s) ${hoursout} Hour(s) left!</h5>`,
       text: "Subscribe again to access premium features!",
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#d33',
       cancelButtonColor: 'orange',
       confirmButtonText: 'Subscribe'
     }).then((result) => {
       if (result.isConfirmed) {
         router.navigate('#!/donate');
       }
     })
  }


})();

}else{
  $('.footer').hide();
  $('.top').hide();
}
});

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}