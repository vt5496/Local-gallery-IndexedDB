import createImgBig from "./bigImg/index.js";
import showGalleryTagHeader from "./tagHeader/index.js";
import showStorageUsed from "./showStorageUsed/index.js";

//=========== class for image in array Images ===========

class Image {
    constructor(img, key) {
        function getExif(img, obj) {
            EXIF.getData(img.file, function () {
                let exif = EXIF.getAllTags(this);
                obj['Orientation'] = `${exif.Orientation}`
                obj['Model'] = `${exif.Make}: ${exif.Model}`
                obj['Size'] = `${exif.ImageWidth} x ${exif.ImageHeight}`
                obj['Weight'] = `${(img.file.size / (1024 ** 2)).toFixed(2)}MB`
                obj['Date add'] = img.dateAdd
                obj['Date created'] = `${exif.DateTime}`
            })
        }


        this['Name'] = img.file.name;
        this['Id'] = key;
        this['Type'] = img.file.type
        getExif(img, this)

        //hidden properties
        this.src = 'data:image/jpeg;base64,' + btoa(img.data);
        this.file = img.file;
        this['Description'] = img.description
    }
}

//=========== transaction for get values ===========

function getAndDisplayImg(filterValue = false, finder = false) {
    let reqDB = indexedDB.open('photos', 1);
    reqDB.onsuccess = function (e) {
        console.log('DB opened for get and display images');

        let db = e.target.result;
        let tx = db.transaction(['cachedForms'], 'readonly');
        let store = tx.objectStore('cachedForms');

        //open cursor for get all values of objectStore
        let req = store.openCursor(),

            //empty images and usedStorage
            images = [],
            allUsedStorage = {size: 0, count: 0};

        //when cursor started
        req.onsuccess = function (e) {
            const {result} = e.target;

            //while cursor !== null
            if (result !== null) {

                //for finder
                if (finder) {
                    result.value.file.name.includes(filterValue) && images.push(new Image(result.value, result.key));
                    allUsedStorage = calcStorage(allUsedStorage, result.value.file.size)

                } else {

                    //for tags
                    if (filterValue) {
                        let tags = JSON.parse(localStorage.getItem('tags'));
                        let tagObj = tags.filter(tag => tag.title === filterValue.innerHTML)[0];
                        tagObj.images.includes(result.key) && images.push(new Image(result.value, result.key));
                        allUsedStorage = calcStorage(allUsedStorage, result.value.file.size)

                        //for all images
                    } else {
                        images.push(new Image(result.value, result.key));
                        allUsedStorage = calcStorage(allUsedStorage, result.value.file.size)
                    }
                }
                result.continue();

            } else {

                //upgrade storage info
                showStorageUsed(allUsedStorage)

                //if finder – ignore filter value
                finder ? createGallery(images) : createGallery(images, filterValue);
            }
        }

        req.onerror = function (e) {
            console.log('Unable to display images' + e)
        }
    }

}

//=========== show all image in root ===========

function createGallery(arrImages, filterValue) {

    //clear all
    const root = document.getElementById("root");
    const tagHeader = document.getElementById("tagHeader");
    root.innerHTML = '';
    tagHeader.innerHTML = '';

    //if tag – show tag header
    if (filterValue) {
        showGalleryTagHeader(filterValue, getAndDisplayImg)
    }

    //show photos

    arrImages.forEach((image, i) => {

        //div image container
        const imgContainer = document.createElement("div");
        imgContainer.className = 'imgContainer';

        //change image container size for different display
        //root.clientWidth - because clientWidth return upward to its nearest integer value
        if (root.offsetWidth < 600) {
            imgContainer.style.width = imgContainer.style.height = (root.offsetWidth - 1) * 0.33 - 6 + 'px';
        } else {
            imgContainer.style.width = imgContainer.style.height = (root.offsetWidth - 1) / 5 - 20 + 'px';
        }

        //add event listener 'click' for show big image
        imgContainer.addEventListener("click", () => createImgBig(arrImages, i, getAndDisplayImg));

        //image element in imgContainer
        const img = document.createElement('img')
        img.src = image.src;
        img.alt = 'image';
        img.className = 'img';

        //add nodes
        imgContainer.append(img);
        root.append(imgContainer);
    })
    document.getElementById('cube-loader').style.display = 'none'
}

//=========== calculate storage ===========

function calcStorage(storage, value){
    storage.size += value;
    storage.count += 1;
    return storage
}

export default getAndDisplayImg;