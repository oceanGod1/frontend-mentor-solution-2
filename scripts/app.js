// Select all the necessary elements
const pageForm = document.querySelector('form');
const inputField = document.querySelectorAll('.input-field');
const radioButton = document.querySelectorAll('[type="radio"]');
const parentResultCard = document.querySelector('.result-card')
const emptyResultCard = document.querySelector('.result__empty-card');
const previewResultCard = document.querySelector('.result__preview-card')
const monthlyPayment = document.querySelector('.monthly-payment');
const totalPayment = document.querySelector('.total-repayment');

let resultOption;

// enable navigation for all input fields using the up and down arrow keys
document.addEventListener('keydown', (e) => {
  const inputField = document.querySelectorAll('input');
  const currentIndex = Array.from(inputField).findIndex(input => document.activeElement === input)
  if (e.key === 'ArrowDown' && currentIndex < inputField.length -1) {
      inputField[currentIndex + 1].focus();
  } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      inputField[currentIndex - 1].focus();
  }
})

// doubles for focus and blur events. the action parameter adds the class on focus events and removes the class on blur events
const toggleFocus = (inputField, event, action, className1, className2) => {
  inputField.addEventListener(event, () => {
    inputField.parentElement.classList[action](className1);
    inputField.nextElementSibling.classList[action](className2);
  })
}

// input field validation to accept only numbers and one dot, and automatically generate a coma for numbers above 999
const numbersOnly = (obj, prop, sign) => {
  let value = obj[prop].replace(/[^0-9.]/g, '');  // replace any non-digit with empty string
  /^0$/.test(obj[prop]) ? value = value.replace(/0/,"") : ''; // If the first number you enter is 0, don't allow another 0 to be entered immediately
  /^\.$/.test(obj[prop]) ? value = value.replace(/\./, '0.') : '';  // if the first entry is a dot, put a 0 in front of it by default
  value.split(".").length > 2 ? value = value.replace(/\.+$/,"") : '';  // if there already exists a dot in the field, don't allow another to be entered
  let [integerPart, decimalPart] = value.split(".");
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");  // add a coma after every third digit from the right
  obj[prop] = decimalPart !== undefined ? `${sign}${integerPart}.${decimalPart}` : integerPart;
}

// applying user entry events
inputField.forEach((input) => {
  toggleFocus(input, 'focus', 'add', 'fieldset--on-focus', 'input-tag--on-focus');
  toggleFocus(input, 'blur', 'remove', 'fieldset--on-focus', 'input-tag--on-focus')
  input.addEventListener('input', () => {
    numbersOnly(input, 'value', '')
  })
})

// enables radio buttons to be checked either by clicking, or by pressing the enter key when they are already on focus
const checkRadio = {
  toggle: function(element, sibling) {
    element.checked = true;
    element.parentElement.classList.add('radio--on-checked');
    element.parentElement[sibling].classList.remove('radio--on-checked');
  },

  radioCheckLogic: function(element, sibling, event, className, target, key, type) {
    if (event[type] === 'keydown') {
      event.preventDefault()
    }
    if(element.classList.contains(className)) {
      if (event[target] === element) {
        this.toggle(element, sibling)
      } else if (event[key] === 'Enter') {
        this.toggle(element, sibling)
      }
    }
  },

  radioEvent: function(elName, eventType, sibling1, sibling2, className1, className2,){
    elName.addEventListener(eventType, (e) => {
      this.radioCheckLogic(elName, sibling1, e, className1, 'target', 'key', 'type')
      this.radioCheckLogic(elName, sibling2, e, className2, 'target', 'key','type')
      resultOption = elName.value;
    })
  }
}

// applying radio button events
radioButton.forEach((radio) => {
  toggleFocus(radio, 'focus', 'add', 'radio--on-focus')
  toggleFocus(radio, 'blur', 'remove', 'radio--on-focus')
  checkRadio.radioEvent(radio, 'keydown', 'nextElementSibling', 'previousElementSibling', 'repayment-radio', 'interest-only-radio')
  checkRadio.radioEvent(radio, 'click', 'nextElementSibling', 'previousElementSibling', 'repayment-radio', 'interest-only-radio')
})

// submit button
pageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let filledInputFields = 0;
  const userEntry = {};
  inputField.forEach((input) => {
    userEntry[input.name] = Number(input.value.replace(/,/g, ""));
    if (input.value === '') {
      input.parentElement.classList.add('fieldset--on-error');
      input.nextElementSibling.classList.add('input-tag--throw-error');
      input.parentElement.nextElementSibling.classList.add('show-error-message');
    } else {
      filledInputFields ++
      input.parentElement.classList.remove('fieldset--on-error');
      input.nextElementSibling.classList.remove('input-tag--throw-error');
      input.parentElement.nextElementSibling.classList.remove('show-error-message');
    }
  });

  !resultOption ? document.querySelector('.input-field__fourth-section').lastElementChild.classList.add('show-error-message') : document.querySelector('.input-field__fourth-section').lastElementChild.classList.remove('show-error-message');
  
  const {mortgageAmount, mortgageTerm, mortgageRate} = userEntry;
  const rate = mortgageRate / 12 / 100;
  const time = mortgageTerm * 12;
  const numerator = rate * Math.pow(1 + rate, time);
  const denominator = Math.pow(1 + rate, time) - 1;
  const fraction = numerator / denominator;
  const repaymentMonthlyPay = mortgageAmount * fraction;
  const repaymentTotalPay = repaymentMonthlyPay * time;
  const interestMonthlyPay = mortgageAmount / time - repaymentMonthlyPay;
  const interestTotalPay = repaymentTotalPay - mortgageAmount

  
  if (filledInputFields === 3){
    emptyResultCard.classList.add('result__empty-card--hide');
    previewResultCard.classList.add('result__preview-card--show');
    parentResultCard.classList.add('result-card--show-result');
  }

  if (filledInputFields === 3 && resultOption === 'input-field__mortgage-repayment') {
    totalPayment.value = repaymentTotalPay.toFixed(2)
    numbersOnly(totalPayment, 'value', '\u00A3')

    monthlyPayment.value = repaymentMonthlyPay.toFixed(2)
    numbersOnly(monthlyPayment, 'value', '\u00A3')
  } else if (filledInputFields === 3 && resultOption === 'input-field__mortgage-interest') {

    totalPayment.value = interestTotalPay.toFixed(2)
    numbersOnly(totalPayment, 'value', '\u00A3')

    monthlyPayment.value = interestMonthlyPay.toFixed(2)
    numbersOnly(monthlyPayment, 'value', '\u00A3')
  }
})
