window.addEventListener("load", () => {
    const resetBtn = document.getElementsByClassName("reset");
     for(let i=0; i<resetBtn.length; i++){
         const btn = resetBtn[i];
         btn.addEventListener("click", resetPassword);
     }
})

async function resetPassword(){
    const obj = {
        email: document.getElementById("email").value
    }
    console.log(obj);
    try{
        const res = await axios.post("http://localhost:3000/api/password/forgotpassword", obj);
        console.log(res);
    } catch(err){
        console.log(err);
    }
}