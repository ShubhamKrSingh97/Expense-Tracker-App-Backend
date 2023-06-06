const monthly_t_body=document.getElementById('monthExp-body');
const yearly_t_body=document.getElementById('yearlyExp-body');

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
    row.innerHTML=`<td>${formattedDate}</td><td>${res.description}</td><td>${res.amount}</td>`;
    monthly_t_body.append(row);
}

function displayYearly(res){
    const date=new Date(0,res.month-1).toLocaleDateString('en-us',{month:'long'});
    const row=document.createElement('tr');
    row.innerHTML=`<td>${date}</td><td>${res.totalExpense}</td>`;
    yearly_t_body.append(row);
}