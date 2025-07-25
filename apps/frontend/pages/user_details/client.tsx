import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import NewUserButton from '../../components/NewUserButton';

function PortalDropdown({ show, anchorRef, children }) {
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 });
  React.useEffect(() => {
    if (show && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [show, anchorRef]);
  if (!show) return null;
  return createPortal(
    <div
      className="dropdown-menu show"
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

export default function ClientPage() {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activating, setActivating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    const fetchClients = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/users?role=USER');
        const data = await res.json();
        if (data.success) {
          setClients(data.users || []);
        } else {
          setError('Failed to fetch clients');
        }
      } catch (err) {
        setError('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Add refresh function
  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users?role=USER');
      const data = await res.json();
      if (data.success) {
        setClients(data.users || []);
      } else {
        setError('Failed to fetch clients');
      }
    } catch (err) {
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh when page becomes visible and periodic refresh
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    // Refresh every 30 seconds
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);

    // Refresh when page becomes visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedClients.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle individual user selection
  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // Filter and paginate data
  const filteredClients = clients.filter(user => 
    user.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contactno?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredClients.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset to first page when entries per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);

  // Handle dropdown toggle
  const toggleDropdown = (userId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle dropdown actions
  const handleDropdownAction = (action: string, user: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenDropdown(null);
    
    switch (action) {
      case 'edit':
        // Navigate to edit page or open edit modal
        alert(`Edit user: ${user.name}`);
        break;
      case 'active':
        handleStatusUpdate(true, [user.id]);
        break;
      case 'inactive':
        handleStatusUpdate(false, [user.id]);
        break;
      case 'limitUpdate':
        // Navigate to client limit update page
        window.location.href = `/user_details/client_limit?userId=${user.id}`;
        break;
      case 'sendSMS':
        alert(`Send SMS login details to: ${user.contactno}`);
        break;
      case 'sendDevice':
        alert(`Send device login details to: ${user.contactno}`);
        break;
      case 'emergency':
        alert(`Client emergency action for: ${user.name}`);
        break;
      default:
        break;
    }
  };

  // Handle status update
  const handleStatusUpdate = async (isActive: boolean, userIds?: string[]) => {
    const usersToUpdate = userIds || selectedUsers;
    
    if (usersToUpdate.length === 0) {
      alert('Please select at least one user');
      return;
    }

    if (isActive) {
      setActivating(true);
    } else {
      setDeactivating(true);
    }

    try {
      const res = await fetch('/api/users/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: usersToUpdate,
          isActive: isActive,
          role: 'USER'
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setClients(prev => prev.map(user => 
          usersToUpdate.includes(user.id) ? { ...user, isActive: isActive } : user
        ));
        if (!userIds) {
          setSelectedUsers([]);
        }
      } else {
        console.error('Failed to update status:', data.message);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      if (isActive) {
        setActivating(false);
      } else {
        setDeactivating(false);
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>Client Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style jsx>{`
          .dropdown-menu {
            min-width: 200px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
          }
          .dropdown-item {
            padding: 8px 16px;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
          }
          .dropdown-item:hover {
            background-color: #f8f9fa;
          }
          .table td {
            position: relative;
          }
        `}</style>
      </Head>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Client Details</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item active">Client</li>
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
                <form action="#" method="post" id="demoForm">
                  <div className="card-header">
                    <div className="form-group">
                      <NewUserButton role="USER" className="btn btn-primary mr-2">
                        New <i className="fa fa-plus-circle"></i>
                      </NewUserButton>
                      {selectedUsers.length > 0 && (
                        <span className="badge badge-info mr-2">
                          {selectedUsers.length} user(s) selected
                        </span>
                      )}
                      <button 
                        className="btn btn-success mr-2" 
                        type="button"
                        onClick={() => handleStatusUpdate(true)}
                        disabled={activating || deactivating || selectedUsers.length === 0}
                      >
                        {activating ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check"></i> Active</>}
                      </button>
                      <button 
                        className="btn btn-danger mr-2" 
                        type="button"
                        onClick={() => handleStatusUpdate(false)}
                        disabled={activating || deactivating || selectedUsers.length === 0}
                      >
                        {deactivating ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fa fa-ban"></i> DeActivate</>}
                      </button>
                      <a href="/user_details/client_limit" className="btn btn-primary">
                        Limit Update
                      </a>
                    </div>
                  </div>
                  <div className="card-body">
                    {loading && (
                      <div className="text-center">
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                        <p>Loading clients...</p>
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
                        <table className="table table-bordered table-striped" style={{ width: '100%', tableLayout: 'fixed' }}>
                          <thead>
                            <tr>
                              <th>
                                <div style={{ textAlign: 'center' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={selectedUsers.length === paginatedClients.length && paginatedClients.length > 0}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                  />
                                </div>
                              </th>
                              <th>#</th>
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
                            {paginatedClients.length === 0 && (
                              <tr><td colSpan={11} style={{ textAlign: 'center' }}>No client users found.</td></tr>
                            )}
                            {paginatedClients.map((user, idx) => (
                              <tr 
                                key={user.id}
                                className={selectedUsers.includes(user.id) ? 'table-active' : ''}
                              >
                                <td>
                                  <input 
                                    type="checkbox" 
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                                  />
                                </td>
                                <td style={{ position: 'relative' }}>
                                  <div className="dropdown">
                                    <button 
                                      ref={buttonRef}
                                      className="btn btn-link btn-sm p-0" 
                                      onClick={(e) => toggleDropdown(user.id, e)}
                                    >
                                      {idx + 1} <i className="fas fa-chevron-down"></i>
                                    </button>
                                    <PortalDropdown show={openDropdown === user.id} anchorRef={buttonRef}>
                                      <button className="dropdown-item" onClick={(e) => handleDropdownAction('edit', user, e)}>Edit</button>
                                      <button className="dropdown-item" onClick={(e) => handleDropdownAction(user.isActive ? 'inactive' : 'active', user, e)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                                      <button className="dropdown-item" onClick={() => window.location.href = `/user_details/statement?userId=${user.id}`}>Statement</button>
                                      <button className="dropdown-item" onClick={() => handleOpenLimitModal(user, 'deposit')} disabled={!user.parentId}>Deposit</button>
                                      <button className="dropdown-item" onClick={() => handleOpenLimitModal(user, 'withdrawal')} disabled={!user.parentId}>Withdraw</button>
                                      <button className="dropdown-item" onClick={() => window.location.href = `/user_details/downline?userId=${user.id}`}>Downline</button>
                                      <button className="dropdown-item" onClick={() => window.location.href = `/changePassword?userId=${user.id}`}>Change Password</button>
                                      <button className="dropdown-item" onClick={() => alert('Send Login Details (SMS)')}>Send Login Details (SMS)</button>
                                      <button className="dropdown-item" onClick={() => alert('Send Login Details (Device)')}>Send Login Details (Device)</button>
                                    </PortalDropdown>
                                  </div>
                                </td>
                                <td>{user.code || 'N/A'}</td>
                                <td>{user.name || 'N/A'}</td>
                                <td>{user.contactno || 'N/A'}</td>
                                <td>******</td>
                                <td>{(user.creditLimit || 0).toLocaleString()}</td>
                                <td>{(user.balance * 0.5)?.toLocaleString() || '0'}</td>
                                <td>{(user.balance * 0.2)?.toLocaleString() || '0'}</td>
                                <td>{user.share || 0}%</td>
                                <td>
                                  <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {/* Pagination */}
                        <div className="row mt-3">
                          <div className="col-sm-6">
                            <p>
                              Showing {startIndex + 1} to {Math.min(endIndex, filteredClients.length)} of {filteredClients.length} entries
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 