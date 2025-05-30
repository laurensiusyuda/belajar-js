let nextId = 1;
let transactions = [];

document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportBtn');

    setTodayDate();
    loadTransactions();
    updateSummary();
    displayTransactions();

    document.getElementById('transactionForm').addEventListener('submit', addNewTransaction);
    document.getElementById('filterBulan').addEventListener('change', filterTransactions);
    document.getElementById('filterJenis').addEventListener('change', filterTransactions);


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

    saveTransactions();
    updateSummary();
    displayTransactions();

    showSuccesMessage();
    document.getElementById('transactionForm').reset();
    setTodayDate();
}

function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


function displayTransactions(filteredTransactions = null) {
    const tbody = document.querySelector('#transactionTable tbody');
    const noTrasactionsMessage = document.getElementById('noTransactionsMessage');
    const transactionsToShow = filteredTransactions || transactions;

    if (!tbody) return;
    tbody.innerHTML = '';

    if (transactionsToShow.length === 0) {

        if (noTrasactionsMessage) {
            noTrasactionsMessage.style.display = 'block';
        }

        const table = document.getElementById('transactionTable');
        table.style.display = 'none';

        if (table) {
            table.style.display = 'none';
        }

        return;
    }


    if (noTrasactionsMessage) {
        noTrasactionsMessage.style.display = 'none';
    }

    const table = document.getElementById('transactionTable');

    if (table) {
        table.style.display = 'table';
    }

    const sortedTransactions = [...transactionsToShow].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    sortedTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        const amountClass = transaction.jenis === 'pemasukan' ? 'amount-pemasukan' : 'amount-pengeluaran';
        const amountSign = transaction.jenis === 'pemasukan' ? '+' : '-';

        row.innerHTML = `
            <td>${formatDate(transaction.tanggal)}</td>
            <td><span class="badge badge-${transaction.jenis}">${transaction.jenis.charAt(0).toUpperCase() + transaction.jenis.slice(1)}</span></td>
            <td>${escapeHtml(transaction.deskripsi)}</td>
            <td class="${amountClass}">${amountSign} ${formatCurrency(transaction.jumlah)}</td>
            <td class="action-buttons">
                <button onclick="editTransaction(${transaction.id})" class="edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTransaction(${transaction.id})" class="delete-btn" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    })
}


function editTransaction(id) {
    const transaction = transactions.find(transaction => transaction.id === id);
    if (!transaction) return;

    document.getElementById('jenisTransaksi').value = transaction.jenis;
    document.getElementById('jumlah').value = transaction.jumlah;
    document.getElementById('deskripsi').value = transaction.deskripsi;
    document.getElementById('tanggal').value = transaction.tanggal;

    transactions = transactions.filter(t => t.id !== id);
    transactions = transactions.filter(t => t.id !== id);

    updateSummary();
    filterTransactions();

    document.getElementById('transactionForm').scrollIntoView({ behavior: 'smooth' });
    showTemporaryMessage('Data transaksi telah dimuat ke form untuk diedit', 'info');
}

function updateFilteredSummary(filteredTransactions) {
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    filteredTransactions.forEach(transaction => {
        if (transaction.jenis === 'pemasukan') {
            totalPemasukan += transaction.jumlah;
        } else {
            totalPengeluaran += transaction.jumlah;
        }
    });
    const saldo = totalPemasukan - totalPengeluaran;
    const filteredSummary = document.getElementById('filteredSummary');

    if (filteredSummary) {
        filteredSummary.innerHTML = `
            <div class="filtered-stats">
                <h4>Ringkasan Filter:</h4>
                <p>Pemasukan: ${formatCurrency(totalPemasukan)}</p>
                <p>Pengeluaran: ${formatCurrency(totalPengeluaran)}</p>
                <p>Saldo: ${formatCurrency(saldo)}</p>
            </div>
        `;
    }
}

function deleteTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    const confirmMessage = `Apakah Anda yakin ingin menghapus transaksi "${transaction.deskripsi}" sebesar ${formatCurrency(transaction.jumlah)}?`;

    if (confirm(confirmMessage)) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        // saveTransactions();
        updateSummary();
        filterTransactions();
        showTemporaryMessage('Transaksi berhasil dihapus!', 'success');
    }

}


function filterTransactions() {
    const monthFilter = document.getElementById('filterBulan').value;
    const jenisFilter = document.getElementById('filterJenis').value;

    let filteredTransactions = transactions;

    if (monthFilter) {
        filteredTransactions = filteredTransactions.filter(t => t.tanggal.startsWith(monthFilter));
    }

    if (jenisFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.jenis === jenisFilter);
    }

    displayTransactions(filteredTransactions);
    updateFilteredSummary(filteredTransactions);
}

function loadSampleData() {
    const sampleTransactions = [{
            id: nextId++,
            jenis: 'pemasukan',
            jumlah: 5000000,
            deskripsi: 'Gaji Bulanan',
            tanggal: new Date().toISOString().split('T')[0]
        },
        {
            id: nextId++,
            jenis: 'pengeluaran',
            jumlah: 1500000,
            deskripsi: 'Belanja Bulanan',
            tanggal: new Date(Date.now() - 86400000).toISOString().split('T')[0]
        },
        {
            id: nextId++,
            jenis: 'pengeluaran',
            jumlah: 500000,
            deskripsi: 'Bensin Motor',
            tanggal: new Date(Date.now() - 172800000).toISOString().split('T')[0]
        }
    ];

    transactions = sampleTransactions;
}

function exportToCSV() {
    if (transactions.length === 0) {
        alert('Tidak ada data untuk diekspor!');
        return;
    }

    try {
        const headers = ['Tanggal', 'Jenis', 'Deskripsi', 'Jumlah'];
        const csvContent = [
            headers.join(','),
            ...transactions.map(t => [
                t.tanggal,
                t.jenis,
                `"${t.deskripsi.replace(/"/g, '""')}"`,
                t.jumlah
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transaksi_keuangan_${new Date().toISOString().split('T')[0]}.csv`;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);

        showTemporaryMessage('Data berhasil diekspor ke CSV!', 'success');
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showTemporaryMessage('Gagal mengekspor data!', 'error');
    }
}

function clearAllTransactions() {
    if (transactions.length === 0) {
        alert('Tidak ada data untuk dihapus!');
        return;
    }

    const confirmMessage = `Apakah Anda yakin ingin menghapus SEMUA transaksi (${transactions.length} transaksi)? Tindakan ini tidak dapat dibatalkan!`;

    if (confirm(confirmMessage)) {
        transactions = [];
        nextId = 1;
        saveTransactions();
        updateSummary();
        displayTransactions();
        showTemporaryMessage('Semua transaksi berhasil dihapus!', 'success');
    }
}

function searchTransactions(query) {
    if (!query || query.trim() === '') {
        displayTransactions();
        return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = transactions.filter(transaction =>
        transaction.deskripsi.toLowerCase().includes(searchTerm) ||
        transaction.jenis.toLowerCase().includes(searchTerm) ||
        formatCurrency(transaction.jumlah).toLowerCase().includes(searchTerm)
    );

    displayTransactions(filtered);

    if (filtered.length === 0) {
        showTemporaryMessage(`Tidak ditemukan transaksi dengan kata kunci "${query}"`, 'info');
    }
}

function getTransactionStats() {
    if (transactions.length === 0) {
        return {
            totalTransactions: 0,
            totalPemasukan: 0,
            totalPengeluaran: 0,
            avgPemasukan: 0,
            avgPengeluaran: 0,
            balance: 0
        };
    }

    const pemasukan = transactions.filter(t => t.jenis === 'pemasukan');
    const pengeluaran = transactions.filter(t => t.jenis === 'pengeluaran');

    const totalPemasukan = pemasukan.reduce((sum, t) => sum + t.jumlah, 0);
    const totalPengeluaran = pengeluaran.reduce((sum, t) => sum + t.jumlah, 0);

    return {
        totalTransactions: transactions.length,
        totalPemasukan,
        totalPengeluaran,
        avgPemasukan: pemasukan.length > 0 ? Math.round(totalPemasukan / pemasukan.length) : 0,
        avgPengeluaran: pengeluaran.length > 0 ? Math.round(totalPengeluaran / pengeluaran.length) : 0,
        balance: totalPemasukan - totalPengeluaran,
        pemasukanCount: pemasukan.length,
        pengeluaranCount: pengeluaran.length
    };
}

// Print transactions
function printTransactions() {
    if (transactions.length === 0) {
        alert('Tidak ada data untuk dicetak!');
        return;
    }

    const stats = getTransactionStats();
    const printWindow = window.open('', '_blank');

    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Laporan Keuangan Pribadi</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; text-align: center; }
                .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                .pemasukan { color: green; }
                .pengeluaran { color: red; }
                .print-date { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <h1>Laporan Keuangan Pribadi</h1>
            <div class="summary">
                <h3>Ringkasan</h3>
                <p>Total Transaksi: ${stats.totalTransactions}</p>
                <p>Total Pemasukan: ${formatCurrency(stats.totalPemasukan)} (${stats.pemasukanCount} transaksi)</p>
                <p>Total Pengeluaran: ${formatCurrency(stats.totalPengeluaran)} (${stats.pengeluaranCount} transaksi)</p>
                <p>Saldo: ${formatCurrency(stats.balance)}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Jenis</th>
                        <th>Deskripsi</th>
                        <th>Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                        .map(t => `
                        <tr>
                            <td>${formatDate(t.tanggal)}</td>
                            <td>${t.jenis.charAt(0).toUpperCase() + t.jenis.slice(1)}</td>
                            <td>${escapeHtml(t.deskripsi)}</td>
                            <td class="${t.jenis}">${t.jenis === 'pemasukan' ? '+' : '-'} ${formatCurrency(t.jumlah)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="print-date">
                Dicetak pada: ${new Date().toLocaleString('id-ID')}
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Save transactions to memory (placeholder for future localStorage implementation)
function saveTransactions() {
    // In a real app, this would save to localStorage:
    // localStorage.setItem('transactions', JSON.stringify(transactions));
    // localStorage.setItem('nextId', nextId.toString());
    
    // For debugging purposes, you can uncomment the following line:
    // console.log('Transactions saved:', transactions);
}

// Load transactions from memory (placeholder for future localStorage implementation)
function loadTransactions() {
    // In a real app, this would load from localStorage:
    // const savedTransactions = localStorage.getItem('transactions');
    // const savedNextId = localStorage.getItem('nextId');
    // 
    // if (savedTransactions) {
    //     transactions = JSON.parse(savedTransactions);
    // }
    // 
    // if (savedNextId) {
    //     nextId = parseInt(savedNextId);
    // }
    
    // For demo purposes, you can add sample data:
    // loadSampleData();
}