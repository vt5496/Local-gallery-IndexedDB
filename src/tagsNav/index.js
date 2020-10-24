//===========================
//=========== TAGS ==========
//===========================

//get element #tags
import getAndDisplayImg from "../getAndDisplayImage/index.js";

const tagsPanel = document.getElementById('tagsPanel');
const tags = document.getElementById('tags')

//=========== show all tags ===========

export function funcShowTags() {

    //show tags
    if (tagsPanel.style.display !== 'flex') {

        //get colors from local storage
        if (localStorage.getItem('tags') !== null) {
            let tagsArr = JSON.parse(localStorage.getItem('tags'))
            tagsArr.forEach(tag => {
                tags.prepend(createTag(tag.title, tag.borderColor))
            })
        }
        tagsPanel.style.display = 'flex'
    } else {
        tags.innerHTML = ''
        tagsPanel.style.display = 'none'
    }
}

//=========== add tag ===========

export function funcAddTag() {
    let name = prompt('Tag name');
    if (name) {
        if (name.length > 6){
            alert('Max tag characters are 7')
        } else {
            let tag = {title: name, borderColor: getRandomColor(), images: []}
            let tagsArr = []

            //add to array tas all tags
            if (localStorage.getItem('tags') !== null) {
                tagsArr = JSON.parse(localStorage.getItem('tags'))
            }

            //add tag if tags don`t have him
            if (!tagsArr.filter(oneTag => oneTag.title === tag.title)[0]) {
                tagsArr.push(tag)
                localStorage.setItem('tags', JSON.stringify(tagsArr))
                tags.innerHTML = '';
                tagsArr.forEach(tag => {
                    tags.prepend(createTag(tag.title, tag.borderColor))
                })
            } else {
                alert('You have this tag')
            }
        }
    }
}

//=========== functions for tag ===========

//generator random color
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//tag creator
function createTag(text, borderColor) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = text;
    tag.style.border = `3px solid ${borderColor}`;
    tag.addEventListener('click', (e)=>{
        getAndDisplayImg(e.target)
    })
    return tag
}
