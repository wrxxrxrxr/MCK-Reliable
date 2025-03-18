const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3002;


const uri = 'mongodb://localhost:27017'; // Укажите ваш URI подключения
const client = new MongoClient(uri);
const dbName = 'imagebox'; // Ваша база данных
const collectionName = 'images'; // Ваша коллекция изображений
const contactCollectionName = 'contactForms'; // Коллекция для сообщений формы
const rewiesCollection = 'rewies'; 
const workerCollectionName = 'workers'; // Коллекция для рабочих
const workerCollectionOtdelName = 'workersOtdel';
const workerCollectionDemontName = 'workersDemont'; 
const proektirCollectionBooking='proektirBooking';

// Подключаемся один раз при запуске сервера
let db;
client.connect().then(() => {
    db = client.db(dbName);
    console.log('Подключение к MongoDB успешно установлено.');
}).catch(err => {
    console.error('Ошибка подключения к MongoDB:', err);
});



app.use(cors()); 
app.use(express.json());
app.use('/GALLERY', express.static(path.join(__dirname, 'GALLERY/photo'))); // Путь к изображениям
app.use('/workers/photos', express.static(path.join(__dirname, 'USLUGI/peoplesElec')));
app.use('/workersOtdel/photos', express.static(path.join(__dirname, 'USLUGI/peoples')));
app.use('/workersDemont/photos', express.static(path.join(__dirname, 'USLUGI/peoplesDemont')));


