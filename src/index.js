import './css/styles.css';
import fetch from './js/fetchCountries.js';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/name/';

const inputEl = document.querySelector('#search-box');
const countriesListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  const inputText = evt.target.value.trim();
  if (!inputText) {
    countriesListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
  }

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
    .then(countries => setCountries(countries))
    .catch(error => {
      console.log(error);
      countriesListEl.innerHTML = '';
      countryInfoEl.innerHTML = '';
    });
}

function setCountries(countries) {
  const arrLength = countries.length;

  if (arrLength > 10) {
    countriesListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (arrLength > 1 && arrLength <= 10) {
    countryInfoEl.innerHTML = '';
    countryInfoEl.style.display = 'none';

    countriesListEl.style.display = 'flex';
    countriesListEl.style.flexDirection = 'column';

    return (countriesListEl.innerHTML = markupList(countries));
  }

  if (arrLength === 1) {
    countriesListEl.innerHTML = '';
    countriesListEl.style.display = 'none';
    countryInfoEl.style.display = 'flex';

    return (countryInfoEl.innerHTML = markupInfo(countries));
  }
}

function markupList(arrCountries) {
  const markup = arrCountries
    .map(
      ({ flags: { svg, alt }, name: { official } }) =>
        `<li class="country-list__item">
        <img class="country-list__image" src="${svg}" alt="${alt}" width="20">
        <p class="country-list__text">${official}</p>
      </li>`
    )
    .join('');
  return markup;
}

function markupInfo(arrCountries) {
  const {
    flags: { svg, alt },
    name: { official },
    capital,
    population,
    languages,
  } = arrCountries[0];

  const capitalString = capital.join(', ');
  const languagesString = Object.values(languages).join(', ');

  const markup = `<div class="title-container">
      <img class="title-img" src="${svg}" alt="${alt}" width="100">
      <h2 class="title-info">${official}</h2>
    </div>
    <ul class="list-info">
      <li class="list-info__item"><span class="list-info__property">Capital: </span>${capitalString}</li>
      <li class="list-info__item"><span class="list-info__property">Population: </span>${population}</li>
      <li class="list-info__item"><span class="list-info__property">Languages: </span>${languagesString}</li>
    </ul>`;
  return markup;
}
