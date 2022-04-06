window.addEventListener("load", () => {
    setTheme();

    const addExpenseBtn = document.getElementsByClassName("btn");
     for(let i=0; i<addExpenseBtn.length; i++){
         const btn = addExpenseBtn[i];
         btn.addEventListener("click", addExpense);
     }

    const buyPlus = document.getElementsByClassName("buy-plus");
    for(let i=0; i<buyPlus.length; i++){
        const btn = buyPlus[i];
        btn.addEventListener("click", createOrder);
    }
})

async function createOrder(){
    const orderData = {
        amount: 9900,
        currency: "INR",
        receipt: "sndvjv8djbvjv",
        notes: {
            description: "Buy Expo Plus Membership"
        }
    };

    try{
        const res = await axios.post("http://localhost:3000/api/plus/createOrder", orderData);
        if(res.data){
            console.log(res);
            checkout(res.data.order, res.data.key);
        }
    } catch(err){
        console.log(err);
    }
}

function checkout(data, key) {
    var options = {
        "key": key, 
        "amount": data.amount,
        "currency": data.currency,
        "name": "Expo - Expense Tracker",
        "description": data.notes.description,
        "order_id": data.id,  
        "handler": function (response){
            verifyOrder(response);
        },
       "notes" : {
          "description":data.notes.description,
        }, 
        "theme": {
            "color": "#2300a3"
        }
    };
    const razorpayObject = new Razorpay(options);
    console.log(razorpayObject);
    razorpayObject.on('payment.failed', function (response){
          console.log(response);
          alert("This step of Payment Failed");
    });
      
    razorpayObject.open();
}

async function verifyOrder(data) {
    try{
        const res = await axios.post("http://localhost:3000/api/plus/verifyOrder", data);
        if(res.data.success){
            alert("You are now expo plus member");
        } else {
            if(confirm("Payment failed. Try again?") == true){
                createOrder();
            } else {
                alert("Payment cancelled");
            }
        }
    } catch(err){   
        console.log(err);
    }
}

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

async function setTheme() {
    try{
        const res = await axios.get("http://localhost:3000/api/user/getsubscription");
        if(res.data === "plus"){
            document.querySelector("body").classList.add("dark-mode");
            document.querySelector(".container").innerHTML += `
            <button class="btn">View Expenses</button>
            <button class="btn">Download your expenses</button>
            `;
        }
    } catch(err) {
        console.log(err);
    }
}