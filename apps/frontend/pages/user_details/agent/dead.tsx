import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

function PortalDropdown({ show, anchorEl, children, dropdownRef }: { show: boolean; anchorEl: HTMLElement | null; children: React.ReactNode; dropdownRef: React.RefObject<HTMLDivElement> }) {
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 });
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (show && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
      setReady(true);
    } else {
      setReady(false);
    }
  }, [show, anchorEl]);
  if (!show || !ready) return null;
  return createPortal(
    <div
      ref={dropdownRef}
      className="custom-dropdown-menu"
      style={{
        position: 'absolute',
        zIndex: 3000,
        top: coords.top,
        left: coords.left,
        minWidth: coords.width,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

export default function DeadAgentPage() {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const site = hostname.split('.')[1]?.toUpperCase() || 'SITE';
      setSiteName(hostname);
      setBrandName(site);
      document.title = site;
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/users'); // Fetch all users, not just agents
        const data = await res.json();
        if (data.success) {
          setAgents((data.users || []).filter((u: any) => u.isActive === false || u.isActive === 'false' || u.isActive === 0));
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter and paginate data
  const filteredAgents = agents.filter(user => 
    user.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contactno?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredAgents.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset to first page when entries per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);

  const handleDropdownOpen = (userId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(userId);
    setDropdownAnchor(e.currentTarget);
  };
  const handleDropdownClose = () => {
    setOpenDropdownId(null);
    setDropdownAnchor(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownAnchor &&
        !(dropdownAnchor as any).contains(event.target)
      ) {
        handleDropdownClose();
      }
    }
    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId, dropdownAnchor]);

  // Handle dropdown actions (view only)
  const handleDropdownAction = (action: string, user: any, e?: React.MouseEvent) => {
    handleDropdownClose();
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    switch (action) {
      case 'statement':
        window.location.href = `/user_details/statement?userId=${user.id}`;
        break;
      case 'downline':
        window.location.href = `/user_details/downline?userId=${user.id}`;
        break;
      default:
        break;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Dead Users</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Dead Users</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item active">Dead Users</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="form-group">
                    <div className="user-action-grid">
                      <Link href="/user_details/agent" className="btn btn-secondary">
                        Back to Active Users
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {loading && (
                    <div className="text-center">
                      <i className="fas fa-spinner fa-spin fa-2x"></i>
                      <p>Loading agents...</p>
                    </div>
                  )}
                  {error && <div className="alert alert-danger">{error}</div>}
                  {!loading && (
                    <>
                      <div className="row mb-3">
                        <div className="col-sm-6">
                          <label>
                            Show{' '}
                            <select 
                              value={entriesPerPage} 
                              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                              className="form-control-sm d-inline-block w-auto mx-1"
                            >
                              <option value={10}>10</option>
                              <option value={25}>25</option>
                              <option value={50}>50</option>
                              <option value={100}>100</option>
                            </select>
                            {' '}entries
                          </label>
                        </div>
                        <div className="col-sm-6 text-right">
                          <label>
                            Search:{' '}
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search by code, name, or mobile..."
                              className="form-control-sm d-inline-block w-auto ml-1"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="table-responsive" style={{ width: '100%' }}>
                        <table className="table table-bordered table-striped" style={{ width: '100%', tableLayout: 'fixed' }}>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Role</th>
                              <th>CODE</th>
                              <th>Name</th>
                              <th>Mobile</th>
                              <th>Password</th>
                              <th>Limit</th>
                              <th>Match</th>
                              <th>Session</th>
                              <th>Share</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedAgents.length === 0 && (
                              <tr><td colSpan={11} style={{ textAlign: 'center' }}>No dead users found.</td></tr>
                            )}
                            {paginatedAgents.map((user, idx) => (
                              <tr key={user.id}>
                                <td style={{ position: 'relative' }}>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-link btn-sm p-0"
                                      onClick={(e) => handleDropdownOpen(user.id, e)}
                                    >
                                      {idx + 1} <i className="fas fa-chevron-down"></i>
                                    </button>
                                    <PortalDropdown show={openDropdownId === user.id} anchorEl={dropdownAnchor} dropdownRef={dropdownRef}>
                                      <button className="dropdown-item" onClick={(e) => handleDropdownAction('statement', user, e)}>Statement</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('downline', user)}>Downline</button>
                                    </PortalDropdown>
                                  </div>
                                </td>
                                <td>{user.role || 'N/A'}</td>
                                <td>{user.code || 'N/A'}</td>
                                <td>{user.name || 'N/A'}</td>
                                <td>{user.contactno || 'N/A'}</td>
                                <td>******</td>
                                <td>{(user.creditLimit || 0).toLocaleString()}</td>
                                <td>{(user.balance * 0.5)?.toLocaleString() || '0'}</td>
                                <td>{(user.balance * 0.2)?.toLocaleString() || '0'}</td>
                                <td>{user.share || 0}%</td>
                                <td>
                                  <span className="badge badge-danger">Inactive</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Pagination */}
                      <div className="row mt-3">
                        <div className="col-sm-6">
                          <p>
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredAgents.length)} of {filteredAgents.length} entries
                          </p>
                        </div>
                        <div className="col-sm-6 text-right">
                          <nav>
                            <ul className="pagination pagination-sm justify-content-end mb-0">
                              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => setCurrentPage(currentPage - 1)}
                                  disabled={currentPage === 1}
                                >
                                  Previous
                                </button>
                              </li>
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                return (
                                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                    <button 
                                      className="page-link" 
                                      onClick={() => setCurrentPage(pageNum)}
                                    >
                                      {pageNum}
                                    </button>
                                  </li>
                                );
                              })}
                              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => setCurrentPage(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                >
                                  Next
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 