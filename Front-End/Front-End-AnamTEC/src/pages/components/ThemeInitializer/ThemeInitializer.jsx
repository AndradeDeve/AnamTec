import { useEffect } from 'react';


const ThemeInitializer = () => {
  useEffect(() => {
    // 1. Tenta ler o tema salvo no navegador
    const temaSalvo = localStorage.getItem('temaPreferido');
    
    // Se não houver nada salvo, o tema padrão é o 'claro' (definido em :root)
    if (!temaSalvo) {
        return; 
    }
    const root = document.documentElement;

    // 2. Limpa classes antigas e aplica a classe salva (tema-escuro)
    root.classList.remove('tema-claro', 'tema-escuro');

    if (temaSalvo === 'escuro') {
        root.classList.add('tema-escuro');
    } else {
        root.classList.add('tema-claro');
    }

  }, []); // O array de dependências vazio garante que ele rode APENAS uma vez na montagem.

  return null; // Não renderiza HTML visível
};

export default ThemeInitializer;