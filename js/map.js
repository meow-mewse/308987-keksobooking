'use strict';

// случайное данное от min до max
function getRandomFromMinToMax (min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
};

// случайное число без повторения
var getWithoutRepeat = function (array) {
  var index = getRandomFromMinToMax(0, array.length - 1);
  var randomResult = array[index];
  array.splice(index, 1);
  return randomResult;
};

// случайный элемент из массива
var getRandomElementFromArray = function (array) {
  return array[Math.floor((Math.random()*array.length))];
};

// перемешивания данных из массива
function shuffle(array) {
  var j, temp;
  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random()*(i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

// случайная длина массива
var getRandomArray = function (array) {
  var newArray = [];
  var arrayLength = array.length;
  var newArrayLength = getRandomFromMinToMax(1, arrayLength);
  for (var i = 0; i < newArrayLength; i++) {
    newArray[i] = array[i];
  }
  return newArray;
};


var AVATAR = {
  imgNumbers: ['01', '02', '03', '04', '05', '06', '07', '08'],
  path: 'img/avatars/user',
  extention: '.png'
}
var TITLES = [
"Большая уютная квартира",
"Маленькая неуютная квартира",
"Огромный прекрасный дворец",
"Маленький ужасный дворец",
"Красивый гостевой домик",
"Некрасивый негостеприимный домик",
"Уютное бунгало далеко от моря",
"Неуютное бунгало по колено в воде"
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
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
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



var getAdObject = function () {
  var ad = {
    author: {
      avatar: AVATAR.path + getWithoutRepeat(AVATAR.imgNumbers) + AVATAR.extention
    },
    offer: {
      title: getWithoutRepeat(TITLES),
      price: getRandomFromMinToMax(PRICE.min, PRICE.max),
      type: getRandomElementFromArray(TYPES),
      rooms: getRandomFromMinToMax(ROOM.min, ROOM.max),
      guests: getRandomFromMinToMax(GUEST.min, GUEST.max),
      checkin: getRandomElementFromArray(CHECKIN),
      checkout: getRandomElementFromArray(CHECKOUT),
      features: getRandomArray(FEATURES),
      description: DESCRIPTION,
      photos: shuffle(PHOTOS)
    },
    location: {
      x: getRandomFromMinToMax(LOCATION.minX, LOCATION.maxX),
      y: getRandomFromMinToMax(LOCATION.minY, LOCATION.maxY)
    }
  };
  ad.offer.address = ad.location.x + ', ' + ad.location.y;
  return ad;
};


// функция генерации массива из 8 объектов

var ads = [];
var countOfAds = 8;

var createAllAds = function () {
  var titles = shuffle(TITLES);
  var imageNumbers = shuffle(AVATAR.imgNumbers);
  for (var i = 0; i < countOfAds; i++) {
    ads[i] = getAdObject(titles[i], imageNumbers[i]);
  };
  return ads;
};
createAllAds();



// функция включения активного режима
var showMap = function() {
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
};
showMap();




var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin')

for (var j = 0; j < ads.length; j++) {
  var pinElement = mapPinTemplate.cloneNode(true);
  var pinWidth = 40;
  var pinHeight = 40;
  pinElement.style.left = ads[j].location.x + pinWidth / 2;
  pinElement.style.top = ads[j].location.y + pinHeight;
  mapPins.appendChild(pinElement);

}



















