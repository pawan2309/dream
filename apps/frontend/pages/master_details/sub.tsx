import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

// Empty array for real data
const emptySubs: any[] = [];

export default function SubAgentPage() {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activating, setActivating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

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
    const fetchSubs = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/users?role=SUB');
        const data = await res.json();
        if (data.success) {
          setSubs(data.users || []);
        } else {
          setError('Failed to fetch sub agents');
        }
      } catch (err) {
        setError('Failed to fetch sub agents');
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(subs.map(user => user.id));
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

  // Handle status update
  const handleStatusUpdate = async (isActive: boolean) => {
    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    const action = isActive ? 'activate' : 'deactivate';
    if (!confirm(`Are you sure you want to ${action} ${selectedUsers.length} selected user(s)?`)) {
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
          userIds: selectedUsers,
          isActive: isActive,
          role: 'SUB'
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setSubs(prev => prev.map(user => 
          selectedUsers.includes(user.id) ? { ...user, isActive: isActive } : user
        ));
        setSelectedUsers([]);
        alert(data.message);
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (err) {
      alert('Failed to update status');
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
        <title>{brandName || 'Sub Agent'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Sub Agent Master Details</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item active">Sub Agent</li>
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
                      <Link href="/user/create" className="btn btn-primary mr-2">
                        New <i className="fa fa-plus-circle"></i>
                      </Link>
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
                      <a href="/master/limit" className="btn btn-primary">
                        Limit Update
                      </a>
                    </div>
                  </div>
                  <div className="card-body">
                    {loading && (
                      <div className="text-center">
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                        <p>Loading sub agents...</p>
                      </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!loading && (
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>
                              <div style={{ textAlign: 'center' }}>
                                <input 
                                  type="checkbox" 
                                  checked={selectedUsers.length === subs.length && subs.length > 0}
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
                          {subs.length === 0 && (
                            <tr><td colSpan={11} style={{ textAlign: 'center' }}>No sub agent users found.</td></tr>
                          )}
                          {subs.map((user, idx) => (
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
                              <td>{idx + 1}</td>
                              <td>{user.code || 'N/A'}</td>
                              <td>{user.name || 'N/A'}</td>
                              <td>{user.contactno || 'N/A'}</td>
                              <td>******</td>
                              <td>₹{user.balance?.toLocaleString() || '0'}</td>
                              <td>₹{(user.balance * 0.5)?.toLocaleString() || '0'}</td>
                              <td>₹{(user.balance * 0.2)?.toLocaleString() || '0'}</td>
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