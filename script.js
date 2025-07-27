const catCount = 10;
let currentIndex = 0;
let likedCats = [];
let allCats = [];

const cardStack = document.getElementById("card-stack");
const likeBtn = document.getElementById("like");
const dislikeBtn = document.getElementById("dislike");

async function fetchCats() {
    allCats = [];
    cardStack.innerHTML = '<p style="font-size: 18px;">Loading cats... 🐾</p>';

    for (let i = 0; i < catCount; i++) {
        const response = await fetch("https://cataas.com/cat?json=true");
        const data = await response.json();
        allCats.push(`https://cataas.com${data.url}`);
    }
    renderCard();
}

function renderCard() {
    if (currentIndex >= allCats.length) {
        showSummary();
        return;
    }

    cardStack.innerHTML = '<p style="font-size: 18px;">Loading cat... 🐾</p>';

    const card = document.createElement("div");
    card.className = "card";

    const img = new Image();
    img.src = allCats[currentIndex];
    img.alt = "cat";
    
    img.onload = () => {
        card.innerHTML = "";
        card.appendChild(img);

    let startX = 0;
    let currentX = 0;

    card.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    card.addEventListener("touchmove", (e) => {
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 10}deg)`;
    });

    card.addEventListener("touchend", () => {
        const deltaX = currentX - startX;
        if (deltaX > 100) {
            handleVote(true); //to swipe right
        } else if (deltaX < -100) {
            handleVote(false); //to swipe left
        } else {
            card.style.transition = "transform 0.3s ease";
            card.style.transform = "translateX(0)";
        }
    });

    cardStack.innerHTML = "";
    cardStack.appendChild(card);
};

img.onerror = () => {
    cardStack.innerHTML = `<p>😿 Failed to load cat. Try refreshing.</p>`;
};

}

function handleVote(liked) {
    const card = document.querySelector(".card");
    if (!card) return;

    card.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    card.style.transform = liked
    ? "translateX(100vw) rotate(20deg)"
    : "translateX(-100vw) rotate(-20deg)";
    card.style.opacity = "0";

    setTimeout(() => {
        if (liked) likedCats.push(allCats[currentIndex]);
        currentIndex++;

        if (currentIndex >= allCats.length) {
            showSummary();
        } else {
            renderCard();
        }
    }, 300);
}

function showSummary() {
    
    const voteButtons = document.getElementById("vote-buttons");
    if (voteButtons) voteButtons.style.display = "none";

    cardStack.innerHTML = ''; 

    const title = document.createElement('h2');
    title.textContent = `You liked ${likedCats.length} cats 🐾`;
    cardStack.appendChild(title);

    const grid = document.createElement('div');
    grid.style.display = 'flex';
    grid.style.flexWrap = 'wrap';
    grid.style.justifyContent = 'center';
    grid.style.gap = '10px';
    grid.style.marginTop = '20px';

    likedCats.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.style.width = '100px';
    img.style.height = '130px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '10px';
    grid.appendChild(img);
  });

  cardStack.appendChild(grid);

    const restartBtn = document.createElement('button');
    restartBtn.textContent = '🔁 Try Again';
    restartBtn.style.marginTop = '20px';
    restartBtn.style.padding = '10px 20px';
    restartBtn.style.fontSize = '16px';
    restartBtn.style.borderRadius = '8px';
    restartBtn.style.border = 'none';
    restartBtn.style.cursor = 'pointer';
    restartBtn.style.backgroundColor = '#6c5ce7';
    restartBtn.style.color = 'white';

    restartBtn.onclick = () => {
        currentIndex = 0;
        likedCats = [];
        voteButtons.style.display = "flex";
        fetchCats(); //To load a new set of cats
  };

  cardStack.appendChild(restartBtn);
}

likeBtn.addEventListener("click", () => handleVote(true));
dislikeBtn.addEventListener("click", () => handleVote(false));

fetchCats();