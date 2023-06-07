const expenseForm = document.getElementById('exp-form');
const category = document.getElementById('category');
const amount = document.getElementById('exp-amt');
const description = document.getElementById('exp-desc');
const tbody = document.getElementById('tbody');
const premiumBtn = document.getElementById('premium-btn');
const leaderBoardBtn=document.getElementById('leader-btn');

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
        } catch (err) {
            alert(err.response.data.message);
        }
    }
    else {
        alert("Please enter all fields");
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
    
    let token = localStorage.getItem('key');
    if(decodeJwtToken(token).premium){
        premiumBtn.style.display='none';
    }
    try {
        const res = await axios.get("http://localhost:4000/get-all-expenses", { headers: { "Authorization": token } });
        for (let i = 0; i < res.data.length; i++) {
            displayOnScreen(res.data[i]);
        };
    } catch (err) {
        console.log(err.response.data.message);
    }

})

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
    tbody.appendChild(row);
    let token = localStorage.getItem('key');

    delBtn.addEventListener('click', (e) => {
        tbody.removeChild(row);
        try {
            axios.delete(`http://localhost:4000/delete-expense/${obj.id}`, { headers: { "Authorization": token } });
        } catch (err) {
            alert(err.response.data.message);
        };

    });
    editBtn.addEventListener('click', (e) => {
        amount.value = obj.amount;
        description.value = obj.description;
        tbody.removeChild(row);
        try {
            axios.delete(`http://localhost:4000/delete-expense/${obj.id}`, { headers: { "Authorization": token } });
        } catch (err) {
            alert(err.response.data.message);
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
                localStorage.setItem('key',res.data.token);
                premiumBtn.style.display='none';
                
                alert(res.data.message);
            }
        }
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open(options);
        razorpayInstance.on('payment.failed', async (response) => {
            await axios.post("http://localhost:4000/update-transaction", { status: 'FAILED', order_id: response.error.metadata.order_id }, { headers: { 'Authorization': token } });
        })
    } catch (err) {
        alert(err.response.data.message);
    }

});
leaderBoardBtn.addEventListener('click',async(e)=>{
    const token = localStorage.getItem('key');
    if(decodeJwtToken(token).premium){
       window.location.href="/premium/leaderboard"
    }
    else{
        alert('Buy Premium to access Premium features');
    }
});
const reportsButton=document.getElementById('reports-btn');
reportsButton.addEventListener('click',async (e)=>{
    const token=localStorage.getItem('key');
    if(decodeJwtToken(token).premium){
        window.location.href="/premium/reports"
    }
    else{
        alert('Buy Premium to access Premium features');
    }
})