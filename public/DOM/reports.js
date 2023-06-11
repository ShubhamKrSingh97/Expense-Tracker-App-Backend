const monthly_t_body=document.getElementById('monthExp-body');
const yearly_t_body=document.getElementById('yearlyExp-body');
const downloadReportsBtn=document.getElementById('download-report');
const backBtn=document.getElementById('back-btn');
document.addEventListener('DOMContentLoaded',async (e)=>{
    const token=localStorage.getItem('key');
    try{
   const res= await axios.get("http://localhost:4000/premium/reports/yearly",{headers:{'Authorization': token }});
    res.data.allExpenses.sort((a,b)=>a.month-b.month);
    for(let i=0;i<res.data.allExpenses.length;i++){
        displayYearly(res.data.allExpenses[i]);
    }
}catch(err){
    alert(err.response.data.message);
}
});

const dropDown=document.getElementById('month');
dropDown.addEventListener('change',async (e)=>{
    monthly_t_body.innerHTML="";
    const token=localStorage.getItem('key');
    const month=dropDown.value;
    try{
        const res=await axios.get(`http://localhost:4000/premium/reports/monthly`,{headers:{'Authorization':token,'month':month}});
        console.log(res);
        res.data.allExpenses.sort((a,b)=>{
            dateA=new Date(a.createdAt);
            dateB= new Date(b.createdAt);
            console.log(dateA-dateB)
            return dateA-dateB;
        });
        if(res.data.allExpenses.length==0){
            const row=document.createElement('tr');
            row.innerHTML=`<td>--</td><td>No Expenses</td><td>--</td>`;
            monthly_t_body.append(row);
        }
        else{
            for(let i=0;i<res.data.allExpenses.length;i++){
                displayMonthly(res.data.allExpenses[i]);
            }
        }
       
    }catch(err){
        alert(err.response.data.message);
    }
})

function displayMonthly(res){
    const row=document.createElement('tr');
    const date=new Date(res.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    row.innerHTML=`<td data-label="Date">${formattedDate}</td><td data-label="Description">${res.description}</td data-label="Amount"><td>${res.amount}</td>`;
    monthly_t_body.append(row);
}

function displayYearly(res){
    const date=new Date(0,res.month-1).toLocaleDateString('en-us',{month:'long'});
    const row=document.createElement('tr');
    row.innerHTML=`<td data-label="Date">${date}</td><td data-label="Total Expense">${res.totalExpense}</td>`;
    yearly_t_body.append(row);
}
downloadReportsBtn.addEventListener('click',async (e)=>{
    const token=localStorage.getItem('key');
    downloadReportsBtn.disabled=true;
    let text = downloadReportsBtn.textContent;
    try{
        downloadReportsBtn.textContent='downloading...'
        const res=await axios.get("http://localhost:4000/premium/reports/download",{headers:{'Authorization':token,'month':month}});
        console.log(res.data.message);
        const a=document.createElement('a');
        a.href=res.data.message;
        a.download='myexpense.csv';
        a.click();
        downloadReportsBtn.disabled=false;
        downloadReportsBtn.textContent=text;
    }catch(err){
        customAlert(err.response.data.message,'modal-danger');
       downloadReportsBtn.disabled=false;
       downloadReportsBtn.textContent=text;
    }
});

backBtn.addEventListener('click',(e)=>{
    window.history.back();
});

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