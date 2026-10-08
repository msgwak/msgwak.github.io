(function () {
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
