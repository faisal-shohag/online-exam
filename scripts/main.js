
var router = new Navigo(null, true, '#!');
var app = document.querySelector("#app");
$(document).ready(function(){
  $('.modal').modal();
});


firebase.auth().onAuthStateChanged((user)=>{
  $('.loading').hide();
  if(user){
    $('.top').show();
    $('.image').html(`<img src="${user.photoURL}"/>`)
    $('.sign').hide();
$('.seeMe').html(`<div class="image"><img src="${user.photoURL}" alt class="circle"/></div> <span class="title">প্রোফাইল</span>`)
$('.logout').html(`<div class="image"><img src="https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-logout-icon-png-image_4233257.jpg" alt class="circle"> </div><span class="title">লগ আউট</div>`);
$('.deleteAc').html(`<img src="data:image/jpeg;base64,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" alt class="circle"> <span class="title">Delete Account</span>`)
$('.logout').click(function(){
  firebase.auth().signOut();
  window.location.reload()
});

$('.deleteAc').click(function(){
  window.location.reload()
});



router.on(function() {
  $('.app_loader').show();
  $('.footer').show();
  $('.footertext').hide();
  $('.footerIcon').removeClass('footerIconActive');
  if($('.hm')[0].classList[3] === undefined){
    $('.hm').addClass('footerIconActive');
    $($($('.hm')[0].parentNode)[0].lastElementChild).show();
  }
  $('.top_logo').html(`<span class="animate__animated animate__fadeInLeft">যাচাই</span>`);
  app.innerHTML = `
  <div class="examlist">
  </div>
  `;
 const examlist = document.querySelector('.examlist');
 store.collection('public_exams').orderBy("publish_date", 'desc').limit(20).get().then(snap=> {
   $('.app_loader').hide();
  snap.forEach(doc=> {
    let data = doc.data();
    if(new Date(data.details.end_date) > new Date() && new Date(data.details.start_date) < new Date()){
      if(data.details.password === ""){
        examlist.innerHTML += `
        <a href="#!/view_exam/${doc.id}"><div class="list_exam">
        <div class="list_name">${data.details.exam_name} <span class="lock"><i class="icofont-lock"></i></span></div>
        <div class="list_dur">${data.questions.length} Questions · ${data.details.sl_duration} minutes</div>
        <div class="list_neg"><span style="color:green"><i class="icofont-arrow-up"></i>${data.questions.length}</span> · ${negativeTag[data.details.negative_mark]}</div>
        <div class="chip red">${tag[data.details.sl_class]}</div>
        <div class="chip pink">${tag[data.details.sl_group]}</div>
        <div class="chip green">${tag[data.details.sl_subject]}</div>
        <div class="chip orange">${tag[data.details.sl_exam_type]}</div>
        </div>
        `
      }else{
        examlist.innerHTML += `
        <a href="#!/view_exam/${doc.id}"><div class="list_exam">
        <div class="list_name">${data.details.exam_name}</div>
        <div class="list_dur">${data.questions.length} Questions In ${data.details.sl_duration} minutes</div>
        <div class="list_neg"><span style="color:green"><i class="icofont-arrow-up"></i>${data.questions.length}</span> · ${negativeTag[data.details.negative_mark]}</div>
        <div class="chip red">${tag[data.details.sl_class]}</div>
        <div class="chip pink">${tag[data.details.sl_group]}</div>
        <div class="chip green">${tag[data.details.sl_subject]}</div>
        <div class="chip orange">${tag[data.details.sl_exam_type]}</div>
        </div>
        `
      }
    
    }
    
  })
 })

}).resolve();



router.on({
  "/rank" : function(){
    $('.footer').show();
  $('.footertext').hide();
  $('.footerIcon').removeClass('footerIconActive');
  if($('.rnk')[0].classList[3] === undefined){
    $('.rnk').addClass('footerIconActive');
    $($($('.rnk')[0].parentNode)[0].lastElementChild).show();
    $('.top_logo').html(`<span class="animate__animated animate__fadeInLeft">Rank</span>`);
  }

  },
  "/create" : function(){
    $('.app_loader').show();
    $('.footer').show();
  $('.footertext').hide();
  $('.footerIcon').removeClass('footerIconActive');
  if($('.crt')[0].classList[3] === undefined){
    $('.crt').addClass('footerIconActive');
    $($($('.crt')[0].parentNode)[0].lastElementChild).show();
  }

  $('.top_logo').html(`<span class="animate__animated animate__fadeInLeft">Create</span>`);
  db.ref('app/users/'+user.uid+'/create').on('value', snap=>{
    $('.app_loader').hide();
  if(snap.val().history.status===false){
  app.innerHTML = `
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
  </select>
</div>

<div class="input-field col s12">
<select name="sl_subject" requiredrequired>
  <option value="" disabled selected>Select Subject</option>
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
  `
const detalisform = document.querySelector('#details_form');
  $(document).ready( function () {
    $('#picker').dateTimePicker();
    $('#picker-no-time').dateTimePicker({ showTime: false, dateFormat: 'DD/MM/YYYY', title: 'Select Date'});
})

$(document).ready( function () {
  $('#picker2').dateTimePicker();
  $('#picker-no-time').dateTimePicker({ showTime: false, dateFormat: 'DD/MM/YYYY', title: 'Select Date'});
})
   
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
  $('.top_logo').html(`<span class="animate__animated animate__fadeInLeft">Donate</span>`)
  $(document).ready(function () {
    $("select").formSelect();
  });
}else{
app.innerHTML = `
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

<div class="create-q">
    <textarea name="explanation" id="create-ex" placeholder="ব্যাখ্যা/সমাধান" required></textarea>
</div>
<center><button type="submit" class="btn red">Add Question</button><center>
</form>
</div>
`

$('.publish').click(function(){
  //console.log('clicked')
   let exam = snap.val().history;
   //console.log(exam);
   store.collection("public_exams").add({details: snap.val().history.details, questions: snap.val().history.questions, publish_date: (new Date()).toString()});
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

  let question = {
      q: (question_form.question.value).replace(/(?:\r\n|\r|\n)/g, '<br>'),
      opt: [question_form.a.value, question_form.b.value, question_form.c.value, question_form.d.value],
      ans: question_form.select_ans.value,
      ex: (question_form.explanation.value).replace(/(?:\r\n|\r|\n)/g, '<br>')
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
})
  
},
"edit_exam":function(){
  $('.app_loader').show();
  $('.footer').show();
  $('.footertext').hide();
    $('.footerIcon').removeClass('footerIconActive');
    $('.top_logo').html(`<span class="animate__animated animate__fadeInLeft">Edit</span>`);
    app.innerHTML= `
    <div class="details_view"></div>
    <div class="questions_view"></div>
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
      `
      let ans=[];
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
    <center><a href="#!/edit_q/${i}"><button class="btn green">Edit</button></a></center>
</div>`
  }
      for(let a=0; a<ans.length; a++){
           $("#" + ans[a] + " .st").addClass("cr");
         }
});  
},

"edit_details" : function(){

},
"/edit_q/:id" : function(params){
  $('.app_loader').show();
    $('.footer').show();
    $('.footertext').hide();
      $('.footerIcon').removeClass('footerIconActive');
      $('.top_logo').html(`<span class="animate__animated animate__fadeInLeft">Donate</span>`);
  db.ref('app/users/'+user.uid+'/create/history/questions/'+params.id).on('value', snap=>{
    $('.app_loader').hide();
    app.innerHTML = `
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
    `
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
            db.ref('app/users/'+user.uid+'/create/history/questions/'+params.id).update(question);
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
    $('.top_logo').html(`<span class="animate__animated animate__fadeInLeft">Donate</span>`)
    }

  },


  "/myprofile" : function (){
    $('.footer').show();
    $('.top_logo').html(`<span class="animate__animated animate__fadeInLeft">Profile</span>`)
   app.innerHTML=`
   <center><div class="headlines">প্রোফাইল</div>
   <div class="imagexbig"><img src="${user.photoURL}"/></div>
   <div class="displayName">${user.displayName}</div>
   <div class="email">${user.email}</div>
   <div class="details">
   <div class="rank cardXmed">
   <div class="number">...</div>
   <div class="text">অবস্থান</div>
   </div>

   <div class="exam cardXmed">
   <div class="number">...</div>
   <div class="text">পরীক্ষা</div>
   </div>

   <div class="score cardXmed">
   <div class="number">...</div>
   <div class="text">স্কোর</div>
   </div>
   </div>
   <div id="donut-chart"></div>
   </center>
   
   `;

db.ref("app/users/"+user.uid).on('value', snap=>{
  $(".exam .number").text(snap.val().exams.total);
  $(".score .number").text(snap.val().scores.totalScore);
    window.ApexCharts && (new ApexCharts(document.getElementById('donut-chart'), {
      chart: {
        type: "donut",
        fontFamily: 'inherit',
        foreColor: "red",
        height: 200,
        sparkline: {
          enabled: true
        },
        animations: {
          enabled: false
        },
      },
      fill: {
        opacity: 1,
      },
      series: [snap.val().scores.totalCorrect, snap.val().scores.totalEmpt, snap.val().scores.totalWrong],
      labels: ["সঠিক", "ফাঁকা", "ভুল"],
      grid: {
        strokeDashArray: 4,
      },
      colors: ["#1a7a37", "#ffa500", "rgb(221, 64, 64)"],
      legend: {
        show: false,
      },
      tooltip: {
        fillSeriesColor: false
      },
      legend: {
        show: true,
        position: 'bottom',
        height: 32,
        offsetY: 8,
        markers: {
          width: 8,
          height: 8,
          radius: 100,
        },
        itemMargin: {
          horizontal: 8,
        },
      },
    })).render();
  });

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
      r += key.charAt(Math.floor(Math.random()*keyLen));
    }
    return id;
  }

}else{
  $('.footer').hide();
  $('.top').hide();
}
});