

const imageContainer = document.getElementById('image-container');

// Array of image file paths (modify as needed)
const imageFiles = [
  './img/2011-2019/Places_resized/11_Tsingtao_01.jpg',
  './img/2011-2019/Places_resized/11_Tsingtao_02.jpg',
    './img/2011-2019/Places_resized/11_Tsingtao_03.jpg',
    './img/2011-2019/Places_resized/11_Tsingtao_10.jpg',
    './img/2011-2019/Places_resized/11_Tsingtao_20.jpg',
    './img/2011-2019/Places_resized/11_Tsingtao_21.jpg',
    './img/2011-2019/Places_resized/11_Tsingtao_22.jpg',
    './img/2011-2019/Places_resized/12_Jilin_01.jpg',
    './img/2011-2019/Places_resized/12_Jilin_02.jpg',
    './img/2011-2019/Places_resized/12_Jilin_03.jpg',
    './img/2011-2019/Places_resized/12_Tianjin_01.jpg',
    './img/2011-2019/Places_resized/12_Tianjin_10.jpg',
    './img/2011-2019/Places_resized/12_Tsingtao_01.jpg',
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

function loadProject(file) {
  console.log('Loading project:', file);
  const contentContainer = document.getElementById('dynamic-content');

  fetch(file)
      .then(response => response.text())
      .then(data => {
          contentContainer.innerHTML = data;
      })
      .catch(error => {
          console.error('Error:', error);
          contentContainer.innerHTML = 'Failed to load content.';
      });
}
