import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../constants.js';

const ListEmptyTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

function createListEmptyTemplate(filterType) {
  const ListEmptyTextValue = ListEmptyTextType[filterType];

  return `<p class="trip-events__msg">${ListEmptyTextValue}</p>`;
}

export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyTemplate(this.#filterType);
  }
}
