import { useEffect } from 'react';

const ThemeInitializer = () => {
  useEffect(() => {
    //Garante que o tema escolhido seja salvo
    const temaSalvo = localStorage.getItem('temaPreferido');
    if (!temaSalvo) {
        return; 
    }
    const root = document.documentElement;

    root.classList.remove('tema-claro', 'tema-escuro');

    if (temaSalvo === 'escuro') {
        root.classList.add('tema-escuro');
    } else {
        root.classList.add('tema-claro');
    }

  }, []); 

  return null;
};

export default ThemeInitializer;