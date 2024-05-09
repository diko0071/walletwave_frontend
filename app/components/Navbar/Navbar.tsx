import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import SidebarItem from './SidebarItem';
import CreateNewButton from '../Buttons/CreateNew';
import SidebarIcon from '../../../public/Sidebar.svg';
import PopupModal from '../Popup/PopupModal'; // Import PopupModal if it's being used for the transaction
import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button";



interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isOpaque, setIsOpaque] = useState(true);
    const [isMobile, setIsMobile] = useState(false); // Добавляем состояние для мобильного режима

    useEffect(() => {
    // const handleScroll = () => {
    //     if (window.scrollY > 50) {
    //         setIsOpaque(true);
    //     } else {
    //         setIsOpaque(false);
    //     }
    // };

        const handleResize = () => {
            if (window.innerWidth <= 768) { // Предполагаем, что мобильный режим при ширине экрана 768px или меньше
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        handleResize(); // Вызываем при монтировании компонента

       // window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize); // Добавляем обработчик события изменения размера окна

        return () => {
           // window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-100 duration-300 ease-in-out flex flex-row justify-between items-center h-[70px] border border-gray-200 opacity-0">
            <div onClick={toggleSidebar} className="flex items-center cursor-pointer mr-4 px-4">
                <Image src={SidebarIcon} alt="Sidebar" width={20} height={18} />
            </div>
            <div className={`flex-grow flex ${isMobile ? 'justify-end' : 'justify-end'} items-center pr-4`}>
                {!isMobile && (
                    <>
                        <div className="flex items-center mr-6">
                            <div onClick={() => setIsPopupOpen(true)} className="cursor-pointer">
                                <Button variant="outline" className="w-auto px-4 py-2">
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add Transaction
                                </Button>
                            </div>
                        </div>
                        {isPopupOpen && (
                            <PopupModal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                                <div></div>
                            </PopupModal>
                        )}
                        <div className="flex items-center mr-6">
                            <SidebarItem label="Transactions" />
                        </div>
                        <div className="flex items-center mr-6">
                            <SidebarItem label="Settings" />
                        </div>
                    </>
                )}
                {isMobile && (
                    <div onClick={toggleSidebar} className="cursor-pointer">
                        {/* Здесь может быть иконка меню или текст */}
                        Menu
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;