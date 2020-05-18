"use strict";

// ПЕРЕМЕННЫЕ

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const buttonOut = document.querySelector(".button-out");
const userName = document.querySelector(".user-name");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const restaurantTitle = document.querySelector(".restaurant-title");
const rating = document.querySelector(".rating");
const minPrice = document.querySelector(".price");
const category = document.querySelector(".category");
const inputSearch = document.querySelector(".input-search");
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".modal-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");
const burgerButton = document.querySelector("#burger");
const buttonsBlock = document.querySelector(".buttons");
const inputAddress = document.querySelector(".address");

// ПОЛУЧЕНИЕ ЛОГИНА В ЛОКАЛСТОРЭДЖ
let login = localStorage.getItem("deliveryLogin");

// КОРЗИНА
const cart = [];

// БУРГЕР

let clientWidth = document.documentElement.clientWidth;

if (clientWidth < 520) {
  burgerButton.style.display = "flex";
  buttonsBlock.style.display = "none";
} else {
  burgerButton.style.display = "none";
  buttonsBlock.style.display = "";
}

//Скрытие значка бургер меню при увеличении разрешения окна
window.addEventListener("resize", () => {
  clientWidth = document.documentElement.clientWidth;
  if (clientWidth < 520) {
    burgerButton.style.display = "flex";
  } else {
    burgerButton.style.display = "none";
  }
});

burgerButton.addEventListener("click", () => {
  if (burgerButton.classList.contains("active")) {
    burgerButton.classList.remove("active");
    logo.style.display = "";
    buttonsBlock.style.order = "";
    burgerButton.style.order = "";
    inputAddress.style.order = "";
    buttonsBlock.style.display = "none";
    userName.style.opacity = "0";
    cartButton.style.opacity = "0";
    buttonAuth.style.opacity = "0";
    buttonOut.style.opacity = "0";
  } else {
    burgerButton.classList.add("active");
    logo.style.display = "none";
    buttonsBlock.style.display = "";
    buttonsBlock.style.order = "0";
    burgerButton.style.order = "1";
    inputAddress.style.order = "2";
    cartButton.style.opacity = "1";
    buttonAuth.style.opacity = "1";
    buttonOut.style.opacity = "1";
    userName.style.opacity = "1";
  }
});

// ФУНКЦИИ

