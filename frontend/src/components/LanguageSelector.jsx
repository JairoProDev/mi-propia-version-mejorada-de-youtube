import React from 'react';
import styled from 'styled-components';
import useI18n from '../hooks/useI18n';
import { Language } from '@mui/icons-material';

const Container = styled.div`
  position: relative;
  user-select: none;
`;

const LanguageButton = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  border-radius: 5px;
  padding: 10px;
  display: ${(props) => (props.open ? 'flex' : 'none')};
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  z-index: 999;
  min-width: 120px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
  
  &.active {
    font-weight: bold;
    background-color: ${({ theme }) => theme.soft};
  }
`;

const LanguageFlag = styled.span`
  font-size: 1.2rem;
`;

/**
 * Componente para seleccionar el idioma de la aplicación
 */
const LanguageSelector = () => {
  const { t, changeLanguage, currentLanguage } = useI18n();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setMenuOpen(false);
  };
  
  const getFlagEmoji = (code) => {
    // Convertir códigos de idioma a códigos de bandera
    const codePoints = {
      'en': '🇺🇸', // Inglés - USA
      'es': '🇪🇸', // Español - España
    };
    
    return codePoints[code] || '🌐';
  };
  
  return (
    <Container>
      <LanguageButton onClick={toggleMenu}>
        <Language fontSize="small" />
        <span>{t('language')}</span>
      </LanguageButton>
      
      <Menu open={menuOpen}>
        <MenuItem
          className={currentLanguage === 'es' ? 'active' : ''}
          onClick={() => selectLanguage('es')}
        >
          <LanguageFlag>{getFlagEmoji('es')}</LanguageFlag>
          <span>Español</span>
        </MenuItem>
        
        <MenuItem
          className={currentLanguage === 'en' ? 'active' : ''}
          onClick={() => selectLanguage('en')}
        >
          <LanguageFlag>{getFlagEmoji('en')}</LanguageFlag>
          <span>English</span>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default LanguageSelector; 