import {createAndSubmitItem} from "arseeding-js/cjs/submitOrder";
import SHA256 from 'crypto-js/sha256'
// import { Signer } from "arseeding-arbundles/src/signing"
import {reportUrl} from "@/utils/constant/apiConst"

export async function submitToArseed(tokenSymbol, signer, title, body, originalContentDigest) {
    const content = {
        "body": body,
        "timestamp": Date.parse(new Date()) / 1000,
        // "timestamp": new Date(Moment().format()).getTime() / 1000,
        "title": title
    }
    const contentDigest = SHA256(JSON.stringify(content)).toString()
    if (originalContentDigest === "") {
        originalContentDigest = contentDigest
    }

    const data = JSON.stringify({
        "content": content,
        "digest": contentDigest
    })

    const tags = [
        {
            name: "Content-Type",
            value: "application/json",
        },
        {
            name: "App-Name",
            value: "Monica",
        },
        // {
        //     name: "Contributor",
        //     value: "",
        // },
        {
            name: "Content-Digest",
            value: contentDigest,
        },
        {
            name: "Original-Content-Digest",
            value: originalContentDigest,
        },
        {
            name: "Content-Title",
            value: title
        }]

    const cfg = {
        signer,
        path: '',
        arseedUrl: reportUrl,
        currency: tokenSymbol,
        apiKey: null
    }
    console.log('0000====>createAndSubmitItem', cfg)
    return createAndSubmitItem(Buffer.from(data),{tags: tags},cfg)

}
