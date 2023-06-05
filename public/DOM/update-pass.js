
const updatePassForm=document.getElementById('update-pass');
updatePassForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const updatePass=document.getElementById('update-password');
    const params = new URLSearchParams(window.location.search);
    const id=params.get('id');
    const obj={
        password:updatePass.value,
        id:id
    }
    try{
        const res= await axios.post("http://localhost:4000/password/update-password",obj);
        alert(res.data.message);
        window.location.href="/";
    }catch(err){
        alert(err.response.data.message);
    }
   
});