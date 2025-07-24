document.addEventListener('DOMContentLoaded', function () {
    // Fungsi untuk mendapatkan nama hari saat ini
    function getCurrentDayName() {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const today = new Date().getDay();
        return days[today];
    }

    // Fungsi untuk menandai hari saat ini di tabel
    function highlightCurrentDay() {
        const currentDayName = getCurrentDayName();
        const scheduleRows = document.querySelectorAll('#schedule-table tbody tr');

        for (let i = 0; i < scheduleRows.length; i++) {
            const row = scheduleRows[i];
            const dayCell = row.querySelector('td');
            if (dayCell && dayCell.textContent.trim() === currentDayName) { // .trim() untuk memastikan tidak ada spasi ekstra
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

    // Panggil fungsi highlightCurrentDay saat DOM dimuat
    highlightCurrentDay();

    // --- LOGIKA TOOLTIP ---
    // Fungsi untuk membuat dan menambahkan tooltip ke setiap slot kelas
    function addTooltips() {
        const classSlots = document.querySelectorAll('.class-slot');
        classSlots.forEach(slot => {
            const info = slot.getAttribute('data-info');
            if (info) {
                const tooltipText = document.createElement('span');
                tooltipText.classList.add('tooltip-text');
                tooltipText.textContent = info;
                slot.appendChild(tooltipText);
            }
        });
    }

    // Panggil fungsi addTooltips saat DOM selesai dimuat
    addTooltips();
    // --- AKHIR LOGIKA TOOLTIP ---


    // --- LOGIKA DOWNLOAD ---
    const { jsPDF } = window.jspdf;
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const downloadImgBtn = document.getElementById('download-img-btn');
    const captureElement = document.getElementById('capture');

    // Fungsi utilitas untuk mengatur status loading tombol
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

    // Event listener untuk tombol Unduh PDF
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', async () => {
            setLoading(downloadPdfBtn, true);

            // Sembunyikan semua tooltip sebelum menangkap gambar
            const tooltips = document.querySelectorAll('.tooltip-text');
            tooltips.forEach(tooltip => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            });

            // Tangkap elemen dengan html2canvas
            const canvas = await html2canvas(captureElement, {
                scale: 2, // Meningkatkan kualitas gambar
                useCORS: true // Penting jika ada gambar eksternal
            });

            // Tampilkan kembali semua tooltip setelah menangkap gambar
            tooltips.forEach(tooltip => {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape', // Mengatur orientasi landscape
                unit: 'pt',
                format: [canvas.width, canvas.height] // Mengatur ukuran PDF sesuai canvas
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('Jadwal-Mengajar.pdf');
            setLoading(downloadPdfBtn, false);
        });
    }

    // Event listener untuk tombol Unduh Gambar (PNG)
    if (downloadImgBtn) {
        downloadImgBtn.addEventListener('click', async () => {
            setLoading(downloadImgBtn, true);

            // Sembunyikan semua tooltip sebelum menangkap gambar
            const tooltips = document.querySelectorAll('.tooltip-text');
            tooltips.forEach(tooltip => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            });

            // Tangkap elemen dengan html2canvas
            const canvas = await html2canvas(captureElement, {
                scale: 2,
                useCORS: true
            });

            // Tampilkan kembali semua tooltip setelah menangkap gambar
            tooltips.forEach(tooltip => {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            });

            const link = document.createElement('a');
            link.download = 'Jadwal-Mengajar.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            setLoading(downloadImgBtn, false);
        });
    }
    // --- AKHIR LOGIKA DOWNLOAD ---
});