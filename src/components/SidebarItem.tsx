import React from 'react';

const SidebarItem = ({ 
  label, 
  symbol, 
  counter, 
  indentLevel = 0,
  isSelected = false,
  onSelect,
}: { 
  label: string, 
  symbol?: string, 
  counter?: string, 
  indentLevel?: number,
  isSelected?: boolean,
  onSelect?: () => void,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const getStateClassName = () => {
    if (isSelected) {
      return isFocused ? 'selected-focused' : 'selected-unfocused';
    }
    return '';
  };

  return (
    <div 
      className={`sidebar-item indent-${indentLevel} ${getStateClassName()}`}
      onClick={() => onSelect?.()}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      role="button"
    >
      <div className="leading">
        {symbol && <div className="symbol">{symbol}</div>}
        <div className="label">{label}</div>
      </div>
      {counter && (
        <div className="trailing">
          <div className="counter">
            <div className="number">{counter}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarItem; 