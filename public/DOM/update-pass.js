
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
        customAlert(res.data.message,'modal-success');
        window.location.href="/";
    }catch(err){
        customAlert(err.response.data.message,'modal-danger');
    }
   
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