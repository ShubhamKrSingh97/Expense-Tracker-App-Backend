var loginForm = document.getElementById('login');
var regForm = document.getElementById('register');
var toggleBtn = document.getElementById('btn');
var toggleLogin = document.getElementById('toggle-login');
var toggleRegister = document.getElementById('toggle-register');
var forgotPassForm = document.getElementById('forgot-pass');
var forgotPassBtn = document.getElementById('forgot');
var forgotPassSubBtn = document.getElementById('forgot-sub-btn');
//------------login and registration form toggling-----------//

let toggles = Array.from(document.querySelectorAll('.toggle'));
toggles.forEach(toggle=>{
    toggle.addEventListener('click',e=>{
        toggles.forEach(toggle=>{
            toggle.classList.toggle('active')
        })
    })
})

toggleRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.left = '-400px';
    regForm.style.left = '50px';
    toggleBtn.style.left = '110px';
    forgotPassForm.style.left = '450px';
});

toggleLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.left = '50px';
    regForm.style.left = '450px';
    toggleBtn.style.left = '0px';
    forgotPassForm.style.left = '450px';
});

forgotPassBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.left = '-400px';
    forgotPassForm.style.left = '50px';
})


//-----------------------Registration------------------------//

const regEmail = document.getElementById('reg-email');
const regName = document.getElementById('reg-name');
const regPassword = document.getElementById('reg-pass');
const checkBox = document.getElementById('check');

regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (regEmail.value && regName.value && regPassword.value) {
        let obj = {
            name: regName.value,
            email: regEmail.value,
            pass: regPassword.value
        };
        try {
            await axios.post("http://localhost:4000/add-user", obj)
            regEmail.value = "";
            regName.value = "";
            regPassword.value = "";
            checkBox.checked = false;
            customAlert("Registration Complete",'modal-success')
        }
        catch (err) {
            customAlert(err.response.data.message,'modal-success');
        }

    }
    else {
        alert("Please fill in all the details",'modal-danger');
    }
});

//-----------------------Login---------------------------------//

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-pass');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (loginEmail.value && loginPassword.value) {
        obj = {
            pass: loginPassword.value,
            email: loginEmail.value
        }
        try {
            let msg = await axios.post(`http://localhost:4000/user-login`, obj);
            customAlert(msg.data.message, 'modal-success');
            localStorage.setItem('key', msg.data.token);
            window.location.href = "expense-tracker";
        } catch (err) {
            customAlert(err.response.data.message, 'modal-danger');
        }
    }
    else {
        customAlert("Please fill in all the details",'modal-danger');
    }

});

forgotPassForm.addEventListener('submit',async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('key');
    const forgotPassEmail = document.getElementById('forgot-email');
    let obj = {
        email: forgotPassEmail.value
    }
    try{
        const res= await axios.post("http://localhost:4000/password/forgot-password", obj);
        customAlert(res.data.message,'modal-success');
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