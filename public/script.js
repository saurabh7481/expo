window.addEventListener("load", () => {
  const redirectBtn = document.querySelectorAll("#login");
  for(let i=0; i<redirectBtn.length; i++){
    const btn = redirectBtn[i];
    btn.addEventListener("click", () => {
      console.log(location.href);
      location.href = location.href.split("/")[0] + "/auth";
    })
  }
})

const open = document.getElementById("hamburger");
let changeIcon = true;

open.addEventListener("click", function () {
  const overlay = document.querySelector(".overlay");
  const nav = document.querySelector("nav");
  const icon = document.querySelector(".menu-toggle i");
  const hero = document.querySelector(".hero-text");

  hero.style.display = "none";

  overlay.classList.toggle("menu-open");
  nav.classList.toggle("menu-open");

  if (changeIcon) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");

    changeIcon = false;
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
    hero.style.display = "block";
    changeIcon = true;
  }
});
