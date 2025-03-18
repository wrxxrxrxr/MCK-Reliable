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






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Отправка данных формы в MongoDB
document.getElementById('reviewForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const reviewData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        review: document.getElementById('review').value,
        published: false // По умолчанию отзыв не опубликован
    };

    // Отправка данных на сервер
    fetch('http://localhost:3002/api/rewies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Спасибо за ваш отзыв! Он будет опубликован после проверки.');
        $('#reviewModal').modal('hide'); // Закрыть модальное окно
        document.getElementById('reviewForm').reset(); // Очистить форму
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
});

// Загрузка опубликованных отзывов для пользователей
async function loadPublishedReviews() {
    try {
        const response = await fetch('http://localhost:3002/api/rewies?published=true');
        const reviews = await response.json();

        const reviewsContainer = document.getElementById('published-reviews');
        reviewsContainer.innerHTML = ''; // Очищаем контейнер

        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'col-12 mb-4';
            reviewElement.innerHTML = `
                <div class="card rounded-lg p-3">
                    <h5 class="font-weight-bold">${review.name}</h5>
                    <p>${review.review}</p>
                </div>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Загрузить отзывы при загрузке страницы
window.onload = loadPublishedReviews;

///////////////////////////////////////////////////////////////////////////////////////////////////////////







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