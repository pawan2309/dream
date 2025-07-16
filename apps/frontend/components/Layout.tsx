import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ===================== Sidebar Navigation Links =====================
const sidebarLinks = [
  {
    section: 'USER DETAILS',
    links: [
      { label: 'Collection Master', href: '/master_details/collection', icon: 'fas fa-coins' },
      { label: 'Sub Agent Master', href: '/master_details/sub', icon: 'fas fa-user-secret' },
      { label: 'MasterAgent Master', href: '/master_details/master', icon: 'fas fa-crown' },
      { label: 'SuperAgent Master', href: '/master_details/super', icon: 'fas fa-user-tie' },
      { label: 'Agent Master', href: '/master_details/agent', icon: 'fas fa-user-shield' },
      { label: 'Client Master', href: '/master_details/client', icon: 'fas fa-user' },
    ],
  },
  {
    section: 'GAMES',
    links: [
      { label: 'InPlay Game', href: '/game/inPlay', icon: 'fas fa-play' },
      { label: 'Complete Game', href: '/game/completeGame', icon: 'far fa-stop-circle' },
    ],
  },
  {
    section: 'Casino',
    links: [
      { label: 'Live Casino Position', href: '#', icon: 'fas fa-chart-line' },
      { label: 'Casino Details', href: '#', icon: 'fas fa-wallet' },
      { label: 'Int. Casino Details', href: '#', icon: 'fas fa-chart-line' },
    ],
  },
  {
    section: 'CASH TRANSACTION',
    links: [
      { label: 'Debit/Credit Entry (C)', href: '/ct/client', icon: 'fas fa-angle-right' },
      { label: 'Debit/Credit Entry (A)', href: '/ct/agent', icon: 'fas fa-angle-right' },
      { label: 'Debit/Credit Entry (S)', href: '/ct/super', icon: 'fas fa-angle-right' },
      { label: 'Debit/Credit Entry (M)', href: '/ct/master', icon: 'fas fa-angle-right' },
    ],
  },
  {
    section: 'LEDGER',
    links: [
      { label: 'My Ledger', href: '/ledger', icon: 'fas fa-angle-right' },
      { label: 'Client Plus/Minus', href: '/ledger/client/pm', icon: 'fas fa-angle-right' },
      { label: 'All Client Ledger', href: '/ledger/client', icon: 'fas fa-angle-right' },
      { label: 'All Agent Ledger', href: '/ledger/agent', icon: 'fas fa-angle-right' },
      { label: 'All Super Ledger', href: '/ledger/super', icon: 'fas fa-angle-right' },
      { label: 'All Master Ledger', href: '/ledger/master', icon: 'fas fa-angle-right' },
    ],
  },
  {
    section: 'OLD DATA',
    links: [
      { label: 'Old Ledger', href: '#', icon: 'fas fa-angle-right' },
      { label: 'Old Game Data', href: '#', icon: 'far fa-stop-circle' },
      { label: 'Old Casino Data', href: '#', icon: 'fas fa-angle-right' },
    ],
  },
  {
    section: 'REPORTS',
    links: [
      { label: 'Master Reports', href: '#', icon: 'fas fa-th-list' },
      { label: 'Super Reports', href: '#', icon: 'fas fa-th-list' },
      { label: 'Agent Reports', href: '#', icon: 'fas fa-th-list' },
      { label: 'Clients Reports', href: '#', icon: 'fas fa-th-list' },
    ],
  },
  {
    section: 'Login Reports',
    links: [
      { label: 'Master Login Reports', href: '#', icon: 'fas fa-clipboard-list' },
      { label: 'Super Login Reports', href: '#', icon: 'fas fa-clipboard-list' },
      { label: 'Agent Login Reports', href: '#', icon: 'fas fa-clipboard-list' },
      { label: 'Clients Login Reports', href: '#', icon: 'fas fa-clipboard-list' },
    ],
  },
];