///////////////////////////////////////////////////////// Рабочие электромонтажники /////////////////////////////////////////////////////////
app.get('/api/workers', async (req, res) => {
    try {
        const workers = await db.collection(workerCollectionName).find({}).toArray();
        workers.forEach(worker => {
            worker.photoUrl = worker.photoUrl || '/default.jpg'; // Если фото нет, подставляем заглушку
        });
        res.json(workers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении рабочих электромонтажников' });
    }
});



///////////////////////////////////////////////////////// Рабочие отделочники /////////////////////////////////////////////////////////
app.get('/api/workersOtdel', async (req, res) => {
    try {
        const workers = await db.collection(workerCollectionOtdelName).find({}).toArray();
        res.json(workers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении рабочих отделочников' });
    }
});


///////////////////////////////////////////////////////// Рабочие демонтажники /////////////////////////////////////////////////////////
app.get('/api/workersDemont', async (req, res) => {
    try {
        const workers = await db.collection(workerCollectionDemontName).find().toArray();
        res.json(workers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении списка рабочих' });
    }
});

// Маршрут для получения информации о конкретном рабочем
app.get('/api/workersDemont/:id', async (req, res) => {
    try {
        const workerId = req.params.id;
        const worker = await db.collection(workerCollectionDemontName).findOne({ _id: new ObjectId(workerId) });

        if (worker) {
            res.json(worker);
        } else {
            res.status(404).json({ error: 'Рабочий не найден' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении информации о рабочем' });
    }
});




  

/////////////////////////////////////////////////////////ИЗОБРАЖЕНИЯ//////////////////////////////////////////////////////////
app.get('/api/images', async (req, res) => {
    try {
        const images = await db.collection(collectionName).find({}).toArray();
        res.json(images);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при получении изображений' });
    }
});

app.get('/api/images', async (req, res) => {
    try {
        const projects = await db.collection('images').find({}).toArray();

        // Преобразуем пути к изображениям в URL
        const projectsWithFixedPaths = projects.map(project => ({
            _id: project._id,
            title: project.title,
            images: project.images.map(img => img.replace(/D:\\рспо проект\\MCKReliable\\/g, 'http://localhost:3002/'))
        }));

        res.json(projectsWithFixedPaths);
    } catch (err) {
        console.error('Ошибка при получении проектов:', err);
        res.status(500).json({ error: 'Ошибка при получении проектов' });
    }
});

app.get('/api/images', async (req, res) => {
    try {
        const projects = await db.collection(collectionName).find({}).toArray();

        const projectsWithFixedPaths = projects.map(project => ({
            _id: project._id,
            title: project.title,
            images: project.images.map(img => img.replace(/D:\\рспо проект\\MCKReliable\\/g, 'http://localhost:3002/'))
        }));

        res.json(projectsWithFixedPaths);
    } catch (err) {
        console.error('Ошибка при получении проектов:', err);
        res.status(500).json({ error: 'Ошибка при получении проектов' });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id; // Получаем ID проекта из URL
        const result = await db.collection('images').deleteOne({ _id: new ObjectId(projectId) });

        if (result.deletedCount === 1) {
            res.json({ success: true, message: 'Проект успешно удален' });
        } else {
            res.status(404).json({ success: false, message: 'Проект не найден' });
        }
    } catch (err) {
        console.error('Ошибка при удалении проекта:', err);
        res.status(500).json({ error: 'Ошибка при удалении проекта' });
    }
});

// Обновление проекта
app.put('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const { title, images } = req.body;

        const updateFields = {};
        if (title) updateFields.title = title;
        if (images && Array.isArray(images)) updateFields.images = images;

        const result = await db.collection(collectionName).updateOne(
            { _id: new ObjectId(projectId) },
            { $set: updateFields }
        );

        if (result.modifiedCount === 1) {
            res.json({ success: true, message: 'Проект успешно обновлен' });
        } else {
            res.status(404).json({ success: false, message: 'Проект не найден' });
        }
    } catch (err) {
        console.error('Ошибка при обновлении проекта:', err);
        res.status(500).json({ error: 'Ошибка при обновлении проекта' });
    }
});

// Добавление нового проекта
app.post('/api/projects', async (req, res) => {
    try {
        const { title, images } = req.body;
        if (!title || !images || !Array.isArray(images)) {
            return res.status(400).json({ error: 'Некорректные данные' });
        }
        const newProject = { title, images };
        const result = await db.collection(collectionName).insertOne(newProject);
        res.json({ success: true, message: 'Проект добавлен', project: result.ops[0] });
    } catch (err) {
        console.error('Ошибка при добавлении проекта:', err);
        res.status(500).json({ error: 'Ошибка при добавлении проекта' });
    }
});



/////////////////////////////////////////////////ФОРМА ОБРАТНОЙ СВЯЗИ/////////////////////////////////////////////////////////
app.post('/api/contactForms', async (req, res) => {
    const { name, number, email, message } = req.body;

    if (!name || !number || !email || !message) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    try {
        const contactForm = {
            name,
            number,
            email,
            message,
            timestamp: new Date()
        };

        console.log('Документ для сохранения в contactForms:', contactForm);

        const result = await db.collection(contactCollectionName).insertOne(contactForm);

        console.log('Добавлена заявка в contactForms:', result);
        res.status(200).json({ success: 'Ваше сообщение успешно отправлено!' });
    } catch (err) {
        console.error('Ошибка при вставке в MongoDB:', err);
        res.status(500).json({ error: 'Ошибка при отправке сообщения' });
    }
});

///////////////////////////////////////////////Оформление/////////////////////////////////////////////////////////////
app.post('/api/bookings', async (req, res) => {
    const { name, phone, email, workerName, selectedDate, workType } = req.body;

    // Проверяем, что все поля заполнены
    if (!name || !phone || !email || !workerName || !selectedDate || !workType) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    try {
        const booking = {
            name,
            phone,
            email,
            workerName,
            selectedDate,
            workType,  // Добавляем тип работ
            timestamp: new Date(),
        };

        console.log('Документ для сохранения в bookings:', booking);  // Логирование

        const resultInsert = await db.collection('bookings').insertOne(booking);

        console.log('Добавлена заявка в bookings:', resultInsert);
        res.status(200).json({ success: 'Заявка успешно оформлена!' });
    } catch (err) {
        console.error('Ошибка при вставке в MongoDB:', err);
        res.status(500).json({ error: 'Ошибка при отправке данных заявки' });
    }
});


/////////////////////////////////////////////////////////Проектирование//////////////////////////////////////////////////
app.post('/api/proektirBooking', async (req, res) => {
    // Извлекаем данные из тела запроса
    const { name, email, phone, objectType, area, comment } = req.body;

    // Проверка, что все поля заполнены
    if (!name || !email || !phone || !objectType || !area || !comment) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    // Создаём объект для записи в базу данных
    const booking = {
        name,
        email,
        phone,
        objectType,
        area,
        comment,
        timestamp: new Date(), // Добавляем время запроса
    };

    try {
        // Вставляем данные в коллекцию MongoDB
        const resultInsert = await db.collection(proektirCollectionBooking).insertOne(booking);

        // Ответ пользователю, что заявка успешно отправлена
        res.status(200).json({ success: 'Заявка успешно оформлена!' });
    } catch (err) {
        console.error('Ошибка при вставке в MongoDB:', err);
        res.status(500).json({ error: 'Ошибка при отправке данных заявки' });
    }
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ОТЗЫВЫ


// Эндпоинт для получения всех отзывов
// Получение всех отзывов
app.get('/api/rewies', async (req, res) => {
    try {
        const reviews = await rewiesCollection.find({}).toArray();
        res.json(reviews); // Возвращаем JSON с отзывами
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        res.status(500).json({ error: 'Ошибка сервера' }); // Возвращаем JSON с ошибкой
    }
});

// Добавление нового отзыва
app.post('/api/rewies', async (req, res) => {
    try {
        const { name, email, review } = req.body;
        const result = await rewiesCollection.insertOne({ name, email, review, published: false });
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error);
        res.status(500).send('Ошибка сервера');
    }
});

// Публикация отзыва
app.put('/api/rewies/:id/publish', async (req, res) => {
    try {
        const { id } = req.params;
        await rewiesCollection.updateOne({ _id: new ObjectId(id) }, { $set: { published: true } });
        res.send('Отзыв опубликован');
    } catch (error) {
        console.error('Ошибка при публикации отзыва:', error);
        res.status(500).send('Ошибка сервера');
    }
});

// Удаление отзыва
app.delete('/api/rewies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await rewiesCollection.deleteOne({ _id: new ObjectId(id) });
        res.send('Отзыв удален');
    } catch (error) {
        console.error('Ошибка при удалении отзыва:', error);
        res.status(500).send('Ошибка сервера');
    }
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
