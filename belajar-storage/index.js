    // Ambil data dari localStorage saat halaman dibuka
    window.onload = function() {
        const savedName = localStorage.getItem('username');
        if (savedName) {
            document.getElementById('greeting').textContent = `Halo, ${savedName}!`;
        }
    };

    // Simpan nama ke localStorage
    function saveName() {
        const name = document.getElementById('nameInput').value;
        if (name) {
            localStorage.setItem('username', name);
            showGreeting();
            document.getElementById('nameInput').value = '';
        }
    }


    function removeName() {
        localStorage.removeItem('username');
        showGreeting();
    }

    function showGreeting() {
        const savedName = localStorage.getItem('username');
        const greetingDiv = document.getElementById('greeting');

        if (savedName) {
            greetingDiv.textContent = `Halo, ${savedName}!`;
        } else {
            greetingDiv.textContent = 'Belum ada nama yang disimpan.';
        }
    }