import { useState,useEffect} from "react";

const useLocalStorage = (key, initvalue) =>{
    const [value,setValue] = useState(JSON.parse(localStorage.getItem(key)) || initvalue)

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key,value])

    return [value, setValue];
}

export default useLocalStorage