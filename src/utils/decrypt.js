import {MindLake} from 'mind-lake-sdk'

const appKey = '3KjBLshwhIt1QAKgHda72GeF0UrzlOoT/1bfyg2p79w='
const mindLake = await MindLake.getInstance(appKey)

const permission =  mindLake.permission
const dataLake =  mindLake.dataLake
const crypto = mindLake.crypto

// connect to MindLake
export function connectMindLake(address1, address2) {
    mindLake.connect().then(async res => {
        if(res.code !== 0) {
            return console.error(res.message)
        }

        res = await permission.confirm("policyAliceID")
        if(res.code !== 0) {
            return console.error(res.message)
        }
        res = await permission.confirm("policyBobID")
        if(res.code !== 0) {
            return console.error(res.message)
        }
        const sql = `SELECT combine."WalletAddress", SUM(combine."Volume") FROM(SELECT "WalletAddress","Volume" FROM "${address1.toLocaleLowerCase()}"."transaction"UNION ALLSELECT "WalletAddress","Volume" FROM "${address2.toLocaleLowerCase()}"."transaction") as combineGROUP BY "WalletAddress"`
        res = await dataLake.query(sql)
        if(res.code !== 0) {
            return console.error(res.message)
        }

        for (const row of res.result.data) {
            const walletAddress = row[0]
            res = await crypto.decrypt(row[1])
            if(res.code !== 0) {
                return console.error(res.message)
            }
            console.log(`${walletAddress} >>> `, res.result)
        }
    })
}
