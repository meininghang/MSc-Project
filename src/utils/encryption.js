// ATTENTION:
// This use case will use multiple wallet address.
// During testing period, please make you have all wallet address are registered in into whitelist

import {MindLake} from 'mind-lake-sdk'

const DataType = MindLake.DataType

/**
 * Encrypt the data and create the account table
 * @param data {Array} like:[{'wallet': '0x70dBcC09edF6D9AdD4A235e2D8346E78A79ac770', 'token': 'USDT', 'volume': 7.7}]
 * @param address {String} The account is you want to access encrypted information
 * @returns {Promise<void>}
 */
export async function insertData(data, address) {
    // todo... need add your appKey(https://github.com/mind-network/mind-lake-sdk-typescript/blob/main/tutorial/Configure_AppKey.md)
    const mindLake = await MindLake.getInstance("YOU OWN APP KEY")

    // connect to MindLake
    const res1 = await mindLake.connect()
    if (res1.code !== 0) {
        console.error(res1.message)
        return
    }

    // create a table
    const dataLake = mindLake.dataLake
    await dataLake.dropTable("transaction")
    const res2 = await dataLake.createTable("transaction", [
        {columnName: 'WalletAddress', type: DataType.text, encrypt: false},
        {columnName: 'Token', type: DataType.text, encrypt: true},
        {columnName: 'Volume', type: DataType.float4, encrypt: true}],)
    if (res2.code !== 0) {
        console.error(res2.message)
        return
    }

    // encrypt data
    const crypto = mindLake.crypto
    for (const row of data) {
        const walletAddress = row.WalletAddress
        const encryptToken = await crypto.encrypt(row.Token, "transaction.Token")
        const encryptVolume = await crypto.encrypt(row.Volume, "transaction.Volume")
        const sql = `insert into transaction ("WalletAddress", "Token", "Volume") values ('${walletAddress}', '${encryptToken.result}', '${encryptVolume.result}')`
        const sqlRes = await dataLake.query(sql)
        if (sqlRes.code !== 0) {
            return console.error(sqlRes.message)
        }
    }
    const permission = mindLake.permission
    const result = await permission.grant(address, ['transaction.Token', 'transaction.Volume'])
    if (result.code !== 0) {
        console.error(result.message)
        return
    }
}