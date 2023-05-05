function fetchCountries(name) {
  fetch(name)
    .then(response => {
      if (!response.ok) {
        throw new Error(
          response.statusText,
          Notiflix.Notify.failure('Oops, there is no country with that name')
        );
      }
      return response.json();
    })
    .then(countries => setCountries(countries))
    .catch(error => {
      console.log(error);
      countriesListEl.innerHTML = '';
      countryInfoEl.innerHTML = '';
    });
}

export { fetch };
