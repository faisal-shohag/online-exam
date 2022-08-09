

const solnImg = {
    "govt": "../images/govt.png"
}
const progress = (total, now)=>{
    return (100*(now/total)).toFixed(1);
   }

const solutionsCard = (element)=>{
    element = document.getElementById(element);
    store.collection('solutions').onSnapshot(snap=>{
        element.innerHTML = '';
        snap.forEach(item => {
            let questions =  Object.entries(item.data().questions);
            questions = questions.map(q=> q[1]);
            console.log(item.id);
            element.innerHTML += `
            <a href="#!/examsolution/${item.data().exam_name}/${item.id}"><div class="scroll-card">
            <div class="card-head">
            <div class="card-circle-img"><img src="${solnImg[item.data().type]}"/></div>
            <div><div class="card-title">${item.data().exam_name}</div>
            <div class="card-sub-title">${item.data().held.toDate().toDateString()}</div></div>
            </div>
            <div class="horz-line"></div>
            <div class="flex-row-space-between">
            <div class="card-text"><i class="icofont-book-mark"></i> পূর্ণমানঃ ${item.data().totalQ} </div>
            <div class="card-text"><i class="icofont-wall-clock"></i> সময়ঃ ${item.data().duration} মিনিট </div>
            <div class="card-text"><i class="icofont-bag-alt"></i> #${item.data().tag}</div>
            </div>
            <div>
            
            <div class="progressBarBg">
            <div class="progressParc">${progress(item.data().totalQ, questions.length)}%</div>
            <div style="width:${progress(item.data().totalQ, questions.length)}%;" class="progressLine red"></div>
            </div>
            
            </div></a>
            `
        });
    })
}

const SingleSolutionCard = (id, element) => {
    element = document.getElementById(element);
    store.collection('solutions').doc(id).onSnapshot(item=>{
        let questions =  Object.entries(item.data().questions);
            questions = questions.map(q=> q[1]);
        element.innerHTML = `
        <div class="scroll-card opacity5">
        <div class="card-head">
        <div class="card-circle-img"><img src="${solnImg[item.data().type]}"/></div>
        <div><div class="card-title">${item.data().exam_name}</div>
        <div class="card-sub-title">${item.data().held.toDate().toDateString()}</div></div>
        </div>
        <div class="horz-line"></div>
        <div class="flex-row-space-between">
        <div class="card-text"><i class="icofont-book-mark"></i> পূর্ণমানঃ ${item.data().totalQ} </div>
        <div class="card-text"><i class="icofont-wall-clock"></i> সময়ঃ ${item.data().duration} মিনিট </div>
        <div class="card-text"><i class="icofont-bag-alt"></i> #${item.data().tag}</div>
        </div>
        <div>
        
        <div class="progressBarBg">
        <div class="progressParc">${progress(item.data().totalQ, questions.length)}%</div>
        <div style="width:${progress(item.data().totalQ, questions.length)}%;" class="progressLine red"></div>
        </div>
        
        </div></div>
        `

    });
}

const getSolution = (id, element, uid) =>{
    element = document.getElementById(element);
    store.collection('solutions').doc(id).onSnapshot(item=>{
        const sections = item.data().sections;
        let questions =  Object.entries(item.data().questions);
        questions = questions.map(q=> q[1]);
        //console.log(questions);
        element.innerHTML = `
        <div id="sections"></div>
        <center id="add_sq"></center>
        <div class="solution-body">
        </div>

        `
        let secHTML = '';
        for(let i=0; i<sections.length; i++){
           secHTML += `
            <div class="sec" id="${sections[i]}">${sectionsTag[sections[i]]}</div>
            `
        }
        $('#sections').html(secHTML);

      
    const getQuestionByTag = (tag) => {
        let question_view = document.querySelector('.solution-body');
        question_view.innerHTML = '';
    var ans = [];
    let question = questions.filter(q => q.tag === tag);
 if(question.length === 0){
     question_view.innerHTML = `<center><h4>No question added to this section!</h4></center>`;
     return;
 }
      for(let i=0; i<question.length; i++){
        ans.push(parseInt(question[i].ans)+i*4);
        question_view.innerHTML += `
        <div class="q-wrap">
    <div class="question">
       ${i+1}. ${question[i].q}
    </div>
    <div class="option">
        <div class="opt" id="${i+1+i*3}"><div class="st"></div>${question[i].opt[0]}</div>
        <div class="opt" id="${i+2+i*3}"><div class="st"></div>${question[i].opt[1]}</div>
        <div class="opt" id="${i+3+i*3}"><div class="st"></div>${question[i].opt[2]}</div>
        <div class="opt" id="${i+4+i*3}"><div class="st"></div>${question[i].opt[3]}</div>
    </div>
    <div class="solution"><b>Solution:</b></br> ${question[i].ex}</div>
</div>`
  }
      for(let a=0; a<ans.length; a++){
           $("#" + ans[a] + " .st").addClass("cr");
         }

        }

        $('.sec').click(function(){
            const sec_id = $(this)[0].id;
            $('.sec').removeClass('sec-active');
            $('#'+sec_id).addClass('sec-active');
            $('#add_sq').html(`<a href="#!/add_solution/${id}/${sec_id}/${questions.length}"><div style="left: 80%;" class="floating-button"><img src="../images/plus.png"></div></a>`);
            if(uid !== '094Rbu13YbWc9On6KnuJIUv3QMx2') $('.floating-button').hide();
            getQuestionByTag(sec_id);
        });

        $('#'+sections[0]).click();

    })
}
