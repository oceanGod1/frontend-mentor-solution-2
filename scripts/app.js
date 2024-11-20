const pageForm = document.querySelector('form');
const inputField = document.querySelectorAll('.input-field');
const radioButton = document.querySelectorAll('[type="radio"]');
let resultOption;


document.addEventListener('keydown', (e) => {
  const inputField = document.querySelectorAll('input');
  const currentIndex = Array.from(inputField).findIndex(input => document.activeElement === input)

  if (e.key === 'ArrowDown' && currentIndex < inputField.length -1) {
      inputField[currentIndex + 1].focus();
  } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      inputField[currentIndex - 1].focus();
  }
})

inputField.forEach((input) => {
  
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('fieldset--on-focus');
    input.nextElementSibling.classList.add('input-tag--on-focus');
  })

  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('fieldset--on-focus');
    input.nextElementSibling.classList.remove('input-tag--on-focus');
  })




















  input.addEventListener('input', () => {
    let value = input.value.replace(/[^0-9.]/g, '');

    if (/^0$/.test(input.value)) {
      value = value.replace(/0/,"");
    };

    if (/^\.$/.test(input.value)) {
      value = value.replace(/\./, '0.')
    };

    if (value.split(".").length > 2) {
      value = value.replace(/\.+$/,"");
    };
    
    let [integerPart, decimalPart] = value.split(".");

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    input.value = decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;
  })
})

radioButton.forEach((radio) => {
  
  radio.addEventListener('keydown', (e) => {
    e.preventDefault()
  })

  radio.addEventListener('focus', () => {
    radio.parentElement.classList.add('radio--on-focus');
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        radio.checked = true;
        if(radio.parentElement.classList.contains('repayment-radio__container')){
          radio.parentElement.classList.add('radio--on-checked');
          radio.parentElement.nextElementSibling.classList.remove('radio--on-checked');
        }
        if(radio.parentElement.classList.contains('interest-radio__container')){
          radio.parentElement.classList.add('radio--on-checked');
          radio.parentElement.previousElementSibling.classList.remove('radio--on-checked');
        }
      }
    })
  })
  
  radio.addEventListener('blur', () => {
    radio.parentElement.classList.remove('radio--on-focus');
  })
  
  radio.addEventListener('click', () => {
    if(radio.parentElement.classList.contains('repayment-radio__container')){
      radio.parentElement.classList.add('radio--on-checked');
      radio.parentElement.nextElementSibling.classList.remove('radio--on-checked');
    }
    if(radio.parentElement.classList.contains('interest-radio__container')){
      radio.parentElement.classList.add('radio--on-checked');
      radio.parentElement.previousElementSibling.classList.remove('radio--on-checked');
    }
  })

  radio.addEventListener('change', () => {
    option = radio.value
  })
})

pageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  inputField.forEach((input) => {
    if (input.classList.contains('mortgage-amount') && input.value === '') {
      input.previousElementSibling.classList.add('input-tag--throw-error');
      input.parentElement.classList.add('fieldset--on-error');
      input.parentElement.insertAdjacentHTML('afterend', '<p class=error-message>This field is required</p>')
    } else if (!input.classList.contains('mortgage-amount') && input.value === '') {
      input.parentElement.classList.add('fieldset--on-error');
      input.nextElementSibling.classList.add('input-tag--throw-error');
      input.parentElement.insertAdjacentHTML('afterend', '<p class=error-message>This field is required</p>')
    }
  })

  if (!resultOption) {
    document.querySelector('.input-field__fourth-section').insertAdjacentHTML('beforeend', '<p class=error-message>This field is required</p>')
  }
  


  console.log(option)

  const userEntry = {};
  inputField.forEach((input) => {
    userEntry[input.name] = Number(input.value.replace(/,/g, ""));
  });
  
  const {mortgageAmount, mortgageRate, mortgageTerm} = userEntry;

  const rate = mortgageRate / 100;
  console.log(rate)
  // const rate = Math.pow(mortgageRate, 
  console.log(mortgageAmount)
})