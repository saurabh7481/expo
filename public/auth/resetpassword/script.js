window.addEventListener("load", () => {
    const resetBtn = document.getElementsByClassName("reset");
     for(let i=0; i<resetBtn.length; i++){
         const btn = resetBtn[i];
         btn.addEventListener("click", resetPassword);
     }
})

async function resetPassword(){
    const email = document.getElementById("email").value;
    try{
        const res = await axios.post("http://localhost:3000/auth/password/forgotpassword", JSON.stringify(email));
    }
}