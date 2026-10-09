(function () {
  if (location.hash === '#main-content' || location.hash === '#citation') {
    history.replaceState(null, '', location.pathname + location.search);
  }

  var citationButton = document.getElementById('scroll-to-citation');
  var citationSection = document.getElementById('citation');
  if (citationButton && citationSection) {
    citationButton.addEventListener('click', function () {
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
      citationSection.scrollIntoView({ behavior: 'auto' });
    });
  }

  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var imageTrigger = document.querySelector('.publication-image-trigger');
  var imageLightbox = document.getElementById('icon-lightbox');
  var imageLightboxClose = document.querySelector('.image-lightbox-close');
  var heroVideos = document.querySelectorAll('.publication-hero-image, #icon-lightbox video');
  heroVideos.forEach(function (video) {
    video.defaultPlaybackRate = 0.5;
    video.playbackRate = 0.5;
    video.addEventListener('loadedmetadata', function () {
      video.playbackRate = 0.5;
    }, { once: true });
  });
  if (imageTrigger && imageLightbox) {
    var lightboxImage = imageLightbox.querySelector('video');
    var closingLightbox = false;
    var lightboxDuration = 610;
    function imageRect(element) {
      var rect = element.getBoundingClientRect();
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }
    function setLightboxImageRect(rect) {
      lightboxImage.style.left = rect.left + 'px';
      lightboxImage.style.top = rect.top + 'px';
      lightboxImage.style.width = rect.width + 'px';
      lightboxImage.style.height = rect.height + 'px';
    }
    function closeLightboxWithTransition() {
      if (closingLightbox || !imageLightbox.open) return;
      closingLightbox = true;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        imageLightbox.close();
        lightboxImage.pause();
        closingLightbox = false;
        return;
      }
      imageLightbox.classList.remove('is-visible');
      setLightboxImageRect(imageRect(imageTrigger.querySelector('video')));
      window.setTimeout(function () {
        imageLightbox.close();
        lightboxImage.pause();
        closingLightbox = false;
      }, lightboxDuration);
    }
    imageTrigger.addEventListener('click', function () {
      var triggerVideo = imageTrigger.querySelector('video');
      var originRect = imageRect(triggerVideo);
      setLightboxImageRect(originRect);
      if (lightboxImage.readyState > 0) {
        try { lightboxImage.currentTime = triggerVideo.currentTime; } catch (error) {}
      }
      imageLightbox.showModal();
      var aspect = lightboxImage.videoWidth && lightboxImage.videoHeight
        ? lightboxImage.videoWidth / lightboxImage.videoHeight
        : 800 / 384;
      var playPromise = lightboxImage.play();
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(function () {});
      var pageWidth = document.querySelector('.publication-header .container.is-max-desktop').getBoundingClientRect().width;
      var targetWidth = Math.min(pageWidth, window.innerWidth * .9, window.innerHeight * .82 * aspect);
      var targetHeight = targetWidth / aspect;
      var targetRect = {
        left: (window.innerWidth - targetWidth) / 2,
        top: (window.innerHeight - targetHeight) / 2,
        width: targetWidth,
        height: targetHeight
      };
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          imageLightbox.classList.add('is-visible');
          setLightboxImageRect(targetRect);
        });
      });
    });
    if (imageLightboxClose) {
      imageLightboxClose.addEventListener('click', function () {
        closeLightboxWithTransition();
      });
    }
    imageLightbox.addEventListener('click', function (event) {
      if (event.target === imageLightbox) closeLightboxWithTransition();
    });
    imageLightbox.addEventListener('cancel', function (event) {
      event.preventDefault();
      closeLightboxWithTransition();
    });
  }

  var methodAnimation = document.querySelector('.method-animation');
  if (methodAnimation) {
    var frames = Array.from(methodAnimation.querySelectorAll('.method-frame'));
    var steps = Array.from(methodAnimation.querySelectorAll('.method-steps article'));
    var pauseMethod = methodAnimation.querySelector('.method-pause');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var frameDurations = [1700, 2100, 2100, 1400, 1400, 2100];
    var frameSteps = [0, 0, 1, 2, 2, 2];
    var methodTimer;
    var methodVisible = false;
    var methodReady = false;
    var methodPaused = false;
    var frameIndex = 0;

    function showMethodFrame(index) {
      var nextFrame = frames[index];
      var currentFrame = frames.find(function (frame) { return frame.classList.contains('is-current'); });
      function commitFrame() {
        frames.forEach(function (frame, i) {
          frame.classList.remove('is-entering', 'is-entering-active');
          frame.classList.toggle('is-current', i === index);
          frame.setAttribute('aria-hidden', String(i !== index));
        });
      }
      if (!currentFrame || currentFrame === nextFrame || reducedMotion.matches) {
        commitFrame();
      } else {
        nextFrame.classList.add('is-entering');
        nextFrame.setAttribute('aria-hidden', 'false');
        nextFrame.addEventListener('animationend', function finishEntering(event) {
          if (event.target !== nextFrame) return;
          commitFrame();
        }, { once: true });
        requestAnimationFrame(function () { nextFrame.classList.add('is-entering-active'); });
      }
      steps.forEach(function (step, i) {
        step.classList.toggle('is-revealed', i <= frameSteps[index]);
      });
    }
    function advanceMethod() {
      showMethodFrame(frameIndex);
      methodTimer = window.setTimeout(function () {
        frameIndex = (frameIndex + 1) % frames.length;
        advanceMethod();
      }, frameDurations[frameIndex]);
    }
    function syncMethodPlayback() {
      window.clearTimeout(methodTimer);
      if (!methodReady) return;
      if (reducedMotion.matches) {
        methodAnimation.classList.remove('is-playing');
        showMethodFrame(frames.length - 1);
        pauseMethod.hidden = true;
        return;
      }
      pauseMethod.hidden = false;
      if (!methodVisible || document.hidden || methodPaused) return;
      methodAnimation.classList.add('is-playing');
      advanceMethod();
    }
    pauseMethod.addEventListener('click', function () {
      methodPaused = !methodPaused;
      pauseMethod.classList.toggle('is-paused', methodPaused);
      pauseMethod.setAttribute('aria-label', methodPaused ? 'Play animation' : 'Pause animation');
      syncMethodPlayback();
    });
    reducedMotion.addEventListener('change', syncMethodPlayback);
    document.addEventListener('visibilitychange', syncMethodPlayback);
    var methodObserver = new IntersectionObserver(function (entries) {
      methodVisible = entries[0].isIntersecting;
      syncMethodPlayback();
    }, { threshold: 0.15 });
    methodObserver.observe(methodAnimation);
    Promise.all(frames.map(function (frame) { return frame.decode(); })).then(function () {
      methodReady = true;
      syncMethodPlayback();
    }).catch(function () {
      // Keep the final diagram and all three descriptions as a static fallback.
    });
  }

  var navigation = performance.getEntriesByType('navigation')[0];
  if (navigation && navigation.type === 'reload') {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.addEventListener('pageshow', function () {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      requestAnimationFrame(function () {
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = '';
        if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      });
    });
  }

  var button = document.getElementById('copy-citation');
  var citation = document.getElementById('bibtex');
  var status = document.getElementById('copy-status');
  if (!button || !citation || !navigator.clipboard) return;
  button.hidden = false;
  button.addEventListener('click', function () {
    navigator.clipboard.writeText(citation.textContent).then(function () {
      status.textContent = 'Citation copied.';
    }).catch(function () {
      status.textContent = 'Unable to copy automatically. Select and copy the citation above.';
    });
  });
}());
