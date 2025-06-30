const crypto = require("node:crypto")
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
 exports.encryptToken = async(details)=>{

    const cryp = crypto.createCipheriv('aes-256-ocb',key,iv)
    let  enc = cryp.update(details)
    enc = Buffer.concat([enc,cryp.final()])
    return {
        iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')
    }
 }

 exports.decryptTOken = async(data)=>{

    let iv= Buffer.from(data.iv,'hex')
    let text = Buffer.from(data.encryptedData,'hex')
    let enc = crypto.createDecipheriv('aes-256-ocb',Buffer.from('key'),iv)
    let datas = enc.update(text)
    let decrypted = Buffer.concat([datas,enc.final()])

    return decrypted.toJSON()
 }