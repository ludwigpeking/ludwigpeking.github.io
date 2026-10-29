/* ==========================================================================
   site.js - shared behaviour for every page:
   theme toggle, header/footer chrome, project card rendering,
   project detail rendering, lazy embeds and the p5 sketch viewer.
   Data comes from data/projects.js (window.PROJECTS, window.CATEGORIES)
   and data/sketches.js (window.SKETCHES).
   ========================================================================== */

(function () {
  "use strict";

  var THEME_STORAGE_KEY = "rql-theme";

  /* ---------------------------------------------------------------- theme */

  function readStoredTheme() {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch (storageError) {
      return null;
    }
  }

  function writeStoredTheme(themeName) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (storageError) {
      /* private mode or blocked storage: ignore */
    }
  }

  function currentEffectiveTheme() {
    var explicitTheme = document.documentElement.getAttribute("data-theme");
    if (explicitTheme) {
      return explicitTheme;
    }
    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function applyStoredTheme() {
    var storedTheme = readStoredTheme();
    if (storedTheme === "dark" || storedTheme === "light") {
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }

  function toggleTheme() {
    var nextTheme = currentEffectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    writeStoredTheme(nextTheme);
    updateThemeToggleIcon();
  }

  function updateThemeToggleIcon() {
    var toggleButton = document.querySelector(".theme-toggle");
    if (!toggleButton) {
      return;
    }
    var isDark = currentEffectiveTheme() === "dark";
    toggleButton.innerHTML = isDark ? SUN_ICON : MOON_ICON;
    toggleButton.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  var SUN_ICON =
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var EMAIL_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>';
  var MOON_ICON =
    '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  /* --------------------------------------------------------------- chrome */

  /* The three work categories come first (from CATEGORIES), then these pages. */
  var PAGE_NAVIGATION_ITEMS = [
    { href: "sketches.html", label: "Sketches" },
    { href: "writing.html", label: "Writing" },
    { href: "cv.html", label: "CV" }
  ];

  function currentPageFileName() {
    var pathParts = window.location.pathname.split("/");
    var fileName = pathParts[pathParts.length - 1];
    return fileName === "" ? "index.html" : fileName;
  }

  /* The category the visitor is looking at: the work page filter, or the
     category of the project being shown. Empty string elsewhere. */
  function currentCategoryId(pageFileName) {
    var urlParameters = new URLSearchParams(window.location.search);
    if (pageFileName === "work.html") {
      return urlParameters.get("category") || "";
    }
    if (pageFileName === "project.html") {
      var project = findProject(urlParameters.get("id"));
      return project ? project.category : "";
    }
    return "";
  }

  function renderHeader() {
    var headerElement = document.querySelector(".site-header");
    if (!headerElement) {
      return;
    }
    var pageFileName = currentPageFileName();
    var activeCategoryId = currentCategoryId(pageFileName);
    var categoryNavigationItems = (window.CATEGORIES || []).map(function (category) {
      return {
        href: "work.html?category=" + category.id,
        label: category.navigationLabel || category.label,
        isCurrent: category.id === activeCategoryId
      };
    });
    var pageNavigationItems = PAGE_NAVIGATION_ITEMS.map(function (item) {
      return {
        href: item.href,
        label: item.label,
        isCurrent: item.href === pageFileName
      };
    });
    var navigationMarkup = categoryNavigationItems.concat(pageNavigationItems).map(function (item) {
      var isCurrent = item.isCurrent;
      return (
        '<a href="' +
        item.href +
        '"' +
        (isCurrent ? ' aria-current="page"' : "") +
        ">" +
        item.label +
        "</a>"
      );
    }).join("");

    headerElement.innerHTML =
      '<div class="container">' +
      '<a class="site-home" href="index.html"' +
      (pageFileName === "index.html" ? ' aria-current="page"' : "") +
      ">Home</a>" +
      '<nav class="site-nav" aria-label="Site">' +
      navigationMarkup +
      "</nav>" +
      '<a class="site-email" href="mailto:ludwig.peking@gmail.com" aria-label="Email ludwig.peking@gmail.com">' +
      EMAIL_ICON +
      "<span data-email-label>Email</span></a>" +
      '<button class="theme-toggle" type="button"></button>' +
      "</div>";

    headerElement
      .querySelector(".theme-toggle")
      .addEventListener("click", toggleTheme);
    updateThemeToggleIcon();
  }

  function renderFooter() {
    var footerElement = document.querySelector(".site-footer");
    if (!footerElement) {
      return;
    }
    footerElement.innerHTML =
      '<div class="container">' +
      '<div class="footer-links">' +
      '<a href="mailto:ludwig.peking@gmail.com">Email</a>' +
      '<a href="https://github.com/ludwigpeking" target="_blank" rel="noopener">GitHub</a>' +
      '<a href="https://editor.p5js.org/ludwig.peking/sketches" target="_blank" rel="noopener">p5.js</a>' +
      '<a href="https://www.linkedin.com/in/qian-li-944a0510/" target="_blank" rel="noopener">LinkedIn</a>' +
      '<a href="https://www.youtube.com/channel/UC70EKdkg918fqyimJ5-fNMA" target="_blank" rel="noopener">YouTube</a>' +
      '<a href="architecture.html">Architecture archive</a>' +
      "</div>" +
      '<div class="footer-copy">Richard Qian Li &middot; New York / Beijing</div>' +
      "</div>";
  }

  /* -------------------------------------------------------------- helpers */

  function escapeHtml(rawText) {
    return String(rawText)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findCategory(categoryId) {
    var categories = window.CATEGORIES || [];
    for (var index = 0; index < categories.length; index += 1) {
      if (categories[index].id === categoryId) {
        return categories[index];
      }
    }
    return null;
  }

  function findProject(projectId) {
    var projects = window.PROJECTS || [];
    for (var index = 0; index < projects.length; index += 1) {
      if (projects[index].id === projectId) {
        return projects[index];
      }
    }
    return null;
  }

  function projectsInCategory(categoryId) {
    return (window.PROJECTS || []).filter(function (project) {
      return categoryId === "all" || project.category === categoryId;
    });
  }

  function projectsWithTag(tagName) {
    return (window.PROJECTS || []).filter(function (project) {
      return (project.tags || []).indexOf(tagName) !== -1;
    });
  }

  function tagsByFrequency() {
    var countByTag = {};
    (window.PROJECTS || []).forEach(function (project) {
      (project.tags || []).forEach(function (tag) {
        countByTag[tag] = (countByTag[tag] || 0) + 1;
      });
    });
    return Object.keys(countByTag)
      .map(function (tag) {
        return { tag: tag, count: countByTag[tag] };
      })
      .sort(function (first, second) {
        return second.count - first.count || first.tag.localeCompare(second.tag);
      });
  }

  function tagLinkMarkup(tag) {
    return (
      '<a class="tag" href="work.html?tag=' +
      encodeURIComponent(tag) +
      '">' +
      escapeHtml(tag) +
      "</a>"
    );
  }

  /* ---------------------------------------------------------------- cards */

  function projectCardMarkup(project, options) {
    var settings = options || {};
    var category = findCategory(project.category);
    var tagsMarkup = (project.tags || [])
      .slice(0, settings.maxTags || 4)
      .map(function (tag) {
        return '<span class="tag">' + escapeHtml(tag) + "</span>";
      })
      .join("");
    var pendingMarks = [];
    if (project.copyPending) {
      pendingMarks.push("copy");
    }
    if (project.videoPending && !(project.youtube && project.youtube.length)) {
      pendingMarks.push("video");
    }
    var pendingMarkup = pendingMarks.length
      ? '<span class="pending-mark">' +
        escapeHtml(pendingMarks.join(" + ")) +
        " pending</span>"
      : "";
    var metaParts = [];
    if (category) {
      metaParts.push(category.label);
    }
    if (project.year) {
      metaParts.push(project.year);
    }
    return (
      '<a class="project-card' +
      (settings.wide ? " wide" : "") +
      '" href="project.html?id=' +
      encodeURIComponent(project.id) +
      '">' +
      '<div class="thumb' +
      (project.thumbMotion ? " has-motion" : "") +
      '"><img loading="lazy" src="' +
      escapeHtml(project.thumb) +
      '" alt="' +
      escapeHtml(project.title) +
      '"' +
      (project.thumbMotion
        ? ' data-still="' +
          escapeHtml(project.thumb) +
          '" data-motion="' +
          escapeHtml(project.thumbMotion) +
          '"'
        : "") +
      ' onerror="this.parentNode.classList.add(&quot;missing&quot;)">' +
      pendingMarkup +
      "</div>" +
      '<div class="card-body">' +
      '<div class="card-meta">' +
      escapeHtml(metaParts.join(" · ")) +
      "</div>" +
      "<h3>" +
      escapeHtml(project.title) +
      "</h3>" +
      "<p>" +
      escapeHtml(project.summary) +
      "</p>" +
      (tagsMarkup ? '<div class="tag-row">' + tagsMarkup + "</div>" : "") +
      "</div>" +
      "</a>"
    );
  }

  function renderCardGrid(containerElement, projects, options) {
    containerElement.innerHTML = projects
      .map(function (project) {
        return projectCardMarkup(project, options);
      })
      .join("");
  }

  /* ---------------------------------------------------------- home reels */

  /* The home page shows one row per category that rolls slowly from right to
     left. A row's cards are repeated until one pass is at least
     MINIMUM_CARDS_PER_PASS long (so the row never shows a gap on a wide
     screen), then the pass is doubled; wrapping the scroll offset at one
     pass width makes the loop seamless. The rows never stop rolling, and a
     mouse drag or a sideways trackpad swipe pans a row by hand. */
  var MINIMUM_CARDS_PER_PASS = 16;
  var REEL_SECONDS_PER_CARD = 4.5;

  function shortProjectTitle(project) {
    return project.title.split(":")[0];
  }

  /* Reels load an 800 x 450 still made by tools/make_reel_images.py
     (img/projects/reel/) instead of the 1200 x 675 thumbnail, and play the
     800 x 450 motion preview itself. A project whose small still is missing
     falls back to its full thumbnail; one without a video keeps its still. */
  function reelStillPath(project) {
    return project.thumb.replace("img/projects/", "img/projects/reel/");
  }

  function reelMotionPath(project) {
    return project.thumbMotion;
  }

  function reelCardMarkup(project, isRepeat) {
    var motionAttribute = project.thumbMotion
      ? ' data-reel-motion="' + escapeHtml(reelMotionPath(project)) + '"'
      : "";
    return (
      '<a class="reel-card" draggable="false" href="project.html?id=' +
      encodeURIComponent(project.id) +
      '"' +
      (isRepeat ? ' aria-hidden="true" tabindex="-1"' : "") +
      ">" +
      '<div class="thumb"' +
      motionAttribute +
      '><img loading="lazy" draggable="false" src="' +
      escapeHtml(reelStillPath(project)) +
      '" data-full-still="' +
      escapeHtml(project.thumb) +
      '" alt="' +
      (isRepeat ? "" : escapeHtml(project.title)) +
      '"></div>' +
      '<span class="reel-card-title">' +
      escapeHtml(shortProjectTitle(project)) +
      "</span>" +
      "</a>"
    );
  }

  function renderProjectReels() {
    var containerElement = document.querySelector("[data-project-reels]");
    if (!containerElement) {
      return;
    }
    containerElement.innerHTML = (window.CATEGORIES || [])
      .map(function (category) {
        var categoryProjects = projectsInCategory(category.id);
        var featuredProjects = categoryProjects.filter(function (project) {
          return project.featured;
        });
        var otherProjects = categoryProjects.filter(function (project) {
          return !project.featured;
        });
        var orderedProjects = featuredProjects.concat(otherProjects);
        if (orderedProjects.length === 0) {
          return "";
        }

        var cardsPerPass = [];
        while (cardsPerPass.length < MINIMUM_CARDS_PER_PASS) {
          cardsPerPass = cardsPerPass.concat(orderedProjects);
        }
        var cardsMarkup = cardsPerPass
          .concat(cardsPerPass)
          .map(function (project, cardIndex) {
            return reelCardMarkup(project, cardIndex >= orderedProjects.length);
          })
          .join("");

        return (
          '<div class="reel">' +
          '<div class="container reel-header">' +
          '<a class="reel-label" href="work.html?category=' +
          category.id +
          '">' +
          escapeHtml(category.label) +
          "</a>" +
          '<span class="reel-count">' +
          categoryProjects.length +
          (categoryProjects.length === 1 ? " project" : " projects") +
          "</span>" +
          "</div>" +
          '<div class="reel-viewport">' +
          '<div class="reel-track" data-cards-per-pass="' +
          cardsPerPass.length +
          '">' +
          cardsMarkup +
          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* Distance a press must travel before it counts as a drag rather than a click. */
  var DRAG_THRESHOLD_PIXELS = 6;
  /* How quickly a flung row slows back to its rolling speed: the fraction of
     the extra velocity kept after one second. */
  var FLING_VELOCITY_KEPT_PER_SECOND = 0.05;
  /* A drag that ends with the pointer standing still this long does not fling. */
  var FLING_MAXIMUM_PAUSE_MILLISECONDS = 80;
  /* Fastest coast after a flick; at this speed a row coasts roughly 600 px. */
  var FLING_MAXIMUM_SPEED_PIXELS_PER_SECOND = 1800;

  function wireProjectReels() {
    var viewportElements = document.querySelectorAll(".reel-viewport");
    if (viewportElements.length === 0) {
      return;
    }
    /* Visitors who ask for less motion get still rows they can still drag. */
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var reels = Array.prototype.map.call(viewportElements, function (viewportElement) {
      var trackElement = viewportElement.querySelector(".reel-track");
      return {
        viewportElement: viewportElement,
        trackElement: trackElement,
        cardsPerPass: Number(trackElement.getAttribute("data-cards-per-pass")) || 1,
        passWidthPixels: 0,
        scrollOffsetPixels: 0,
        flingVelocityPixelsPerSecond: 0,
        isPressed: false,
        isDragging: false,
        pressStartPointerX: 0,
        pressStartScrollOffsetPixels: 0,
        lastPointerX: 0,
        lastPointerTime: 0,
        suppressNextClick: false
      };
    });

    function measureReel(reel) {
      reel.passWidthPixels = reel.trackElement.scrollWidth / 2;
    }

    function rollingSpeedPixelsPerSecond(reel) {
      if (prefersReducedMotion || reel.passWidthPixels === 0) {
        return 0;
      }
      return reel.passWidthPixels / (reel.cardsPerPass * REEL_SECONDS_PER_CARD);
    }

    function applyScrollOffset(reel) {
      if (reel.passWidthPixels > 0) {
        reel.scrollOffsetPixels =
          ((reel.scrollOffsetPixels % reel.passWidthPixels) + reel.passWidthPixels) % reel.passWidthPixels;
      }
      reel.trackElement.style.transform = "translateX(" + -reel.scrollOffsetPixels + "px)";
    }

    reels.forEach(function (reel) {
      var viewportElement = reel.viewportElement;

      viewportElement.addEventListener("pointerdown", function (pointerEvent) {
        if (pointerEvent.pointerType === "mouse" && pointerEvent.button !== 0) {
          return;
        }
        reel.isPressed = true;
        reel.isDragging = false;
        reel.pressStartPointerX = pointerEvent.clientX;
        reel.pressStartScrollOffsetPixels = reel.scrollOffsetPixels;
        reel.lastPointerX = pointerEvent.clientX;
        reel.lastPointerTime = pointerEvent.timeStamp;
        reel.flingVelocityPixelsPerSecond = 0;
      });

      viewportElement.addEventListener("pointermove", function (pointerEvent) {
        if (!reel.isPressed) {
          return;
        }
        var dragDistancePixels = pointerEvent.clientX - reel.pressStartPointerX;
        if (!reel.isDragging && Math.abs(dragDistancePixels) > DRAG_THRESHOLD_PIXELS) {
          /* Capture only once it is a real drag, so a plain click still reaches the card link. */
          reel.isDragging = true;
          try {
            viewportElement.setPointerCapture(pointerEvent.pointerId);
          } catch (captureError) {
            /* The pointer is already gone; the drag still works without capture. */
          }
          viewportElement.classList.add("dragging");
        }
        if (!reel.isDragging) {
          return;
        }
        var elapsedSeconds = (pointerEvent.timeStamp - reel.lastPointerTime) / 1000;
        if (elapsedSeconds > 0) {
          reel.flingVelocityPixelsPerSecond = -(pointerEvent.clientX - reel.lastPointerX) / elapsedSeconds;
        }
        reel.lastPointerX = pointerEvent.clientX;
        reel.lastPointerTime = pointerEvent.timeStamp;
        reel.scrollOffsetPixels = reel.pressStartScrollOffsetPixels - dragDistancePixels;
        applyScrollOffset(reel);
      });

      function endPress(pointerEvent) {
        if (!reel.isPressed) {
          return;
        }
        reel.isPressed = false;
        if (!reel.isDragging) {
          return;
        }
        reel.isDragging = false;
        reel.suppressNextClick = true;
        viewportElement.classList.remove("dragging");
        if (viewportElement.hasPointerCapture(pointerEvent.pointerId)) {
          viewportElement.releasePointerCapture(pointerEvent.pointerId);
        }
        if (pointerEvent.timeStamp - reel.lastPointerTime > FLING_MAXIMUM_PAUSE_MILLISECONDS) {
          reel.flingVelocityPixelsPerSecond = 0;
        }
        reel.flingVelocityPixelsPerSecond = Math.max(
          -FLING_MAXIMUM_SPEED_PIXELS_PER_SECOND,
          Math.min(FLING_MAXIMUM_SPEED_PIXELS_PER_SECOND, reel.flingVelocityPixelsPerSecond)
        );
        /* The click that follows a drag lands on the viewport, if it comes at all;
           forget it shortly so the next real click is not swallowed. */
        window.setTimeout(function () {
          reel.suppressNextClick = false;
        }, 0);
      }
      viewportElement.addEventListener("pointerup", endPress);
      viewportElement.addEventListener("pointercancel", endPress);

      /* After a drag the browser may still fire a click; it must not open a project. */
      viewportElement.addEventListener(
        "click",
        function (clickEvent) {
          if (reel.suppressNextClick) {
            reel.suppressNextClick = false;
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
          }
        },
        true
      );

      /* Sideways trackpad swipes (and shift + wheel) pan the row; plain
         vertical scrolling is left to the page. */
      viewportElement.addEventListener(
        "wheel",
        function (wheelEvent) {
          if (Math.abs(wheelEvent.deltaX) <= Math.abs(wheelEvent.deltaY)) {
            return;
          }
          wheelEvent.preventDefault();
          reel.scrollOffsetPixels += wheelEvent.deltaX;
          reel.flingVelocityPixelsPerSecond = 0;
          applyScrollOffset(reel);
        },
        { passive: false }
      );
    });

    function measureAllReels() {
      reels.forEach(measureReel);
    }
    measureAllReels();
    window.addEventListener("resize", measureAllReels);

    var previousFrameTime = null;
    function advanceFrame(frameTime) {
      /* Cap the step so a tab returning from the background does not jump. */
      var elapsedSeconds =
        previousFrameTime === null ? 0 : Math.min((frameTime - previousFrameTime) / 1000, 0.1);
      previousFrameTime = frameTime;
      var flingVelocityKeptThisFrame = Math.pow(FLING_VELOCITY_KEPT_PER_SECOND, elapsedSeconds);
      reels.forEach(function (reel) {
        if (reel.isDragging) {
          return;
        }
        if (reel.passWidthPixels === 0) {
          measureReel(reel);
        }
        reel.scrollOffsetPixels +=
          (rollingSpeedPixelsPerSecond(reel) + reel.flingVelocityPixelsPerSecond) * elapsedSeconds;
        reel.flingVelocityPixelsPerSecond *= flingVelocityKeptThisFrame;
        applyScrollOffset(reel);
      });
      window.requestAnimationFrame(advanceFrame);
    }
    window.requestAnimationFrame(advanceFrame);
  }

  /* A reel card whose small still is missing shows the full thumbnail instead,
     and one with no image at all gets the "image pending" pattern. */
  function wireReelImageFallback() {
    document.addEventListener(
      "error",
      function (errorEvent) {
        var imageElement = errorEvent.target;
        if (!imageElement.matches || !imageElement.matches(".reel-card img")) {
          return;
        }
        var fullStillPath = imageElement.getAttribute("data-full-still");
        if (fullStillPath && imageElement.getAttribute("src") !== fullStillPath) {
          imageElement.setAttribute("src", fullStillPath);
        } else {
          imageElement.parentNode.classList.add("missing");
        }
      },
      true
    );
  }

  /* Video previews in the reels play on their own, but only while the card is
     on screen: a muted video is added as the card rolls into view, fades in
     over the still once it can play, and is removed (freeing its decoder) when
     the card leaves. Nothing loads before the page itself has finished, and
     visitors who ask for less motion or less data, or are on a very slow
     connection, keep the still images. */
  function wireReelMotion() {
    var motionThumbElements = document.querySelectorAll(".reel-card .thumb[data-reel-motion]");
    if (motionThumbElements.length === 0 || !("IntersectionObserver" in window)) {
      return;
    }
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var networkConnection = navigator.connection || {};
    var isSlowConnection =
      networkConnection.effectiveType === "slow-2g" || networkConnection.effectiveType === "2g";
    if (prefersReducedMotion || networkConnection.saveData || isSlowConnection) {
      return;
    }

    /* Video files that failed to load are not tried again. */
    var failedMotionPaths = {};

    function playMotion(thumbElement) {
      var motionPath = thumbElement.getAttribute("data-reel-motion");
      if (failedMotionPaths[motionPath] || thumbElement.querySelector("video")) {
        return;
      }
      var videoElement = document.createElement("video");
      videoElement.muted = true;
      videoElement.loop = true;
      videoElement.playsInline = true;
      videoElement.setAttribute("muted", "");
      videoElement.setAttribute("playsinline", "");
      videoElement.setAttribute("aria-hidden", "true");
      videoElement.addEventListener("playing", function () {
        videoElement.classList.add("is-playing");
      });
      videoElement.addEventListener("error", function () {
        failedMotionPaths[motionPath] = true;
        stopMotion(thumbElement);
      });
      videoElement.src = motionPath;
      thumbElement.appendChild(videoElement);
      var playAttempt = videoElement.play();
      if (playAttempt && playAttempt.catch) {
        /* Autoplay refused (for example in a battery saver mode): keep the still. */
        playAttempt.catch(function () {
          stopMotion(thumbElement);
        });
      }
    }

    function stopMotion(thumbElement) {
      var videoElement = thumbElement.querySelector("video");
      if (!videoElement) {
        return;
      }
      videoElement.pause();
      videoElement.removeAttribute("src");
      videoElement.load();
      thumbElement.removeChild(videoElement);
    }

    function startObserving() {
      var visibilityObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playMotion(entry.target);
          } else {
            stopMotion(entry.target);
          }
        });
      });
      Array.prototype.forEach.call(motionThumbElements, function (thumbElement) {
        visibilityObserver.observe(thumbElement);
      });
    }

    if (document.readyState === "complete") {
      startObserving();
    } else {
      window.addEventListener("load", startObserving);
    }
  }

  /* ------------------------------------------------------------ work page */

  function renderWorkPage() {
    var gridElement = document.querySelector("[data-work-grid]");
    if (!gridElement) {
      return;
    }
    var urlParameters = new URLSearchParams(window.location.search);
    var activeCategoryId = urlParameters.get("category") || "all";
    if (activeCategoryId !== "all" && !findCategory(activeCategoryId)) {
      activeCategoryId = "all";
    }
    var activeTag = urlParameters.get("tag") || "";
    if (activeTag && projectsWithTag(activeTag).length === 0) {
      activeTag = "";
    }

    var tabsElement = document.querySelector("[data-work-tabs]");
    if (tabsElement) {
      var tabItems = [{ id: "all", label: "All" }].concat(
        window.CATEGORIES || []
      );
      tabsElement.innerHTML = tabItems
        .map(function (tabItem) {
          return (
            '<a href="work.html' +
            (tabItem.id === "all" ? "" : "?category=" + tabItem.id) +
            '"' +
            (tabItem.id === activeCategoryId ? ' aria-current="true"' : "") +
            ">" +
            escapeHtml(tabItem.label) +
            "</a>"
          );
        })
        .join("");
    }

    var tagFilterElement = document.querySelector("[data-work-tags]");
    if (tagFilterElement) {
      tagFilterElement.innerHTML = tagsByFrequency()
        .filter(function (entry) {
          return entry.count >= 2 || entry.tag === activeTag;
        })
        .map(function (entry) {
          var isActive = entry.tag === activeTag;
          return (
            '<a href="work.html' +
            (isActive ? "" : "?tag=" + encodeURIComponent(entry.tag)) +
            '"' +
            (isActive ? ' aria-current="true"' : "") +
            ">" +
            escapeHtml(entry.tag) +
            '<span class="tag-count">' +
            entry.count +
            "</span></a>"
          );
        })
        .join("");
    }

    var headingElement = document.querySelector("[data-work-heading]");
    var blurbElement = document.querySelector("[data-work-blurb]");
    var activeCategory = findCategory(activeCategoryId);
    var visibleProjects = activeTag
      ? projectsWithTag(activeTag)
      : projectsInCategory(activeCategoryId);
    if (headingElement) {
      headingElement.textContent = activeTag
        ? "Tagged: " + activeTag
        : activeCategory
        ? activeCategory.label
        : "All work";
    }
    if (blurbElement) {
      blurbElement.textContent = activeTag
        ? visibleProjects.length +
          (visibleProjects.length === 1 ? " project" : " projects") +
          " across all categories."
        : activeCategory
        ? activeCategory.description || activeCategory.blurb
        : "Selected projects since 2022, across three threads of practice. Filter by category, or by tag to cut across them.";
    }

    renderCardGrid(gridElement, visibleProjects, {});
  }

  /* --------------------------------------------------------- lazy embeds */

  function activateEmbed(frameElement) {
    var embedUrl = frameElement.getAttribute("data-embed-url");
    if (!embedUrl || frameElement.querySelector("iframe")) {
      return;
    }
    var iframeElement = document.createElement("iframe");
    iframeElement.src = embedUrl;
    iframeElement.setAttribute("allow", "camera; microphone; fullscreen; accelerometer; gyroscope; xr-spatial-tracking");
    iframeElement.setAttribute("allowfullscreen", "");
    iframeElement.setAttribute("loading", "lazy");
    var coverElement = frameElement.querySelector(".embed-cover");
    if (coverElement) {
      coverElement.remove();
    }
    frameElement.appendChild(iframeElement);
  }

  function embedMarkup(embed, coverImage) {
    var coverStyle = coverImage
      ? ' style="background-image:url(' + escapeHtml(coverImage) + ')"'
      : "";
    return (
      '<div class="embed-frame" data-embed-url="' +
      escapeHtml(embed.url) +
      '">' +
      '<div class="embed-cover"' +
      coverStyle +
      "><span>" +
      escapeHtml(embed.label || "Run it here") +
      "</span></div>" +
      "</div>" +
      (embed.note ? '<p class="embed-note">' + escapeHtml(embed.note) + "</p>" : "")
    );
  }

  function youtubeMarkup(video) {
    var embedUrl =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(video.id) +
      "?autoplay=1&rel=0";
    var coverUrl =
      "https://img.youtube.com/vi/" + encodeURIComponent(video.id) + "/hqdefault.jpg";
    return (
      '<div class="embed-frame youtube-frame" data-embed-url="' +
      escapeHtml(embedUrl) +
      '">' +
      '<div class="embed-cover" style="background-image:url(' +
      escapeHtml(coverUrl) +
      ')"><span>&#9654;&nbsp; ' +
      escapeHtml(video.label || "Play on YouTube") +
      "</span></div>" +
      "</div>"
    );
  }

  function videoPendingMarkup(note) {
    return (
      '<div class="video-pending">' +
      '<div class="video-pending-label">Video pending</div>' +
      (note ? "<p>" + escapeHtml(note) + "</p>" : "") +
      "</div>"
    );
  }

  function motionImageInCard(cardElement) {
    return cardElement ? cardElement.querySelector("img[data-motion]") : null;
  }

  /* A motion preview is either an animated WebP, swapped into the <img>, or a
     silent H.264 video (much smaller for long or detailed clips), played in a
     <video> laid over the still and removed again afterwards. */
  function isVideoMotion(motionPath) {
    return /\.mp4$/i.test(motionPath || "");
  }

  function showMotion(imageElement) {
    if (!imageElement) {
      return;
    }
    var motionPath = imageElement.getAttribute("data-motion");
    if (!isVideoMotion(motionPath)) {
      if (imageElement.getAttribute("src") !== motionPath) {
        imageElement.setAttribute("src", motionPath);
      }
      return;
    }
    var thumbElement = imageElement.parentNode;
    if (thumbElement.querySelector("video")) {
      return;
    }
    var videoElement = document.createElement("video");
    videoElement.muted = true;
    videoElement.loop = true;
    videoElement.playsInline = true;
    videoElement.setAttribute("muted", "");
    videoElement.setAttribute("playsinline", "");
    videoElement.setAttribute("aria-hidden", "true");
    videoElement.addEventListener("playing", function () {
      videoElement.classList.add("is-playing");
    });
    videoElement.addEventListener("error", function () {
      showStill(imageElement);
    });
    videoElement.src = motionPath;
    thumbElement.appendChild(videoElement);
    var playAttempt = videoElement.play();
    if (playAttempt && playAttempt.catch) {
      playAttempt.catch(function () {
        showStill(imageElement);
      });
    }
  }

  function showStill(imageElement) {
    if (!imageElement) {
      return;
    }
    var videoElement = imageElement.parentNode.querySelector("video");
    if (videoElement) {
      videoElement.pause();
      videoElement.removeAttribute("src");
      videoElement.load();
      videoElement.parentNode.removeChild(videoElement);
    }
    if (imageElement.getAttribute("src") !== imageElement.getAttribute("data-still")) {
      imageElement.setAttribute("src", imageElement.getAttribute("data-still"));
    }
  }

  /* Every card with a motion preview plays it whenever the card is in view,
     on any device; the still only shows while the card is off screen, or for
     visitors who ask for less motion. */
  function wireMotionThumbs() {
    if (!("IntersectionObserver" in window)) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showMotion(entry.target);
          } else {
            showStill(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    var observeAll = function () {
      Array.prototype.forEach.call(document.querySelectorAll("img[data-motion]"), function (imageElement) {
        observer.observe(imageElement);
      });
    };
    observeAll();
    window.RQL_observeMotion = observeAll;
  }

  function wireEmbedCovers(rootElement) {
    var coverElements = rootElement.querySelectorAll(".embed-cover");
    Array.prototype.forEach.call(coverElements, function (coverElement) {
      coverElement.addEventListener("click", function () {
        activateEmbed(coverElement.parentNode);
      });
    });
  }

  /* -------------------------------------------------------- project page */

  function linkButtonMarkup(link) {
    return (
      '<a class="button" href="' +
      escapeHtml(link.url) +
      '" target="_blank" rel="noopener">' +
      escapeHtml(link.label) +
      "</a>"
    );
  }

  /* The prominent row under a project's summary: its live page first, then
     its videos on YouTube, then the source code. Links to github.com count
     as code; an embed's URL counts as a live page when no link has it. */
  function projectActions(project) {
    var liveActions = [];
    var codeActions = [];
    (project.links || []).forEach(function (link) {
      if (/github\.com/.test(link.url)) {
        codeActions.push({ kind: "code", url: link.url, label: link.label === "Code" ? "Source code" : link.label });
      } else {
        liveActions.push({ kind: "live", url: link.url, label: link.label === "Live" ? "Live site" : link.label });
      }
    });
    if (
      project.embed &&
      !liveActions.some(function (action) {
        return action.url === project.embed.url;
      })
    ) {
      liveActions.push({ kind: "live", url: project.embed.url, label: project.embed.label || "Run it" });
    }
    var videoActions = (project.youtube || []).map(function (video) {
      return {
        kind: "video",
        url: "https://www.youtube.com/watch?v=" + encodeURIComponent(video.id),
        label: video.label || "Video"
      };
    });
    return liveActions.concat(videoActions, codeActions);
  }

  function projectActionMarkup(action) {
    return (
      '<a class="project-action" data-kind="' +
      action.kind +
      '" href="' +
      escapeHtml(action.url) +
      '" target="_blank" rel="noopener">' +
      escapeHtml(action.label) +
      "</a>"
    );
  }

  function projectActionsMarkup(project) {
    var actions = projectActions(project);
    if (actions.length === 0) {
      return "";
    }
    return '<div class="project-actions">' + actions.map(projectActionMarkup).join("") + "</div>";
  }

  function galleryMarkup(galleryItems) {
    if (!galleryItems || galleryItems.length === 0) {
      return "";
    }
    return (
      '<div class="project-gallery">' +
      galleryItems
        .map(function (item) {
          return (
            "<figure>" +
            '<img loading="lazy" src="' +
            escapeHtml(item.src) +
            '" alt="' +
            escapeHtml(item.caption || "") +
            '">' +
            (item.caption
              ? "<figcaption>" + escapeHtml(item.caption) + "</figcaption>"
              : "") +
            "</figure>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  /* Related projects are the ones sharing the most tags with this one. Ties
     are broken by how specific the shared tags are: a tag carried by few
     projects says more about kinship than one carried by most of them. */
  function relatedProjectsMarkup(project) {
    var ownTags = project.tags || [];
    var allProjects = window.PROJECTS || [];
    var projectCountByTag = {};
    allProjects.forEach(function (candidate) {
      (candidate.tags || []).forEach(function (tag) {
        projectCountByTag[tag] = (projectCountByTag[tag] || 0) + 1;
      });
    });
    var scored = allProjects
      .filter(function (candidate) {
        return candidate.id !== project.id;
      })
      .map(function (candidate) {
        var sharedTags = (candidate.tags || []).filter(function (tag) {
          return ownTags.indexOf(tag) !== -1;
        });
        var sharedSpecificity = sharedTags.reduce(function (sum, tag) {
          return sum + 1 / projectCountByTag[tag];
        }, 0);
        return { project: candidate, sharedTagCount: sharedTags.length, sharedSpecificity: sharedSpecificity };
      })
      .filter(function (entry) {
        return entry.sharedTagCount >= 2;
      })
      .sort(function (first, second) {
        return (
          second.sharedTagCount - first.sharedTagCount ||
          second.sharedSpecificity - first.sharedSpecificity
        );
      })
      .slice(0, 3);
    if (scored.length === 0) {
      return "";
    }
    return (
      '<section class="container section related-projects">' +
      '<div class="section-header"><h2>Related by tag</h2></div>' +
      '<div class="card-grid">' +
      scored
        .map(function (entry) {
          return projectCardMarkup(entry.project, { maxTags: 3 });
        })
        .join("") +
      "</div></section>"
    );
  }

  function neighbourLinks(project) {
    var siblings = projectsInCategory(project.category);
    var position = siblings.indexOf(project);
    var previousProject = position > 0 ? siblings[position - 1] : null;
    var nextProject =
      position < siblings.length - 1 ? siblings[position + 1] : null;
    return (
      '<nav class="project-nav container">' +
      (previousProject
        ? '<a href="project.html?id=' +
          encodeURIComponent(previousProject.id) +
          '">&larr; ' +
          escapeHtml(previousProject.title) +
          "</a>"
        : "<span></span>") +
      (nextProject
        ? '<a href="project.html?id=' +
          encodeURIComponent(nextProject.id) +
          '">' +
          escapeHtml(nextProject.title) +
          " &rarr;</a>"
        : "<span></span>") +
      "</nav>"
    );
  }

  function renderProjectPage() {
    var rootElement = document.querySelector("[data-project-root]");
    if (!rootElement) {
      return;
    }
    var urlParameters = new URLSearchParams(window.location.search);
    var project = findProject(urlParameters.get("id"));
    if (!project) {
      rootElement.innerHTML =
        '<div class="container section"><h1>Not found</h1><p><a href="work.html">Back to work</a></p></div>';
      return;
    }
    document.title = project.title + " — Richard Qian Li";
    var category = findCategory(project.category);

    var heroMarkup =
      '<header class="project-hero container">' +
      '<div class="eyebrow">' +
      (category
        ? '<a href="work.html?category=' +
          category.id +
          '">' +
          escapeHtml(category.label) +
          "</a>"
        : "") +
      (project.year ? " · " + escapeHtml(project.year) : "") +
      (project.context ? " · " + escapeHtml(project.context) : "") +
      "</div>" +
      "<h1>" +
      escapeHtml(project.title) +
      "</h1>" +
      '<p class="lede">' +
      escapeHtml(project.summary) +
      "</p>" +
      projectActionsMarkup(project) +
      '<div class="tag-row">' +
      (project.tags || []).map(tagLinkMarkup).join("") +
      "</div>" +
      "</header>";

    // Every video, embed and hero image is one cell of the same two-column
    // grid as the gallery, so the frames line up and none is oversized.
    var mediaParts = [];
    var hasYoutube = project.youtube && project.youtube.length > 0;
    var youtubeParts = hasYoutube ? project.youtube.map(youtubeMarkup) : [];
    // Videos lead the page unless the project asks for them after the text.
    if (hasYoutube && !project.youtubeAtEnd) {
      mediaParts = mediaParts.concat(youtubeParts);
    }
    if (project.embed) {
      mediaParts.push(embedMarkup(project.embed, project.hero || project.thumb));
    }
    if (project.videoPending && !hasYoutube) {
      mediaParts.push(videoPendingMarkup(project.videoPending));
    }
    var heroImageMarkup = project.hero || project.thumb
      ? '<div class="project-media"><img src="' +
        escapeHtml(project.hero || project.thumb) +
        '" alt="' +
        escapeHtml(project.title) +
        '"></div>'
      : "";
    if (mediaParts.length === 0 || (project.hero && !project.embed)) {
      mediaParts.push(heroImageMarkup);
    }
    var mediaMarkup =
      '<div class="container"><div class="project-media-grid">' + mediaParts.join("") + "</div></div>";

    var copyPendingMarkup = project.copyPending
      ? '<div class="copy-pending">Copy pending: the text below is placeholder.</div>'
      : "";

    var bodyMarkup =
      '<div class="container"><div class="project-body" data-project-body>' +
      copyPendingMarkup +
      (project.body || "") +
      "</div>" +
      galleryMarkup(project.gallery) +
      "</div>" +
      (project.youtubeAtEnd && hasYoutube
        ? '<div class="container"><div class="project-media-grid">' + youtubeParts.join("") + "</div></div>"
        : "");

    rootElement.innerHTML =
      heroMarkup +
      mediaMarkup +
      bodyMarkup +
      relatedProjectsMarkup(project) +
      neighbourLinks(project);
    wireEmbedCovers(rootElement);

    if (project.fragment) {
      loadFragmentInto(
        rootElement.querySelector("[data-project-body]"),
        project.fragment
      );
    }
  }

  function loadFragmentInto(targetElement, fragmentPath) {
    fetch(fragmentPath)
      .then(function (response) {
        return response.text();
      })
      .then(function (fragmentHtml) {
        var wrapperElement = document.createElement("div");
        wrapperElement.innerHTML = fragmentHtml;
        var scriptElements = wrapperElement.querySelectorAll("script");
        Array.prototype.forEach.call(scriptElements, function (scriptElement) {
          scriptElement.remove();
        });
        var headingElements = wrapperElement.querySelectorAll("h1, h2");
        Array.prototype.forEach.call(headingElements, function (headingElement) {
          var replacement = document.createElement("h3");
          replacement.innerHTML = headingElement.innerHTML;
          headingElement.parentNode.replaceChild(replacement, headingElement);
        });
        targetElement.insertAdjacentHTML("beforeend", wrapperElement.innerHTML);
      })
      .catch(function (fetchError) {
        console.warn("Could not load fragment", fragmentPath, fetchError);
      });
  }

  /* --------------------------------------------------------- sketch page */

  /* A sketch card plays its clip (a recording of the sketch itself, made by
     tools/build_sketch_motion_pages.mjs) whenever it is in view, through the
     same wireMotionThumbs as the project cards. */

  function p5FullscreenUrl(sketchId) {
    return "https://editor.p5js.org/ludwig.peking/full/" + sketchId;
  }

  function p5EditorUrl(sketchId) {
    return "https://editor.p5js.org/ludwig.peking/sketches/" + sketchId;
  }

  function renderSketchPage() {
    var gridElement = document.querySelector("[data-sketch-grid]");
    if (!gridElement) {
      return;
    }
    var sketches = window.SKETCHES || [];
    gridElement.innerHTML = sketches
      .map(function (sketch, index) {
        return (
          '<button class="sketch-card" type="button" data-sketch-index="' +
          index +
          '">' +
          '<div class="thumb' +
          (sketch.motion ? " has-motion" : "") +
          '"><img loading="lazy" src="' +
          escapeHtml(sketch.thumb) +
          '" alt="' +
          escapeHtml(sketch.title) +
          '"' +
          (sketch.motion
            ? ' data-still="' + escapeHtml(sketch.thumb) + '" data-motion="' + escapeHtml(sketch.motion) + '"'
            : "") +
          "></div>" +
          '<div class="card-body">' +
          "<h3>" +
          escapeHtml(sketch.title) +
          "</h3>" +
          '<div class="card-meta">' +
          escapeHtml(sketch.year || "") +
          (sketch.note ? " · " + escapeHtml(sketch.note) : "") +
          "</div>" +
          "</div>" +
          "</button>"
        );
      })
      .join("");

    var viewerElement = document.querySelector(".sketch-viewer");
    if (!viewerElement) {
      return;
    }
    var titleElement = viewerElement.querySelector(".viewer-title");
    var editorLinkElement = viewerElement.querySelector("[data-viewer-editor]");
    var closeButton = viewerElement.querySelector("[data-viewer-close]");
    /* The iframe in the markup is only a template; each sketch gets a fresh
       one, removed again on close. The p5 editor page adds a history entry of
       its own shortly after it loads inside the iframe, which is why the Back
       button used to step the iframe instead of closing the viewer and left
       the page looking frozen. So the viewer pushes a history state of its
       own only after the editor's entry has appeared, keeping its state on
       top: Back then closes the viewer, and the removed iframe takes its
       entry with it. */
    var frameTemplate = viewerElement.querySelector("iframe");
    var frameAllow = frameTemplate.getAttribute("allow");
    var frameTitle = frameTemplate.getAttribute("title");
    frameTemplate.parentNode.removeChild(frameTemplate);
    var activeFrame = null;
    /* Measured: the editor adds its entry about 300 ms after the iframe loads. */
    var EDITOR_HISTORY_SETTLE_MILLISECONDS = 900;
    /* History entries the editor added underneath the viewer's own state; they
       belong to the removed iframe once the viewer closes, and are skipped
       so that one more Back leaves the page instead of doing nothing. */
    var editorEntryCount = 0;
    var historyLengthAtOpen = 0;

    function viewerStateIsOnTop() {
      return Boolean(window.history.state && window.history.state.sketchViewer);
    }

    function openSketch(sketch) {
      titleElement.textContent = sketch.title;
      editorLinkElement.href = p5EditorUrl(sketch.id);
      if (activeFrame) {
        viewerElement.removeChild(activeFrame);
      }
      var frame = document.createElement("iframe");
      frame.setAttribute("allow", frameAllow);
      frame.setAttribute("title", frameTitle);
      frame.addEventListener("load", function () {
        window.setTimeout(function () {
          if (frame === activeFrame && viewerElement.classList.contains("open") && !viewerStateIsOnTop()) {
            editorEntryCount = Math.max(0, window.history.length - historyLengthAtOpen);
            window.history.pushState({ sketchViewer: true }, "");
          }
        }, EDITOR_HISTORY_SETTLE_MILLISECONDS);
      });
      if (!viewerStateIsOnTop()) {
        historyLengthAtOpen = window.history.length;
      }
      frame.src = p5FullscreenUrl(sketch.id);
      activeFrame = frame;
      viewerElement.appendChild(frame);
      viewerElement.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeViewer() {
      viewerElement.classList.remove("open");
      if (activeFrame) {
        viewerElement.removeChild(activeFrame);
        activeFrame = null;
      }
      document.body.style.overflow = "";
    }

    /* Close through the history when the viewer's own entry is on top, so the
       Back button and the Close button leave the history in the same state. */
    function requestClose() {
      if (viewerStateIsOnTop()) {
        window.history.back();
      } else {
        closeViewer();
      }
    }

    window.addEventListener("popstate", function () {
      if (!viewerElement.classList.contains("open")) {
        return;
      }
      closeViewer();
      if (editorEntryCount > 0) {
        var entriesToSkip = editorEntryCount;
        editorEntryCount = 0;
        window.history.go(-entriesToSkip);
      }
    });

    gridElement.addEventListener("click", function (clickEvent) {
      var cardElement = clickEvent.target.closest(".sketch-card");
      if (!cardElement) {
        return;
      }
      openSketch(sketches[Number(cardElement.getAttribute("data-sketch-index"))]);
    });
    closeButton.addEventListener("click", requestClose);
    document.addEventListener("keydown", function (keyEvent) {
      if (keyEvent.key === "Escape" && viewerElement.classList.contains("open")) {
        requestClose();
      }
    });
  }

  /* ---------------------------------------------------------- email links */

  /* A mailto link does nothing on a computer without a mail app, which is
     most desktops (people use webmail). On desktop, clicking an email link
     copies the address and shows it on the link instead. Phones always have
     a mail app, so there the link opens it as usual. */
  function wireEmailLinks() {
    var isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      return;
    }
    var emailLinkElements = document.querySelectorAll('a[href^="mailto:"]');
    Array.prototype.forEach.call(emailLinkElements, function (linkElement) {
      var emailAddress = linkElement.getAttribute("href").replace("mailto:", "");
      /* A link with an icon keeps its label in a span, so the icon survives. */
      var labelElement = linkElement.querySelector("[data-email-label]") || linkElement;
      var originalLabel = labelElement.textContent;
      var restoreTimer = null;
      linkElement.setAttribute("title", "Click to copy " + emailAddress);

      function showLabel(labelText, restoreAfterMilliseconds) {
        labelElement.textContent = labelText;
        window.clearTimeout(restoreTimer);
        if (restoreAfterMilliseconds) {
          restoreTimer = window.setTimeout(function () {
            labelElement.textContent = originalLabel;
          }, restoreAfterMilliseconds);
        }
      }

      linkElement.addEventListener("click", function (clickEvent) {
        clickEvent.preventDefault();
        if (!navigator.clipboard) {
          showLabel(emailAddress, 0);
          return;
        }
        navigator.clipboard.writeText(emailAddress).then(
          function () {
            showLabel("Copied: " + emailAddress, 4000);
          },
          function () {
            /* Copy refused: leave the address visible so it can be selected. */
            showLabel(emailAddress, 0);
          }
        );
      });
    });
  }

  /* --------------------------------------------------------------- boot */

  applyStoredTheme();

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    renderProjectReels();
    wireProjectReels();
    wireReelImageFallback();
    wireReelMotion();
    renderWorkPage();
    renderProjectPage();
    renderSketchPage();
    wireEmbedCovers(document);
    wireMotionThumbs();
    wireEmailLinks();
  });

  window.RQL = {
    projectCardMarkup: projectCardMarkup,
    renderCardGrid: renderCardGrid,
    embedMarkup: embedMarkup,
    escapeHtml: escapeHtml
  };
})();
