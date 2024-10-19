document.addEventListener("DOMContentLoaded", () => {
    const spinner = document.getElementById('loadBar');
    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, 2000);
    loadCategories();
    loadAllPets();
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
            button.addEventListener('click', () => filterPets(categoryName.toLowerCase()));
            categoriesContainer.appendChild(button);
            console.log('Button added for category:', category.category);
        } else {
            console.log('Category not found for:', categoryName);
        }
    });
}

async function filterPets(category) {
    const spinner = document.getElementById('loadBar');
    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, 2000);

    // Add active class to clicked button and remove from others
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => button.classList.remove('active'));
    const activeButton = Array.from(categoryButtons).find(button => button.textContent.trim().toLowerCase() === category);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    if (category === "bird") {
        displayNoInfo();
        return;
    }

    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        if (data && data.data) {
            displayPets(data.data);
        } else {
            displayNoInfo();
        }
    } catch (error) {
        console.error('Error fetching pets by category:', error);
        displayNoInfo();
    }
}

function displayNoInfo() {
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML = `
        <div class="no-info">
            <img src="assets/error.webp" alt="image about no data" class="w-full h-auto md:ml-80">
            <p class="md:font-extrabold text-lg font-bold md:text-3xl">No Information Is Available</p>
            <p class="md:mb-7">Since the API doesn't currently provide data for birds, we're unable to display any information about them. We apologize for any inconvenience this may cause.</p>
        </div>
    `;
}

let currentCategory = null;

async function filterPets(category) {
    currentCategory = category;
    const spinner = document.getElementById('loadBar');
    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, 2000);

    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => button.classList.remove('active'));
    const activeButton = Array.from(categoryButtons).find(button => button.textContent.trim().toLowerCase() === category);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    if (category === "bird") {
        displayNoInfo();
        return;
    }

    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        if (data && data.data) {
            displayPets(data.data);
        } else {
            displayNoInfo();
        }
    } catch (error) {
        console.error('Error fetching pets by category:', error);
        displayNoInfo();
    }
}

