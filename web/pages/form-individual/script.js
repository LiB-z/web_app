const WebApp = window.Telegram.WebApp;
const FORM = document.querySelector(".individual");
const INPUTSLIST = document.querySelectorAll("input");
const BTNSUBMIT = document.querySelector(".btn__sub");
const BTNUNDO = document.querySelector(".btn__undo");
const MAILREGEX = /^[A-Za-z0-9._%+\-\']+@[A-Za-z0-9.-]+\.[A-Za-z]{2,5}$/;
const PHONEREGEX =   /^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
let filledCounter = 0;
//---
let tg = window.Telegram.WebApp;
tg.setBackgroundColor ('#FFFFFF');
//---

INPUTSLIST.forEach((input) => {
  let inputID = input.getAttribute("id");
  let validLength = 3;

  if (inputID == "individualItn") validLength = 10;
  if (inputID == "individualPhone") validLength = 12;

  input.oninvalid = (e) => e.preventDefault();
  input.onfocus = (e) => {
    if (inputID == "individualPhone" && input.value == "") input.value = "+7";
    let currValue = e.target.value;

    if (filledCounter < 3) {
      BTNSUBMIT.classList.add("locked");
      input.onblur = (e) => {
        FillCheck(e.target, currValue, inputID, validLength);
        currValue = e.target.value;
      };
    }
  };
  validateInput(input, inputID, validLength);
});

function validateInput(el, inputID, validLength) {
  el.addEventListener("beforeinput", function (e) {
    let beforeValue = el.value;

    e.target.addEventListener(
      "input",
      function () {
        let field = el.closest("label");
        // Проверка почты
        if (inputID == "individualEmail") {
          if (MAILREGEX.test(e.target.value)) {
            field.classList.remove("incorrect");
          }
          if (
            filledCounter >= 3 &&
            MAILREGEX.test(e.target.value) &&
            e.target.value.length >= validLength
          ) {
            BTNSUBMIT.classList.remove("locked");
          } else {
            BTNSUBMIT.classList.add("locked");
          }
          return;
        }
        // Проверка номера
        if (inputID == "individualPhone") {
          if (PHONEREGEX.test(e.target.value)) {
            field.classList.remove("incorrect");
          }
          if (
            filledCounter >= 3 &&
            PHONEREGEX.test(e.target.value) &&
            e.target.value.length >= validLength
          ) {
            BTNSUBMIT.classList.remove("locked");
          } else {
            BTNSUBMIT.classList.add("locked");
          }
          return;
        }
        // Фильтр на ввод символов
        if (el.validity.patternMismatch) {
          el.value = beforeValue;
          return
        }
        // Валидация заполнения поля
        if (el.value.length >= validLength) {
          //   field.classList.remove("incorrect");
          if (filledCounter >= 3 && e.target.value.length >= validLength) {
            field.classList.remove("incorrect")
            BTNSUBMIT.classList.remove("locked");
          } else {
            BTNSUBMIT.classList.add("locked");
          }
          return;
        } else {
          //   field.classList.add("incorrect");
        }

        // Валидация заполнения формы
        if (!field.classList.contains("incorrect") && filledCounter >= 3) {
          BTNSUBMIT.classList.remove("locked");
        } else {
          BTNSUBMIT.classList.add("locked");
        }
      },
      { once: true }
    );
  });
}

function FillCheck(el, prevValue = "", inputID, validLength) {
  let field = el.closest("label");
  let text = el.value;

  //! значение не-валидное
  if (
    (inputID == "individualPhone" && !PHONEREGEX.test(text)) ||
    (inputID == "individualEmail" && !MAILREGEX.test(text)) ||
    ((inputID == "individualFullname" || inputID == "individualItn") &&
      text.length < validLength)
  ) {
    if (
      prevValue != "" &&
      text != prevValue &&
      !field.classList.contains("incorrect")
    ) {
      filledCounter--;
    }
    field.classList.add("incorrect");
    BTNSUBMIT.classList.add("locked");
  } else {
    if (
      (inputID == "individualPhone" && !field.classList.contains("incorrect")) ||
      (inputID == "individualEmail" && !field.classList.contains("incorrect")) ||
      (!field.classList.contains("incorrect") && (prevValue == "" || prevValue == "+7")) ||
      (field.classList.contains("incorrect") && text != prevValue)
    ) {
      filledCounter++;
      field.classList.remove("incorrect");
    }
  }
}

FORM.onsubmit = (e) => {
  e.preventDefault();
};
BTNUNDO.onclick = (e) => {
    WebApp.close();
}
