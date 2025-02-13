import React from 'react';

/* PageTemplate is the main component for the page. It contains the header and the content. It needs a title and children components. */
const PageTemplate = ({ title, children }: { title: string, children?: React.ReactNode }) => {
  return (
    <div className="page">
      <div className="header">
        {/* Header, will later also contains actions */}
        <h1 style={{ fontFamily: 'SF Pro Display Bold', fontSize: '24px', marginLeft: '20px'}}>{title}</h1>
      </div>
      <div className="content">
        {/* Content of the page */}
        {children}
      </div>
    </div>
  );
};

export default PageTemplate; 