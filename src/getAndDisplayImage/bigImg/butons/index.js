function createDivButtons(arrImages, i, getAndDisplayImg, createImgBig) {

    const root = document.getElementById("root");
    //create div for buttons

    const divButtons = document.createElement('div')
    divButtons.className = 'divButtons'

    //create button left

    if (i !== 0) {
        const left = document.createElement('img')
        left.src = './images/left.svg'
        left.alt = 'left'
        left.className = 'image-button'
        left.addEventListener('click', () => goLeft(arrImages, i))
        divButtons.append(left)
    }

    //create button right

    if (arrImages.length !== i + 1) {
        const right = document.createElement('img')
        right.src = './images/right.svg';
        right.alt = 'right';
        right.className = 'image-button';
        right.addEventListener('click', () => goRight(arrImages, i));
        divButtons.append(right);
    }

    //show tags if they be
    function showTags() {
        const tagStorage = localStorage.getItem('tags')
        if (tagStorage !== null && tagStorage.length) {
            const tags = document.createElement('img');
            tags.src = './images/tags.svg';
            tags.className = 'image-button';
            tags.alt = 'tags';
            tags.addEventListener('click', () => showOrHideNode('#bigImgTags', 'row'))
            return tags
        } else {
            return ''
        }
    }

    //create buttons – edit, info, download, tags, remove

    const edit = document.createElement('img');
    const download = document.createElement('img');
    const tags = showTags();
    const info = document.createElement('img');
    const remove = document.createElement('img');

    //add src – edit, info, download, remove

    edit.src = './images/edit.svg';
    download.src = './images/download.svg';
    info.src = './images/info.svg';
    remove.src = './images/remove.svg';

    //add class - edit, info, download, remove

    edit.className =
        download.className =
            info.className =
                remove.className = 'image-button';

    //add alt text - edit, info, download, remove

    edit.alt = 'edit';
    download.alt = 'download';
    info.alt = 'info';
    remove.alt = 'remove';

    //add id attribute for remove

    remove.id = arrImages[i].Id;

    //add event listener for edit, download, remove

    edit.addEventListener('click', () => updateDescription(arrImages, i))

    download.addEventListener('click', () => saveAs(arrImages[i].file, arrImages[i]['Name']))

    info.addEventListener('click', () => showOrHideNode('#description', 'column'))

    remove.addEventListener('click', (e) => {
        confirm('Are you really want to delete this photo?') ? deletePhoto(e, root) : false;
    })

    //=========== function goLeft for button left ===========

    function goLeft(arrImages, i) {
        document.querySelector('.container2').remove()
        createImgBig(arrImages, i - 1, getAndDisplayImg, root)
    }

    //=========== function goRight for button right ===========

    function goRight(arrImages, i) {
        document.querySelector('.container2').remove()
        createImgBig(arrImages, i + 1, getAndDisplayImg, root)
    }

    //=========== function show or hide element ===========

    function showOrHideNode(node, flexDirection = 'row') {
        if ($(node).first().is(":hidden")) {
            $(node).slideDown({
                duration: '2000',
                start: function () {
                    $(this).css({
                        display: "flex",
                        flexDirection
                    })
                }
            });
        } else {
            $(node).slideUp();
        }
    }

    //=========== function for create new description ===========

    function updateDescription(arrImages, i) {
        const image = arrImages[i]
        let reqDB = indexedDB.open('photos', 1);
        reqDB.onsuccess = function (e) {
            let {result} = e.target;

            const description = prompt('New description');

            // открываем транзакцию чтения/записи БД, готовую к удалению данных
            const tx = result.transaction(['cachedForms'], 'readonly');
            // описываем обработчики на завершение транзакции
            tx.oncomplete = () => {

                console.log('Transaction completed. Description got')
                const tx2 = result.transaction(['cachedForms'], 'readwrite');
                const store2 = tx2.objectStore('cachedForms');
                const newFile = {...req.result, description: description}
                const req2 = store2.put(newFile, image.Id);
                req2.onsuccess = () => console.log('Description changed')
                tx2.oncomplete = () => {
                    document.querySelector('.container2').remove()
                    getAndDisplayImg()
                }
            };
            tx.onerror = function (event) {
                alert('error in cursor request ' + event.target.errorCode);
            };

            // создаем хранилище объектов по транзакции
            const store = tx.objectStore('cachedForms');
            // получаем ключ записи
            const req = store.get(image.Id);
        }
    }

    //=========== function delete photo ===========

    function deletePhoto(event) {
        let reqDB = indexedDB.open('photos', 1);
        reqDB.onsuccess = function (e) {
            let db = e.target.result;

            // получаем ключ записи
            const id = event.target.getAttribute('id')
            // открываем транзакцию чтения/записи БД, готовую к удалению данных
            const tx = db.transaction(['cachedForms'], 'readwrite');
            // описываем обработчики на завершение транзакции
            tx.oncomplete = () => {
                console.log('Transaction completed. Photo deleted')
                getAndDisplayImg();
            };
            tx.onerror = function (event) {
                alert('error in cursor request ' + event.target.errorCode);
            };

            // создаем хранилище объектов по транзакции
            const store = tx.objectStore('cachedForms');
            // выполняем запрос на удаление указанной записи из хранилища объектов
            let req = store.delete(+id);

            req.onsuccess = () => {

                //удалить это фото из всех localStorage tag
                if (localStorage.getItem('tags') !== null) {
                    let tags = JSON.parse(localStorage.getItem('tags'))
                    tags = tags.map(tagObj => {
                        return {...tagObj, images: tagObj.images.filter(imgId => imgId !== +id)}
                    })
                    tags = JSON.stringify(tags)
                    localStorage.setItem('tags', tags)
                }

                // обрабатываем успех нашего запроса на удаление
                console.log('Delete request successful');
            };
            document.querySelector('.container2').remove()
        };
    }


    //=========== append all ===========
    divButtons.append(edit, download, tags, info, remove)
    return divButtons
}


export default createDivButtons;

