let nextId = 1;
let transactions = [];

document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportBtn');

    setTodayDate();
    // loadTransactions();
    // updateSummary();
    // displayTransactions();

    document.getElementById('transactionForm').addEventListener('submit', addNewTransaction);
    // document.getElementById('filterBulan').addEventListener('change', filterTransactions);
    // document.getElementById('filterJenis').addEventListener('change', filterTransactions);


    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
});


function showTemporaryMessage(message, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.cssText =
        `
            position : fixed;
            top : 20px;
            right : 20px;
            padding : 12px 20px;
            background-color :  ${type === 'success' ? '#f0fff4' : type === 'error' ? '#fef2f2' : '#ebf8ff'};
            border: 1px solid ${type === 'success' ? '#9ae6b4' : type === 'error' ? '#fca5a5' : '#90cdf4'};
            color : ${type === 'success' ? '#276749' : type === 'error' ? '#b91c1c' : '#1e40af'}; 
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index : 1000;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(messageElement);
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }
    }, 3000);
}

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.substring(0, 7);

    document.getElementById('tanggal').value = today;
    document.getElementById('filterBulan').value = currentMonth;

    console.log(today);
}

function addNewTransaction(e) {
    e.preventDefault();
    const jenis = document.getElementById('jenisTransaksi').value;

    const jumlah = document.getElementById('jumlah').value;
    const intJumlah = parseInt(jumlah);

    const deskripsi = document.getElementById('deskripsi').value;
    const tanggal = document.getElementById('tanggal').value;

    if (!jenis || !jumlah || !deskripsi || !tanggal) {
        alert('Semua field harus diisi!');
        return;
    }

    if (jumlah < 0) {
        alert('Jumlah tidak boleh negatif!');
        return;
    }

    const transaction = {
        id: nextId++,
        jenis: jenis,
        jumlah: intJumlah,
        deskripsi: deskripsi,
        tanggal: tanggal
    };

    transactions.push(transaction);

    // saveTransactions();
    updateSummary();
    // displayTransactions();

    showSuccesMessage();
    document.getElementById('transactionForm').reset();
    setTodayDate();
}

function updateSummary() {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    transactions.forEach(transaction => {
        if (transaction.jenis === 'pemasukan') {
            totalPemasukan += transaction.jumlah;
        } else {
            totalPengeluaran += transaction.jumlah;
        }
    });

    const saldo = totalPemasukan - totalPengeluaran;
    document.getElementById('totalPemasukan').textContent = formatCurrency(totalPemasukan);
    document.getElementById('totalPengeluaran').textContent = formatCurrency(totalPengeluaran);
    document.getElementById('saldoSaatIni').textContent = formatCurrency(saldo);
    const saldoElement = document.getElementById('saldoSaatIni');

    if (saldo >= 0) {
        saldoElement.style.color = '#059669';
    } else {
        saldoElement.style.color = '#dc2626';
    }
}


function showSuccesMessage() {
    const message = document.getElementById('successMessage');

    if (message) {
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    } else {
        showTemporaryMessage('Transaksi berhasil ditambahkan!', 'success');
    }
}