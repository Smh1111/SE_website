function loadComponent(componentId, componentPath) {
    const element = document.getElementById(componentId);
    if (element) {
        fetch(componentPath)
            .then((response) => response.text())
            .then((html) => {
                element.innerHTML = html;
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

loadComponent('header', 'header.html');
loadComponent('footer', 'footer.html');
