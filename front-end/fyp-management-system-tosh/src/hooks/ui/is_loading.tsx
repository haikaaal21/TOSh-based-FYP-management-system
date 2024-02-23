import {useState} from 'react';

function useIsLoading() {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => {
        setIsLoading(true);
    }

    const stopLoading = () => {
        setIsLoading(false);
    }

    return {isLoading, startLoading, stopLoading};
}

export default useIsLoading;