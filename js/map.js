'use strict';

var AVATAR = {
  imgNumbers: ['01', '02', '03', '04', '05', '06', '07', '08'],
  path: 'img/avatars/user',
  extention: '.png'
};
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var PRICE = {
  min: 1000,
  max: 1000000
};
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOM = {
  min: 1,
  max: 5
};
var GUEST = {
  min: 1,
  max: 10
};
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = '';
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var LOCATION = {
  minX: 300,
  maxX: 900,
  minY: 130,
  maxY: 630
};
var COUNT_OF_ADS = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var HOUSING_TYPE = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};
var MAIN_MAP_PIN_WIDTH = 65;
var MAIN_MAP_PIN_HEIGHT = 65;

var ads = [];
var fragment = document.createDocumentFragment();
var map = document.querySelector('.map');
var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var mapCard = mapCardTemplate.cloneNode(true);
var popupCloseButton = mapCard.querySelector('.popup__close');
var mapPins = document.querySelector('.map__pins');
var mainMapPin = mapPins.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var adFormFieldset = adForm.querySelectorAll('fieldset');
var mapFilters = document.querySelector('.map__filters');
var addressInput = adForm.querySelector('#address');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getRandomUniqueItem = function (array) {
  var index = getRandomInt(0, array.length - 1);
  var randomResult = array[index];
  array.splice(index, 1);
  return randomResult;
};

var getRandomItem = function (array) {
  return array[Math.floor((Math.random() * array.length))];
};

function shuffle(array) {
  var j;
  var temp;
  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
}

var resizeArray = function (array) {
  var newArray = [];
  var arrayLength = array.length;
  var newArrayLength = getRandomInt(1, arrayLength);
  for (var i = 0; i < newArrayLength; i++) {
    newArray[i] = array[i];
  }
  return newArray;
};

var getAd = function () {
  var ad = {
    author: {
      avatar: AVATAR.path + getRandomUniqueItem(AVATAR.imgNumbers) + AVATAR.extention
    },
    offer: {
      title: getRandomUniqueItem(TITLES),
      price: getRandomInt(PRICE.min, PRICE.max),
      type: getRandomItem(TYPES),
      rooms: getRandomInt(ROOM.min, ROOM.max),
      guests: getRandomInt(GUEST.min, GUEST.max),
      checkin: getRandomItem(CHECKINS),
      checkout: getRandomItem(CHECKOUTS),
      features: resizeArray(FEATURES),
      description: DESCRIPTION,
      photos: shuffle(PHOTOS)
    },
    location: {
      x: getRandomInt(LOCATION.minX, LOCATION.maxX),
      y: getRandomInt(LOCATION.minY, LOCATION.maxY)
    }
  };
  ad.offer.address = ad.location.x + ', ' + ad.location.y;
  return ad;
};

var showMap = function () {
  return map.classList.remove('map--faded');
};

var createAds = function () {
  var titles = shuffle(TITLES);
  var imageNumbers = shuffle(AVATAR.imgNumbers);
  for (var i = 0; i < COUNT_OF_ADS; i++) {
    ads[i] = getAd(titles[i], imageNumbers[i]);
  }
  return ads;
};

var drawFeaturesList = function (ad) {
  var featuresList = mapCard.querySelector('.popup__features');
  featuresList.innerHTML = '';

  var featuresItem = document.createElement('li');
  featuresItem.classList.add('popup__feature');
  for (var i = 0; i < ad.offer.features.length; i++) {
    var innerItem = featuresItem.cloneNode(true);
    innerItem.classList.add('popup__feature--' + ad.offer.features[i]);
    fragment.appendChild(innerItem);
  }
  featuresList.appendChild(fragment);
};

var drawPhotosList = function (ad) {
  var photosList = mapCard.querySelector('.popup__photos');
  var photoItem = photosList.querySelector('.popup__photo');

  for (var i = 0; i < ad.offer.photos.length; i++) {
    var innerPhotoItem = photoItem.cloneNode(true);
    innerPhotoItem.src = ad.offer.photos[i];
    fragment.appendChild(innerPhotoItem);
  }

  photosList.innerHTML = '';
  photosList.appendChild(fragment);
};

var createCard = function (ad) {
  mapCard.querySelector('.popup__title').textContent = ad.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = HOUSING_TYPE[ad.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  mapCard.querySelector('.popup__description').textContent = ad.offer.description;
  mapCard.querySelector('.popup__avatar').src = ad.author.avatar;

  drawFeaturesList(ad);
  drawPhotosList(ad);
  return mapCard;
};

var drawPinElement = function () {
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  for (var i = 0; i < ads.length; i++) {
    var pinElement = mapPinTemplate.cloneNode(true);
    pinElement.style.left = (ads[i].location.x - PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (ads[i].location.y - PIN_HEIGHT) + 'px';
    pinElement.querySelector('img');
    var img = pinElement.querySelector('img');
    img.src = ads[i].author.avatar;
    img.alt = ads[i].offer.title;
    pinElement.setAttribute('id', i);
    fragment.appendChild(pinElement);
  }
};

var drawPins = function () {
  drawPinElement();
  mapPins.appendChild(fragment);
  return fragment;
};

var drawCard = function () {
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  return map.insertBefore(mapCard, mapFiltersContainer);
};

mapPins.addEventListener('click', function (e) {
  var target = e.target.tagName.toLowerCase() === 'img' ? e.target.parentNode : e.target;
  if (target.classList.contains('map__pin') && !target.classList.contains('map__pin--main')) {
    var createdCard = createCard(ads[target.id]);
    drawCard(createdCard);
    mapCard.classList.remove('hidden');
  }
});

var deactivateMap = function () {
  for (var i = 0; i < adFormFieldset.length; i++) {
    adFormFieldset[i].setAttribute('disabled', 'disabled');
  }

  for (i = 0; i < mapFilters.length; i++) {
    mapFilters[i].setAttribute('disabled', 'disabled');
  }
};

var hideCard = function () {
  mapCard.classList.add('hidden');
};

popupCloseButton.addEventListener('click', hideCard);

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
    hideCard();
  }
});

var fillAddress = function () {
  var mainMapPinTop = parseInt(mainMapPin.style.top, 10);
  var mainMapPinLeft = parseInt(mainMapPin.style.left, 10);
  var address = Math.round(mainMapPinLeft + MAIN_MAP_PIN_WIDTH / 2) + ', ' + Math.round(mainMapPinTop + MAIN_MAP_PIN_HEIGHT / 2);
  addressInput.value = address;
};

mainMapPin.addEventListener('mouseup', function () {
  showMap();
  adForm.classList.remove('ad-form--disabled');

  for (var i = 0; i < mapFilters.length; i++) {
    mapFilters[i].removeAttribute('disabled');
  }
  for (i = 0; i < adFormFieldset.length; i++) {
    adFormFieldset[i].removeAttribute('disabled');
  }

  drawPins();
});

deactivateMap();
createAds();
fillAddress();
