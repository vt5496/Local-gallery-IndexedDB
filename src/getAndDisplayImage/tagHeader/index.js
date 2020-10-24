import funcDownloadAll from "../../downloadAll/index.js";

function showGalleryTagHeader(filterBy, getAndDisplayImg) {
    //show tag name
    const tagHeader = document.getElementById("tagHeader");
    tagHeader.innerHTML = '';

    //create tagName span
    const tagName = document.createElement('span');
    tagName.className = 'tagName';
    tagName.style.backgroundColor = filterBy.style.borderColor;
    tagName.innerHTML = filterBy.innerHTML

    //create buttons
    const tagButtons = createTagButtons(filterBy, getAndDisplayImg);

    //append all to tag header of gallery
    tagHeader.append(tagName, tagButtons);
}

function createTagButtons(tagName, getAndDisplayImg) {
    const tagButtons = document.createElement('div')
    tagButtons.className = 'tagButtons'

    const downloadAll = document.createElement('div')
    const deleteImages = document.createElement('div')
    const deleteTag = document.createElement('div')

    downloadAll.innerHTML = 'Download';
    deleteImages.innerHTML = 'Clear tag';
    deleteTag.innerHTML = 'Delete tag';

    downloadAll.className =
        deleteImages.className =
            deleteTag.className =
                'tagButton';

    downloadAll.addEventListener('click', () => {
        funcDownloadAll(tagName)
    })

    deleteImages.addEventListener('click', () => {
        confirm('Are you really want to clear tag?') ? funcDeleteImages(tagName, getAndDisplayImg) : false
    })

    deleteTag.addEventListener('click', () => {
        confirm('Are you really want to delete tag?') ? funcDeleteTag(tagName) : false
    })

    tagButtons.append(downloadAll, deleteImages, deleteTag)
    return tagButtons
}

function funcDeleteImages(tagName, getAndDisplayImg) {
    let tags = JSON.parse(localStorage.getItem('tags'))
    tags = tags.map(tag =>
        tag.title === tagName.innerHTML ? {...tag, images: []} : tag)
    tags = JSON.stringify(tags)
    localStorage.setItem('tags', tags)
    getAndDisplayImg(tagName)
}

function funcDeleteTag(tagName){
    let tags = JSON.parse(localStorage.getItem('tags'))
    tags = tags.filter(tag => tag.title !== tagName.innerHTML)
    tags = JSON.stringify(tags)
    localStorage.setItem('tags', tags)
    location.reload()
}

export default showGalleryTagHeader;