//Імпортуємо бібліотеку flatpickr та її стилі
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

//Імпортуємо бібліотеку Notiflix
import { Notify } from "notiflix"; 

// Отримуємо елементи інтерфейсу
const timerOptions = {
  input: document.querySelector('#datetime-picker'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
  startBtn: document.querySelector('button[data-start]'),
}

let remainTime = {};
let timerId = 0;
let chosenTime = 0;

// Створюємо об'єкт параметрів для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
      if (selectedDates[0] <= Date.now()) {
        return onDateInPast();
      }
      enableStartBtn(selectedDates[0]);
  }
};

// функція вимкнення кнопки запуску таймера 
function disableStartBtn() {
  timerOptions.startBtn.setAttribute('disabled', 'true');
}

// функція вимкнення текстового вводу 
function disableInput() {
  timerOptions.input.setAttribute('disabled', 'true');
}

// активація кнопки старт
function enableStartBtn(selDate) {
  timerOptions.startBtn.removeAttribute('disabled');
  chosenTime = selDate;
    if (timerId > 0) {
    clearInterval(timerId);
  } 
    Notify.success('Date in the future successfully selected')
    refreshTimer();
}


function enableInput() {
  timerOptions.input.removeAttribute('disabled')
}

// вимкнення кнопки старт
disableStartBtn()

// створюємо календарь, для вибору дати та часу
const selectedDate = flatpickr(timerOptions.input, options)
console.dir(selectedDate);
timerOptions.startBtn.addEventListener('click', onClickStart)

// після натискання кнопки "Старт" (startBtn) виконується перевірка умов
function onClickStart() {
  disableStartBtn();
  disableInput();
   if (chosenTime <= Date.now()) {
    clearHtml();
    Notify.info('The timer is in the past tense..')
    return
  }
  Notify.info('Starting timer..')
  timerId = setInterval(refreshTimer, 1000)
}

// обнулення вмісту в елементах HTML
function clearHtml() {
  timerOptions.days.innerHTML = "00";
  timerOptions.hours.innerHTML = "00";
  timerOptions.minutes.innerHTML = "00";
  timerOptions.seconds.innerHTML = "00";
}

// Функція буде викликана коли користувач вибере дату в минуому часі
function onDateInPast() {
  disableStartBtn();
  clearInterval(timerId);
  timerId = 0;
  clearHtml();
  return Notify.failure('Please choose a date in the future')
}

// выдображення оновлення часу в таймері
function refreshTimer() {
  if (chosenTime <= Date.now()) {
    clearInterval(timerId);
    timerId = 0;
    clearHtml();
    enableInput();
    return Notify.success('Timer succesfully finished')
  }

  remainTime = convertMs(chosenTime - Date.now());
  const { days, hours, minutes, seconds } = remainTime;
  timerOptions.days.innerHTML = addLeadingZero(days);
  timerOptions.hours.innerHTML = addLeadingZero(hours);
  timerOptions.minutes.innerHTML = addLeadingZero(minutes);
  timerOptions.seconds.innerHTML = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return `${value.toString().padStart(2, '0')}`;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}