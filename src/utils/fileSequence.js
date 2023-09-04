/**
 * create by amanda 2023.6
 * It mainly solves the data that adot searches back, obtains the required part, and serializes the data
 */

import {adotAppName} from "@/utils/constant/chainConst"
import moment from "moment"
import {getFileSize} from "@/utils/util";

/**
 * Determines whether the current string is in JSON data format
 * @param value
 * @returns {boolean}
 */
export function checkJSON(value) {
    if (typeof value === 'string') {
        try {
            const obj = JSON.parse(value)
            return Object.keys(obj).length !== 0
        } catch (e) {
            return false
        }
    } else {
        return false
    }
}

/**
 * Calculate the size of the JSON
 * @param str
 * @returns {*}
 */
function getBytesLength(str) {
    const lg = str.replace(/[^x00-xFF]/g, '**').length
    return getFileSize(lg)

}

/**
 * Check whether there is a corresponding APP-name in tags (different app-name has a corresponding data structure)
 * @param tags
 * @returns {string|*}
 */
export function getUploadAppName(tags) {
    if (!tags || !Array.isArray(tags)) {
        return ''
    }
    // weweave and mscProject
    const weweaveTags = tags.filter(item => (item.value.toUpperCase() === adotAppName.weweave.toUpperCase() || item.value.toUpperCase() === adotAppName.mscProject.toUpperCase()))
    if (weweaveTags && weweaveTags.length !== 0) {
        return weweaveTags[0].value
    }
    // SmartWeaveContract
    const filterList = tags.filter(item => item.value.toUpperCase() === adotAppName.smartWeaveContract.toUpperCase())
    if (filterList && filterList.length !== 0) {
        return filterList[0].value
    }
    // mirror
    const mirrorTags = tags.filter(item => item.value.toUpperCase() === adotAppName.mirror.toUpperCase())
    if (mirrorTags && mirrorTags.length !== 0) {
        return mirrorTags[0].value
    }
    // twitter
    const twitterTags = tags.filter(item => item.value.toUpperCase() === adotAppName.twitter.toUpperCase())
    if (twitterTags && twitterTags.length !== 0) {
        return twitterTags[0].value
    }
    return ''
}

/**
 * data search results from adot are not in the JSON of data, and the body will not have data, so you need to use the data of tags to obtain relevant content
 * @param dataObj
 * @returns {*}
 */
export function formatWeWeaveData(dataObj) {
    const fileObj = {}
    dataObj.tags.forEach(item => {
        // fileName
        if (item.name && (item.name.toUpperCase() === 'name'.toUpperCase() || item.name.toUpperCase() === 'fileName'.toUpperCase())) {
            fileObj.fileName = item.value
        }
        // Content-Type
        if (item.name && (item.name.toUpperCase() === 'Content-Type'.toUpperCase() || item.name.toUpperCase() === 'type'.toUpperCase())) {
            fileObj.fileType = item.value
        }
        // fileSize
        if (item.name && (item.name.toUpperCase() === 'file-size'.toUpperCase())) {
            fileObj.fileSize = getFileSize(Number(item.value))
        }
    })
    return fileObj
}

/**
 * Mirror the content of the returned data
 * @param dataObj
 * @returns {*}
 */
export function formatMirrorData(dataObj) {
    const fileObj = {}
    dataObj.tags.forEach(item => {
        // Content-Type
        if (item.name && (item.name.toUpperCase() === 'Content-Type'.toUpperCase() || item.name.toUpperCase() === 'type'.toUpperCase())) {
            fileObj.fileType = item.value
        }
    })
    if (dataObj.data && checkJSON(dataObj.data)) {
        fileObj.info = JSON.parse(dataObj.data)
        fileObj.fileName = fileObj.info.content ? fileObj.info.content.title : '--'
    }
    fileObj.fileSize = getBytesLength(dataObj.data)
    fileObj.time = moment(dataObj.createdTime).format('YYYY.MM.DD')
    fileObj.timeStampStr = moment(dataObj.createdTime).format('YYYY.MM.D  HH:mm:SS  A')
    return fileObj
}

