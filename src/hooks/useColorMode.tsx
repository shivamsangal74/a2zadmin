import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');

  useEffect(() => {
    const className = 'dark';
    const rootClass = window.document.documentElement.classList;
    const bodyClass = window.document.body.classList;

    if (colorMode === 'dark') {
      rootClass.add(className);
      bodyClass.add(className);
    } else {
      rootClass.remove(className);
      bodyClass.remove(className);
    }
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
