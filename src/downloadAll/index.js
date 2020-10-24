function funcDownloadAll(filterBy = false) {
    let reqDB = indexedDB.open('photos', 1);
    reqDB.onsuccess = function (e) {
        let db = e.target.result;
        console.log('DB opened for download images');

        let tx = db.transaction(['cachedForms'], 'readonly');
        let store = tx.objectStore('cachedForms');

        //open cursor for get all values of objectStore
        let req = store.openCursor();
        let zip = new JSZip()

        //div background for big image
        document.getElementById('cube-loader').style.display = 'flex'

        req.onsuccess = function (e) {
            const {result} = e.target;
            let cursor = result;
            if (cursor !== null) {

                //if tag, then filter
                if (filterBy) {

                    //get tag
                    let tags = JSON.parse(localStorage.getItem('tags'));
                    let tagObj = tags.filter(tag => tag.title === filterBy.innerHTML)[0];
                    debugger

                    //if includes, add to zip
                    tagObj.images.includes(cursor.key) && zip.file(`${cursor.value.file.name}`, cursor.value.file)
                } else {
                    debugger
                    zip.file(`${cursor.value.file.name}`, cursor.value.file)
                }
                cursor.continue();
            } else {
                zip.generateAsync({type: "blob"})
                    .then(function (blob) {
                        saveAs(blob, "all_images.zip");
                        document.getElementById('cube-loader').style.display = 'none'
                    });
            }
        }

        req.onerror = function (e) {
            console.log('Unable to display images' + e)
        }
    }
}



export default funcDownloadAll;