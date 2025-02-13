import SidebarSection from './SidebarSection';
import SidebarItem from './SidebarItem';
import React from 'react';

const Sidebar = () => {
  const [selectedId, setSelectedId] = React.useState<string>('notes'); // Default to notes being selected

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="sidebar">
      <div className="toolbar">
        <div className="windowcontrols">
          <div className="window-button close" />
          <div className="window-button minimize" />
          <div className="window-button zoom" />
        </div>
      </div>
      
      <div className="sidebarlist">
        <SidebarSection title="Section Title">
          <SidebarItem 
            label="Notes" 
            symbol="📝" 
            isSelected={selectedId === 'notes'} 
            onSelect={() => handleSelect('notes')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            isSelected={selectedId === 'label1'} 
            onSelect={() => handleSelect('label1')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            isSelected={selectedId === 'label2'} 
            onSelect={() => handleSelect('label2')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            isSelected={selectedId === 'label3'} 
            onSelect={() => handleSelect('label3')} 
          />
        </SidebarSection>

        <SidebarSection title="Section Title">
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            isSelected={selectedId === 'label4'} 
            onSelect={() => handleSelect('label4')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            indentLevel={1} 
            isSelected={selectedId === 'label5'} 
            onSelect={() => handleSelect('label5')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            indentLevel={2} 
            isSelected={selectedId === 'label6'} 
            onSelect={() => handleSelect('label6')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            indentLevel={3} 
            counter="8" 
            isSelected={selectedId === 'label7'} 
            onSelect={() => handleSelect('label7')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            indentLevel={1} 
            isSelected={selectedId === 'label8'} 
            onSelect={() => handleSelect('label8')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            indentLevel={1} 
            isSelected={selectedId === 'label9'} 
            onSelect={() => handleSelect('label9')} 
          />
          <SidebarItem 
            label="Label" 
            symbol="􀈷" 
            indentLevel={1} 
            isSelected={selectedId === 'label10'} 
            onSelect={() => handleSelect('label10')} 
          />
        </SidebarSection>
      </div>
    </div>
  );
};

export default Sidebar; 