async function sortPetsByPrice() {
    if (currentCategory === "bird") {
        return; 
    }
    
    const petsContainer = document.getElementById('pets');
    const spinner = document.getElementById('loadBar');
    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, 2000);

    try {
        let pets;
        if (currentCategory) {
            const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${currentCategory}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            pets = data.data;
        } else {
            const res = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            pets = data.pets;
        }

        const sortedPets = pets.sort((a, b) => b.price - a.price); 
        petsContainer.innerHTML = '';
        sortedPets.forEach(pet => {
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
                        <button class="btn btn-sm btn-warning" onclick="adoptPet(this, '${pet.pet_name || 'No Name'}')">Adopt</button>
                        <button class="btn btn-sm btn-info" onclick="showPetDetails('${pet.id}')">Details</button>
                    </div>
                </div>
            `;
            petsContainer.appendChild(petCard);
        });
    } catch (error) {
        console.error('Error fetching or sorting pets:', error);
        displayNoInfo();
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const spinner = document.getElementById('loadBar');
    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, 2000);
    loadCategories();
    loadAllPets();
    const sortButton = document.querySelector('.sort-button');
    if (sortButton) {
        sortButton.addEventListener('click', sortPetsByPrice);
    }
});

async function loadAllPets() {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
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
        if (pet.petId) { // Ensure the pet has an ID and exclude bird data
            const petCard = document.createElement('div');
            petCard.classList = 'card card-compact p-4';
            petCard.innerHTML = `
                <figure>
                    <img src="${pet.image || 'https://via.placeholder.com/150'}" alt="${pet.pet_name || 'No Name'}" class="h-48 w-full object-cover rounded">
                </figure>
                <div class="card-body">
                    <h2 class="card-title">${pet.pet_name || 'No Name'}</h2>
                    <p><i class="fas fa-paw"></i> Breed: ${pet.breed || 'Unknown Breed'}</p>
                    <p><i class="fas fa-calendar-alt"></i> Birth: ${pet.date_of_birth || 'Not Available'}</p>
                    <p><i class="fas fa-venus-mars"></i> Gender: ${pet.gender || 'Unknown Gender'}</p>
                    <p><i class="fas fa-dollar-sign"></i> Price: ${pet.price ? `$${pet.price}` : 'No Price'}</p>
                    <div class="flex gap-2 mt-4">
                        <button class="btn btn-sm" onclick="likePet('${pet.image || 'https://via.placeholder.com/150'}')">Like</button>
                        <button class="btn btn-sm btn-warning" onclick="adoptPet(this, '${pet.pet_name || 'No Name'}')">Adopt</button>
                        <button class="btn btn-sm btn-info" onclick="showPetDetails(${pet.petId})">Details</button>
                    </div>
                </div>
            `;
            petsContainer.appendChild(petCard);
        } else {
            console.error('Pet ID is missing:', pet);
        }
    });
}







function likePet(thumbnail) {
    const likedPetsContainer = document.getElementById('liked-pets');
    const petThumbnail = document.createElement('img');
    petThumbnail.src = thumbnail;
    petThumbnail.classList = 'rounded h-16 w-16 object-cover';
    likedPetsContainer.appendChild(petThumbnail);
}

function adoptPet(button, petName) {
    const modalContent = `
        <div>
            <h2 class="text-2xl font-extrabold text-green-600 text-center">Congratulation! <br> Adopting process starts for your pet . . .</h2>
            <img src="https://img.icons8.com/?size=100&id=Kd3aGkmdbe4V&format=png&color=000000" alt="Adoption Icon" style="margin: 20px 0;">
            <p id="adopting-text" class="text-red-700 mt-5 text-center">Adopting ${petName}</p>
            <p id="countdown" class="text-center" style="font-size: 1.2rem;">3</p>
            <button class="btn btn-sm btn-danger" onclick="closeModal()" style="background-color: #ff6347; color: white; margin-top: auto;">Close</button>
        </div>
    `;
    const modal = document.getElementById('modal');
    modal.innerHTML = modalContent;
    modal.classList.remove('hidden');
    let countdown = 3;
    const interval = setInterval(() => {
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = countdown;
        countdownElement.style.fontSize = '1.2rem';
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            countdownElement.textContent = `Now You Adopted ${petName}!`;
            countdownElement.style.color = 'orange';
            countdownElement.style.fontWeight = 'bold';
            document.getElementById('adopting-text').style.display = 'none';
            button.disabled = true;
        }
    }, 1000);
}

function showPetDetails(petId) {
    if (!petId) {
        console.error('Invalid pet ID');
        return;
    }
    console.log('Pet ID:', petId); // Log the petId to ensure it's correct

    const spinner = document.getElementById('loadBar');
    spinner.classList.remove('hidden');
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, 2000);

    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
        .then(res => res.json())
        .then(data => {
            console.log('API Response:', data); // Log the entire API response
            if (data.status && data.petData) {
                const pet = data.petData;
                const modalContent = `
                    <div style="padding: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <img src="${pet.image || 'https://via.placeholder.com/150'}" alt="${pet.pet_name || 'No Name'}" class="h-48 w-full object-cover rounded">
                        <h2 class="text-xl font-bold">${pet.pet_name || 'No Name'}</h2>
                        <p><i class="fas fa-paw"></i> Breed: ${pet.breed || 'Unknown Breed'}</p>
                        <p><i class="fas fa-calendar-alt"></i> Birth: ${pet.date_of_birth || 'Not Available'}</p>
                        <p><i class="fas fa-venus-mars"></i> Gender: ${pet.gender || 'Unknown Gender'}</p>
                        <p><i class="fas fa-dollar-sign"></i> Price: ${pet.price ? `$${pet.price}` : 'No Price'}</p>
                        <p><i class="fas fa-syringe"></i> Vaccinated: ${pet.vaccinated_status || 'Not Available'}</p>
                        <p>${pet.pet_details || 'Description Not Available'}</p>
                        <button class="btn btn-sm btn-danger" onclick="closeModal()" style="background-color: #ff6347; color: white; margin-top: auto;">Close</button>
                    </div>
                `;
                const modal = document.getElementById('modal');
                modal.innerHTML = modalContent;
                modal.classList.remove('hidden');
            } else {
                console.error('Error fetching pet details:', data.message);
                const modal = document.getElementById('modal');
                modal.innerHTML = '<p>No details available for this pet.</p>';
                modal.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Error fetching pet details:', error);
            const modal = document.getElementById('modal');
            modal.innerHTML = '<p>Error fetching pet details.</p>';
            modal.classList.remove('hidden');
        })
        .finally(() => {
            spinner.classList.add('hidden');
        });
}


function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
}







