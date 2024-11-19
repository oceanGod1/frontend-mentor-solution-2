const pageForm = document.querySelector('.input-field__card');
const inputField = document.querySelectorAll('.input-field');
const radioButton = document.querySelectorAll('[type="radio"]');

inputField.forEach((input) => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('fieldset--on-focus');
    if (input.classList.contains('mortgage-amount')){
      input.previousElementSibling.classList.add('input-tag--on-focus');
    } else {
      input.nextElementSibling.classList.add('input-tag--on-focus');
    }
  })

  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('fieldset--on-focus');
    if (input.classList.contains('mortgage-amount')){
      input.previousElementSibling.classList.remove('input-tag--on-focus');
    } else {
      input.nextElementSibling.classList.remove('input-tag--on-focus');
    }
  })
})

radioButton.forEach((radio) => {
  radio.addEventListener('click', () => {
    if(radio.parentElement.classList.contains('repayment-radio__container')){
      radio.parentElement.classList.add('radio--on-focus');
      radio.parentElement.nextElementSibling.classList.remove('radio--on-focus');
    }
    if(radio.parentElement.classList.contains('interest-radio__container')){
      radio.parentElement.classList.add('radio--on-focus');
      radio.parentElement.previousElementSibling.classList.remove('radio--on-focus');
    }
  })
})