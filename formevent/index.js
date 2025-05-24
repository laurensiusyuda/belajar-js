document.addEventListener('DOMContentLoaded', function() {
    const inputNama = document.getElementById('inputNama');
    const sisaKarakter = document.getElementById('sisaKarakter');
    const notifikasiSisaKarakter = document.getElementById('notifikasiSisaKarakter');
    const inputCaptcha = document.getElementById('inputCaptcha');
    const submitButton = document.getElementById('submitButton');

    sisaKarakter.innerText = inputNama.maxLength;

    inputNama.addEventListener('input', function() {
        const jumlahKarakter = inputNama.value.length;
        const sisa = inputNama.maxLength - jumlahKarakter;
        if (sisa === 0) {
            sisaKarakter.innerText = 'Batas maksimal tercapai!';
        } else {
            sisaKarakter.innerText = sisa;
        }
        notifikasiSisaKarakter.style.color = sisa <= 5 ? 'red' : 'black';
    });

    inputNama.addEventListener('focus', () => {
        notifikasiSisaKarakter.style.visibility = 'visible';
    });

    inputNama.addEventListener('blur', () => {
        notifikasiSisaKarakter.style.visibility = 'hidden';
    });

    inputCaptcha.addEventListener('change', () => {
        if (inputCaptcha.value === 'PRNU') {
            submitButton.removeAttribute('disabled');
        } else {
            submitButton.setAttribute('disabled', '');
        }
    });

    document.getElementById('formDataDiri').addEventListener('submit', function(event) {
        event.preventDefault();
        const inputVal = inputCaptcha.value.trim();
        if (inputVal === 'PRNU') {
            alert('Selamat! Captcha Anda lolos :D');
            console.log('Form telah disubmit');
        } else {
            alert('Captcha Anda belum tepat :(');
            submitButton.setAttribute('disabled', '');
        }
    });

    document.getElementById('inputCopy').addEventListener('copy', () => {
        alert('Anda telah men-copy sesuatu...');
    });

    document.getElementById('inputPaste').addEventListener('paste', () => {
        alert('Anda telah mem-paste sebuah teks...');
    });
});