// Функция для скрытия всех секций с вопросами
function hideAllSections() {
    const questionSections = document.querySelectorAll('.question-section');
    questionSections.forEach(section => section.style.display = 'none');
}

// Функция для показа конкретной секции с вопросом
function scrollToQuestion(questionId) {
    hideAllSections();
    const selectedQuestion = document.getElementById(questionId);
    selectedQuestion.style.display = 'block';
    selectedQuestion.scrollIntoView({ behavior: 'smooth' });
}

// Функция для перехода к следующему вопросу
function nextQuestion(nextQuestionId) {
    const currentQuestion = document.querySelector('.question-section[style*="block"]');
    if (currentQuestion) currentQuestion.style.display = 'none';

    const nextQuestionSection = document.getElementById(nextQuestionId);
    if (nextQuestionSection) {
        nextQuestionSection.style.display = 'block';
        nextQuestionSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Функция для возврата к началу
function goBack() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => location.reload(), 500); // Обновление страницы через задержку
}

// Данные вопросов
const questions = [
    {
        question: "1.Какое назначение дома?",
        options: [
            { label: "Жилой", value: 1, weight: 5000, img: "/images/uslug/vid1.jpg" },
            { label: "Коммерческий", value: 2, weight: 7000, img: "/images/uslug/images.jpeg" },
            { label: "Смешанный", value: 3, weight: 8000, img: "/images/uslug/29285037b982e36b229fe7d7731abc82.jpg" }
        ]
    },
    {
        question: "2.Какой тип фундамента?",
        options: [
            { label: "Ленточный", value: 1, weight: 3000, img: "/images/uslug/i.jpeg"},
            { label: "Свайный", value: 2, weight: 10000, img: "/images/uslug/images (1).jpeg" },
            { label: "Плитный", value: 3, weight: 6000, img: "/images/uslug/monolitnaya-plita_img.jpg" }
        ]
    },
    {
        question: "3.Какая высота цоколя?",
        options: [
            { label: "30 см.", value: 1, weight: 500, img: "/images/uslug/images (2).jpeg" },
            { label: "50 см.", value: 2, weight: 1000, img: "/images/uslug/images (2).jpeg" },
            { label: "80 см.", value: 3, weight: 1500, img: "/images/uslug/images (2).jpeg" }
        ]
    },
    {
        question: "4.Какую форму фундамента вы хотите?",
        options: [
            { label: "Прямоугольный", value: 1, weight: 11000, img: "/images/uslug/images (3).jpeg" },
            { label: "Круглый", value: 2, weight: 20000, img: "/images/uslug/images (4).jpeg"},
            { label: "Многоугольный", value: 3, weight: 15000, img: "/images/uslug/b14023c26adbd4050024b0bf9e7a2a22.jpg" }
        ]
    },
    {
        question: "5.Выберите длину фундамента",
        options: [
            { label: "0-10 метров", value: 1, weight: 500, img: "/images/uslug/1s.jpg"  },
            { label: "10-25 метров", value: 2, weight: 1000, img: "/images/uslug/1s.jpg" },
            { label: "25 и более метров", value: 3, weight: 1500, img: "/images/uslug/1s.jpg"  }
        ]
    },
    {
        question: "6.Выберите ширину фундамента",
        options: [
            { label: "1 метр", value: 1, weight: 500, img: "/images/uslug/images.png" },
            { label: "1.5 метра", value: 2, weight: 1000, img: "/images/uslug/images.png"  },
            { label: "2 метра", value: 3, weight: 1500, img: "/images/uslug/images.png"  }
        ]
    },
    {
        question: "7.Какой рельеф участка?",
        options: [
            { label: "Равнинный", value: 1, weight: 5000, img: "/images/uslug/pic_4_черепаново.jpg" },
            { label: "Холмистый", value: 2, weight: 8000, img: "/images/uslug/images (5).jpeg" },
            { label: "Склон", value: 3, weight: 15000, img: "/images/uslug/sklon_relef_trava_181914_2780x2780.jpg" }
        ]
    },
    {
        question: "8.Выберите этажность",
        options: [
            { label: "Одноэтажный", value: 1, weight: 10000, img: "/images/uslug/6809701585.jpg" },
            { label: "Двухэтажный", value: 2, weight: 16000, img: "/images/uslug/img2186_39554_1170p.jpg" },
            { label: "два и более этажа", value: 3, weight: 25000, img:"/images/uslug/3D-model-building-87905-xxl.jpg" }
        ]
    },
    {
        question: "9.Выберите вид мансардного этажа",
        options: [
            { label: "Без мансарды", value: 1, weight: 0, img: "/images/uslug/images (6).jpeg" },
            { label: "С мансардой", value: 2, weight: 3000, img: "/images/uslug/pexelrrrrrrphoto.jpg" },
            { label: "С частичной мансардой", value: 2000, weight: 15, img: "/images/uslug/images (7).jpeg" }
        ]
    }
];

let currentQuestionIndex = 0;
let totalWeight = 0;

// Начало теста
function startQuiz() {
    currentQuestionIndex = 0;
    totalWeight = 0;
    document.getElementById('questions-container').style.display = 'block';
    showQuestion(currentQuestionIndex);
    document.getElementById('questions-container').scrollIntoView({ behavior: 'smooth' });
}

// Отображение вопроса
function showQuestion(index) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    const questionData = questions[index];

    const questionBox = document.createElement('div');
    questionBox.className = 'question-box';

    const questionTitle = document.createElement('h3');
    questionTitle.textContent = questionData.question;
    questionBox.appendChild(questionTitle);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    questionData.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';

        const img = document.createElement('img');
        img.src = option.img;
        img.alt = `Вариант ${option.label}`;
        optionDiv.appendChild(img);

        const label = document.createElement('label');
        label.setAttribute('for', `option${index + 1}-${i + 1}`);
        label.textContent = option.label;
        optionDiv.appendChild(label);

        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `option${index + 1}-${i + 1}`;
        input.name = `answer${index + 1}`;
        input.value = option.value;
        input.setAttribute('data-weight', option.weight);
        optionDiv.appendChild(input);

        optionsDiv.appendChild(optionDiv);
    });

    questionBox.appendChild(optionsDiv);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-green';
    nextButton.textContent = 'Следующий вопрос';
    nextButton.onclick = handleNextButtonClick;

    const closeButton = document.createElement('button');
    closeButton.className = 'btn btn-red';
    closeButton.textContent = 'Закрыть тест';
    closeButton.onclick = goBack;

    buttonsDiv.appendChild(nextButton);
    buttonsDiv.appendChild(closeButton);

    questionBox.appendChild(buttonsDiv);
    container.appendChild(questionBox);
}

function handleNextButtonClick() {
    const selectedOption = document.querySelector(`input[name="answer${currentQuestionIndex + 1}"]:checked`);
    if (selectedOption) {
        totalWeight += parseInt(selectedOption.getAttribute('data-weight'));
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            showResult();
        }
    } else {
        alert('Пожалуйста, выберите вариант ответа.');
    }
}

// Отображение результата
function showResult() {
    const resultModal = document.getElementById('resultModal');
    resultModal.style.display = 'block';

    const finalResultTitle = document.getElementById('final-result-title');
    finalResultTitle.innerHTML = '';

    const resultHeading = document.createElement('h2');
    resultHeading.innerHTML = `Примерная цена вашего проекта 😄: <span style="color: red;">${totalWeight}$</span>`;
    finalResultTitle.appendChild(resultHeading);
}

// Закрытие модального окна
function closeModal() {
    const resultModal = document.getElementById('resultModal');
    resultModal.style.display = 'none';
    goBack();
}
