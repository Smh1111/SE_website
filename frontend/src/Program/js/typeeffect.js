const text = "Dive into the world of software engineering with KMITL's SE program. Experience hands-on learning, innovative projects, and industry insights. Prepare for a transformative career in technology and innovation.";

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