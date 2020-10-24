function createDivDescription(image) {

    //div with properties of image
    const divDescription = document.createElement('div')
    divDescription.id = 'description';
    Object.keys(image).forEach(key => {
        if (key !== 'src' && key !== 'file' && key !== 'Id' && image[key] !== undefined)
            divDescription.append(createOneProperty(key, image[key]))
    })

    //function create span for one property
    function createOneProperty(key, value) {
        const oneProperty = document.createElement('span')
        key === 'Orientation' ?
            oneProperty.innerHTML = `${key}: ${value < 5 ? 'Landscape' : 'Portrait'}` :
            oneProperty.innerHTML = `${key}: ${value}`
        oneProperty.style.margin = '5px'
        return oneProperty
    }

    return divDescription
}

export default createDivDescription;