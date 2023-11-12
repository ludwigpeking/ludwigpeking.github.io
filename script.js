
var currentSelectedLink = null;

const imageContainer = document.getElementById('image-container');

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

function loadProject(projectPath, clickedElement) {

    // if (currentSelectedLink) {
    //     currentSelectedLink.style.color = ''; // Set this to your default link color
    // }

    // Set the new link as the selected one and change its color
    currentSelectedLink = clickedElement;
    currentSelectedLink.style.color = 'magenta'; // Or any color you prefer


    fetch(projectPath)
        .then(response => response.text())
        .then(html => {
            document.getElementById('dynamic-content').innerHTML = html;

            const contentContainer = document.getElementById('dynamic-content');
            contentContainer.innerHTML = html;

            // Clear any existing intervals to prevent multiple slideshows from running
            if (window.slideshowInterval) {
                clearInterval(window.slideshowInterval);
                window.slideshowInterval = null;
            }

            // Remove any previously declared 'images' variable to prevent errors
            window.images = undefined;

            // Execute any script tags found in the loaded content
            const scripts = Array.from(contentContainer.querySelectorAll('script'));
            for (const oldScript of scripts) {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                new Function(oldScript.textContent)();
                oldScript.parentNode.removeChild(oldScript);
            }

            // Update the browser's history state when loading a new project
            history.pushState({ project: projectPath }, '', `?project=${projectPath}`);

            // Initialize the slideshow after the new content is loaded
            if (typeof initializeSlideshow === 'function') {
                initializeSlideshow();
            }

            // Update the 'visited' state of links
            if (clickedElement) {
                // Change the color of the clicked link to indicate it's visited
                clickedElement.style.color = 'magenta'; // Or any color you prefer
            }
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

// Get all the .image-preview elements
const previews = document.querySelectorAll('.image-preview');

// Add event listeners to each preview
previews.forEach(preview => {
    preview.addEventListener('mouseenter', () => {
        // Add the 'expanded' class when mouse enters
        preview.classList.add('expanded');
    });
    // If you want to allow the user to collapse the image back by clicking, uncomment below
    /*
    preview.addEventListener('click', () => {
        // Toggle the 'expanded' class when image is clicked
        preview.classList.toggle('expanded');
    });
    */
});


// Get all the <a> elements
const links = document.querySelectorAll('a');

// Add event listeners to each link
links.forEach(link => {
    link.addEventListener('click', () => {
        // Add a 'clicked' class to the link
        link.classList.add('clicked');
    });
});
