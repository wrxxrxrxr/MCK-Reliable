document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('galleryContainer');
    const modal = document.getElementById('myModal');
    const modalGallery = document.getElementById('modalGallery');
    const closeModal = document.querySelector('.close');

    try {
        const response = await fetch('http://localhost:3002/api/images');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const images = await response.json();
        console.log('Loaded images:', images);

        galleryContainer.innerHTML = ''; // Очистите контейнер перед добавлением изображений

        images.forEach(image => {
            console.log('Image data:', image);
            const basePath = 'D:\\рспо проект\\MCKReliable\\GALLERY\\photo\\';
            const relativePath = image.thumbnail.startsWith(basePath)
                ? image.thumbnail.replace(basePath, '')
                : image.thumbnail;

            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card" data-id="${image._id.$oid || image._id}">
                        <img src="http://localhost:3002/GALLERY/${relativePath}" class="card-img-top" alt="${image.title}">
                        <div class="card-body">
                            <h5 class="card-title">${image.title}</h5>
                        </div>
                    </div>
                </div>`;
            galleryContainer.insertAdjacentHTML('beforeend', card);
        });

        // Добавление события на карточки
        galleryContainer.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', () => {
                const imageId = card.getAttribute('data-id');
                console.log('Clicked card ID:', imageId);

                const selectedImage = images.find(img => img._id.$oid === imageId || img._id === imageId);
                console.log('Selected image data:', selectedImage);

                if (selectedImage) {
                    modalGallery.innerHTML = ''; // Очищаем модальное окно перед добавлением новых изображений
                    selectedImage.images.forEach(imgPath => {
                        const relativePath = imgPath.replace(/^.*[\\/]/, '');

                        const imgElement = `
                            <div>
                                <img src="http://localhost:3002/GALLERY${relativePath}" class="img-fluid" alt="Фото объекта">
                            </div>`;
                        modalGallery.insertAdjacentHTML('beforeend', imgElement);
                    });

                    // Показываем модальное окно
                    modal.style.display = 'block';
                }
            });
        });

        // Закрытие модального окна
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Закрытие модального окна при клике вне его содержимого
        window.addEventListener('click', event => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

    } catch (error) {
        console.error('Ошибка при загрузке изображений:', error);
        galleryContainer.innerHTML = `<p class="text-center text-danger">Не удалось загрузить изображения.</p>`;
    }
});
