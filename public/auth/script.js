 window.addEventListener("load", () => {
     const signUpBtn = document.getElementsByClassName("signup");
     for(let i=0; i<signUpBtn.length; i++){
         const btn = signUpBtn[i];
         btn.addEventListener("click", signup);
     }

     const loginBtn = document.getElementsByClassName("login");
     for(let i=0; i<loginBtn.length; i++){
         const btn = loginBtn[i];
         btn.addEventListener("click", login);
     }

     const loginToggle = document.getElementById("login-toggle");
     loginToggle.addEventListener("click", toggleLogin);

     const signupToggle = document.getElementById("signup-toggle");
     signupToggle.addEventListener("click", toggleSignup);
 })

 async function login(){
    const form = document.getElementById("l-form");
    const formData = new FormData(form);
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    }
    try{
        const res = await axios.post("http://localhost:3000/api/login", data);
        if(res.status === 200){
            localStorage.setItem("auth", res.data);
            location.href = "../user/expense/index.html";
        } else if(res.status === 401){
            alert("Invalid credentials");
        } else if(res.status === 404){
            alert("User not found");
        } else {
            console.log(res);
        }
    } catch(err){
        console.log(err);
    }
 }

 async function signup(){
     const form = document.getElementById("s-form");
     const formData = new FormData(form);
     const data = {
         username: formData.get("username"),
         email: formData.get("email"),
         phone: formData.get("phone"),
         password: formData.get("password")
     }

     try {
         const res = await axios.post("http://localhost:3000/api/signup", data);
         if(res.status === 200){
             alert("You are registered. Head on to login page.");
         } else if(res.status === 400) {
             alert("User already exists, please sign in");
         } else {
             console.log(res);
         }
     } catch(err) {
         alert("Something went wrong!");
     }
 }

 function toggleSignup(){
    document.getElementById("login-toggle").style.backgroundColor="#fff";
     document.getElementById("login-toggle").style.color="#222";
     document.getElementById("signup-toggle").style.backgroundColor="#57b846";
     document.getElementById("signup-toggle").style.color="#fff";
     document.getElementById("login-form").style.display="none";
     document.getElementById("signup-form").style.display="block";
 }
 
 function toggleLogin(){
     document.getElementById("login-toggle").style.backgroundColor="#57B846";
     document.getElementById("login-toggle").style.color="#fff";
     document.getElementById("signup-toggle").style.backgroundColor="#fff";
     document.getElementById("signup-toggle").style.color="#222";
     document.getElementById("signup-form").style.display="none";
     document.getElementById("login-form").style.display="block";
 }

 