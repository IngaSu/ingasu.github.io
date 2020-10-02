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
  const getResources = async (url) => {
    const result = await fetch(url);
    if (!result.ok) {
      throw Error(`Failed to fetch ${url} status: ${result.status}`);
    }
    return await result.json();
  };

  axios.get("http://localhost:3000/menu").then((data) =>
    data.data.forEach(({ img, altimg, title, descr, price }) => {
      new Panel(img, altimg, title, descr, price, ".menu .container").render();
    })
  );

  // getResources('http://localhost:3000/menu')
  //   .then(data => {
  //     data.forEach(
  //       ({
  //         img,
  //         altimg,
  //         title,
  //         descr,
  //         price
  //       }) => {
  //         new Panel(img, altimg, title, descr, price, ".menu .container").render();
  //       });
  //   });

  //Forms
  const forms = document.querySelectorAll("form"),
    message = {
      loading: "img/form/spinner.svg",
      success: "You data was sent",
      failure: "Form data faild to send",
    };

  forms.forEach((item) => {
    bindPostData(item);
  });

  const postData = async (url, body) => {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: body,
    });
    return await result.json();
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));
      console.log(json);

      postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
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

  //Slider My version v1

  const offerSlides = document.querySelectorAll(".offer__slide"),
    leftSliderArrow = document.querySelector(".offer__slider-prev"),
    rightSliderArrow = document.querySelector(".offer__slider-next"),
    currentSlide = document.querySelector("#current"),
    totalSlides = document.querySelector("#total");

  function hideSides() {
    offerSlides.forEach((slide) => {
      slide.classList.add("hide");
      slide.classList.remove("show");
    });
  }

  function showSides(i) {
    offerSlides[i].classList.add("show");
    offerSlides[i].classList.remove("hide");

    if (offerSlides.length < 10) {
      totalSlides.innerHTML = `0${offerSlides.length}`;
      currentSlide.innerHTML = `0${i + 1}`;
    } else {
      totalSlides.innerHTML = offerSlides.length;
      currentSlide.innerHTML = i + 1;
    }
  }

  function slider() {
    let i = 0;
    hideSides();
    showSides(i);

    rightSliderArrow.addEventListener("click", () => {
      hideSides();
      if (i < offerSlides.length - 1) {
        i++;
      } else {
        i = 0;
      }
      showSides(i);
    });

    leftSliderArrow.addEventListener("click", () => {
      hideSides();
      if (i === 0) {
        i = offerSlides.length - 1;
      } else {
        i--;
      }
      showSides(i);
    });
  }
  slider();
});
