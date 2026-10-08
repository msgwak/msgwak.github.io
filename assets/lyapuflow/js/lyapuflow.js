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
  if (imageTrigger && imageLightbox) {
    var lightboxImage = imageLightbox.querySelector('img');
    var closingLightbox = false;
    var lightboxDuration = 460;
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
        closingLightbox = false;
        return;
      }
      imageLightbox.classList.remove('is-visible');
      setLightboxImageRect(imageRect(imageTrigger.querySelector('img')));
      window.setTimeout(function () {
        imageLightbox.close();
        closingLightbox = false;
      }, lightboxDuration);
    }
    imageTrigger.addEventListener('click', function () {
      var originRect = imageRect(imageTrigger.querySelector('img'));
      setLightboxImageRect(originRect);
      imageLightbox.showModal();
      var aspect = lightboxImage.naturalWidth / lightboxImage.naturalHeight;
      var targetWidth = Math.min(window.innerWidth * .9, window.innerHeight * .82 * aspect);
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
