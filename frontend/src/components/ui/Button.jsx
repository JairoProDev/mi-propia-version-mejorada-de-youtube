/**
 * @file Button.jsx
 * @description Componente de botón reutilizable con diferentes variantes y estilos
 * @author Tu Nombre
 * @version 1.0.0
 */

import React from 'react';
import styled, { css } from 'styled-components';

// Estilos compartidos para todos los botones
const ButtonBase = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:focus-visible {
    outline: 2px solid #3ea6ff;
    outline-offset: 2px;
  }

  ${({ $icon }) => $icon && css`
    svg {
      font-size: 20px;
    }
  `}
`;

// Variantes de botón
const PrimaryButton = styled(ButtonBase)`
  background-color: #3ea6ff;
  color: ${({ theme }) => theme.bg};
  border: none;
  padding: ${({ $size }) => 
    $size === 'sm' ? '6px 12px' : 
    $size === 'lg' ? '12px 24px' : 
    '8px 16px'
  };

  &:hover:not(:disabled) {
    background-color: #2196f3;
    transform: translateY(-1px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: transparent;
  color: #3ea6ff;
  border: 1px solid #3ea6ff;
  padding: ${({ $size }) => 
    $size === 'sm' ? '5px 11px' : 
    $size === 'lg' ? '11px 23px' : 
    '7px 15px'
  };

  &:hover:not(:disabled) {
    background-color: rgba(62, 166, 255, 0.08);
  }

  &:active:not(:disabled) {
    background-color: rgba(62, 166, 255, 0.16);
  }
`;

const TextButton = styled(ButtonBase)`
  background-color: transparent;
  color: ${({ theme }) => theme.textSoft};
  border: none;
  padding: ${({ $size }) => 
    $size === 'sm' ? '6px 12px' : 
    $size === 'lg' ? '12px 24px' : 
    '8px 16px'
  };

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.soft2};
  }
`;

const IconButton = styled(ButtonBase)`
  background-color: transparent;
  color: ${({ theme }) => theme.textSoft};
  border: none;
  border-radius: 50%;
  padding: ${({ $size }) => 
    $size === 'sm' ? '6px' : 
    $size === 'lg' ? '12px' : 
    '8px'
  };
  min-width: ${({ $size }) => 
    $size === 'sm' ? '32px' : 
    $size === 'lg' ? '48px' : 
    '40px'
  };
  height: ${({ $size }) => 
    $size === 'sm' ? '32px' : 
    $size === 'lg' ? '48px' : 
    '40px'
  };

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.soft};
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.soft2};
  }
`;

// Componente de carga
const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Componente Button reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.variant='primary'] - Variante del botón ('primary', 'secondary', 'text', 'icon')
 * @param {string} [props.size='md'] - Tamaño del botón ('sm', 'md', 'lg')
 * @param {boolean} [props.loading=false] - Si se muestra un indicador de carga
 * @param {boolean} [props.fullWidth=false] - Si el botón ocupa todo el ancho disponible
 * @param {React.ReactNode} [props.leftIcon] - Icono a mostrar a la izquierda del texto
 * @param {React.ReactNode} [props.rightIcon] - Icono a mostrar a la derecha del texto
 * @param {React.ReactNode} props.children - Contenido del botón
 * @returns {React.ReactElement} Componente Button
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  // Determinar qué componente de botón usar según la variante
  const ButtonComponent = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    text: TextButton,
    icon: IconButton,
  }[variant] || PrimaryButton;

  // Props para styled-components (con $ para evitar pasar props al DOM)
  const styledProps = {
    $size: size,
    $fullWidth: fullWidth,
    $icon: !!(leftIcon || rightIcon),
    style: fullWidth ? { width: '100%' } : {},
    ...props,
  };

  return (
    <ButtonComponent disabled={loading || props.disabled} {...styledProps}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {leftIcon && <span className="button-icon">{leftIcon}</span>}
          {variant !== 'icon' && children}
          {rightIcon && <span className="button-icon">{rightIcon}</span>}
        </>
      )}
    </ButtonComponent>
  );
};

export default Button; 