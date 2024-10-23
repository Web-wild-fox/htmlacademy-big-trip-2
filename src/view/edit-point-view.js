import AbstractView from '../framework/view/abstract-view.js';
import {humanizeTaskDueDate} from '../utils/task.js';
import {
  FULL_DATE_FORMAT,
  DEFAULT_POINT_COUNT,
  EDIT_POINT_BUTTON_TEXT,
  NEW_POINT_BUTTON_TEXT
} from '../constants.js';

const getDefaultPoint = (offers) => ({
  basePrice: 0,
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: offers[DEFAULT_POINT_COUNT].type,
});

const getDefaultDestination = () => ({
  description: '',
  name: '',
  pictures: []
});

const createEventItemTemplate = (offers, checkedType) =>
  offers.map(({type}) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden"  type="radio" name="event-type" value="${type}" ${checkedType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}"  for="event-type-${type}-1">${type}</label>
    </div>`
  ).join('');

const createDestinationItemTemplate = (destinations) =>
  destinations.map(({name}) =>
    `<option value="${name}"></option>`
  ).join('');

const createOfferItemTemplate = (offersByType, point, type) =>
  offersByType.offers.map(({id, title, price}) => {
    const isChecked = point.offers.includes(id)
      ? 'checked'
      : '';

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${type}-${id}" ${isChecked}/>
        <label class="event__offer-label" for="event-offer-${id}">
          <span class="event__offer-title">${title} ${id}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join('');

const createOffersContainerTemplate = (offers, point, type) => {
  const offersByType = offers.find((offer) => offer.type === type);

  if (!offersByType.offers.length) {
    return '';
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createOfferItemTemplate(offersByType, point, type)}
      </div>
    </section>`
  );
};

const createDescriptionItemTemplate = (description) => {
  if (!description) {
    return '';
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>`
  );
};

const createImageItemTemplate = (images) => {
  if (!images.length) {
    return '';
  }

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${images.map(({src}) =>`<img class="event__photo" src="${src}" alt="Event photo">`)
      .join('')}
      </div>
    </div>`
  );
};

const createDestinationContainerTemplate = (description, pictures) => {
  if (!description && !pictures.length) {
    return '';
  }

  return (
    `<section class="event__section  event__section--destination">
      ${createDescriptionItemTemplate(description)}
      ${createImageItemTemplate(pictures)}
    </section>`
  );
};

const createRollupButtonTemplate = (isEditMode) => {
  if (!isEditMode) {
    return '';
  }

  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );
};

const getResetButtonText = (isEditMode) =>
  isEditMode
    ? EDIT_POINT_BUTTON_TEXT
    : NEW_POINT_BUTTON_TEXT;

function createEditPointTemplate(
  point,
  destination,
  destinations,
  offers,
  isEditMode) {
  if (!isEditMode) {
    point = getDefaultPoint(offers);
    destination = getDefaultDestination();
  }

  const {
    id,
    type,
    basePrice,
    dateFrom,
    dateTo
  } = point;
  const {
    name,
    description,
    pictures
  } = destination;
  const eventStartTime = humanizeTaskDueDate(dateFrom, FULL_DATE_FORMAT);
  const eventEndTime = humanizeTaskDueDate(dateTo, FULL_DATE_FORMAT);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventItemTemplate(offers, type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
            <datalist id="destination-list-${id}">
              ${createDestinationItemTemplate(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${eventStartTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${eventEndTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">
            ${getResetButtonText(isEditMode)}
          </button>
          ${createRollupButtonTemplate(isEditMode)}
        </header>
        <section class="event__details">

          ${createOffersContainerTemplate(offers, point, type)}

          ${createDestinationContainerTemplate(description, pictures)}
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractView {
  #point = null;
  #destination = null;
  #destinations = null;
  #offers = null;
  #isEditMode = null;
  #handleFormSubmit = null;

  constructor({point, destination, destinations, offers, isEditMode, onFormSubmit}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#isEditMode = isEditMode;
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formSubmitHandler);
  }

  get template() {
    return createEditPointTemplate(
      this.#point,
      this.#destination,
      this.#destinations,
      this.#offers,
      this.#isEditMode
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
