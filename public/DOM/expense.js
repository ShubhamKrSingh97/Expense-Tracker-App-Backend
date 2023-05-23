const expenseForm = document.getElementById('exp-form');
const category = document.getElementById('category');
const amount = document.getElementById('exp-amt');
const description = document.getElementById('exp-desc');
const tbody = document.getElementById('tbody');

expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let token=localStorage.getItem('key');
    if (amount.value && category.value && description.value) {
        let obj = {
            amount: amount.value,
            category: category.value,
            description: description.value
        }
        try {
            const res = await axios.post("http://localhost:4000/add-expense",obj,{headers:{"Authorization":token}});
            displayOnScreen(res.data.expense);
        } catch (err) {
            alert(err.response.data.message);
        }
    }
    else {
        alert("Please enter all fields");
    }
});

document.addEventListener('DOMContentLoaded', async (e) => {
    let token = localStorage.getItem('key');
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
    const editBtn = document.createElement('button');
    editBtn.innerText = "Edit";
    const row = document.createElement('tr');
    row.innerHTML = `<td>${obj.category}</td><td>${obj.description}</td><td>${obj.amount}</td>`;
    const actionCell = document.createElement('td');
    actionCell.appendChild(editBtn);
    actionCell.appendChild(delBtn);
    row.appendChild(actionCell);
    tbody.appendChild(row);
    let token=localStorage.getItem('key');

    delBtn.addEventListener('click', (e) => {
        tbody.removeChild(row);
        try {
            axios.delete(`http://localhost:4000/delete-expense/${obj.id}`,{headers:{"Authorization": token}});
        } catch (err) {
            alert(err.response.data.message);
        };

    });
    editBtn.addEventListener('click', (e) => {
        amount.value = obj.amount;
        description.value = obj.description;
        tbody.removeChild(row);
        try {
            axios.delete(`http://localhost:4000/delete-expense/${obj.id}`,{headers:{"Authorization": token}});
        } catch (err) {
            alert(err.response.data.message);
        }

    });
};