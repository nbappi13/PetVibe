

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
}

function scrollToAdoptSection() {
    const section = document.getElementById('adopt-section');
    section.scrollIntoView({ behavior: 'smooth' });
}




