function showStorageUsed(allUsedStorage) {

    //take nodes
    const usedStorageLine = document.getElementById('usedStorageLine')
    const usedStorageInfo = document.getElementById('usedStorageInfo')

    //calc all used storage
    let used = allUsedStorage.size;
    const photoCount = allUsedStorage.count
    used = (used / (1024 ** 2)).toFixed(2)

    //full storage
    const fullStorage = 500;

    //show info
    usedStorageInfo.innerHTML = `Used ${used}MB of ${fullStorage}MB. ${photoCount} photos.`
    usedStorageLine.style.width = `${(used / fullStorage) * 100}%`

}

export default showStorageUsed;