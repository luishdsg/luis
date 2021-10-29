//CONTROLLERS-WEB

//CLOSECONTACT
function closecontact() {
    document.getElementById("Pcontact").style.display = "none";
    document.getElementById("Psobre").style.display = "block";
    document.getElementById("contact").style.borderTop = "2px solid transparent";
    document.getElementById("sobre").style.borderTop = "2px solid var(--pisina)";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "block";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "none";
    backskill[1].style.display = "none";
    backskill[2].style.display = "none";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "none";
}



function sobre() {
    document.getElementById("sobre").style.borderTop = "2px solid var(--pisina)";
    document.getElementById("skill").style.borderTop = "2px solid transparent";
    document.getElementById("form").style.borderTop = "2px solid transparent";
    document.getElementById("contact").style.borderTop = "2px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "block";
    document.getElementById("Pskill").style.display = "none";
    document.getElementById("Pform").style.display = "none";
    document.getElementById("Pcontact").style.display = "none";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "block";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "none";
    backskill[1].style.display = "none";
    backskill[2].style.display = "none";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "none";
}

function skills() {
    document.getElementById("sobre").style.borderTop = "2px solid  transparent";
    document.getElementById("skill").style.borderTop = "2px solid var(--pisina)";
    document.getElementById("form").style.borderTop = "2px solid transparent";
    document.getElementById("contact").style.borderTop = "2px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "none";
    document.getElementById("Pskill").style.display = " block";
    document.getElementById("Pform").style.display = "none";
    document.getElementById("Pcontact").style.display = "none";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "none";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "block";
    backskill[1].style.display = "block";
    backskill[2].style.display = "block";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "none";


}

function form() {
    document.getElementById("sobre").style.borderTop = "2px solid transparent";
    document.getElementById("skill").style.borderTop = "2px solid transparent";
    document.getElementById("form").style.borderTop = "2px solid var(--pisina)";
    document.getElementById("contact").style.borderTop = "2px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "none";
    document.getElementById("Pskill").style.display = "none";
    document.getElementById("Pform").style.display = "block";
    document.getElementById("Pcontact").style.display = "none";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "none";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "none";
    backskill[1].style.display = "none";
    backskill[2].style.display = "none";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "block";
}

function contact() {
    document.getElementById("sobre").style.borderTop = "2px solid transparent";
    document.getElementById("skill").style.borderTop = "2px solid transparent";
    document.getElementById("form").style.borderTop = "2px solid transparent";
    document.getElementById("contact").style.borderTop = "2px solid var(--pisina)";
    //PAGES
    document.getElementById("Psobre").style.display = "none";
    document.getElementById("Pskill").style.display = "none";
    document.getElementById("Pform").style.display = "none";
    document.getElementById("Pcontact").style.display = "block";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "none";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "none";
    backskill[1].style.display = "none";
    backskill[2].style.display = "none";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "none";
}


//CONTROLLERS-MOBILE
function theboxon() {
    document.getElementById("theboxkid").style.display = "flex";
    document.getElementById("theboxon").style.display = "none";
    document.getElementById("theboxoff").style.display = "block";
}

function theboxoff() {
    document.getElementById("theboxkid").style.display = "none";
    document.getElementById("theboxon").style.display = "block";
    document.getElementById("theboxoff").style.display = "none";
}

function sobreF() {
    document.getElementById("sobres").style.borderLeft = "1px solid var(--pisina)";
    document.getElementById("skills").style.borderLeft = "1px solid transparent";
    document.getElementById("forms").style.borderLeft = "1px solid transparent";
    document.getElementById("contacts").style.borderLeft = "1px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "block";
    document.getElementById("Pskill").style.display = "none";
    document.getElementById("Pform").style.display = "none";
    document.getElementById("Pcontact").style.display = "none";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "block";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "none";
    backskill[1].style.display = "none";
    backskill[2].style.display = "none";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "none";
}

function skillsF() {
    document.getElementById("sobres").style.borderLeft = "1px solid  transparent";
    document.getElementById("skills").style.borderLeft = "1px solid var(--pisina)";
    document.getElementById("forms").style.borderLeft = "1px solid transparent";
    document.getElementById("contacts").style.borderLeft = "1px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "none";
    document.getElementById("Pskill").style.display = " block";
    document.getElementById("Pform").style.display = "none";
    document.getElementById("Pcontact").style.display = "none";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "none";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "block";
    backskill[1].style.display = "block";
    backskill[2].style.display = "block";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "none";
}

function formF() {
    document.getElementById("sobres").style.borderLeft = "1px solid transparent";
    document.getElementById("skills").style.borderLeft = "1px solid transparent";
    document.getElementById("forms").style.borderLeft = "1px solid var(--pisina)";
    document.getElementById("contacts").style.borderLeft = "1px solid transparent";
    //PAGES
    document.getElementById("Psobre").style.display = "none";
    document.getElementById("Pskill").style.display = "none";
    document.getElementById("Pform").style.display = "block";
    document.getElementById("Pcontact").style.display = "none";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "block";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "none";
    backskill[1].style.display = "none";
    backskill[2].style.display = "none";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "block";
}

function contactF() {
    document.getElementById("sobres").style.borderLeft = "1px solid transparent";
    document.getElementById("skills").style.borderLeft = "1px solid transparent";
    document.getElementById("forms").style.borderLeft = "1px solid transparent";
    document.getElementById("contacts").style.borderLeft = "1px solid var(--pisina)";
    //PAGES
    document.getElementById("Psobre").style.display = "none";
    document.getElementById("Pskill").style.display = "none";
    document.getElementById("Pform").style.display = "none";
    document.getElementById("Pcontact").style.display = "block";
    //BACKGROUNDS
    var backhome = document.getElementsByClassName("bubbles");
    backhome[0].style.display = "none";

    var backskill = document.getElementsByClassName("skillet");
    backskill[0].style.display = "none";
    backskill[1].style.display = "none";
    backskill[2].style.display = "none";

    var backform = document.getElementsByClassName("area");
    backform[0].style.display = "none";
}


