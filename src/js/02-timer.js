// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";



const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate > new Date()) {
            btnStart.disabled = false;
            countdownToDate = selectedDate;
        } else {
            window.alert('Please choose a date in the future')
            btnStart.disabled = true
        }    
  },
};

