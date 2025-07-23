import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// ===================== Sidebar Navigation Links =====================
const sidebarLinks = [
  {
    section: 'USER DETAILS',
    links: [
      { label: 'Super Admin Master', href: '/user_details/super_admin', icon: 'fas fa-user-tie' },
      { label: 'Admin Master', href: '/user_details/admin', icon: 'fas fa-user-shield' },
      { label: 'Sub Agent Master', href: '/user_details/sub', icon: 'fas fa-chess-rook' },
      { label: 'MasterAgent Master', href: '/user_details/master', icon: 'fas fa-crown' },
      { label: 'SuperAgent Master', href: '/user_details/super', icon: 'fas fa-user-tie' },
      { label: 'Agent Master', href: '/user_details/agent', icon: 'fas fa-user-shield' },
      { label: 'Client Master', href: '/user_details/client', icon: 'fas fa-user' },
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
      { label: 'Debit/Credit Entry (Sub)', href: '/ct/sub', icon: 'fas fa-angle-right' },
      { label: 'Debit/Credit Entry (M)', href: '/ct/master', icon: 'fas fa-angle-right' },
      { label: 'Debit/Credit Entry (S)', href: '/ct/super', icon: 'fas fa-angle-right' },
      { label: 'Debit/Credit Entry (A)', href: '/ct/agent', icon: 'fas fa-angle-right' },
      { label: 'Debit/Credit Entry (C)', href: '/ct/client', icon: 'fas fa-angle-right' },
    ],
  },
  {
    section: 'LEDGER',
    links: [
      { label: 'My Ledger', href: '/ledger', icon: 'fas fa-angle-right' },
      { label: 'All Sub Ledger', href: '/ledger/sub', icon: 'fas fa-angle-right' },
      { label: 'All Master Ledger', href: '/ledger/master', icon: 'fas fa-angle-right' },
      { label: 'All Super Ledger', href: '/ledger/super', icon: 'fas fa-angle-right' },
      { label: 'All Agent Ledger', href: '/ledger/agent', icon: 'fas fa-angle-right' },
      { label: 'All Client Ledger', href: '/ledger/client', icon: 'fas fa-angle-right' },
      { label: 'Client Plus/Minus', href: '/ledger/client/pm', icon: 'fas fa-angle-right' },
    ],
  },
  {
    section: 'COMMISSIONS',
    links: [
      { label: 'Commission Dashboard', href: '/commissions', icon: 'fas fa-coins' },
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
    section: 'Login Reports',
    links: [
      { label: 'All Login Reports', href: '/reports/login-reports', icon: 'fas fa-clipboard-list' },
      { label: 'Boss Login Reports', href: '/reports/login-reports?role=BOSS', icon: 'fas fa-clipboard-list' },
      { label: 'Sub Login Reports', href: '/reports/login-reports?role=SUB', icon: 'fas fa-clipboard-list' },
      { label: 'Master Login Reports', href: '/reports/login-reports?role=MASTER', icon: 'fas fa-clipboard-list' },
      { label: 'Super Login Reports', href: '/reports/login-reports?role=SUPER_AGENT', icon: 'fas fa-clipboard-list' },
      { label: 'Agent Login Reports', href: '/reports/login-reports?role=AGENT', icon: 'fas fa-clipboard-list' },
      { label: 'Clients Login Reports', href: '/reports/login-reports?role=USER', icon: 'fas fa-clipboard-list' },
    ],
  },
];

// ===================== Layout Component =====================
// This component provides the sidebar, navbar, footer, and main content wrapper
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  
  // -------- Sidebar Section Expand/Collapse State --------
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([
    'USER DETAILS', 'GAMES', 'Casino', 'CASH TRANSACTION', 'LEDGER', 'COMMISSIONS', 'OLD DATA', 'Login Reports'
  ]));
  
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

  // -------- Sync Sidebar State on Mount --------
  useEffect(() => {
    const isCollapsed = document.body.classList.contains('sidebar-collapse');
    setSidebarCollapsed(isCollapsed);
  }, []);

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
          // Session invalid in Layout, but not redirecting
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserData();
  }, []);

  // -------- Handle Navigation State --------
  useEffect(() => {
    // Prevent default browser behavior for navigation
    // (Removed beforeunload handler to prevent unwanted confirmation dialog)
  }, [router.asPath]);

  // -------- Preserve Scroll Position on Navigation --------
  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Store current scroll position before navigation
      const currentScroll = window.scrollY;
      sessionStorage.setItem('scrollPosition', currentScroll.toString());
      sessionStorage.setItem('scrollTimestamp', Date.now().toString());
      
      // Also store the current navbar state
      sessionStorage.setItem('navbarState', JSON.stringify({
        sidebarCollapsed: sidebarCollapsed
      }));

      // Prevent any scroll reset during navigation
      const preventScrollReset = () => {
        if (currentScroll > 0) {
          window.scrollTo(0, currentScroll);
        }
      };

      // Multiple attempts to prevent scroll reset
      setTimeout(preventScrollReset, 0);
      setTimeout(preventScrollReset, 10);
      setTimeout(preventScrollReset, 50);
    };

    const handleRouteChangeComplete = () => {
      // Prevent immediate scroll to top
      const preventScrollToTop = () => {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
          const targetPosition = parseInt(savedPosition);
          if (targetPosition > 0) {
            // Force scroll to saved position
            window.scrollTo(0, targetPosition);
            return true;
          }
        }
        return false;
      };

      // Try to prevent scroll to top immediately
      if (!preventScrollToTop()) {
        // If no saved position, allow normal behavior
        return;
      }

      // Restore scroll position after navigation with multiple attempts
      const savedPosition = sessionStorage.getItem('scrollPosition');
      const savedTimestamp = sessionStorage.getItem('scrollTimestamp');
      
      if (savedPosition && savedTimestamp) {
        const targetPosition = parseInt(savedPosition);
        const timestamp = parseInt(savedTimestamp);
        const timeDiff = Date.now() - timestamp;
        
        // Only restore if the navigation happened within the last 5 seconds
        if (timeDiff < 5000) {
          const restoreScroll = () => {
            // Use requestAnimationFrame for smooth restoration
            requestAnimationFrame(() => {
              window.scrollTo(0, targetPosition);
            });
          };
          
          // Multiple delayed attempts to handle AdminLTE interference
          setTimeout(restoreScroll, 10);
          setTimeout(restoreScroll, 50);
          setTimeout(restoreScroll, 100);
          setTimeout(restoreScroll, 200);
          setTimeout(restoreScroll, 500);
          setTimeout(restoreScroll, 1000);
        }
      }
      
      // Restore navbar state
      const savedNavbarState = sessionStorage.getItem('navbarState');
      if (savedNavbarState) {
        const state = JSON.parse(savedNavbarState);
        if (state.sidebarCollapsed) {
          document.body.classList.add('sidebar-collapse');
          setSidebarCollapsed(true);
        } else {
          document.body.classList.remove('sidebar-collapse');
          setSidebarCollapsed(false);
        }
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // -------- Sidebar State --------
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize based on current body class
    if (typeof window !== 'undefined') {
      return document.body.classList.contains('sidebar-collapse');
    }
    return false;
  });

  // -------- Sidebar Toggle Handler --------
  const toggleSidebar = () => {
    const body = document.body;
    const newCollapsedState = !sidebarCollapsed;
    
    if (newCollapsedState) {
      body.classList.add('sidebar-collapse');
    } else {
      body.classList.remove('sidebar-collapse');
    }
    
    setSidebarCollapsed(newCollapsedState);
  };

  // -------- Scroll to Top Function --------
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // -------- Handle Scroll Events --------
  useEffect(() => {
    const handleScroll = () => {
      // Ensure navbar stays fixed during scroll
      const navbar = document.querySelector('.main-header') as HTMLElement;
      if (navbar) {
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.right = '0';
        navbar.style.zIndex = '1030';
        navbar.style.backgroundColor = 'white';
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }
    };

    // Force navbar to stay fixed on mount and during any changes
    const forceNavbarFixed = () => {
      // Try multiple selectors to find the navbar
      const navbar = document.getElementById('fixed-navbar') || 
                    document.querySelector('.main-header') || 
                    document.querySelector('nav.main-header') as HTMLElement;
      
      if (navbar) {
        // Force all critical styles
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.right = '0';
        navbar.style.zIndex = '1030';
        navbar.style.backgroundColor = 'white';
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        navbar.style.marginTop = '0';
        navbar.style.marginBottom = '0';
        navbar.style.transform = 'none';
        navbar.style.transition = 'none';
        navbar.style.willChange = 'auto';
        
        // Also set as CSS custom property for extra enforcement
        navbar.style.setProperty('--navbar-fixed', 'true');
        navbar.style.setProperty('--navbar-top', '0px');
        navbar.style.setProperty('--navbar-z-index', '1030');
      }
    };

    // Override window.scrollTo to prevent unwanted scroll resets
    const originalScrollTo = window.scrollTo;
    (window as any).scrollTo = function(options: any, y?: number) {
      // Only allow scroll to top if it's our own scroll restoration
      if (typeof options === 'object' && options.top === 0) {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
          const targetPosition = parseInt(savedPosition);
          if (targetPosition > 0) {
            // Don't scroll to top if we have a saved position
            return;
          }
        }
      }
      return originalScrollTo.call(this, options, y || 0);
    };

    // Force navbar fixed immediately
    forceNavbarFixed();

    // Set up interval to continuously ensure navbar stays fixed
    const interval = setInterval(forceNavbarFixed, 50); // More frequent checks
    
    // Also set up a more aggressive interval for critical moments
    const criticalInterval = setInterval(() => {
      const navbar = document.getElementById('fixed-navbar') as HTMLElement;
      if (navbar && navbar.style.position !== 'fixed') {
        forceNavbarFixed();
      }
    }, 10);

    // Watch for DOM changes that might affect navbar
    const observer = new MutationObserver(() => {
      forceNavbarFixed();
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Prevent any scroll events from affecting navbar position
    const preventNavbarScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      forceNavbarFixed();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', forceNavbarFixed);
    
    // Add more event listeners to catch any navbar movement
    document.addEventListener('scroll', preventNavbarScroll, { capture: true });
    document.addEventListener('wheel', preventNavbarScroll, { capture: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', forceNavbarFixed);
      document.removeEventListener('scroll', preventNavbarScroll, { capture: true });
      document.removeEventListener('wheel', preventNavbarScroll, { capture: true });
      clearInterval(interval);
      clearInterval(criticalInterval);
      observer.disconnect();
      window.scrollTo = originalScrollTo;
    };
  }, []);

  // Add after other useState declarations
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992); // Bootstrap lg breakpoint
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) setMobileSidebarOpen(false);
    // eslint-disable-next-line
  }, [router.asPath]);

  return (
    <div className="hold-transition sidebar-mini">
      <div className="wrapper">
        {/* ===================== Navbar ===================== */}
        <nav 
          id="fixed-navbar"
          className="main-header navbar navbar-expand navbar-white navbar-light" 
          style={{ 
            position: 'fixed', 
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1030,
            minHeight: '64px',
            height: '64px',
            transition: 'none',
            backgroundColor: '#673ab7',
            color: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginTop: 0,
            marginBottom: 0,
            transform: 'none',
            willChange: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left navbar links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#" role="button" onClick={(e) => {
                e.preventDefault();
                if (isMobile) {
                  setMobileSidebarOpen(true);
                } else {
                  toggleSidebar();
                }
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
              <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" style={{
                padding: 0,
                background: 'none',
                border: 'none',
                boxShadow: 'none',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#e0e0e0',
                  color: '#222',
                  borderRadius: 24,
                  height: 40,
                  padding: '15px',
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  minWidth: 120,
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#007bff',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    textTransform: 'uppercase',
                  }}>
                    {((user?.name || user?.username || '')
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .substring(0, 2)) || 'U'}
                  </div>
                  <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 600,
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                  }}>{user?.name || user?.username || 'User'}</span>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-right" style={{ minWidth: 260, padding: 0, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                <li className="user-header" style={{ background: '#e0e0e0', color: '#222', borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 15, textAlign: 'center' }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: '#007bff',
                      color: '#fff',
                      fontSize: 32,
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto',
                      textTransform: 'uppercase',
                    }}
                  >
                    {((user?.name || user?.username || '')
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .substring(0, 2)) || 'U'}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{user?.name || user?.username || 'User'}</div>
                  <div style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>ID: {user?.username || user?.id || '-'}</div>
                  <div style={{ fontSize: 13, color: '#555' }}>Role: {user?.role || '-'}</div>
                </li>
                <li className="user-footer" style={{ display: 'flex', justifyContent: 'space-between', padding: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, background: '#fff' }}>
                  <Link href="/profile" className="btn btn-default btn-flat" style={{ width: '48%' }}>Profile</Link>
                  <a href="#" className="btn btn-default btn-flat float-right" style={{ width: '48%' }}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        router.push('/login');
                      } catch (error) {
                        console.error('Logout error:', error);
                        router.push('/login');
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
        <aside
          className="main-sidebar sidebar-light-indigo elevation-4"
          style={{
            position: isMobile ? 'fixed' : 'fixed',
            top: 0,
            left: isMobile ? (mobileSidebarOpen ? 0 : '-80vw') : 0,
            height: '100vh',
            zIndex: 1031,
            display: 'flex',
            flexDirection: 'column',
            width: isMobile ? '80vw' : '250px',
            maxWidth: '100vw',
            minWidth: isMobile ? '0' : '250px',
            background: '#fff',
            boxShadow: isMobile && mobileSidebarOpen ? '2px 0 8px rgba(0,0,0,0.15)' : undefined,
            transition: 'left 0.3s cubic-bezier(.4,0,.2,1)',
          }}
        >
          {/* Brand Logo */}
          <Link href="/" className="brand-link bg-indigo text-white" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 15px',
            height: '60px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            flexShrink: 0
          }}>
            <img 
              src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png" 
              alt="AdminLTE Logo"
              className="brand-image img-circle elevation-3" 
              style={{ opacity: '.8', marginRight: '10px' }}
            />
            <span className="brand-text font-weight-light" id="brandName">BETX</span>
          </Link>
          {/* Sidebar Navigation Menu */}
          <div className="sidebar" style={{ marginTop: '0', flex: 1, overflowY: 'auto' }}>
            <nav>
              <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                {sidebarLinks.map(section => {
                  const isExpanded = expandedSections.has(section.section);
                  return (
                    <React.Fragment key={section.section}>
                      <li className="nav-header" style={{ cursor: 'pointer' }} onClick={() => toggleSection(section.section)}>
                        {section.section}
                        <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} float-right`} style={{ fontSize: '12px', marginTop: '3px' }}></i>
                      </li>
                      {isExpanded && section.links.map(link => (
                        <li className="nav-item" key={link.label}>
                          <Link href={link.href} className={`nav-link ${router.pathname === link.href ? 'active' : ''}`} style={{ padding: '8px 15px', fontSize: '13px' }}
                            onClick={() => { if (isMobile) setMobileSidebarOpen(false); }}
                          >
                            <i className={`nav-icon ${link.icon}`} style={{ fontSize: '12px', marginRight: '8px' }}></i>
                            <p style={{ margin: '0', fontSize: '13px' }}>{link.label}</p>
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
        <div className="content-wrapper" style={{
          marginTop: '60px',
          marginLeft: sidebarCollapsed ? '0' : '250px',
          minHeight: 'calc(100vh - 60px)',
          transition: 'margin-left 0.3s ease-in-out'
        }}>
          {/* This is where the page content is rendered */}
          {children}
        </div>

        {/* ===================== Footer ===================== */}
        <footer className="main-footer">
          <strong>Copyright &copy; 2025 <a href="#" id="siteName">BETX.com</a>.</strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block">
            <b>Version</b> 2.0.2
          </div>
        </footer>

        {/* ===================== Control Sidebar (optional) ===================== */}
        <aside className="control-sidebar control-sidebar-dark">
          {/* Control sidebar content goes here */}
        </aside>

        {/* Render overlay for mobile sidebar */}
        {isMobile && mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.3)',
              zIndex: 1030,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Layout; 