

const imageContainer = document.getElementById('image-container');

// Array of image file paths (modify as needed)
const imageFiles = [
  './img/Places_resized/11_Tsingtao_01.jpg',
  './img/Places_resized/11_Tsingtao_02.jpg',
      './img/Places_resized/11_Tsingtao_03.jpg',
    './img/Places_resized/11_Tsingtao_10.jpg',
    './img/Places_resized/11_Tsingtao_20.jpg',
    './img/Places_resized/11_Tsingtao_21.jpg',
    './img/Places_resized/11_Tsingtao_22.jpg',
    './img/Places_resized/12_Jilin_01.jpg',
    './img/Places_resized/12_Jilin_02.jpg',
    './img/Places_resized/12_Jilin_03.jpg',
    './img/Places_resized/12_Tianjin_01.jpg',
    './img/Places_resized/12_Tianjin_10.jpg',
    './img/Places_resized/12_Tsingtao_01.jpg',
  // ... more file paths ...
];

imageFiles.forEach(imageSrc => {
  const previewDiv = document.createElement('div');
  previewDiv.className = 'image-preview';

  const img = document.createElement('img');
  img.src = imageSrc;

  previewDiv.appendChild(img);
  imageContainer.appendChild(previewDiv);
});

function addImages(id) {
  const galleryDiv = document.getElementById(id);
  const numberOfImages = 20; // Update this to match the number of images you have
  const folderName = `./img/2019-2023 Auswahl/Places`; // Update this to your specific folder

  for (let i = 1; i <= numberOfImages; i++) {
  const imageName = String(i).padStart(3, '0') + '.jpg';
  const imagePath = `${folderName}/${imageName}`;
  const imgElement = document.createElement('img');
  imgElement.src = imagePath;
  imgElement.alt = `${imageName}`;
  galleryDiv.appendChild(imgElement);
  }
}