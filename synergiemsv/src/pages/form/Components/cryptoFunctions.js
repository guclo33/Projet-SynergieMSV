
import LZString from "lz-string"
import CryptoJS from "crypto-js";


const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET_KEY 
console.log("🔍 SECRET_KEY at import:", SECRET_KEY)

const getSecretKey = () => {
    const key = process.env.REACT_APP_CRYPTO_SECRET_KEY;
    if (!key) console.error("❌ SECRET_KEY est undefined, vérifie .env");
    return key;
};

export const encryptParams = (paramsObj) => {
   
    console.log("📝 Raw data before encryption:", paramsObj);

    const SECRET_KEY = getSecretKey();
    console.log("🔐 SECRET_KEY in encryptParams:", SECRET_KEY);

    const paramsString = JSON.stringify(paramsObj);
    console.log("🔒 Stringified JSON before encryption:", paramsString);

    

    const encryptedString = CryptoJS.AES.encrypt(paramsString, SECRET_KEY).toString();
    console.log("🟣 Encrypted String:", encryptedString);

    

    return encodeURIComponent(encryptedString);
};


export const decryptParams = (encryptedString) => {
    const SECRET_KEY = getSecretKey()

    try {
        const decoded = decodeURIComponent(encryptedString)
        
        const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        
        const parsedData = JSON.parse(decryptedText);
        console.log("✅ Parsed JSON data:", parsedData);
        return parsedData;
    } catch (error) {
        console.error("Erreur de déchiffrement :", error);
        return null;
    }
};