import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
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

export default function SuperAdminMasterPage() {
  const [superAdmins, setSuperAdmins] = useState<any[]>([]);
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
    const fetchSuperAdmins = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/users?role=SUPER_ADMIN');
        const data = await res.json();
        if (data.success) {
          setSuperAdmins(data.users || []);
        } else {
          setError('Failed to fetch super admins');
        }
      } catch (err) {
        setError('Failed to fetch super admins');
      } finally {
        setLoading(false);
      }
    };
    fetchSuperAdmins();
  }, []);

  // Add refresh function
  const refreshData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users?role=SUPER_ADMIN');
      const data = await res.json();
      if (data.success) {
        setSuperAdmins(data.users || []);
      } else {
        setError('Failed to fetch super admins');
      }
    } catch (err) {
      setError('Failed to fetch super admins');
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
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedSuperAdmins.map(user => user.id));
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
  const filteredSuperAdmins = superAdmins.filter(user => 
    user.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.contactno?.includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredSuperAdmins.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedSuperAdmins = filteredSuperAdmins.slice(startIndex, endIndex);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  useEffect(() => { setCurrentPage(1); }, [entriesPerPage]);

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

  const handleDropdownAction = async (action: string, user: any, e?: React.MouseEvent) => {
    handleDropdownClose();
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
    switch (action) {
      case 'edit':
        window.location.href = `/user_details/super_admin/${user.id}/edit`;
        break;
      case 'active':
        handleStatusUpdate(true, [user.id]);
        break;
      case 'inactive':
        handleStatusUpdate(false, [user.id]);
        break;
      case 'statement':
        window.location.href = `/user_details/statement?userId=${user.id}`;
        break;
      case 'deposit':
        handleOpenLimitModal(user, 'deposit');
        break;
      case 'withdrawal':
        handleOpenLimitModal(user, 'withdrawal');
        break;
      case 'downline':
        window.location.href = `/user_details/downline?userId=${user.id}`;
        break;
      case 'changePassword':
        window.location.href = `/changePassword?userId=${user.id}`;
        break;
      case 'sendSMS':
        alert('Send Login Details (SMS)');
        break;
      case 'sendDevice':
        alert('Send Login Details (Device)');
        break;
      default:
        break;
    }
  };

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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies/session are sent in all environments
        body: JSON.stringify({
          userIds: usersToUpdate,
          isActive: isActive,
          role: 'SUPER_ADMIN'
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuperAdmins(prev => prev.map(user =>
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

  const handleLimitSubmit = async () => {
    if (!limitAmount || !limitModal?.user?.parentId) {
      setLimitError('Please enter a valid amount and select a parent.');
      return;
    }
    setLimitLoading(true);
    try {
      const res = await fetch('/api/users/transfer-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          parentId: limitModal.user.parentId,
          childId: limitModal.user.id,
          amount: parseFloat(limitAmount),
          type: limitModal.type,
          remark: '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuperAdmins(prev => prev.map(user =>
          user.id === limitModal.user.id ? { ...user, creditLimit: data.childNewLimit } :
          user.id === limitModal.user.parentId ? { ...user, creditLimit: data.parentNewLimit } : user
        ));
        // Hide the modal with Bootstrap JS before removing from DOM
        const w = window as any;
        if (w.$) {
          w.$('#limitModal').modal('hide');
        }
        setLimitModal(null);
        alert('Limit transfer successful!');
      } else {
        setLimitError(data.message || 'Failed to transfer limit.');
      }
    } catch (err) {
      setLimitError('Failed to transfer limit.');
    } finally {
      setLimitLoading(false);
    }
  };

  useEffect(() => {
    if (limitModal) {
      // Show the modal using Bootstrap's JS (assumes jQuery/Bootstrap JS is loaded)
      if (typeof window !== 'undefined') {
        const w = window as any;
        if (w.$) {
          w.$('#limitModal').modal('show');
        }
      }
    }
  }, [limitModal]);

  return (
    <Layout>
      <Head>
        <title>Super Admin Master Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Super Admin Master Details</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item active">Super Admin</li>
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
                        <Link href="/user_details/super_admin/create" className="btn btn-primary">
                          New <i className="fa fa-plus-circle"></i>
                        </Link>
                        <Link href="/user_details/super_admin/limit" className="btn btn-info">
                          Limit Update <i className="fa fa-coins"></i>
                        </Link>
                        <button className="btn btn-success" type="button" onClick={() => handleStatusUpdate(true)} disabled={activating || deactivating || selectedUsers.length === 0}>
                          {activating ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check"></i> Active</>}
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => handleStatusUpdate(false)} disabled={activating || deactivating || selectedUsers.length === 0}>
                          {deactivating ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fa fa-ban"></i> DeActivate</>}
                        </button>
                      </div>
                      {/* Removed the badge showing selectedUsers.length */}
                    </div>
                  </div>
                  <div className="card-body">
                    {loading && (
                      <div className="text-center">
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                        <p>Loading super admin users...</p>
                      </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!loading && (
                      <>
                        <div className="row mb-3">
                          <div className="col-sm-6">
                            <label>
                              Show{' '}
                              <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="form-control-sm d-inline-block w-auto mx-1">
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
                              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by code, name, or mobile..." className="form-control-sm d-inline-block w-auto ml-1" />
                            </label>
                          </div>
                        </div>
                        <table className="table table-bordered table-striped" style={{ width: '100%', tableLayout: 'fixed' }}>
                          <thead>
                            <tr>
                              <th><div style={{ textAlign: 'center' }}><input type="checkbox" checked={selectedUsers.length === paginatedSuperAdmins.length && paginatedSuperAdmins.length > 0} onChange={(e) => handleSelectAll(e.target.checked)} /></div></th>
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
                            {paginatedSuperAdmins.length === 0 && (<tr><td colSpan={11} style={{ textAlign: 'center' }}>No super admin users found.</td></tr>)}
                            {paginatedSuperAdmins.map((user, idx) => (
                              <tr key={user.id} className={selectedUsers.includes(user.id) ? 'table-active' : ''}>
                                <td><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={(e) => handleUserSelect(user.id, e.target.checked)} /></td>
                                <td>
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-link btn-sm p-0"
                                      onClick={(e) => handleDropdownOpen(user.id, e)}
                                    >
                                      {idx + 1} <i className="fas fa-chevron-down"></i>
                                    </button>
                                    <PortalDropdown show={openDropdownId === user.id} anchorEl={dropdownAnchor} dropdownRef={dropdownRef}>
                                      <button className="dropdown-item" onClick={async (e) => await handleDropdownAction('edit', user, e)}>Edit</button>
                                      <button className="dropdown-item" onClick={async (e) => handleDropdownAction(user.isActive ? 'inactive' : 'active', user, e)}>{user.isActive ? 'Deactivate' : 'Activate'}</button>
                                      <button className="dropdown-item" onClick={() => handleDropdownAction('statement', user)}>Statement</button>
                                      <button className="dropdown-item" onClick={async (e) => handleDropdownAction('deposit', user, e)} disabled={!user.parentId}>Deposit</button>
                                      <button className="dropdown-item" onClick={async (e) => handleDropdownAction('withdrawal', user, e)} disabled={!user.parentId}>Withdraw</button>
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
                                <td>{user.matchCommission ?? '0'}</td>
                                <td>{user.sessionCommission ?? '0'}</td>
                                <td>{user.share || 0}%</td>
                                <td><span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="row mt-3">
                          <div className="col-sm-6">
                            <p>Showing {startIndex + 1} to {Math.min(endIndex, filteredSuperAdmins.length)} of {filteredSuperAdmins.length} entries</p>
                          </div>
                          <div className="col-sm-6 text-right">
                            <nav>
                              <ul className="pagination pagination-sm justify-content-end mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button></li>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => { const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i; return (<li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button></li>); })}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button></li>
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
      {limitModal && (
        <div className="modal fade" id="limitModal" tabIndex={-1} role="dialog" aria-labelledby="limitModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="limitModalLabel">Update Limit for {limitModal.user.name || limitModal.user.code}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <b>Parent:</b> {parentInfo ? (parentInfo.name === 'No parent' ? 'No parent' : parentInfo.name === 'Not found' ? 'Parent not found' : parentInfo.name === 'Error loading parent' ? 'Error loading parent' : `${parentInfo.code} ${parentInfo.name}`) : 'Loading...'}<br/>
                  <b>Parent Limit:</b> <input type="text" className="form-control" value={parentInfo ? parentInfo.limit : ''} readOnly />
                </div>
                <div className="form-group">
                  <label htmlFor="limitAmount">New Limit Amount</label>
                  <input type="number" className="form-control" id="limitAmount" value={limitAmount} onChange={(e) => setLimitAmount(e.target.value)} placeholder="Enter new limit amount" />
                  {limitError && <div className="text-danger">{limitError}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleLimitSubmit} disabled={limitLoading || !limitModal?.user?.parentId}>
                  {limitLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> Save Limit</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
} 