//Author-Name
export function formatTwitterData(dataObj) {
    const fileObj = {}
    dataObj.tags.forEach(item => {
        // Content-Type
        if (item.name && (item.name.toUpperCase() === 'Content-Type'.toUpperCase() || item.name.toUpperCase() === 'type'.toUpperCase())) {
            fileObj.fileType = item.value
        }
        // fileName
        if (item.name && (item.name.toUpperCase() === 'Author-Name'.toUpperCase())) {
            fileObj.fileName = item.value
        }
    })
    if (dataObj.data && checkJSON(dataObj.data)) {
        fileObj.info = JSON.parse(dataObj.data)
        fileObj.timeStampStr = fileObj.info.created_at ? moment(fileObj.info.created_at).format('YYYY.MM.D  HH:mm:SS  A') : '--'
        fileObj.time = fileObj.info.created_at ? moment(fileObj.info.created_at).format('YYYY.MM.DD') : '--'
    }
    fileObj.fileSize = getBytesLength(dataObj.data)
    return fileObj
}

/**
 * SmartWeaveContract: data structure tags include name and type,
 * the rest of the time is in the post after data serialization
 * @param dataObj
 * @returns {*}
 */
export function formatSmartWeaveContractData(dataObj) {
    const fileObj = {}
    dataObj.tags.forEach(item => {
        // Content-Type
        if (item.name && (item.name.toUpperCase() === 'Content-Type'.toUpperCase())) {
            fileObj.fileType = item.value
        }
        // fileName
        if (item.name && (item.name.toUpperCase() === 'title'.toUpperCase())) {
            fileObj.fileName = item.value
        }
    })
    if (dataObj.data && checkJSON(dataObj.data)) {
        fileObj.info = JSON.parse(dataObj.data)
        fileObj.timeStampStr = fileObj.info.post && fileObj.info.post.created_at ? moment(fileObj.info.post.created_at).format('YYYY.MM.D  HH:mm:SS  A') : '--'
        fileObj.time = fileObj.info.post && fileObj.info.post.created_at ? moment(fileObj.info.post.created_at).format('YYYY.MM.DD') : '--'
    }
    fileObj.fileSize = getBytesLength(dataObj.data)
    return fileObj
}

/**
 * Other data formats require constant validation
 * @param dataObj
 * @returns {*}
 */
export function formatOtherData(dataObj) {
    const fileObj = {}
    dataObj.tags.forEach(item => {
        // Content-Type
        if (item.name && (item.name.toUpperCase() === 'Content-Type'.toUpperCase() || item.name.toUpperCase() === 'type'.toUpperCase())) {
            fileObj.fileType = item.value
        }
        if (item.name && (item.name.toUpperCase() === 'fileName'.toUpperCase() || item.name.toUpperCase() === 'File-Name'.toUpperCase() || item.name.toUpperCase() === 'name'.toUpperCase())) {
            fileObj.fileName = item.value
        }
        if (item.name && (item.name.toUpperCase() === 'File-Size'.toUpperCase())) {
            fileObj.fileSize = getFileSize(Number(item.value))
        }
        if (item.name && (item.name.toUpperCase() === 'timeStamp'.toUpperCase())) {
            fileObj.time = moment(Number(item.value)).format('YYYY.MM.DD')
            fileObj.timeStampStr = moment(Number(item.value)).format('YYYY.MM.D  HH:mm:SS  A')
        }
    })
    if (dataObj.data && checkJSON(dataObj.data)) {
        fileObj.info = JSON.parse(dataObj.data)
        // Serialize content (provided the content is JSON)
        if (fileObj.info.content && checkJSON(fileObj.info.content)) {
            fileObj.info.contentJSON = JSON.parse(fileObj.info.content)
            fileObj.fileName = fileObj.info.contentJSON ? fileObj.info.contentJSON.title : '--'
            fileObj.time = moment(fileObj.info.contentJSON.ts).format('YYYY.MM.DD')
            fileObj.timeStampStr = moment(fileObj.info.contentJSON.ts).format('YYYY.MM.D  HH:mm:SS  A')
        } else {
            fileObj.fileName = fileObj.info.name ? fileObj.info.name : fileObj.info.title
            fileObj.time = '--'
            fileObj.timeStampStr = '--'
        }
        fileObj.fileSize = getBytesLength(dataObj.data)
    }
    return fileObj
}