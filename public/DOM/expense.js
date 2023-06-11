const expenseForm = document.getElementById('exp-form');
const category = document.getElementById('category');
const amount = document.getElementById('exp-amt');
const description = document.getElementById('exp-desc');
const tbody = document.getElementById('tbody');
const premiumBtn = document.getElementById('premium-btn');
const leaderBoardBtn = document.getElementById('leader-btn');
const paginationContainer = document.getElementById('paginate');
const selectLimit = document.getElementById('limit');
const logoutBtn=document.getElementById('logout');
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let token = localStorage.getItem('key');
    if (amount.value && category.value && description.value) {
        let obj = {
            amount: amount.value,
            category: category.value,
            description: description.value
        }
        try {
            const res = await axios.post("http://localhost:4000/add-expense", obj, { headers: { "Authorization": token } });
            displayOnScreen(res.data.expense);
            expenseForm.reset()
        } catch (err) {
            customAlert(err.response.data.message,'modal-danger');
        }
    }
    else {
        customAlert("Please enter all fields",'modal-danger');
    }
});

function decodeJwtToken(token) {
    const base64Url = token.split('.')[1]; // Extract the payload from the JWT token
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
    const rawPayload = atob(base64); // Decode the base64-encoded payload
    const payload = JSON.parse(rawPayload); // Parse the JSON payload
    return payload;
}

document.addEventListener('DOMContentLoaded', async (e) => {
    currentPage = 1;
    let token = localStorage.getItem('key');
    if (decodeJwtToken(token).premium) {
        premiumBtn.style.display = 'none';
    }
    var limit = JSON.parse(localStorage.getItem('limit'));
    if (limit) {
        selectLimit.value = limit;
        pagination(currentPage, limit);
    }
    else {
        pagination(currentPage, limit = 5);
    }

});
selectLimit.addEventListener('change', () => {
    console.log(selectLimit.value);
    tbody.innerHTML = "";
    pagination(currentPage, selectLimit.value);
})

function addPageButtons(res) {
    paginationContainer.innerHTML = "";
    if (res.data.hasPrev) {
        const prevBtn = document.createElement('button');
        prevBtn.innerText = res.data.prevPage;
        prevBtn.classList.add('page-btn');
        prevBtn.addEventListener('click', () => {
            pagination(res.data.prevPage, limit);
            tbody.innerHTML = "";
        });
        paginationContainer.append(prevBtn);
    }
    const currentPage = res.data.currentPage;
    const limit = localStorage.getItem('limit');
    const currentBtn = document.createElement('button');
    currentBtn.innerText = currentPage;
    currentBtn.classList.add('page-btn', 'currPage');
    paginationContainer.append(currentBtn);
    if (res.data.hasNext) {

        const nextBtn = document.createElement('button');
        nextBtn.innerText = res.data.nextPage;
        nextBtn.classList.add('page-btn')
        nextBtn.addEventListener('click', () => {
            pagination(res.data.nextPage, limit);
            tbody.innerHTML = "";
        });
        paginationContainer.append(nextBtn);
    }

}

async function pagination(currentPage, limit) {
    try {
        const res = await axios.get(`http://localhost:4000/get-all-expenses?page=${currentPage}&limit=${limit}`, { headers: { "Authorization": token } });

        currentPage = res.data.currentPage;

        localStorage.setItem('limit', res.data.limit)

        addPageButtons(res);
        for (let i = 0; i < res.data.allexp.length; i++) {
            displayOnScreen(res.data.allexp[i]);
        };
    } catch (err) {
        customAlert(err.response.data.message,'modal-danger');
    }

}

function displayOnScreen(obj) {
    const delBtn = document.createElement('button');
    delBtn.innerText = "Delete";
    delBtn.classList.add('anyButton');
    const editBtn = document.createElement('button');
    editBtn.innerText = "Edit";
    editBtn.classList.add('anyButton');
    const row = document.createElement('tr');
    row.innerHTML = `<td data-label="Category">${obj.category}</td><td data-label="Description">${obj.description}</td><td data-label="Amount">${obj.amount}</td>`;
    const actionCell = document.createElement('td');
    actionCell.appendChild(editBtn);
    actionCell.appendChild(delBtn);
    row.appendChild(actionCell);
    if (tbody.firstChild) {
        tbody.insertBefore(row, tbody.firstChild);
      } else {
        tbody.appendChild(row);
      }
    let token = localStorage.getItem('key');    

    delBtn.addEventListener('click', (e) => {
        tbody.removeChild(row);
        try {
            axios.delete(`http://localhost:4000/delete-expense/${obj.id}`, { headers: { "Authorization": token } });
        } catch (err) {
            customAlert(err.response.data.message,'modal-success');
        };

    });
    editBtn.addEventListener('click', async (e) => {
        tbody.removeChild(row);
        try {
            category.value=obj.category;
            amount.value=obj.amount;
            description.value=obj.description;
            await axios.delete(`http://localhost:4000/delete-expense/${obj.id}`, { headers: { "Authorization": token } });
        } catch (err) {
            customAlert(err.response.data.message,'modal-success');
        }

    });
};


const token = localStorage.getItem('key');

premiumBtn.addEventListener('click', async (e) => {
    try {
        const response = await axios.get("http://localhost:4000/buy-premium", { headers: { 'Authorization': token } });
        const { orderDetails } = response.data;
        var options = {
            key: response.data.key_id,
            order_id: orderDetails.id,
            handler: async function (response) {
                const res = await axios.post('http://localhost:4000/update-transaction', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                    status: "SUCCESS"
                }, { headers: { 'Authorization': token } });
                localStorage.setItem('key', res.data.token);
                premiumBtn.style.display = 'none';

                customAlert(res.data.message,'modal-success');
            }
        }
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open(options);
        razorpayInstance.on('payment.failed', async (response) => {
            await axios.post("http://localhost:4000/update-transaction", { status: 'FAILED', order_id: response.error.metadata.order_id }, { headers: { 'Authorization': token } });
        })
    } catch (err) {
        customAlert(err.response.data.message,'modal-danger');
    }

});
leaderBoardBtn.addEventListener('click', async (e) => {
    const token = localStorage.getItem('key');
    if (decodeJwtToken(token).premium) {
        window.location.href = "/premium/leaderboard"
    }
    else {
        customAlert('Buy Premium to access Premium features','modal-danger');
    }
});
const reportsButton = document.getElementById('reports-btn');
reportsButton.addEventListener('click', async (e) => {
    const token = localStorage.getItem('key');
    if (decodeJwtToken(token).premium) {
        window.location.href = "/premium/reports"
    }
    else {
        customAlert('Buy Premium to access Premium features','modal-danger');
    }
});
logoutBtn.addEventListener('click',(e)=>{
    window.location.href='/';
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