// ===================== Layout Component =====================
// This component provides the sidebar, navbar, footer, and main content wrapper
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // -------- Sidebar Section Expand/Collapse State --------
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['REPORTS']));
  
  // -------- User State --------
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // -------- Toggle Sidebar Section --------
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  // -------- Get User Data on Mount --------
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.valid && data.user) {
          setUser(data.user);
        } else {
          // Don't redirect here, let individual pages handle session validation
          console.log('Session invalid in Layout, but not redirecting');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserData();
  }, []);

  // -------- Sidebar Toggle Handler --------
  const toggleSidebar = () => {
    const body = document.body;
    if (body.classList.contains('sidebar-collapse')) {
      body.classList.remove('sidebar-collapse');
    } else {
      body.classList.add('sidebar-collapse');
    }
  };

  return (
    <div className="hold-transition sidebar-mini">
      <div className="wrapper">
        {/* ===================== Navbar ===================== */}
        <nav className="main-header navbar navbar-expand navbar-white navbar-light" style={{ 
          position: 'relative', 
          zIndex: 999,
          minHeight: '60px'
        }}>
          {/* Left navbar links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#" role="button" onClick={(e) => {
                e.preventDefault();
                toggleSidebar();
              }} style={{ 
                position: 'relative', 
                zIndex: 1000,
                minWidth: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-bars"></i>
              </a>
            </li>
          </ul>

          {/* Right navbar links (User Dropdown) */}
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown user-menu">
              <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                <img 
                  src="https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg"
                  className="user-image img-circle elevation-2" 
                  alt="User Image"
                />
                <span className="d-none d-md-inline">
                  {isLoading ? 'Loading...' : (user?.name || user?.username || 'User')}
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                {/* User image */}
                <li className="user-header bg-primary">
                  <img 
                    src="https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg"
                    className="img-circle elevation-2"
                    alt="User Image"
                  />
                  <p>
                    {isLoading ? 'Loading...' : `${user?.username || 'User'} ${user?.name || ''}`}
                  </p>
                </li>
                
                {/* Menu Footer*/}
                <li className="user-footer">
                  <a href="/profile" className="btn btn-default btn-flat">Profile</a>
                  <a href="#" className="btn btn-default btn-flat float-right" 
                     onClick={async (e) => {
                       e.preventDefault();
                       try {
                         await fetch('/api/auth/logout', { method: 'POST' });
                         window.location.href = '/login';
                       } catch (error) {
                         console.error('Logout error:', error);
                         window.location.href = '/login';
                       }
                     }}>
                    Sign out
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* ===================== Sidebar ===================== */}
        <aside className="main-sidebar sidebar-light-indigo elevation-4">
          {/* Brand Logo */}
          <a href="/" className="brand-link bg-indigo text-white">
            <img 
              src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png" 
              alt="AdminLTE Logo"
              className="brand-image img-circle elevation-3" 
              style={{ opacity: '.8' }}
            />
            <span className="brand-text font-weight-light" id="brandName">BETX</span>
          </a>

          {/* Sidebar Navigation Menu */}
          <div className="sidebar">
            <nav className="mt-2">
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                {sidebarLinks.map(section => {
                  const isExpanded = expandedSections.has(section.section);
                  return (
                    <React.Fragment key={section.section}>
                      <li className="nav-header">{section.section}</li>
                      {section.links.map(link => (
                        <li className="nav-item" key={link.label}>
                          <Link href={link.href} className="nav-link">
                            <i className={`nav-icon ${link.icon}`}></i>
                            <p>{link.label}</p>
                          </Link>
                        </li>
                      ))}
                    </React.Fragment>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* ===================== Main Content Wrapper ===================== */}
        <div className="content-wrapper">
          {/* This is where the page content is rendered */}
          {children}
        </div>

        {/* ===================== Footer ===================== */}
        <footer className="main-footer">
          <strong>Copyright &copy; 2020-2021 <a href="#" id="siteName">BETX.com</a>.</strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block">
            <b>Version</b> 2.0.2
          </div>
        </footer>

        {/* ===================== Control Sidebar (optional) ===================== */}
        <aside className="control-sidebar control-sidebar-dark">
          {/* Control sidebar content goes here */}
        </aside>
      </div>
    </div>
  );
};

export default Layout; 