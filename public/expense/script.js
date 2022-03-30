window.addEventListener("load", () => {
    const auth = localStorage.getItem("auth");
    if(!auth){
        location.href = "../Auth/index.html";
    }
})