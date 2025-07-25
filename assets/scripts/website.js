darkMode = false;

function updateTheme() {
    if (darkMode) {
        document.body.setAttribute("dark",true);
    } else {
        document.body.removeAttribute("dark");
    }
}
function toggleTheme() {
    darkMode = !darkMode
    localStorage.setItem("dark", darkMode);
    updateTheme();
}

document.addEventListener("DOMContentLoaded", function() {
    darkMode = localStorage.getItem("dark")=="true";
   
    document.body.addEventListener('click', function(e) {
        //console.log(e.target)
        if(e.target == document.body) toggleTheme();
    }, false);

    updateTheme();
});