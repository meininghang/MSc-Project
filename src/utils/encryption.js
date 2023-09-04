// ATTENTION:
// This use case will use multiple wallet address.
// During testing period, please make you have all wallet address are registered in into whitelist

import {MindLake} from 'mind-lake-sdk'

const DataType = MindLake.DataType

const appKey = '3KjBLshwhIt1QAKgHda72GeF0UrzlOoT/1bfyg2p79w='

/**
 * Encrypt the data and create the account table
 * @param data like:[{'wallet': '0x70dBcC09edF6D9AdD4A235e2D8346E78A79ac770', 'token': 'USDT', 'volume': 7.7}]
 * @param fileName {String} file Name
 * @param address {String} The account is you want to access encrypted information
 * @returns {Promise<void>}
 */
export async function insertData(data, fileName) {
    const mindLake = await MindLake.getInstance(appKey)

    // connect to MindLake
    const res1 = await mindLake.connect()
    if (res1.code !== 0) {
        console.error(res1.message)
        return
    }

    // create a table
    const dataLake = mindLake.dataLake
    await dataLake.dropTable("album")
    const res2 = await dataLake.createTable("album", [
        {columnName: 'name', type: DataType.text, encrypt: false},
        {columnName: 'file', type: DataType.text, encrypt: true}])
    if (res2.code !== 0) {
        console.error(res2.message)
        return
    }

    // encrypt data
    const crypto = mindLake.crypto
    const res3 = await crypto.encrypt(data, "album.file");
    if(res3.code !== 0) {
        console.error(res3.message);
        return
    }
    const sql = `insert into album (name, file) values (${fileName}, '${res3.result}')`;
    const res4 = await dataLake.query(sql);
    if(res4.code !== 0) {
        console.error(res4.message);
        return
    }
}