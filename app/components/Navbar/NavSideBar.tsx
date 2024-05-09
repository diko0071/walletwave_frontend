"use client";
import React, { useState, useEffect } from 'react'; 
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { InputWithButton } from '../Inputs/MainInput';

interface NavSideBarProps {
  onSidebarToggle?: (isOpen: boolean) => void;
}

export default function NavSideBar({ onSidebarToggle }: NavSideBarProps) {
  // Инициализируем состояние открытости боковой панели как false
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Состояние для отслеживания ручного закрытия боковой панели пользователем
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Если боковая панель была закрыта вручную, не изменяем её состояние автоматически
      if (!isManuallyClosed) {
        const shouldOpenSidebar = window.innerWidth > 768;
        setIsSidebarOpen(shouldOpenSidebar);
        if (onSidebarToggle) {
          onSidebarToggle(shouldOpenSidebar);
        }
      }
    };

    // Проверяем размер окна при инициализации компонента
    handleResize();

    // Подписываемся на событие изменения размера окна
    window.addEventListener('resize', handleResize);

    // Очищаем подписку
    return () => window.removeEventListener('resize', handleResize);
  }, [onSidebarToggle, isManuallyClosed]);

  const toggleSidebar = () => {
    const nextIsSidebarOpen = !isSidebarOpen;
    setIsSidebarOpen(nextIsSidebarOpen);
    // Обновляем состояние isManuallyClosed в зависимости от действия пользователя
    setIsManuallyClosed(isSidebarOpen);
    if (onSidebarToggle) {
      onSidebarToggle(nextIsSidebarOpen);
    }
  };

  return (
    <>
      <InputWithButton />
      <div className={`fixed top-0 bottom-0 transition-left duration-300 ease-out ${isSidebarOpen ? 'left-0' : '-left-80'} w-64`}>
        <Sidebar />
      </div>
    </>
  );
}