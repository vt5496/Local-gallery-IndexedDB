import createDivButtons from "./butons/index.js";
import createDivDescription from "./description/index.js";
import createDivTags from "./tags/index.js";

function createImgBig(arrImages, i, getAndDisplayImg) {

    //div container for background and big image
    const container = document.createElement('div')
    container.classList.add('container2')


    //div background for big image
    const background = document.createElement('div')
    background.classList.add('background')
    background.addEventListener('click', () => {
        container.remove();
        document.body.style.overflow = 'visible'
    })

    //div container for big image and description
    const imgBigContainer = document.createElement('div')
    imgBigContainer.classList.add('bigImgContainer')

    //img in container
    const imgBig = document.createElement('img');
    imgBig.src = arrImages[i].src;
    imgBig.alt = 'image';

    //div buttons
    //arrImages and i for action 'goLeft' && 'goRight'
    const divButtons = createDivButtons(arrImages, i, getAndDisplayImg, createImgBig);

    //div tags
    const divTags = createDivTags(arrImages[i])

    //div description
    const divDescription = createDivDescription(arrImages[i])

    //appends nodes
    imgBigContainer.append(imgBig, divButtons, divTags, divDescription)
    container.append(background, imgBigContainer)
    document.body.append(container)
}

export default createImgBig;