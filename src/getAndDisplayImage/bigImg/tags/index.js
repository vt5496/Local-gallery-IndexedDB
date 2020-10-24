function createDivTags(image) {

    //div with all tags for bit image
    const divTags = document.createElement('div')
    divTags.id = 'bigImgTags';

    //get tags from localStorage
    let tags = JSON.parse(localStorage.getItem('tags'))

    //if tags be, show it
    if(tags) {
        tags.forEach(tagObj => divTags.append(createOneTag(tagObj)))

        //function create span for one tag
        function createOneTag({title, borderColor, images}) {

            //create black container for one tag
            const oneTagContainer = document.createElement('span')
            oneTagContainer.style.backgroundColor = 'black'

            //create one tag
            const oneTag = document.createElement('span')
            oneTag.innerHTML = title;
            oneTag.style.backgroundColor = borderColor;

            //if image added to tag change tag opacity
            if (images.includes(image.Id)) {
                nodeActive(oneTag)
            } else{
                nodePassive(oneTag)
            }

            //add event listener to tag
            oneTag.addEventListener('click', (e)=>imgAddToTag(e, image.Id))

            oneTagContainer.append(oneTag)
            return oneTagContainer
        }
    }

    //function for add photo to tag
    function imgAddToTag(e, id){
        let tags = JSON.parse(localStorage.getItem('tags'))
        tags = tags.map(tagObj=> {
            if (tagObj.title === e.target.innerHTML) {
                if (tagObj.images.includes(id)) {
                    tagObj.images = tagObj.images.filter(imgId => imgId !== id)
                    nodePassive(e.target)
                    return {...tagObj}
                } else {
                    tagObj.images.push(id)
                    nodeActive(e.target)
                    return {...tagObj}
                }
            } else {
                return tagObj
            }
        })
        localStorage.setItem('tags', JSON.stringify(tags))
    }

    function nodeActive(node){
        node.style.opacity = '100%'
        node.addEventListener('mouseover', e=>e.target.style.opacity = '80%')
        node.addEventListener('mouseout', e=>e.target.style.opacity = '100%')
    }

    function nodePassive(node) {
        node.style.opacity = '50%'
        node.addEventListener('mouseover', e=>e.target.style.opacity = '60%')
        node.addEventListener('mouseout', e=>e.target.style.opacity = '50%')
    }

    return divTags
}

export default createDivTags;