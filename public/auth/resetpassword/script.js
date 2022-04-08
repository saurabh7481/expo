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
        const res = await axios.post("http://13.233.197.99:3000/api/password/forgotpassword", obj);
        if(res.status == 200){
            alert("Reset password link sent to your mail.");
        }
    } catch(err){
        console.log(err);
    }
}