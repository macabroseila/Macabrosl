// Array de URLs das imagens
var imageUrls = [
  "images/image1.jpg",
  "images/image2.jpg",
  "images/image3.jpg",
  "images/image4.jpg",
  "images/image5.jpg"
];

var currentIndex = 0; // Índice da imagem atual

// Função para exibir a imagem atual
function showCurrentImage() {
  var imageElement = document.getElementById("current-image");
  imageElement.src = imageUrls[currentIndex];
}

// Função para exibir a próxima imagem
function showNextImage() {
  currentIndex++;
  if (currentIndex >= imageUrls.length) {
    currentIndex = 0; // Voltar ao início se atingir o final do array
  }
  showCurrentImage();
}

// Função para exibir a imagem anterior
function showPreviousImage() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = imageUrls.length - 1; // Voltar ao final se atingir o início do array
  }
  showCurrentImage();
}

// Chamar a função para exibir a imagem inicial
showCurrentImage();

// Event listeners para os botões de próxima e anterior
var nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", showNextImage);

var previousButton = document.getElementById("previous-button");
previousButton.addEventListener("click", showPreviousImage);
const imageInput = document.getElementById('image-input');
const imageGallery = document.getElementById('image-gallery');

imageInput.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target.result;
      addImageToGallery(imageUrl);
    };
    reader.readAsDataURL(file);
  }
}

function addImageToGallery(imageUrl) {
  const imageItem = document.createElement('div');
  imageItem.classList.add('image-item');

  const image = document.createElement('img');
  image.src = imageUrl;

  imageItem.appendChild(image);
  imageGallery.appendChild(imageItem);
}

function handleImageUpload(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target.result;
      addImageToGallery(imageUrl);
      updateImageCount(1);
    };
    reader.readAsDataURL(file);
  }
}

function addImageToGallery(imageUrl) {
  const imageItem = document.createElement('div');
  imageItem.classList.add('image-item');

  const image = document.createElement('img');
  image.src = imageUrl;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.innerText = 'X';
  deleteButton.addEventListener('click', function () {
    imageItem.remove();
    updateImageCount(-1);
  });

  imageItem.appendChild(image);
  imageItem.appendChild(deleteButton);
  imageGallery.appendChild(imageItem);
}

function updateImageCount(change) {
  imageCount += change;
  imageCountSpan.innerText = `${imageCount} ${imageCount === 1 ? 'imagem' : 'imagens'}`;
}
function addTweetToGallery(tweet) {
  const tweetItem = document.createElement('div');
  tweetItem.classList.add('image-item');

  const image = document.createElement('img');
  image.src = tweet.image;
  image.alt = 'Tweet';

  tweetItem.appendChild(image);
  imageGallery.appendChild(tweetItem);
}

// Exemplo de uso:
const tweets = [
  {
    image: 'path/to/tweet1.png',
    // outras propriedades do tweet
  },
  {
    image: 'path/to/tweet2.png',
    // outras propriedades do tweet
  },
];

for (let i = 0; i < tweets.length; i++) {
  const tweet = tweets[i];
  addTweetToGallery(tweet);
}
const slider = document.querySelector('.slider');
const sliderContainer = document.querySelector('.slider-container');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');

let slideIndex = 0;

function showSlide(index) {
  if (index < 0) {
    index = slides.length - 1;
  } else if (index >= slides.length) {
    index = 0;
  }
  
  sliderContainer.style.transform = `translateX(-${index * 100}%)`;
  slideIndex = index;
}

prevButton.addEventListener('click', () => {
  showSlide(slideIndex - 1);
});

nextButton.addEventListener('click', () => {
  showSlide(slideIndex + 1);
});



function updateSlideIndicators() {
  slideIndicators.forEach((indicator, index) => {
    if (index === slideIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Adicione estas linhas de código abaixo do código anterior

Cache-Control: public, max-age=3600
