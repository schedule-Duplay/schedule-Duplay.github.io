document.addEventListener('DOMContentLoaded', function() {
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

    const { jsPDF } = window.jspdf;
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const downloadImgBtn = document.getElementById('download-img-btn');
    const captureElement = document.getElementById('capture');

    const setLoading = (button, isLoading) => {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.dataset.originalText = button.innerText;
            button.innerText = 'Memproses...';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.innerText = button.dataset.originalText;
        }
    };

    downloadPdfBtn.addEventListener('click', () => {
        setLoading(downloadPdfBtn, true);
        
        document.querySelector('.actions-container').style.visibility = 'hidden';

        html2canvas(captureElement, { scale: 2 }).then(canvas => {
            document.querySelector('.actions-container').style.visibility = 'visible';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('Jadwal-Mengajar.pdf');
            setLoading(downloadPdfBtn, false);
        });
    });

    downloadImgBtn.addEventListener('click', () => {
        setLoading(downloadImgBtn, true);

        document.querySelector('.actions-container').style.visibility = 'hidden';

        html2canvas(captureElement, { scale: 2 }).then(canvas => {
            document.querySelector('.actions-container').style.visibility = 'visible';
            
            const link = document.createElement('a');
            link.download = 'Jadwal-Mengajar.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            setLoading(downloadImgBtn, false);
        });
    });
});