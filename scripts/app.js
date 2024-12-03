// Define Initializer
let resultOption = 0;

const allVariables = {
  // Select all the necessary elements
  pageForm: document.querySelector("form"),
  inputField: document.querySelectorAll(".input-field"),
  radioButton: document.querySelectorAll('[type="radio"]'),
  parentResultCard: document.querySelector(".result-card"),
  emptyResultCard: document.querySelector(".result__empty-card"),
  previewResultCard: document.querySelector(".result__preview-card"),
  monthlyPayment: document.querySelector(".monthly-payment"),
  totalPayment: document.querySelector(".total-repayment"),
  allFormInputs: document.querySelectorAll("form input"),
};

// doubles for focus and blur events. the action parameter adds the class on focus events and removes the class on blur events
allVariables.toggleFocus = (inputField, event, action, className1, className2) => {
  inputField.addEventListener(event, () => {
    inputField.parentElement.classList[action](className1);
    inputField.nextElementSibling.classList[action](className2);
  });
};

// input field validation to accept only numbers and one dot, and automatically generate a coma for numbers above 999
allVariables.numbersOnly = (obj, prop, sign) => {
  let value = obj[prop].replace(/[^0-9.]/g, ""); // replace any non-digit with empty string
  /^0$/.test(obj[prop]) ? (value = value.replace(/0/, "")) : ""; // If the first number you enter is 0, don't allow another 0 to be entered immediately
  /^\.$/.test(obj[prop]) ? (value = value.replace(/\./, "0.")) : ""; // if the first entry is a dot, put a 0 in front of it by default
  value.split(".").length > 2 ? (value = value.replace(/\.+$/, "")) : ""; // if there already exists a dot in the field, don't allow another to be entered
  let [integerPart, decimalPart] = value.split(".");
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add a coma after every third digit from the right
  obj[prop] = decimalPart !== undefined ? `${sign}${integerPart}.${decimalPart}` : integerPart;
};

// enables radio buttons to be checked either by clicking, or by pressing the enter key when they are already on focus
allVariables.checkRadio = {
  toggle: function (element, sibling) {
    element.checked = true;
    element.parentElement.classList.add("radio--on-checked");
    element.parentElement[sibling].classList.remove("radio--on-checked");
  },

  radioCheckLogic: function (element, sibling, event, key, className) {
    if (event["type"] === "keydown") {
      event.preventDefault();
    }
    if (event[key] === "Enter" && element.classList.contains(className)) {
      this.toggle(element, sibling);
      document.activeElement === document.querySelector("button");
    } else if (event["type"] === "click" && element.classList.contains(className)) {
      this.toggle(element, sibling);
    }
  },

  radioEvent: function (elName, eventType, sibling1, sibling2, className1, className2) {
    elName.addEventListener(eventType, e => {
      this.radioCheckLogic(elName, sibling1, e, "key", className1);
      this.radioCheckLogic(elName, sibling2, e, "key", className2);
      resultOption = elName.value;
    });
  },
};

// enable navigation for all input fields using the up and down arrow keys
document.addEventListener("keydown", e => {
  const { allFormInputs } = allVariables;
  const currentIndex = Array.from(allFormInputs).findIndex(input => document.activeElement === input);
  if (e.key === "ArrowDown" && currentIndex < allFormInputs.length - 1) {
    allFormInputs[currentIndex + 1].focus();
  } else if (e.key === "ArrowUp" && currentIndex > 0) {
    allFormInputs[currentIndex - 1].focus();
  }
});

// applying user entry events
(() => {
  const { inputField, toggleFocus, numbersOnly } = allVariables;
  inputField.forEach(input => {
    toggleFocus(input, "focus", "add", "fieldset--on-focus", "input-tag--on-focus");
    toggleFocus(input, "blur", "remove", "fieldset--on-focus", "input-tag--on-focus");
    input.addEventListener("input", () => numbersOnly(input, "value", ""));
  });
})();

// applying radio button events
(() => {
  const { radioButton, toggleFocus, checkRadio } = allVariables;
  radioButton.forEach(radio => {
    toggleFocus(radio, "focus", "add", "radio--on-focus");
    toggleFocus(radio, "blur", "remove", "radio--on-focus");
    checkRadio.radioEvent(radio, "keydown", "nextElementSibling", "previousElementSibling", "repayment-radio", "interest-only-radio");
    checkRadio.radioEvent(radio, "click", "nextElementSibling", "previousElementSibling", "repayment-radio", "interest-only-radio");
  });
})();

// submit button
(() => {
  const { pageForm, inputField, emptyResultCard, previewResultCard, parentResultCard, totalPayment, monthlyPayment, numbersOnly } = allVariables;
  pageForm.addEventListener("submit", e => {
    e.preventDefault();

    let filledInputFields = 0;
    const userEntry = {};
    const errorNotifier = (elName, action) => {
      elName.parentElement.classList[action]("fieldset--on-error");
      elName.nextElementSibling.classList[action]("input-tag--throw-error");
      elName.parentElement.nextElementSibling.classList[action]("show-error-message");
    };

    inputField.forEach(input => {
      userEntry[input.name] = Number(input.value.replace(/,/g, ""));
      if (input.value === "") {
        errorNotifier(input, "add");
      } else {
        filledInputFields++;
        errorNotifier(input, "remove");
      }
    });

    !resultOption
      ? document.querySelector(".input-field__fourth-section").lastElementChild.classList.add("show-error-message")
      : document.querySelector(".input-field__fourth-section").lastElementChild.classList.remove("show-error-message");

    const { mortgageAmount, mortgageTerm, mortgageRate } = userEntry;
    const rate = mortgageRate / 12 / 100;
    const time = mortgageTerm * 12;
    const numerator = rate * Math.pow(1 + rate, time);
    const denominator = Math.pow(1 + rate, time) - 1;
    const fraction = numerator / denominator;
    const repaymentMonthlyPay = mortgageAmount * fraction;
    const repaymentTotalPay = repaymentMonthlyPay * time;
    const interestMonthlyPay = mortgageAmount / time - repaymentMonthlyPay;
    const interestTotalPay = repaymentTotalPay - mortgageAmount;

    if (filledInputFields === 3) {
      emptyResultCard.classList.add("result__empty-card--hide");
      previewResultCard.classList.add("result__preview-card--show");
      parentResultCard.classList.add("result-card--show-result");
    }

    if (filledInputFields === 3 && resultOption === "input-field__mortgage-repayment") {
      totalPayment.innerHTML = repaymentTotalPay.toFixed(2);
      numbersOnly(totalPayment, "innerHTML", "\u00A3");

      monthlyPayment.innerHTML = repaymentMonthlyPay.toFixed(2);
      numbersOnly(monthlyPayment, "innerHTML", "\u00A3");
    } else if (filledInputFields === 3 && resultOption === "input-field__mortgage-interest") {
      totalPayment.innerHTML = interestTotalPay.toFixed(2);
      numbersOnly(totalPayment, "innerHTML", "\u00A3");

      monthlyPayment.innerHTML = interestMonthlyPay.toFixed(2);
      numbersOnly(monthlyPayment, "innerHTML", "\u00A3");
    }
  });
})();
