import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import NewUserButton from '../../../components/NewUserButton';
import { createPortal } from 'react-dom';

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

const MasterPage = () => {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [masters, setMasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activating, setActivating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [parentInfo, setParentInfo] = useState<{ name: string; code: string; limit: number } | null>(null);
  const [limitModal, setLimitModal] = useState<{ open: boolean; user: any; type: 'deposit' | 'withdrawal' } | null>(null);
  const [limitAmount, setLimitAmount] = useState('');
  const [limitError, setLimitError] = useState('');
  const [limitLoading, setLimitLoading] = useState(false);

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
    const fetchMasters = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/users?role=MASTER');
        const data = await res.json();
        if (res.ok) {
          setMasters(data.users || []);
        } else {
          setError(data.error || 'Failed to fetch masters');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, []);

  // Add refresh function
  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users?role=MASTER');
      const data = await res.json();
      if (res.ok) {
        setMasters(data.users || []);
      } else {
        setError(data.error || 'Failed to fetch masters');
      }
    } catch (err) {
      setError('Network error');
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
      setSelectedUsers(paginatedMasters.map(user => user.id));
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
  const filteredMasters = masters.filter(user => 
    user.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contactno?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredMasters.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedMasters = filteredMasters.slice(startIndex, endIndex);

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

  // Handle dropdown actions
  const handleDropdownAction = (action: string, user: any, e?: React.MouseEvent) => {
    handleDropdownClose();
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    switch (action) {
      case 'edit':
        window.location.href = `/user_details/master/${user.id}/edit`;
        break;
      case 'active':
        handleStatusUpdate(true, [user.id]);
        break;
      case 'inactive':
        handleStatusUpdate(false, [user.id]);
        break;
              case 'limitUpdate':
          // Navigate to master limit update page
          window.location.href = `/user_details/master/limit?userId=${user.id}`;
        break;
      case 'sendSMS':
        alert(`Send SMS login details to: ${user.contactno}`);
        break;
      case 'sendDevice':
        alert(`Send device login details to: ${user.contactno}`);
        break;
      case 'emergency':
        alert(`Master emergency action for: ${user.name}`);
        break;
      case 'statement':
        // Navigate to statement page
        window.location.href = `/user_details/statement?userId=${user.id}`;
        break;
      case 'changePassword':
        // Navigate to change password page
        window.location.href = `/changePassword?userId=${user.id}`;
        break;
      case 'downline':
        // Navigate to downline page
        window.location.href = `/user_details/downline?userId=${user.id}`;
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
          role: 'MASTER'
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setMasters(prev => prev.map(user => 
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

  // Change function to async
  async function handleOpenLimitModal(user: any, type: 'deposit' | 'withdrawal') {
    setLimitModal({ open: true, user, type });
    setLimitAmount('');
    setLimitError('');
    setParentInfo(null);
    if (user.parentId) {
      try {
        const res = await fetch(`/api/users/${user.parentId}`);
        const data = await res.json();
        if (data.success && data.user) {
          setParentInfo({
            name: data.user.name || '',
            code: data.user.code || '',
            limit: data.user.creditLimit || 0,
          });
        } else {
          setParentInfo({ name: 'Not found', code: '', limit: 0 });
        }
      } catch {
        setParentInfo({ name: 'Error loading parent', code: '', limit: 0 });
      }
    } else {
      setParentInfo({ name: 'No parent', code: '', limit: 0 });
    }
  }

  function handleCloseLimitModal() {
    setLimitModal(null);
    setLimitAmount('');
    setLimitError('');
    setParentInfo(null);
  }
  async function handleLimitSubmit() {
    if (!limitModal || !limitAmount || isNaN(Number(limitAmount)) || Number(limitAmount) <= 0) {
      setLimitError('Please enter a valid amount');
      return;
    }
    setLimitLoading(true);
    setLimitError('');
    try {
      const res = await fetch('/api/users/transfer-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentId: limitModal.user.parentId,
          childId: limitModal.user.id,
          amount: Number(limitAmount),
          type: limitModal.type, // 'deposit' or 'withdrawal'
          remark: '',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        handleCloseLimitModal();
        refreshData();
      } else {
        setLimitError(data.message || 'Failed to update limit');
      }
    } catch (err) {
      setLimitError('Network error');
    } finally {
      setLimitLoading(false);
    }
  }

  return (
    <Layout>
      <Head>
        <title>{brandName || 'Master'}</title>
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
              <h1>Master Agent Details</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item active">Master</li>
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
                      <div className="user-action-grid">
                        <Link href="/user_details/master/create" className="btn btn-primary">
                          New <i className="fa fa-plus-circle"></i>
                        </Link>
                        <Link href="/user_details/master/limit" className="btn btn-info">
                          Limit Update <i className="fa fa-coins"></i>
                        </Link>
                        <button className="btn btn-success" type="button" onClick={() => handleStatusUpdate(true)} disabled={activating || deactivating || selectedUsers.length === 0}>
                          {activating ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check"></i> Active</>}
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => handleStatusUpdate(false)} disabled={activating || deactivating || selectedUsers.length === 0}>
                          {deactivating ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fa fa-ban"></i> DeActivate</>}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    {loading && (
                      <div className="text-center">
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                        <p>Loading masters...</p>
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
                                    checked={selectedUsers.length === paginatedMasters.length && paginatedMasters.length > 0}
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
                            {paginatedMasters.length === 0 && (
                              <tr><td colSpan={11} style={{ textAlign: 'center' }}>No master users found.</td></tr>
                            )}
                            {paginatedMasters.map((user, idx) => (
                              <tr key={user.id} className={selectedUsers.includes(user.id) ? 'table-active' : ''}>
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
                                      className="btn btn-link btn-sm p-0" 
                                      onClick={(e) => handleDropdownOpen(user.id, e)}
                                    >
                                      {idx + 1} <i className="fas fa-chevron-down"></i>
                                    </button>
                                    <PortalDropdown show={openDropdownId === user.id} anchorEl={dropdownAnchor} dropdownRef={dropdownRef}>
                                      <button className="dropdown-item" onClick={(e) => handleDropdownAction('edit', user, e)}>Edit</button>
                                      <button className="dropdown-item" onClick={(e) => handleDropdownAction(user.isActive ? 'inactive' : 'active', user, e)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('statement', user)}>Statement</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('deposit', user)} disabled={!user.parentId}>Deposit</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('withdrawal', user)} disabled={!user.parentId}>Withdraw</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('downline', user)}>Downline</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('changePassword', user)}>Change Password</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('sendSMS', user)}>Send Login Details (SMS)</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('sendDevice', user)}>Send Login Details (Device)</button>
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
                              Showing {startIndex + 1} to {Math.min(endIndex, filteredMasters.length)} of {filteredMasters.length} entries
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

      {/* Limit Update Modal */}
      {limitModal && limitModal.open && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{limitModal.type === 'deposit' ? 'Deposit' : 'Withdraw'} Limit for {limitModal.user.code} {limitModal.user.name}</h5>
                <button type="button" className="close" onClick={handleCloseLimitModal}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <b>Parent:</b> {parentInfo ? `${parentInfo.code} ${parentInfo.name}` : 'Loading...'}<br/>
                  <b>Parent Limit:</b> <input type="text" className="form-control" value={parentInfo ? parentInfo.limit : ''} readOnly />
                </div>
                <div className="mb-2">
                  <b>Client:</b> {limitModal.user.code} {limitModal.user.name}<br/>
                  <b>Client Limit:</b> <input type="text" className="form-control" value={limitModal.user.creditLimit} readOnly />
                </div>
                <div className="form-group">
                  <label htmlFor="limitAmount">Enter amount</label>
                  <input type="number" className="form-control" id="limitAmount" value={limitAmount} onChange={e => setLimitAmount(e.target.value)} placeholder="Enter amount" />
                  {limitError && <div className="text-danger">{limitError}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseLimitModal} disabled={limitLoading}>Cancel</button>
                <button className="btn btn-primary" onClick={handleLimitSubmit} disabled={limitLoading || !limitModal?.user?.parentId}>
                  {limitLoading ? 'Processing...' : (limitModal.type === 'deposit' ? 'Deposit' : 'Withdraw')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MasterPage; 