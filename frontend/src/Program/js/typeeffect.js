const text = "TheB.Eng. in Software Engineering Programis a 4-year undergraduate program aiming at producing graduates who are capable of working confidently in the international software industry as well as pursuing postgraduate study and research in leading universities worldwide. The curriculum of the program is designed in accordance with the recent ACM/IEEE guideline for undergraduate curriculum in software engineering.";

let index = 0;
const speed = 10; // Speed of typing, in milliseconds

function typeEffect() {
    const textContentElement = document.querySelector('.textcontent');
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