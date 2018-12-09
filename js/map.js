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
var ads = [];
var countOfAds = 8;


function getRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getRandomUnique = function (array) {
  var index = getRange(0, array.length - 1);
  var randomResult = array[index];
  array.splice(index, 1);
  return randomResult;
};

var getRandom = function (array) {
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

var getRandomArrayLength = function (array) {
  var newArray = [];
  var arrayLength = array.length;
  var newArrayLength = getRange(1, arrayLength);
  for (var i = 0; i < newArrayLength; i++) {
    newArray[i] = array[i];
  }
  return newArray;
};


var getAd = function () {
  var ad = {
    author: {
      avatar: AVATAR.path + getRandomUnique(AVATAR.imgNumbers) + AVATAR.extention
    },
    offer: {
      title: getRandomUnique(TITLES),
      price: getRange(PRICE.min, PRICE.max),
      type: getRandom(TYPES),
      rooms: getRange(ROOM.min, ROOM.max),
      guests: getRange(GUEST.min, GUEST.max),
      checkin: getRandom(CHECKINS),
      checkout: getRandom(CHECKOUTS),
      features: getRandomArrayLength(FEATURES),
      description: DESCRIPTION,
      photos: shuffle(PHOTOS)
    },
    location: {
      x: getRange(LOCATION.minX, LOCATION.maxX),
      y: getRange(LOCATION.minY, LOCATION.maxY)
    }
  };
  ad.offer.address = ad.location.x + ', ' + ad.location.y;
  return ad;
};

var showMap = function () {
  var map = document.querySelector('.map');
  return map.classList.remove('map--faded');
};


var createAds = function () {
  var titles = shuffle(TITLES);
  var imageNumbers = shuffle(AVATAR.imgNumbers);
  for (var i = 0; i < countOfAds; i++) {
    ads[i] = getAd(titles[i], imageNumbers[i]);
  }
  return ads;
};
createAds();


var drawPins = function () {
  var mapPins = document.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  for (var j = 0; j < ads.length; j++) {
    var pinElement = mapPinTemplate.cloneNode(true);
    var pinWidth = 50;
    var pinHeight = 70;
    pinElement.style.left = (ads[j].location.x - pinWidth / 2) + 'px';
    pinElement.style.top = (ads[j].location.y - pinHeight) + 'px';
    pinElement.querySelector('img');
    var img = pinElement.querySelector('img');
    img.src = ads[j].author.avatar;
    img.alt = ads[j].offer.title;
    fragment.appendChild(pinElement);
  }

  mapPins.appendChild(fragment);
  return fragment;
};

var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var HOUSING_TYPE = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var createCards = function () {
  mapCardTemplate.querySelector('.popup__title').textContent = ads[0].offer.title;
  mapCardTemplate.querySelector('.popup__text--address').textContent = ads[0].offer.address;
  mapCardTemplate.querySelector('.popup__text--price').textContent = ads[0].offer.price + '₽/ночь';
  mapCardTemplate.querySelector('.popup__type').textContent = HOUSING_TYPE[ads[0].offer.type];
  mapCardTemplate.querySelector('.popup__text--capacity').textContent = ads[0].offer.rooms + ' комнаты для ' + ads[0].offer.guests + ' гостей';
  mapCardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + ads[0].offer.checkin + ', выезд до ' + ads[0].offer.checkout;
  mapCardTemplate.querySelector('.popup__description').textContent = ads[0].offer.description;
  mapCardTemplate.querySelector('.popup__avatar').src = ads[0].author.avatar;

  var featuresList = mapCardTemplate.querySelector('.popup__features');
  featuresList.innerHTML = '';

  var featuresItem = document.createElement('li');
  featuresItem.classList.add('popup__feature');
  var featuresItemsFragment = document.createDocumentFragment();
  for (var i = 0; i < ads[0].offer.features.length; i++) {
    var innerItem = featuresItem.cloneNode(true);
    innerItem.classList.add('popup__feature--' + ads[0].offer.features[i]);
    featuresItemsFragment.appendChild(innerItem);
  }
  featuresList.appendChild(featuresItemsFragment);

  var photosList = mapCardTemplate.querySelector('.popup__photos');
  var photoItem = photosList.querySelector('.popup__photo');
  var photoItemsFragment = document.createDocumentFragment();

  for (var j = 0; j < ads[0].offer.photos.length; j++) {
    var innerPhotoItem = photoItem.cloneNode(true);
    innerPhotoItem.src = ads[0].offer.photos[j];
    photoItemsFragment.appendChild(innerPhotoItem);
  }

  photosList.innerHTML = '';
  return photosList.appendChild(photoItemsFragment);
};
createCards();


var drawCards = function () {
  var map = document.querySelector('.map');
  var mapCard = mapCardTemplate.cloneNode(true);
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  return map.insertBefore(mapCard, mapFiltersContainer);
};
