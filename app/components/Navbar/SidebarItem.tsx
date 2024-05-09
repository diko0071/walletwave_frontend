import React from 'react';

interface SidebarItemProps {
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label }) => {
  return (
    <div className="cursor-pointer flex items-center p-2 hover:bg-gray-200 text-sm font-medium rounded-md">
      {label}
    </div>
  );
};

export default SidebarItem;

