import getAndDisplayImg from "./getAndDisplayImage/index.js";
import finder from "./finder/index.js";
import {funcShowTags, funcAddTag} from "./tagsNav/index.js";
import funcDownloadAll from "./downloadAll/index.js";

const images = []

//=========== will reload when resize window ===========

//=========== get root ===========
const root = document.getElementById("root");

//=========== finder add event handler ===========
const finderInput = document.getElementById('finder')
finderInput.addEventListener('input', () => finder(finderInput.value, images, root))


//=========== navigation buttons ===========
const addPhoto = document.getElementById('addPhoto');
const photos = document.getElementById('photos');
const downloadAll = document.getElementById('downloadAll');
const deleteAll = document.getElementById('deleteAll');
const showTags = document.getElementById("showTags");
const addTag = document.getElementById('addTag')

//add events
addPhoto.addEventListener('change', (e) => doFile(e))
photos.addEventListener("click", () => getAndDisplayImg());
downloadAll.addEventListener('click', () => funcDownloadAll());
deleteAll.addEventListener('click', () => funcDeleteAll(db))
showTags.addEventListener('click', () => funcShowTags());
addTag.addEventListener('click', () => funcAddTag())


//===========================
//=========== IDB ===========
//===========================

let db;


//=========== create IDB when dom loaded first time ===========

document.addEventListener('DOMContentLoaded', initDb)

function initDb() {

    let reqDB = indexedDB.open('photos', 1);

    reqDB.onerror = function (e) {
        console.error('Unable to open database.');
    }

    //when first time create
    reqDB.onupgradeneeded = function (e) {
        db = e.target.result;
        db.createObjectStore('cachedForms', {autoIncrement: true});
    }

    //after open or onupgradeneeded
    reqDB.onsuccess = function (e) {
        db = e.target.result;
        console.log('DB opened first time');
        getAndDisplayImg();
    }
}


//=========== get new image and show ===========

function doFile(e) {
    console.log('New file');
    let file = e.target.files[0];
    const reader = new FileReader();

    //file object to string
    reader.readAsBinaryString(file);

    //when file is ready
    reader.onload = function (e) {
        let bits = e.target.result;
        let time = new Date()
        let img = {
            dateAdd: `${time.getFullYear()}:${time.getMonth() + 1}:${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
            description: 'Empty',
            data: bits,
            file
        };

        //transaction for add img to IDB
        let tx = db.transaction(['cachedForms'], 'readwrite');
        let addImg = tx.objectStore('cachedForms').add(img);

        addImg.onerror = function (e) {
            console.log('error storing data');
            console.error(e);
        }

        //when transaction complete
        tx.oncomplete = function (e) {
            console.log('data stored');
            getAndDisplayImg()
        }
    }
}



//=========== delete all data ===========

function funcDeleteAll(db) {
    if (confirm('You really wand to delete all photos?')) {
        let tx = db.transaction(['cachedForms'], 'readwrite');
        let store = tx.objectStore('cachedForms');

        //open cursor for get all values of objectStore
        let request = store.clear();

        request.onsuccess = function (e) {
            //удалить все фото из всех localStorage tag
            let tags = JSON.parse(localStorage.getItem('tags'))
            tags = tags.map(tagObj => {
                return {...tagObj, images: []}
            })
            tags = JSON.stringify(tags)
            localStorage.setItem('tags', tags)

            getAndDisplayImg(db, root)
        }
    }
}

