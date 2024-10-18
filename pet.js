document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadAllPets(); // Load all pets by default
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

// -------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Show spinner
    const spinner = document.getElementById('loadBar');
    spinner.classList.remove('hidden');

    // Hide spinner after 2 seconds
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, 2000);

    loadCategories();
    loadAllPets(); // Load all pets by default
});






// ---------------------------------------------------------------------





async function loadAllPets() {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        console.log('Fetched Pets:', data.pets); // Log to inspect the data structure
        if (data && data.pets) {
            displayPets(data.pets);
        } else {
            console.error('No pets found in the response:', data);
        }
    } catch (error) {
        console.error('Error fetching pets:', error);
    }
}

function displayPets(pets) {
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML = '';
    pets.forEach(pet => {
        console.log('Pet Data:', pet); // Debugging line to log pet data
        const petCard = document.createElement('div');
        petCard.classList = 'card card-compact p-4';
        petCard.innerHTML = `
            <figure>
                <img src="${pet.image || 'assets/placeholder.png'}" alt="${pet.pet_name || 'No Name'}" class="h-48 w-full object-cover rounded">
            </figure>
            <div class="card-body">
                <h2 class="card-title">${pet.pet_name || 'No Name'}</h2>
                <p><i class="fas fa-paw"></i> Breed: ${pet.breed || 'Unknown Breed'}</p>
                <p><i class="fas fa-calendar-alt"></i> Birth: ${pet.date_of_birth || 'Not Available'}</p>
                <p><i class="fas fa-venus-mars"></i> Gender: ${pet.gender || 'Unknown Gender'}</p>
                <p><i class="fas fa-dollar-sign"></i> Price: ${pet.price ? `$${pet.price}` : 'No Price'}</p>
                <div class="flex gap-2 mt-4">
                    <button class="btn btn-sm" onclick="likePet('${pet.image || 'assets/placeholder.png'}')">Like</button>
                    <button class="btn btn-sm btn-warning" onclick="adoptPet(this)">Adopt</button>
                    <button class="btn btn-sm btn-info" onclick="showPetDetails('${pet.id}')">Details</button>
                </div>
            </div>
        `;
        petsContainer.appendChild(petCard);
    });
}


function likePet(thumbnail) {
    const likedPetsContainer = document.getElementById('liked-pets');
    const petThumbnail = document.createElement('img');
    petThumbnail.src = thumbnail;
    petThumbnail.classList = 'rounded h-16 w-16 object-cover';

    // Ensure image is appended at the bottom each time
    likedPetsContainer.appendChild(petThumbnail);
}







function adoptPet(button) {
    let countdown = 3;
    const interval = setInterval(() => {
        button.textContent = `Adopting in ${countdown}...`;
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            button.textContent = 'Adopted';
            button.disabled = true;
        }
    }, 1000);
}

function showPetDetails(petId) {
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
        .then(res => res.json())
        .then(data => {
            const pet = data.data;
            const modalContent = `
                <h2 class="text-xl font-bold">${pet.pet_name || 'No Name'}</h2>
                <p><i class="fas fa-paw"></i> Breed: ${pet.breed || 'Unknown Breed'}</p>
                <p><i class="fas fa-calendar-alt"></i> Birth: ${pet.date_of_birth || 'Not Available'}</p>
                <p><i class="fas fa-venus-mars"></i> Gender: ${pet.gender || 'Unknown Gender'}</p>
                <p><i class="fas fa-dollar-sign"></i> Price: ${pet.price ? `$${pet.price}` : 'No Price'}</p>
                <p>${pet.vaccination_history || 'Vaccination History Not Available'}</p>
                <p>${pet.description || 'Description Not Available'}</p>
                <button class="btn btn-sm" onclick="closeModal()">Close</button>
            `;
            const modal = document.getElementById('modal');
            modal.innerHTML = modalContent;
            modal.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error fetching pet details:', error);
        });
}


function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
}
