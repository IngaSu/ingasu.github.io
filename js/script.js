window.addEventListener("DOMContentLoaded", () => {
  //Tabs

  const tabParent = document.querySelector(".tabheader__items"),
    tabItems = document.querySelectorAll(".tabheader__item"),
    tabContent = document.querySelectorAll(".tabcontent");

  function hideTabContent() {
    tabContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabItems.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabContent[i].classList.add("show");
    tabContent[i].classList.remove("hide", "fade");
    tabItems[i].classList.add("tabheader__item_active");
  }
  hideTabContent();
  showTabContent();

  tabParent.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabItems.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //Timer
  const deadline = "2020-10-01";

  function getTimeRemaining(endTime) {
    let t = Date.parse(endTime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setTimer(timerSelector) {
    const timer = document.querySelector(timerSelector),
      days = document.querySelector("#days"),
      hours = document.querySelector("#hours"),
      minutes = document.querySelector("#minutes"),
      seconds = document.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const timerObj = getTimeRemaining(deadline);
      days.innerHTML = getZero(timerObj.days);
      hours.innerHTML = getZero(timerObj.hours);
      minutes.innerHTML = getZero(timerObj.minutes);
      seconds.innerHTML = getZero(timerObj.seconds);

      if (timerObj <= 0) {
        clearInterval();
      }
    }
  }
  setTimer("timer");

  // MODAL
  const contactButton = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal"),
    closeBtn = document.querySelector("[data-close]");

  function openModal() {
    modal.classList.remove("hide");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  contactButton.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);

  //Progress Bar

  function updateProgress() {
    const progressBar = document.querySelector(".progress_bar"),
      scrollPosition = document.documentElement.scrollTop,
      totalHeight = document.documentElement.scrollHeight;

    function updateValue() {
      const newValue = Math.floor((scrollPosition * 100) / (totalHeight - 750));
      progressBar.setAttribute("value", newValue);
    }
    updateValue();
  }
  window.addEventListener("scroll", updateProgress);

  // Class
  class Panel {
    constructor(
      src,
      alt,
      subtitle,
      description,
      price,
      parentSelector,
      ...classes
    ) {
      this.src = src;
      this.alt = alt;
      this.subtitle = subtitle;
      this.description = description;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
    }

    render() {
      const element = document.createElement("div");

      if (this.classes.length === 0) {
        this.classes = "menu__item";
        element.classList.add(this.classes);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }

      element.innerHTML = `
      <img src=${this.src} alt=${this.alt} />
      <h3 class="menu__item-subtitle">${this.subtitle}</h3>
      <div class="menu__item-descr">${this.description}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
        <div class="menu__item-cost">Цена:</div>
        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
      </div>
    </div>`;
      this.parent.append(element);
    }
  }

  new Panel(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    `Меню "Фитнес" - это новый подход к приготовлению блюд: больше
свежих овощей и фруктов. Продукт активных и здоровых людей. Это
абсолютно новый продукт с оптимальной ценой и высоким качеством!`,
    229,
    ".menu .container"
  ).render();

  new Panel(
    "img/tabs/elite.jpg",
    "elite",
    "Меню “Премиум”",
    `В меню “Премиум” мы используем не только красивый дизайн упаковки,
но и качественное исполнение блюд. Красная рыба, морепродукты,
фрукты - ресторанное меню без похода в ресторан!`,
    550,
    ".menu .container"
  ).render();

  new Panel(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    `Меню “Постное” - это тщательный подбор ингредиентов: полное
отсутствие продуктов животного происхождения, молоко из миндаля,
овса, кокоса или гречки, правильное количество белков за счет тофу
и импортных вегетарианских стейков.`,
    430,
    ".menu .container"
  ).render();

  //Forms
  const forms = document.querySelectorAll("form"),
    message = {
      loading: "img/form/spinner.svg",
      success: "You data was sent",
      failure: "Form data faild to send",
    };

  forms.forEach((item) => {
    postData(item);
  });

  function postData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let statusMessage = document.createElement("img");
      statusMessage.setAttribute("src", message.loading);
      statusMessage.style.cssText = `
      display: block;
      margin: 0, auto;
      z-index: 255;
      `;
      form.insertAdjacentElement("afterend", statusMessage);

      const request = new XMLHttpRequest();
      request.open("POST", "js/server.php");
      request.setRequestHeader("Content-type", "application/json");

      const formData = new FormData(form);

      const object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      const json = JSON.stringify(object);

      request.send(json);

      request.addEventListener("load", () => {
        if (request.status === 200) {
          console.log(request.response);
          showThanksModal(message.success);
          form.reset();
          statusMessage.remove();
        } else {
          showThanksModal(message.failure);
        }
      });
    });
  }

  function showThanksModal(message) {
    const preModalMessage = document.querySelector(".modal__dialog");
    preModalMessage.classList.remove("show");
    preModalMessage.classList.add("hide");
    openModal();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `<div class="modal__content">
        <div data-close class="modal__close" >&times;</div>
         <div class="modal__title">${message}</div>`;
    document.querySelector(".modal").append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      preModalMessage.classList.add("show");
      preModalMessage.classList.remove("hide");
      closeModal();
    }, 4000);
  }
});
