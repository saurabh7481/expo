window.addEventListener("load", async () => {
    const res = await axios.get("http://localhost:3000/api/user/leaderboard");
    const expenses = sortByValues(res.data.expenses);
    renderLeaderboard(expenses);

    const back = document.querySelector(".back-btn");
    back.addEventListener("click", () => {
        window.history.back();
    })
})

function sortByValues(data){
    let entries =  Object.entries(data);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const objSorted = {}
    sorted.forEach(function(item){
        objSorted[item[0]]=item[1]
    }
    )
    return objSorted;
}

function renderLeaderboard(expenses){
    const card = document.getElementsByClassName("score-card")[0];
    let cnt = 1;
    for(let user of Object.keys(expenses)){
        const template = `
        <div class="leader">
            <div class="user">
                <div class="number">${cnt}</div>
            </div>
            <div class="user-info">
                <div class="user-name">${user}</div>
            </div>
            <div class="expense">
                <div class="expense-item">Rs. ${expenses[user]}</div>
            </div>
        </div>
        `
        cnt++;
        card.innerHTML += template;
    }
}