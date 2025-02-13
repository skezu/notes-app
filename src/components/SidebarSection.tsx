const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="sidebar-group">
      <div className="section-header">
        <div className="section-title">{title}</div>
        <div className="section-symbol">􀆈</div>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

export default SidebarSection; 