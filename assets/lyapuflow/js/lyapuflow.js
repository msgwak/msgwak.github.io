(function () {
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
