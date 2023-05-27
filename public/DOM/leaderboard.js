const tbody=document.getElementById('t-body');

document.addEventListener('DOMContentLoaded',async (e)=>{
    const token=localStorage.getItem('key');
    try{
   const res= await axios.get("http://localhost:4000/premium/rankings",{headers:{'Authorization': token }});
    res.data.allUser.sort((a,b)=>b.TotalExpense-a.TotalExpense);
   for(let i=0;i<res.data.allUser.length;i++){
    console.log(res.data.allUser[i]);
    displayLeaderBoard(res.data.allUser[i]);
   }
}catch(err){
    console.log(err);
}
});

function displayLeaderBoard(res){
    const row=document.createElement('tr');
    row.innerHTML=`<td>${res.Name}</td><td>${res.TotalExpense}</td>`;
    tbody.append(row);
}