const loadCart = function () {
  if (localStorage.getItem(login)) {
    JSON.parse(localStorage.getItem(login)).forEach(function (item) {
      cart.push(item);
    });
  }
};
// СОХРАНЕНИЕ КОРЗИНЫ
const saveCart = function () {
  localStorage.setItem(login, JSON.stringify(cart));
};
// ПОЛУЧЕНИЕ ИНФОРМАЦИИ О ТОВАРАХ С ФАЙЛА JSON
const getData = async function (url) {
  const response = await window.fetch(url);

  // Ошибка, если данные не получены
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
    статус ошибки ${response.status}!`);
  }
  return await response.json();
};
// ДОБАВЛЕНИЕ РЕГУЛЯРНОГО ВЫРАЖЕНИЯ ДЛЯ ЛОГИНА
const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};
// ОТКРЫТИЕ МОДАЛЬНОГО ОКНА
function toggleModal() {
  modal.classList.toggle("is-open");
}
// ОТКРЫТИЕ МОДАЛЬНОГО ОКНА АВТОРИЗАЦИИ
function toogleModalAuth() {
  modalAuth.classList.toggle("is-open");
  loginInput.style.borderColor = "";
}

function returnMain() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
}
// АВТОРИЗАЦИЯ
function authorized() {
  function logOut() {
    login = null;
    cart.length = 0;
    localStorage.removeItem("deliveryLogin");
    buttonAuth.style.display = "";
    buttonOut.style.display = "";
    userName.style.display = "";
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    returnMain();
  }

  userName.textContent = login;
  buttonAuth.style.display = "none";
  buttonOut.style.display = "flex";
  userName.style.display = "inline";
  cartButton.style.display = "flex";
  buttonOut.addEventListener("click", logOut);
  loadCart();
} //функция, если пользователь авторизован

function notAuthorized() {
  function logIn(event) {
    event.preventDefault();

    if (valid(loginInput.value.trim())) {
      login = loginInput.value;
      localStorage.setItem("deliveryLogin", login);
      toogleModalAuth();
      buttonAuth.removeEventListener("click", toogleModalAuth);
      closeAuth.removeEventListener("click", toogleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = "red";
      loginInput.value = "";
    }
  }

  buttonAuth.addEventListener("click", toogleModalAuth);
  closeAuth.addEventListener("click", toogleModalAuth);
  logInForm.addEventListener("submit", logIn);
} //функция, если пользователь не авторизован
/* ПРОВЕРКА НА АВТОРИЗАЦИЮ */
function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
} //проверка пользователя на авторизацию

/* ГЕНЕРАТОР КАРТОЧЕК РЕСТОРАНОВ */
function createCardRestaurant({
  image,
  name,
  kitchen,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery,
}) {
  const card = `<a class='card card-restaurant wow animate__animated animate__fadeInUp' data-wow-delay="0.2s + 0.2" 
                data-products='${products}'
                data-info='${[name, price, stars, kitchen]}'>
					<img src='${image}' alt='image' class='card-image'/>
					<div class='card-text'>
						<div class='card-heading'>
							<h3 class='card-title'>${name}</h3>
							<span class='card-tag tag'>${timeOfDelivery} мин</span>
						</div>
						<div class='card-info'>
							<div class='rating'>${stars}</div>
							<div class='price'>от ${price} ₽</div>
							<div class='category'>${kitchen}</div>
						</div>
					</div>
				</a>`;

  cardsRestaurants.insertAdjacentHTML("beforeend", card);
}

/* СОЗДАНИЕ КАРТОЧКИ ТОВАРА */
function createCardGood({
  description,
  id,
  image,
  name,
  price
}) {
  const card = document.createElement("div");
  card.className = "card wow animate__animated animate__fadeInUp";
  card.id = id;
  card.insertAdjacentHTML(
    "beforeend",
    `<img src='${image}' alt='${name}' class='card-image'/>
    <div class='card-text'>
            <div class='card-heading'>
                <h3 class='card-title card-title-reg'>${name}</h3>
            </div>
            <div class='card-info'>
                <div class='ingredients'>${description}</div>
            </div>
            <div class='card-buttons'>
                <button class='button button-primary button-add-cart hvr-float-shadow' id="${id}">
            <span class='button-card-text'>В корзину</span>
            <span class='button-cart-svg'></span>
                </button>
                <strong class='card-price card-price-bold'>${price} ₽</strong>
            </div>
    </div>
`
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

/* РЕНДЕР КАРТОЧЕК */
function openGoods(event) {
  const target = event.target;

  const restaurant = target.closest(".card-restaurant");

  if (restaurant) {
    if (login) {
      const info = restaurant.dataset.info.split(",");

      const [name, price, stars, kitchen] = info;

      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;

      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    } else {
      toogleModalAuth();
    }
  }
}

//ДОБАВЛЕНИЕ ТОВАРОВ В КОРЗИНУ
function addToCart(event) {
  const target = event.target;

  const buttonAddToCart = target.closest(".button-add-cart");

  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price").textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }
  }
  saveCart();
}
// РЕНДЕР КОРЗИНЫ
function renderCart() {
  modalBody.textContent = "";
  cart.forEach(function ({
    id,
    title,
    cost,
    count
  }) {
    const itemCart = `
				<div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id="${id}">-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id="${id}">+</button>
					</div>
				</div>`;
    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);

  modalPrice.textContent = totalPrice + " ₽";
}
// ИЗМЕНЕНИЕ КОЛИЧЕСТВА ТОВАРА В КОРЗИНЕ
function changeCount(event) {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains("counter-plus")) food.count++;
    renderCart();
  }
  saveCart();
}

// ИНИЦИАЛИЗАЦИЯ
function init() {
  /* ОБРАБОТЧИКИ СОБЫТИЙ */

  /* МОДАЛЬНОЕ ОКНО */
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener("click", function () {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener("click", changeCount);

  cardsMenu.addEventListener("click", addToCart);

  close.addEventListener("click", toggleModal);

  /* ВКЛЮЧЕНИЕ КАРТОЧЕК ТОВАРОВ */
  cardsRestaurants.addEventListener("click", openGoods);

  /* ВОЗВРАТ КАРТОЧЕК РЕСТОРАНОВ */
  logo.addEventListener("click", returnMain);

  //
  inputSearch.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      const target = event.target;

      const value = target.value.toLowerCase().trim();

      target.value = "";

      if (!value || value.length < 2 || !login) {
        checkAuth();
        toogleModalAuth();
        target.style.backgroundColor = "tomato";
        setTimeout(function () {
          target.style.backgroundColor = "";
        }, 2000);
        return;
      }
      // МАССИВ ТОВАРОВ
      const goods = [];
      // ПОЛУЧЕНИЕ ТОВАВАРОВ С БАЗЫ ДАННЫХ JSON
      getData("./db/partners.json").then(function (data) {
        const products = data.map(function (item) {
          return item.products;
        });

        products.forEach(function (product) {
          getData(`./db/${product}`)
            .then(function (data) {
              goods.push(...data);

              const searchGoods = goods.filter(function (item) {
                return item.name.toLowerCase().includes(value);
              });

              cardsMenu.textContent = "";
              containerPromo.classList.add("hide");
              restaurants.classList.add("hide");
              menu.classList.remove("hide");

              restaurantTitle.textContent = "Результат поиска";
              rating.textContent = "";
              minPrice.textContent = "";
              category.textContent = "";

              return searchGoods;
            })
            .then(function (data) {
              data.forEach(createCardGood);
            });
        });
      });
    }
  });

  // ВЫЗОВ ФУНКЦИЙ

  checkAuth(); //Авторизация

  // SLIDER
  new Swiper(".swiper-container", {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    slidesPerView: 1,
    slidesPerColumn: 1,
    longSwipesMs: 1000,
    longSwipesRatio: 2,
  });
}
init();

// WOW

new WOW().init();