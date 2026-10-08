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
    imageTrigger.addEventListener('click', function () {
      imageLightbox.showModal();
    });
    if (imageLightboxClose) {
      imageLightboxClose.addEventListener('click', function () {
        imageLightbox.close();
      });
    }
    imageLightbox.addEventListener('click', function (event) {
      if (event.target === imageLightbox) imageLightbox.close();
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
