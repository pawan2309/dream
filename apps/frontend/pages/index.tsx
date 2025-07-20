// ===================== Imports =====================
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { requireAuth } from '../lib/requireAuth';
import { useRouter } from 'next/router';

// Removed server-side auth check to prevent redirect loops
export const getServerSideProps = async () => {
  return { props: {} };
};

// ===================== Card Color Definitions =====================
const CARD_COLORS = [
  'bg-primary', // Blue
  'bg-success', // Green
  'bg-warning', // Yellow
  'bg-danger',  // Red
];

// ===================== Dashboard Card Maps =====================
// These define the sections and navigation for the dashboard
const userMap = [
  { label: 'Sub Agent Master', value: 'user_details/sub' },
  { label: 'MasterAgent Master', value: 'user_details/master' },
  { label: 'SuperAgent Master', value: 'user_details/super' },
  { label: 'Agent Master', value: 'user_details/agent' },
  { label: 'Client Master', value: 'user_details/client' },
  { label: 'Collection Master', value: 'user_details/collection' },
];
const ledgerMap = [
  { label: 'My Ledger', value: 'ledger' },
  { label: 'All Sub Ledger', value: 'ledger/sub' },
  { label: 'All Master Ledger', value: 'ledger/master' },
  { label: 'All Super Ledger', value: 'ledger/super' },
  { label: 'All Agent Ledger', value: 'ledger/agent' },
  { label: 'All Client Ledger', value: 'ledger/client' },
  { label: 'Client Plus/Minus', value: 'ledger/client/pm' },
];
const gameMap = [
  { label: 'InPlay', value: 'game/inPlay' },
  { label: 'Complete', value: 'game/completeGame' },
];
const cashMap = [
  { label: 'Debit/Credit (C)', value: 'ct/client' },
  { label: 'Debit/Credit (A)', value: 'ct/agent' },
  { label: 'Debit/Credit (SA)', value: 'ct/super' },
  { label: 'Debit/Credit (MA)', value: 'ct/master' },
];
const map = {
  user: userMap,
  ledger: ledgerMap,
  game: gameMap,
  cash: cashMap,
};

// ===================== Main Homepage Component =====================
const IndexPage = () => {
  const router = useRouter();
  
  // -------- State Definitions --------
  const [modalContent, setModalContent] = useState<React.ReactNode>(null); // Content for modal popups
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [siteName, setSiteName] = useState(''); // Site hostname
  const [brandName, setBrandName] = useState(''); // Brand name for header
  const [currentView, setCurrentView] = useState<string>(''); // Current dashboard view
  const [user, setUser] = useState<any>(null); // User info (demo user)
  const [isLoading, setIsLoading] = useState(true); // Loading spinner

  // -------- Set Site Name and Brand on Mount --------
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const site = hostname.split('.')[1]?.toUpperCase() || 'SITE';
      setSiteName(hostname);
      setBrandName(site);
      document.title = site;
    }
  }, []);

  // -------- Get Real User Data from Session --------
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.valid && data.user) {
          setUser(data.user);
        } else {
          // Redirect to login if no valid session
          router.replace('/login');
          return;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.replace('/login');
        return;
      }
      setIsLoading(false);
    };
    getUserData();
  }, []);

  // -------- Logout Handler --------
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.replace('/login');
    }
  };

  // -------- Modal Logic for Dashboard Cards --------
  const showModel = (key: string) => {
    const items = map[key as keyof typeof map] || [];
    const content = items.map((item, i) => (
      <div className="col-lg-6 col-12" key={item.value}>
        <div 
          className={`small-box ${CARD_COLORS[i % CARD_COLORS.length]}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handleItemClick(item.value, item.label)}
        >
          <div className="inner" style={{ padding: 12 }}>
            <h3>{i + 1}</h3>
            <p>{item.label}</p>
          </div>
          <div className="icon">
            <i className="ion ion-bag"></i>
          </div>
          <span className="small-box-footer">More Info <i className="fas fa-arrow-circle-right"></i></span>
        </div>
      </div>
    ));
    setModalContent(content);
    setShowModal(true);
  };

  // -------- Handle Card Clicks (Navigation/Modal) --------
  const handleItemClick = (value: string, label: string) => {
    if (value === 'user_details/client') {
      setCurrentView('client');
      // Show client table in modal
      const clientTableContent = (
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">{label} List</h3>
              <div className="card-tools">
                <button type="button" className="btn btn-primary btn-sm">
                  <i className="fas fa-plus"></i> Add New {label}
                </button>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th><div style={{ textAlign: 'center' }}><input type="checkbox" name="all" id="all" value="1"/></div></th>
                    <th>#</th>
                    <th>CODE</th>
                    <th>Name</th>
                    <th>Agent</th>
                    <th>Mobile</th>
                    <th>Password</th>
                    <th>Limit</th>
                    <th>Share</th>
                    <th>Match</th>
                    <th>Session</th>
                    <th>Charge</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Data rows will be dynamically loaded here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
      setModalContent(clientTableContent);
    } else {
      // Navigate to the selected page
      window.location.href = `/${value}`;
    }
  };

  // -------- Loading Spinner While Initializing --------
  if (isLoading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  // ===================== Main Render =====================
  return (
    <Layout>
      <Head>
        <title>{brandName || 'Load'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <section className="content" style={{ paddingTop: '20px' }}>
        <div className="container-fluid">
         
          <div className="row">
            <div className="col-lg-3 col-6" onClick={() => showModel('user')}>
              <div className="small-box bg-primary" style={{ cursor: 'pointer' }}>
                <div className="inner">
                  <h3>1</h3>
                  <p>User Details</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag"></i>
                </div>
                <span className="small-box-footer">More Info <i className="fas fa-arrow-circle-right"></i></span>
              </div>
            </div>
            <div className="col-lg-3 col-6" onClick={() => showModel('game')}>
              <div className="small-box bg-success" style={{ cursor: 'pointer' }}>
                <div className="inner">
                  <h3>2</h3>
                  <p>Games Details</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag"></i>
                </div>
                <span className="small-box-footer">More Info <i className="fas fa-arrow-circle-right"></i></span>
              </div>
            </div>
            <div className="col-lg-3 col-6" onClick={() => showModel('cash')}>
              <div className="small-box bg-warning" style={{ cursor: 'pointer' }}>
                <div className="inner">
                  <h3>3</h3>
                  <p>Cash Transaction</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag"></i>
                </div>
                <span className="small-box-footer">More Info <i className="fas fa-arrow-circle-right"></i></span>
              </div>
            </div>
            <div className="col-lg-3 col-6" onClick={() => showModel('ledger')}>
              <div className="small-box bg-danger" style={{ cursor: 'pointer' }}>
                <div className="inner">
                  <h3>4</h3>
                  <p>Ledger Details</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag"></i>
                </div>
                <span className="small-box-footer">More Info <i className="fas fa-arrow-circle-right"></i></span>
              </div>
            </div>
          </div>
          {/* Modal Section (if any) */}
          {showModal && (
            <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Details</h5>
                    <button type="button" className="close" onClick={() => setShowModal(false)}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      {modalContent}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage; 