

const imageContainer = document.getElementById('image-container');

// Array of image file paths (modify as needed)
// const imageFiles = [
//   './img/2011-2019/Places_resized/11_Tsingtao_01.jpg',
//   './img/2011-2019/Places_resized/11_Tsingtao_02.jpg',
//     './img/2011-2019/Places_resized/11_Tsingtao_03.jpg',
//     './img/2011-2019/Places_resized/11_Tsingtao_10.jpg',
//     './img/2011-2019/Places_resized/11_Tsingtao_20.jpg',
//     './img/2011-2019/Places_resized/11_Tsingtao_21.jpg',
//     './img/2011-2019/Places_resized/11_Tsingtao_22.jpg',
//     './img/2011-2019/Places_resized/12_Jilin_01.jpg',
//     './img/2011-2019/Places_resized/12_Jilin_02.jpg',
//     './img/2011-2019/Places_resized/12_Jilin_03.jpg',
//     './img/2011-2019/Places_resized/12_Tianjin_01.jpg',
//     './img/2011-2019/Places_resized/12_Tianjin_10.jpg',
//     './img/2011-2019/Places_resized/12_Tsingtao_01.jpg',
//   // ... more file paths ...
// ];

// imageFiles.forEach(imageSrc => {
//   const previewDiv = document.createElement('div');
//   previewDiv.className = 'image-preview';
//   const img = document.createElement('img');
//   img.src = imageSrc;
//   previewDiv.appendChild(img);
//   imageContainer.appendChild(previewDiv);
// });

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const project = urlParams.get('project');

    if (project) {
        loadProject(project);
    } else {
        // Handle initial load here, e.g., load a default project.
    }

    // Listen for the popstate event, which occurs when the user navigates backward or forward.
    window.addEventListener('popstate', function (event) {
        const project = event.state ? event.state.project : null;
        if (project) {
            loadProject(project);
        } else {
            // Handle the case where there's no project (e.g., load a default project).
        }
    });
});

function loadProject(projectPath) {
    fetch(projectPath)
        .then(response => response.text())
        .then(html => {
            const contentContainer = document.getElementById('dynamic-content');
            contentContainer.innerHTML = html;

            // Clear any existing intervals to prevent multiple slideshows from running
            if (window.slideshowInterval) {
                clearInterval(window.slideshowInterval);
                window.slideshowInterval = null;
            }

            // Remove any previously declared 'images' variable to prevent 'Identifier "images" has already been declared' error
            window.images = undefined;

            // Execute any script tags found in the loaded content
            const scripts = Array.from(contentContainer.querySelectorAll('script'));
            for (const oldScript of scripts) {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                // Execute the script in a new function to give it a fresh scope
                new Function(oldScript.textContent)();
                oldScript.parentNode.removeChild(oldScript);
            }

            // Update the browser's history state when loading a new project.
            history.pushState({ project: projectPath }, '', `?project=${projectPath}`);

            // Initialize the slideshow after the new content is loaded
            initializeSlideshow();
        })
        .catch(err => console.warn('Something went wrong.', err));
}

function initializeSlideshow() {
    // Check if the slideshow elements exist before initializing
    const imgElement1 = document.getElementById('slideshow1');
    const imgElement2 = document.getElementById('slideshow2');
    
    if (imgElement1 && imgElement2) {
        // Use a unique name for the images array to avoid conflicts
        const slideImages = [
            'img/Coding/BecomingCity_Voronoi Claimation/1.jpg',
            'img/Coding/BecomingCity_Voronoi Claimation/2.jpg',
            'img/Coding/BecomingCity_Voronoi Claimation/3.jpg',
            'img/Coding/BecomingCity_Voronoi Claimation/4.jpg'
        ];

        let currentIndex = 0;
        let currentImgElement = imgElement1;
        let nextImgElement = imgElement2;

        // Clear any existing intervals
        if (window.slideshowInterval) {
            clearInterval(window.slideshowInterval);
        }

        // Set a new interval
        window.slideshowInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideImages.length;
            nextImgElement.src = slideImages[currentIndex];
            nextImgElement.classList.add('show');
            currentImgElement.classList.remove('show');

            // Swap the current and next image elements for the next iteration
            [currentImgElement, nextImgElement] = [nextImgElement, currentImgElement];
        }, 1500);
    }
}
