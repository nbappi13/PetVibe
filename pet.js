document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
});

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function scrollToAdoptSection() {
    const section = document.getElementById('adopt-section');
    section.scrollIntoView({ behavior: 'smooth' });
}

async function loadCategories() {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/peddy/categories');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        console.log('Fetched Categories:', data.categories);
        if (data && data.categories) {
            displayCategories(data.categories);
        } else {
            console.error('No categories found in the response:', data);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function displayCategories(categories) {
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';

    const specificCategories = ["Cat", "Dog", "Rabbit", "Bird"];

    specificCategories.forEach(categoryName => {
        const category = categories.find(cat => cat.category && cat.category.toLowerCase() === categoryName.toLowerCase());
        if (category) {
            const button = document.createElement('button');
            button.classList = 'btn btn-outline category-btn';
            button.innerHTML = `<img src="${category.category_icon}" alt="${category.category}" class="w-6 h-6 mr-2">${category.category}`;
            categoriesContainer.appendChild(button);
            console.log('Button added for category:', category.category);
        } else {
            console.log('Category not found for:', categoryName);
        }
    });
}
