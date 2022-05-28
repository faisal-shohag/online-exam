

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
            <div class="progressParc">${progress(200, 20)}%</div>
            <div style="width:${progress(200, 20)}%;" class="progressLine red"></div>
            </div>
            
            </div></a>
            `
        });
    })
}

const SingleSolutionCard = (id, element) => {
    element = document.getElementById(element);
    store.collection('solutions').doc(id).onSnapshot(item=>{
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
        <div class="progressParc">${progress(200, 20)}%</div>
        <div style="width:${progress(200, 20)}%;" class="progressLine red"></div>
        </div>
        
        </div></div>
        `

    });
}

const getSolution = (id, element) =>{
    element = document.getElementById(element);
    store.collection('solutions').doc(id).onSnapshot(item=>{
        const sections = item.data().sections;
        let questions =  Object.entries(item.data().questions);
        questions = questions.map(q=> q[1]);
        //console.log(questions);
        element.innerHTML = `
        <div id="sections"></div>
        <center id="add_sq"></center>
        <div class="question-body">
        <center><h4>No question added to this section!</h4></center>
        </div>
        `

        for(let i=0; i<sections.length; i++){
            document.getElementById('sections').innerHTML += `
            <div class="sec" id="${sections[i]}">${sectionsTag[sections[i]]}</div>
            `
        }

        $('.sec').click(function(){
            const sec_id = $(this)[0].id;
            $('.sec').removeClass('sec-active');
            $('#'+sec_id).addClass('sec-active');
            $('#add_sq').html(`<a href="#!/add_solution/${id}/${sec_id}/${questions.length}"><div style="margin-top:10px" class="btn add_sq"> Add questions</div></a>`)
        });
        $('#'+sections[0]).click();

        const getQuestionByTag = (tag) => {

        }

    })
}
