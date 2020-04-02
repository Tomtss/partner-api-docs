let button = document.getElementById('nav-button');
let menu = document.getElementById('toc-wrapper');

button.onclick = function () {
	button.classList.toggle('open')
	menu.classList.toggle('open')
};
