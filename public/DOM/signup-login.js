var loginForm = document.getElementById('login');
var regForm = document.getElementById('register');
var toggleBtn = document.getElementById('btn');
var toggleLogin = document.getElementById('toggle-login');
var toggleRegister = document.getElementById('toggle-register');

//------------login and registration form toggling-----------//

toggleRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.left = '-400px';
    regForm.style.left = '50px';
    toggleBtn.style.left = '110px';
});

toggleLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.left = '50px';
    regForm.style.left = '450px';
    toggleBtn.style.left = '0px';
});

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
            localStorage.setItem('key',msg.data.id);
            window.location.href="expense-tracker";
        } catch (err) {
            alert(err.response.data.message);
        }
    }
    else {
        alert("Please fill in all the details");
    }

});