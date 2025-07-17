document.addEventListener('DOMContentLoaded', function () {

    function getCurrentDayName() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const today = new Date().getDay();
        return days[today]; 
    }

    function highlightCurrentDay() {
        const currentDayName = getCurrentDayName();
        const scheduleRows = document.querySelectorAll('#schedule-table tbody tr');

        for (let i = 0; i < scheduleRows.length; i++) {
            const row = scheduleRows[i];
            const dayCell = row.querySelector('td'); 

            if (dayCell && dayCell.textContent === currentDayName) {
                const rowspan = parseInt(dayCell.getAttribute('rowspan'), 10) || 1;

                dayCell.classList.add('active-day-cell');

                for (let j = 0; j < rowspan; j++) {
                    if (scheduleRows[i + j]) {
                        scheduleRows[i + j].classList.add('current-day');
                    }
                }

                break;
            }
        }
    }

    highlightCurrentDay();

});