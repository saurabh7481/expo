window.addEventListener("load", () => {
    setTheme();

    const addExpenseBtn = document.getElementsByClassName("add");
     for(let i=0; i<addExpenseBtn.length; i++){
         const btn = addExpenseBtn[i];
         btn.addEventListener("click", addExpense);
     }

    const downloadBtn = document.querySelector("#download");
    downloadBtn.addEventListener("click", downloadExpense);

    const buyPlus = document.getElementsByClassName("buy-plus");
    for(let i=0; i<buyPlus.length; i++){
        const btn = buyPlus[i];
        btn.addEventListener("click", createOrder);
    }

    const leaderboard = document.querySelector("#leaderboard");
    leaderboard.addEventListener("click", () => {
        location.href = "http://localhost:3000/user/leaderboard";
    })

    const view = document.querySelector("#view");
    view.addEventListener("click", () => {
        location.href = "http://localhost:3000/user/expense/view";
    })

    const logOut = document.querySelector(".log-out");
    logOut.addEventListener("click", logout);
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
            checkout(res.data.order, res.data.key);
        }
    } catch(err){
        alert(err);
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
    console.log(data);
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
            document.querySelectorAll(".plus").forEach(el => {
                el.style.display = "block"
            })
            getExpenseFiles(1);
        }
    } catch(err) {
        console.log(err);
    }
}

async function downloadExpense(){
    try{
        const res = await axios.get("http://localhost:3000/api/plus/download");
        if(res.status == 200){
            window.open(res.data.url, "_blank");
        }
    } catch(err){
        console.log(err);
    }
}

async function getExpenseFiles(page){
    try{
        const pageNo = page;
        const res = await axios.get(`http://localhost:3000/api/plus/expensefiles?page=${pageNo}`);
        console.log(res);
        renderExpenseFiles(res.data.result);
    } catch(err){
        console.log(err);
    }
}

function renderExpenseFiles(data){
    const list = document.querySelector("#file-list");
    const container = document.querySelector(".pages");
    list.innerHTML = "";
    container.innerHTML = "";
    data.files.forEach(file => {
        let tmp = `
                <li class="files"><a href=${file.url}>${file.name}</a><span>${file.createdAt}</span></li>
            `
        list.innerHTML += tmp;
    })

    let pagesTemplate = "";
    if(data.previous){
        pagesTemplate = `<button class="page-btn" onclick=getExpenseFiles(${data.previous.page})>Previous</button>`
    }
    if(data.next){
      pagesTemplate += `<button class="page-btn" onclick=getExpenseFiles(${data.next.page})>Next</button>`
    }

    container.innerHTML += pagesTemplate;
}

async function logout(){
    try{    
        const res = await axios.get("http://localhost:3000/api/logout");
        if(res.status == 200){
            location.href = "http://localhost:3000";
        }
    } catch(err){
        alert("Something went wrong!");
    }
}