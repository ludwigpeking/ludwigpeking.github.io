var currentSelectedLink = null;

const imageContainer = document.getElementById("image-container");

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const project = urlParams.get("project");
  const clicked = urlParams.get("clicked");

  if (project) {
    loadProject(project, clicked);
  } else {
    // Load default project
    loadProject("coding/grid-erosion.html");
  }
});

function loadProject(projectPath, clickedLinkIdentifier) {
  fetch(projectPath)
    .then((response) => response.text())
    .then((html) => {
      const contentContainer = document.getElementById("dynamic-content");
      if (!contentContainer) {
        console.error("Element with ID 'dynamic-content' not found.");
        return;
      }
      contentContainer.innerHTML = html;

      // Clear any existing intervals to prevent multiple slideshows from running
      if (window.slideshowInterval) {
        clearInterval(window.slideshowInterval);
        window.slideshowInterval = null;
      }

      // Remove any previously declared 'images' variable to prevent errors
      window.images = undefined;

      // Execute any script tags found in the loaded content
      const scripts = Array.from(contentContainer.querySelectorAll("script"));
      for (const oldScript of scripts) {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        new Function(oldScript.textContent)();
        oldScript.parentNode.removeChild(oldScript);
      }

      // Update the browser's history state when loading a new project
      history.pushState(
        { project: projectPath },
        "",
        `?project=${projectPath}`
      );

      // Initialize the slideshow after the new content is loaded
      if (typeof initializeSlideshow === "function") {
        initializeSlideshow();
      }

      // Update the 'visited' state of links
      if (clickedLinkIdentifier) {
        highlightClickedLink(clickedLinkIdentifier);
      }
    })
    .catch((err) => console.warn("Something went wrong.", err));
}

function initializeSlideshow() {
  // Check if the slideshow elements exist before initializing
  const imgElement1 = document.getElementById("slideshow1");
  const imgElement2 = document.getElementById("slideshow2");

  if (imgElement1 && imgElement2) {
    // Use a unique name for the images array to avoid conflicts
    const slideImages = [
      "img/Coding/BecomingCity_Voronoi Claimation/1.jpg",
      "img/Coding/BecomingCity_Voronoi Claimation/2.jpg",
      "img/Coding/BecomingCity_Voronoi Claimation/3.jpg",
      "img/Coding/BecomingCity_Voronoi Claimation/4.jpg",
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
      nextImgElement.classList.add("show");
      currentImgElement.classList.remove("show");

      // Swap the current and next image elements for the next iteration
      [currentImgElement, nextImgElement] = [nextImgElement, currentImgElement];
    }, 1500);
  }
}

// Get all the .image-preview elements
document.body.addEventListener(
  "mouseenter",
  (event) => {
    if (event.target.classList.contains("image-preview")) {
      event.target.classList.add("expanded");
    }
  },
  true
);

// ... [previous code]

function highlightClickedLink(clickedLinkIdentifier) {
  if (currentSelectedLink) {
    currentSelectedLink.style.color = ""; // Reset previous link color
  }

  // Adjust the selector to match the onclick attribute
  const onclickToMatch = `loadProject('coding/${clickedLinkIdentifier}`;
  const clickedLink = document.querySelector(`a[onclick*="${onclickToMatch}"]`);

  if (clickedLink) {
    clickedLink.style.color = "magenta"; // Highlight new link
    currentSelectedLink = clickedLink;
  }
}

// Set up event delegation for dynamically loaded links
document.addEventListener("click", function (event) {
  if (
    event.target.tagName === "A" &&
    event.target.getAttribute("onclick").startsWith("loadProject")
  ) {
    event.preventDefault(); // Prevent default link behavior
    const onclickAttr = event.target.getAttribute("onclick");
    const match = onclickAttr.match(/loadProject\('([^']+)', '([^']+)'\)/);
    if (match) {
      loadProject(match[1], match[2]);
    }
  }
});
