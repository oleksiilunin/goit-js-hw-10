import './css/styles.css';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/name/';

const inputEl = document.querySelector('#search-box');
const countriesListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', onInput);

function onInput(evt) {
  console.dir(evt.target);
  const inputText = evt.target.value;
  if (inputText) {
    const URL = `${BASE_URL}${inputText}`;
    fetchCountries(URL);
  }
}

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
    .then(countries => {
      console.log('FETCH:', countries), setCountries(countries);
    })
    .catch(error => {
      console.log(error);
      countriesListEl.innerHTML = '';
      //   Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function setCountries(countries) {
  const arrLength = countries.length;

  if (arrLength > 10) {
    countriesListEl.innerHTML = '';
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (arrLength > 1 && arrLength <= 10) {
    countryInfoEl.innerHTML = '';
    return (countriesListEl.innerHTML = markupList(countries));
  }

  if (arrLength === 1) {
    countriesListEl.innerHTML = '';
    return (countryInfoEl.innerHTML = markupInfo(countries));
  }
}

function markupList(arrCountries) {
  const markup = arrCountries
    .map(
      ({ flags: { png, alt }, name: { common } }) =>
        `<li>
        <img src="${png}" alt="${alt}" width=50>
        <p>${common}</p>
      </li>`
    )
    .join('');
  return markup;
}

function markupInfo(arrCountries) {
  const {
    flags: { png, alt },
    name: { common },
    capital,
    population,
    languages,
  } = arrCountries[0];

  const capitalString = capital.join(', ');
  const languagesString = Object.values(languages).join(', ');

  const markup = `<div class="title-container">
      <img class="title-img" src="${png}" alt="${alt}" />
      <h2 class="title-info">${common}</h2>
    </div>
    <ul class="list-info">
      <li><span class="list-info__property">Capital: </span>${capitalString}</li>
      <li><span class="list-info__property">Population: </span>${population}</li>
      <li><span class="list-info__property">Languages: </span>${languagesString}</li>
    </ul>`;
  return markup;
}
