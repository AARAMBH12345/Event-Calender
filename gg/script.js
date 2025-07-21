const calendarDays = document.querySelector('.calendar-days');
const monthYearLabel = document.getElementById('monthYear');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const eventModal = document.getElementById('eventModal');
const closeModalBtn = document.getElementById('closeModal');
const eventForm = document.getElementById('eventForm');
const deleteEventBtn = document.getElementById('deleteEvent');

let currentDate = new Date();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('events')) || [];

function renderCalendar() {
  calendarDays.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  monthYearLabel.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

  for (let i = 1; i < firstDay.getDay(); i++) {
    calendarDays.innerHTML += `<div></div>`;
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const today = new Date();
    const isToday = today.toDateString() === new Date(year, month, d).toDateString();

    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    if (isToday) dayEl.classList.add('today');
    dayEl.dataset.date = dateStr;
    dayEl.innerHTML = `<strong>${d}</strong>`;

    const dayEvents = events.filter(e => e.date === dateStr);
    dayEvents.forEach(event => {
      const eventEl = document.createElement('div');
      eventEl.className = 'event';
      eventEl.textContent = event.title;
      dayEl.appendChild(eventEl);
    });

    dayEl.addEventListener('click', () => openModal(dateStr));
    calendarDays.appendChild(dayEl);
  }
}

function openModal(date) {
  selectedDate = date;
  eventForm.reset();
  document.getElementById('eventDateTime').value = `${date}T12:00`;
  deleteEventBtn.style.display = 'none';
  eventModal.classList.remove('hidden');
}

function closeModal() {
  eventModal.classList.add('hidden');
}

eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('eventTitle').value;
  const dateTime = document.getElementById('eventDateTime').value;
  const desc = document.getElementById('eventDesc').value;
  const recurrence = document.getElementById('eventRecurrence').value;

  const newEvent = {
    id: Date.now(),
    title,
    date: dateTime.split('T')[0],
    time: dateTime.split('T')[1],
    description: desc,
    recurrence
  };

  events.push(newEvent);

  // Recurrence
  if (recurrence !== 'none') {
    let recurDate = new Date(dateTime);
    for (let i = 0; i < 10; i++) {
      if (recurrence === 'daily') recurDate.setDate(recurDate.getDate() + 1);
      if (recurrence === 'weekly') recurDate.setDate(recurDate.getDate() + 7);
      if (recurrence === 'monthly') recurDate.setMonth(recurDate.getMonth() + 1);

      events.push({
        ...newEvent,
        id: Date.now() + i + 1,
        date: recurDate.toISOString().split('T')[0],
      });
    }
  }

  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
  renderCalendar();
});

deleteEventBtn.addEventListener('click', () => {
  events = events.filter(e => e.date !== selectedDate);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
  renderCalendar();
});

closeModalBtn.addEventListener('click', closeModal);
prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
