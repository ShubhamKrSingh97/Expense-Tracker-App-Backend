var loginForm = document.getElementById('login');
var regForm = document.getElementById('register');
var toggleBtn = document.getElementById('btn');
var toggleLogin = document.getElementById('toggle-login');
var toggleRegister = document.getElementById('toggle-register');
var forgotPassForm = document.getElementById('forgot-pass');
var forgotPassBtn = document.getElementById('forgot');
var forgotPassSubBtn = document.getElementById('forgot-sub-btn');
//------------login and registration form toggling-----------//

document.querySelector('#toggle-login').focus();

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
        }
        catch (err) {
            alert(err.response.data.message);
        }

    }
    else {
        alert("Please fill in all the details");
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
            alert(msg.data.message);
            console.log(msg.data);
            localStorage.setItem('key', msg.data.token);
            window.location.href = "expense-tracker";
        } catch (err) {
            alert(err.response.data.message);
        }
    }
    else {
        alert("Please fill in all the details");
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
        alert(res.data.message);
    }catch(err){
        alert(err.response.data.message);
    }
    
});