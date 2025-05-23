document.addEventListener('DOMContentLoaded', function() {
    const inputMaxLengthOnLoad = document.getElementById('inputNama').maxLength;
    document.getElementById('sisaKarakter').innerText = inputMaxLengthOnLoad;

    // ! on-input
    document.getElementById('inputNama').addEventListener('input', function() {
        const jumlahKarakterDiInput = document.getElementById('inputNama').value.length;
        const jumnlahKarakterMaksimal = document.getElementById('inputNama').maxLength;
        const sisaKarakterUpdate = jumnlahKarakterMaksimal - jumlahKarakterDiInput;
        document.getElementById('sisaKarakter').innerText = sisaKarakterUpdate.toString();
        if (sisaKarakterUpdate === 0) {
            document.getElementById('sisaKarakter').innerText = 'Batas maksimal tercapai!';
        } else if (sisaKarakterUpdate <= 5) {
            document.getElementById('notifikasiSisaKarakter').style.color = 'red';
        } else {
            document.getElementById('notifikasiSisaKarakter').style.color = 'black';
        }
    });

    // ! on focus
    document.getElementById('inputNama').addEventListener('focus', function() {
        document.getElementById('notifikasiSisaKarakter').style.visibility = 'visible';
    })

    // ! on blur
    document.getElementById('inputNama').addEventListener('blur', function() {
        document.getElementById('notifikasiSisaKarakter').style.visibility = 'hidden';
    });

    // ! on change 
    document.getElementById('inputCaptcha').addEventListener('change', function() {
        const inputCaptcha = document.getElementById('inputCaptcha').value;
        const submitButtonStatus = document.getElementById('submitButton');
        if (inputCaptcha === 'PRNU') {
            submitButtonStatus.removeAttribute('disabled');
        } else {
            submitButtonStatus.setAttribute('disabled', '');
        }
    });

    // ! on submit 
    document.getElementById('formDataDiri').addEventListener('submit', function(event) {
        const inputCaptcha = document.getElementById('inputCaptcha').value;
        if (inputCaptcha === 'PRNU') {
            alert('Selamat! Captcha Anda lolos :D');
        } else {
            console.log('Captcha Anda belum tepat :(');
            alert('Captcha Anda belum tepat :(');
            document.getElementById('submitButton').setAttribute('disabled', '');
        }
        console.log('Form telah disubmit');
        event.preventDefault();
    });

});