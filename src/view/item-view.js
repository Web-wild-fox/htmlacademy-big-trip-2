import {createElement} from '../render.js';
import {humanizeTaskDueDate} from '../utils.js';
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  TIME_FORMAT
} from '../constants.js';

const isFavoritePoint = (favorite) => Boolean(favorite);

const getFavoriteClassName = (favorite) => isFavoritePoint(favorite)
  ? '--active'
  : '';

const createOffersTemplate = (offers) => offers.map(({title, price}) => `
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`)
  .join('');

function createItemTemplate(points, destinations, offers) {
  const {
    type,
    basePrice,
    dateFrom,
    dateTo,
    isFavorite
  } = points;
  const {name} = destinations;
  const date = humanizeTaskDueDate(dateFrom, DATE_FORMAT);
  const dateTime = humanizeTaskDueDate(dateFrom, DATE_TIME_FORMAT);
  const timeFrom = humanizeTaskDueDate(dateFrom, TIME_FORMAT);
  const timeTo = humanizeTaskDueDate(dateTo, TIME_FORMAT);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateTime}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
        </div>
        <h3 class="event__title">${type} ${name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${timeTo}</time>
          </p>
          <p class="event__duration">30M</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(offers)}
        </ul>
        <button class="event__favorite-btn event__favorite-btn${getFavoriteClassName(isFavorite)}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class ItemView {
  constructor({points, destinations, offers}) {
    this.points = points;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createItemTemplate(
      this.points,
      this.destinations,
      this.offers
    );
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
