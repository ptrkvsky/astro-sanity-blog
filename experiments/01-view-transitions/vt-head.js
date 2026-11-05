// Script classique (non module), chargé en <head> sans defer : `pagereveal` doit
// être écouté avant le premier rendu de la nouvelle page. Il ne fait que deux
// choses facultatives : appliquer la durée choisie et mesurer la transition.
(function () {
  try {
    var d = sessionStorage.getItem('vtDur');
    if (d) document.documentElement.style.setProperty('--vt-dur', d + 'ms');
  } catch (e) {}
  window.__vt = { api: 'onpagereveal' in window, last: null };
  addEventListener('pagereveal', function (e) {
    if (!e.viewTransition) return;
    var t0 = performance.now();
    e.viewTransition.finished.then(function () {
      window.__vt.last = Math.round(performance.now() - t0);
      try { sessionStorage.setItem('vtLast', window.__vt.last); } catch (err) {}
      document.dispatchEvent(new CustomEvent('vt:measured'));
    });
  });
})();
