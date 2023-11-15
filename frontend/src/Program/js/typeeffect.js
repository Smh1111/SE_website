const text = "We aim to produce graduates who are capable of working confidently in the international software industry as well as pursuing postgraduate study and research in leading universities worldwide.";

let index = 0;
const speed = 90; // Speed of typing, in milliseconds

function typeEffect() {
    const textContentElement = document.getElementById('textcontent');
    if (index < text.length) {
        textContentElement.innerHTML = text.substring(0, index) + '<span class="cursor">|</span>';
        index++;
        setTimeout(typeEffect, speed);
    }
    else {
        textContentElement.innerHTML = text; // Remove cursor at the end
    }
}
typeEffect();