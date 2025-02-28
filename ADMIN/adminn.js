//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Обработка заказов
    document.addEventListener("DOMContentLoaded", async function () {
        const tableBody = document.getElementById("projects-table-body");
    
        async function loadProjects() {
            try {
                const response = await fetch("http://localhost:3002/api/images");
                const projects = await response.json();
                // tableBody.innerHTML = ""; 
    
                projects.forEach((project) => {
                    const row = document.createElement("tr");
    
                    row.innerHTML = `
                        <td>${project._id}</td>
                        <td>${project.title}</td>
                        <td>
                            <div class="project-photos">
                                ${project.images.map(photo => `<img src="${photo}" alt="Фото проекта" width="100">`).join('')}
                            </div>
                        </td>
                        <td>
                            <button onclick="editProject('${project._id}')">Редактировать</button>
                            <button onclick="deleteProject('${project._id}')">Удалить</button>
                        </td>
                    `;
    
                    tableBody.appendChild(row);
                });
            } catch (error) {
                console.error("Ошибка загрузки проектов:", error);
            }
        }
        // window.loadProjects = loadProjects;
    });

    async function deleteProject(projectId) {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
        try {
            const response = await fetch(`http://localhost:3002/api/projects/${projectId}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                alert('Проект успешно удален');
                loadProjects(); // Перезагружаем список проектов
            } else {
                alert('Не удалось удалить проект');
            }
        } catch (error) {
            console.error('Ошибка при удалении проекта:', error);
            alert('Ошибка при удалении проекта');
        }
    }
    window.loadProjects = loadProjects;
}

async function editProject(projectId) {
    const newTitle = prompt('Введите новое название проекта:');
    if (newTitle) {
        try {
            const response = await fetch(`http://localhost:3002/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle, images: imagesArray }) // Отправляем новые данные
            });
            const result = await response.json();

            if (result.success) {
                alert('Проект успешно обновлен');
                loadProjects(); // Перезагружаем список проектов
            } else {
                alert('Не удалось обновить проект');
            }
        } catch (error) {
            console.error('Ошибка при обновлении проекта:', error);
            alert('Ошибка при обновлении проекта');
        }
    }
    window.loadProjects = loadProjects;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Управление калькулятором








//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Управление рабочими


let currentWorkerId;

function editWorker(workerId, name, age, experience) {
    currentWorkerId = workerId;
    document.getElementById('workerName').value = name;
    document.getElementById('workerAge').value = age;
    document.getElementById('workerExperience').value = experience;
    document.getElementById('edit-worker-form').style.display = 'block';
}

function closeEditForm() {
    document.getElementById('edit-worker-form').style.display = 'none';
}

document.getElementById('saveWorkerButton').addEventListener('click', async () => {
    const name = document.getElementById('workerName').value;
    const age = document.getElementById('workerAge').value;
    const experience = document.getElementById('workerExperience').value;
    const photoUrl = document.getElementById('workerPhoto').value;

    await updateWorker(currentWorkerId, { name, age, experience, photoUrl });
    closeEditForm();
});

async function updateWorker(workerId, updatedData) {
    try {
        const response = await fetch(`http://127.0.0.1:3002/api/workers/${workerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            location.reload(); // Обновляем страницу после успешного обновления
        } else {
            console.error('Ошибка при обновлении рабочего');
        }
    } catch (error) {
        console.error('Ошибка при обновлении:', error);
    }
}

const baseUrl = 'http://localhost:3002';

async function fetchWorkers(apiUrl, tableId, workerType) {
    try {
        const response = await fetch(apiUrl);
        const workers = await response.json();
        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = ''; // Очистка перед добавлением новых данных

        workers.forEach(worker => {
            const photoUrl = `${baseUrl}/workers${workerType}/photos${worker.photoUrl}`;
            console.log(`Fetching photo for ${worker.name}: ${photoUrl}`); // Логируем URL фото
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${worker._id}</td>
                <td>${worker.name}</td>
                <td>${worker.age}</td>
                <td>${worker.experience}</td>
                <td>
                    <img src="${photoUrl}" alt="${worker.name}" style="width:50px; height:50px; object-fit:cover;">
                </td>
                <td>
                    <button onclick="editWorker('${worker._id}', '${worker.name}', '${worker.age}', '${worker.experience}')">Редактировать</button>
                    <button onclick="deleteWorker('${worker._id}', '${apiUrl}')">Удалить</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

    async function deleteWorker(workerId, apiUrl) {
        if (!confirm('Вы уверены, что хотите удалить рабочего?')) return;
        try {
            const response = await fetch(`${apiUrl}/${workerId}`, { method: 'DELETE' });
            if (response.ok) {
                location.reload(); // Обновляем страницу после удаления
            } else {
                console.error('Ошибка при удалении рабочего');
            }
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    }


    document.getElementById('add-worker-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const name = document.getElementById('worker_name').value;
    const position = document.getElementById('worker_position').value;
    const age = document.getElementById('worker_age').value;
    const experience = document.getElementById('worker_experience').value;
    const photoUrl = document.getElementById('worker_photo').value;

    const newWorker = {
        name,
        position,
        age,
        experience,
        photoUrl
    };

    await addWorker(newWorker);
    document.getElementById('add-worker-form').reset(); // Сброс формы
});

async function addWorker(workerData) {
    try {
        const response = await fetch('http://127.0.0.1:3002/api/workers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workerData)
        });

        if (response.ok) {
            location.reload(); // Обновляем страницу после успешного добавления
        } else {
            console.error('Ошибка при добавлении рабочего');
        }
    } catch (error) {
        console.error('Ошибка при добавлении:', error);
    }
}



    // Выгружаем данные при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        fetchWorkers('http://127.0.0.1:3002/api/workers', 'electromontage-workers');
        fetchWorkers('http://127.0.0.1:3002/api/workersOtdel', 'otdel-workers');
        fetchWorkers('http://127.0.0.1:3002/api/workersDemont', 'demont-workers');
    });





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Обработка заказов










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Управление отзывами