
import LZString from "lz-string"
import CryptoJS from "crypto-js";


const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET_KEY 


const getSecretKey = () => {
    const key = process.env.REACT_APP_CRYPTO_SECRET_KEY;
    if (!key) console.error("❌ SECRET_KEY est undefined, vérifie .env");
    return key;
};

export const encryptParams = (paramsObj) => {
   
    

    const SECRET_KEY = getSecretKey();
    

    const paramsString = JSON.stringify(paramsObj);
    

    

    const encryptedString = CryptoJS.AES.encrypt(paramsString, SECRET_KEY).toString();
    

    

    return encodeURIComponent(encryptedString);
};


export const decryptParams = (encryptedString) => {
    const SECRET_KEY = getSecretKey()

    try {
        const decoded = decodeURIComponent(encryptedString)
        
        const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        
        const parsedData = JSON.parse(decryptedText);
        
        return parsedData;
    } catch (error) {
        console.error("Erreur de déchiffrement :", error);
        return null;
    }
};