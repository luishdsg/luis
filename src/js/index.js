

//CONTROLLERS-WEB

function sobre(){
    document.getElementById("sobre").style.borderTop = "2px solid var(--pisina)";
    document.getElementById("skill").style.borderTop = "2px solid transparent";
    document.getElementById("form").style.borderTop = "2px solid transparent";
    document.getElementById("contact").style.borderTop = "2px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "block !important"
    document.getElementById("Pskill").style.display = "none !important"
    document.getElementById("Pform").style.display = "none !important"
    document.getElementById("Pcontact").style.display = "none !important"
}

function skills(){
    document.getElementById("sobre").style.borderTop = "2px solid  transparent";
    document.getElementById("skill").style.borderTop = "2px solid var(--pisina)";
    document.getElementById("form").style.borderTop = "2px solid transparent";
    document.getElementById("contact").style.borderTop = "2px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "none !important"
    document.getElementById("Pskill").style.display = " block !important"
    document.getElementById("Pform").style.display = "none !important"
    document.getElementById("Pcontact").style.display = "none !important"
}

function form(){
    document.getElementById("sobre").style.borderTop = "2px solid transparent";
    document.getElementById("skill").style.borderTop = "2px solid transparent";
    document.getElementById("form").style.borderTop = "2px solid var(--pisina)";
    document.getElementById("contact").style.borderTop = "2px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "none !important"
    document.getElementById("Pskill").style.display = "none !important"
    document.getElementById("Pform").style.display = "block !important"
    document.getElementById("Pcontact").style.display = "none !important"
}

function contact(){
    document.getElementById("sobre").style.borderTop = "2px solid transparent";
    document.getElementById("skill").style.borderTop = "2px solid transparent";
    document.getElementById("form").style.borderTop = "2px solid transparent";
    document.getElementById("contact").style.borderTop = "2px solid var(--pisina)";
    //PAGES
    document.getElementById("Psobre").style.display = "none !important"
    document.getElementById("Pskill").style.display = "none !important"
    document.getElementById("Pform").style.display = "none !important"
    document.getElementById("Pcontact").style.display = "block !important"
}


//CONTROLLERS-MOBILE
function theboxon(){
    document.getElementById("theboxkid").style.display = "flex";
    document.getElementById("theboxon").style.display = "none";
    document.getElementById("theboxoff").style.display = "block";
}
function theboxoff(){
    document.getElementById("theboxkid").style.display = "none";
    document.getElementById("theboxon").style.display = "block";
    document.getElementById("theboxoff").style.display = "none";
}

function sobreF(){
    document.getElementById("sobres").style.borderLeft = "1px solid var(--pisina)";
    document.getElementById("skills").style.borderLeft = "1px solid transparent";
    document.getElementById("forms").style.borderLeft = "1px solid transparent";
    document.getElementById("contacts").style.borderLeft = "1px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "block !important"
    document.getElementById("Pskills").style.display = "none !important"
    document.getElementById("Pform").style.display = "none !important"
    document.getElementById("Pcontact").style.display = "none !important"
}

function skillsF(){
    document.getElementById("sobres").style.borderLeft = "1px solid  transparent";
    document.getElementById("skills").style.borderLeft = "1px solid var(--pisina)";
    document.getElementById("forms").style.borderLeft = "1px solid transparent";
    document.getElementById("contacts").style.borderLeft = "1px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "none !important"
    document.getElementById("Pskills").style.display = " block !important"
    document.getElementById("Pform").style.display = "none !important"
    document.getElementById("Pcontact").style.display = "none !important"
}

function formF(){
    document.getElementById("sobres").style.borderLeft = "1px solid transparent";
    document.getElementById("skills").style.borderLeft = "1px solid transparent";
    document.getElementById("forms").style.borderLeft = "1px solid var(--pisina)";
    document.getElementById("contacts").style.borderLeft = "1px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "none !important"
    document.getElementById("Pskills").style.display = "none !important"
    document.getElementById("Pform").style.display = "block !important"
    document.getElementById("Pcontact").style.display = "none !important"
}

function contactF(){
    document.getElementById("sobres").style.borderLeft = "1px solid transparent";
    document.getElementById("skills").style.borderLeft = "1px solid transparent";
    document.getElementById("forms").style.borderLeft = "1px solid transparent";
    document.getElementById("contacts").style.borderLeft = "1px solid var(--pisina)";
    //PAGES
    document.getElementById("Psobre").style.display = "none !important"
    document.getElementById("Pskills").style.display = "none !important"
    document.getElementById("Pform").style.display = "none !important"
    document.getElementById("Pcontact").style.display = "block !important"
}
