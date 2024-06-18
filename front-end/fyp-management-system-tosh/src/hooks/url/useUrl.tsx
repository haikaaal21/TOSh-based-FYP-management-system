import { useState } from 'react';

const useUrl = () => {
  const [url, setUrl] = useState<string>();

  function identifyUrl(url: string) {
    const path = url.split('/')[1];
    setUrl(path);
  }

  return { url, identifyUrl };
};

export default useUrl;
