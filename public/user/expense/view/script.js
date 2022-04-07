window.addEventListener("load", () => {
    if(localStorage.getItem("num")){
        document.querySelector("#page").value = localStorage.getItem("num");
    }

    const getBtn = document.querySelector("#get")
    getBtn.addEventListener("click", fetchExpenses);

    const back = document.querySelector("#back-btn")
    back.addEventListener("click", () => {
        window.history.back();
    })
})

async function fetchExpenses(page=1){
    try{
        const val = document.querySelector("#page").value;
        localStorage.setItem("num", val);

        const res = await axios.get(`http://localhost:3000/api/plus/expenses?page=${page}&limit=${val}`);
        renderExpenses(res.data.result);
    } catch(err){
        console.log(err);
    }
}

function renderExpenses(result){
    const table = document.querySelector("#content");
    const container = document.querySelector(".pages");
    table.innerHTML = "";
    container.innerHTML = "";
    result.expenses.forEach(expense => {
        const tmp = `
        <tr class="table-rows">
            <td class="items">${expense.createdAt}</td>
            <td class="items">${expense.description}</td>
            <td class="items icon">${expense.category}</td>
            <td class="items">Rs. ${expense.amount}</td>
        </tr>
        `

        table.innerHTML += tmp;
    })

    let pagesTemplate = "";
    if(result.previous){
        pagesTemplate = `<button class="page-btn" onclick=fetchExpenses(${result.previous.page})>Previous</button>`
    }
    if(result.next){
      pagesTemplate += `<button class="page-btn" onclick=fetchExpenses(${result.next.page})>Next</button>`
    }

    container.innerHTML += pagesTemplate;eeee
}