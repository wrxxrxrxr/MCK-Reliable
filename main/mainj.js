document.addEventListener("DOMContentLoaded", function() {
    // Инициализация intl-tel-input
    const phoneInput = document.querySelector("#phone");
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "auto", // автоматический выбор страны
        geoIpLookup: function(callback) {
            fetch("https://ipinfo.io", { headers: { 'Accept': 'application/json' } })
                .then(response => response.json())
                .then(data => callback(data.country))
                .catch(() => callback("by")); // если не удается получить страну, по умолчанию выбирается США
        },
        preferredCountries: ["by", "ru", "gb"], // список предпочтительных стран
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // скрипт для валидации номера
    });

    // Обработчик отправки формы
    document.getElementById('contact-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Получаем данные из формы
        const formData = {
            name: document.querySelector('[name="cf-name"]').value,
            // Получаем полный номер с кодом страны
            number: iti.getNumber(), // это вернет номер с кодом страны
            email: document.querySelector('[name="cf-email"]').value,
            message: document.querySelector('[name="cf-message"]').value,
        };

        try {
            const response = await fetch('http://localhost:3002/api/contactForms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.success);
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error('Ошибка отправки формы:', err);
            alert('Произошла ошибка при отправке сообщения');
        }
    });
});


const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) { // Показывать кнопку при прокрутке вниз на 300px
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});