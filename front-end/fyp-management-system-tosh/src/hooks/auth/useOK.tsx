import {useState} from 'react';

function useOK() {
    const [OK, setOK] = useState(false);

    const greenFlag = () => {
        setOK(true);
    }

    const redFlag = () => {
        setOK(false);
    }

    return {OK, greenFlag, redFlag};
}

export default useOK;