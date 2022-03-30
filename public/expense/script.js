window.addEventListener("load", () => {
    const addExpenseBtn = document.getElementsByClassName("btn");
     for(let i=0; i<addExpenseBtn.length; i++){
         const btn = addExpenseBtn[i];
         btn.addEventListener("click", addExpense);
     }
})

async function addExpense(){
    const form = document.getElementById("form");
    const formData = new FormData(form);
    const data = {
        description: formData.get("desc"),
        amount: formData.get("amount"),
        category: formData.get("category")
    }

    try{
        const res = await axios.post("http://localhost:3000/api/expense/addexpense", data);
        if(res.status === 200){
            alert("Expense added");
            console.log(res);
        } else {
            console.log(res);
        }
    } catch(err) {
        console.log(err);
    }
}