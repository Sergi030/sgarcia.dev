toggleButton = document.getElementsByClassName('toggle-button')[0];
navbarLinks = document.getElementsByClassName('navbar-links')[0];
navbarBurger = document.getElementById("navbar-burger");
navbarCross = document.getElementById("navbar-cross");
navbarSocial = document.getElementById("navbar-social");


toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');

    if (navbarCross.style.display == "none" ){
        // menu is closed, we want to open it
        navbarBurger.style.display="none";
        navbarCross.style.display="block";
        navbarSocial.style.display="block"
    } else {
        // menu is open, we want to close it
        navbarCross.style.display="none";
        navbarBurger.style.display="block";
        navbarSocial.style.display="none"
    }
})
