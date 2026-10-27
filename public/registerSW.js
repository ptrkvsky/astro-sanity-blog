// Ancien script d'enregistrement du SW : ne réenregistre plus rien et retire les SW existants.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => registrations.forEach((r) => r.unregister()));
}
