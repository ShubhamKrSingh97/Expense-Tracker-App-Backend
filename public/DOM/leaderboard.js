const tbody=document.getElementById('t-body');
const backBtn=document.getElementById('back-btn');
document.addEventListener('DOMContentLoaded',async (e)=>{
    const token=localStorage.getItem('key');
    try{
   const res= await axios.get("/premium/rankings",{headers:{'Authorization': token }});
    res.data.allUser.sort((a,b)=>b.TotalExpense-a.TotalExpense);
   for(let i=0;i<res.data.allUser.length;i++){
    displayLeaderBoard(res.data.allUser[i],i+1);
   }
}catch(err){
    customAlert(err.response.data.message);
}
});

function displayLeaderBoard(res,i){
    const row=document.createElement('tr');
    row.innerHTML=`<td data-label="#">${i}</td><td data-label="Name">${res.name}</td><td data-label="Total Expense">${res.totalExpense}/-</td>`;
    tbody.append(row);
}

backBtn.addEventListener('click',(e)=>{
    window.history.back();
})

function customAlert(text, classNames=''){
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal-wrapper');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.className+=' '+classNames;
    const span = document.createElement('span');
    span.classList.add('close');
    span.innerHTML='&times;';
    const p = document.createElement('p');
    p.textContent=text;
    modalContent.appendChild(span);
    modalContent.appendChild(p);
    modalWrapper.appendChild(modalContent);
    document.body.appendChild(modalWrapper);
    function close(){
        document.body.removeChild(document.querySelector('.modal-wrapper')); 
    }
    span.onclick=close;
    modalWrapper.addEventListener('click',e=>{
        if(e.target.className==='modal-wrapper'){
            close();
        }
    });
    setTimeout(close,3500);
}