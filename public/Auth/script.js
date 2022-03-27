 window.addEventListener("load", () => {
     const signUpBtn = document.getElementsByClassName("signup");
     console.log(signUpBtn)
     for(let i=0; i<signUpBtn.length; i++){
         const btn = signUpBtn[i];
         btn.addEventListener("click", signup);
     }

     const loginToggle = document.getElementById("login-toggle");
     loginToggle.addEventListener("click", toggleLogin);

     const signupToggle = document.getElementById("signup-toggle");
     signupToggle.addEventListener("click", toggleSignup);
 })

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
             alert("User registration completed!");
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

 