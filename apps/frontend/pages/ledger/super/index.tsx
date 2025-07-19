import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Super {
  id: string;
  username: string;
  name: string;
  code: string;
  creditLimit: number;
}

interface LedgerEntry {
  id: string;
  userId: string;
  collection: string;
  debit: number;
  credit: number;
  balanceAfter: number;
  type: string;
  remark?: string;
  createdAt: string;
}

interface SuperWithLedger extends Super {
  ledger: LedgerEntry[];
}

export default function AllSuperLedgerPage() {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [supers, setSupers] = useState<SuperWithLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuper, setSelectedSuper] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const site = hostname.split('.')[1]?.toUpperCase() || 'SITE';
      setSiteName(hostname);
      setBrandName(site);
      document.title = site;
    }
  }, []);

  // Fetch supers and their ledger
  useEffect(() => {
    const fetchSupersAndLedger = async () => {
      setLoading(true);
      setError('');
      try {
        // Get all super agents
        const supersRes = await fetch('/api/users?role=SUPER_AGENT');
        const supersData = await supersRes.json();
        
        if (!supersData.success) {
          setError('Failed to fetch super agents');
          return;
        }

        const supersWithLedger: SuperWithLedger[] = [];
        
        // Get ledger for each super agent
        for (const superAgent of supersData.users) {
          try {
            const ledgerRes = await fetch(`/api/users/${superAgent.id}/ledger`);
            const ledgerData = await ledgerRes.json();
            
            supersWithLedger.push({
              ...superAgent,
              ledger: ledgerData.success ? ledgerData.ledger : []
            });
          } catch (err) {
            console.error(`Failed to fetch ledger for super agent ${superAgent.id}:`, err);
            supersWithLedger.push({
              ...superAgent,
              ledger: []
            });
          }
        }
        
        setSupers(supersWithLedger);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSupersAndLedger();
  }, []);

  // Filter supers based on search term
  const filteredSupers = supers.filter(superAgent => 
    superAgent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    superAgent.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    superAgent.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected super's ledger
  const selectedSuperData = supers.find(superAgent => superAgent.id === selectedSuper);
  const selectedSuperLedger = selectedSuperData?.ledger || [];

  // Filter and paginate selected super's ledger
  const filteredLedger = selectedSuperLedger.filter(entry => 
    entry.remark?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.collection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLedger.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedLedger = filteredLedger.slice(startIndex, endIndex);

  // Reset to first page when search term or selected super changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSuper]);

  // Reset to first page when entries per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entriesPerPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
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

  return (
    <Layout>
      <Head>
        <title>All Super Ledger - {brandName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>All Super Ledger</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">All Super Ledger</li>
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
                  <h3 className="card-title">Super Agent Ledger Management</h3>
                  <div className="card-tools">
                    <div className="input-group input-group-sm" style={{ width: 250 }}>
                      <input
                        type="text"
                        name="table_search"
                        className="form-control float-right"
                        placeholder="Search super agents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="input-group-append">
                        <button type="submit" className="btn btn-default">
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger">
                      <h6>{error}</h6>
                    </div>
                  )}
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="superSelect">Select Super Agent:</label>
                      <select
                        id="superSelect"
                        className="form-control"
                        value={selectedSuper}
                        onChange={(e) => setSelectedSuper(e.target.value)}
                      >
                        <option value="">Choose a super agent to view ledger...</option>
                        {filteredSupers.map(superAgent => (
                          <option key={superAgent.id} value={superAgent.id}>
                            {superAgent.code} - {superAgent.name} (₹{superAgent.creditLimit.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedSuperData ? (
                    <>
                      <div className="alert alert-info">
                        <h6>
                          <strong>Selected Super Agent:</strong> {selectedSuperData.name} ({selectedSuperData.code})
                          <br />
                          <strong>Current Credit Limit:</strong> {formatAmount(selectedSuperData.creditLimit)}
                          <br />
                          <strong>Total Ledger Entries:</strong> {selectedSuperLedger.length}
                        </h6>
                      </div>

                      {selectedSuperLedger.length === 0 ? (
                        <div className="alert alert-warning">
                          <h6>No ledger entries found for this super agent</h6>
                        </div>
                      ) : (
                        <>
                          <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Date & Time</th>
                                  <th>Type</th>
                                  <th>Collection</th>
                                  <th>Debit</th>
                                  <th>Credit</th>
                                  <th>Balance After</th>
                                  <th>Remark</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedLedger.map((entry, index) => (
                                  <tr key={entry.id}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{formatDate(entry.createdAt)}</td>
                                    <td>
                                      <span className={`badge badge-${entry.type === 'ADJUSTMENT' ? 'warning' : 'info'}`}>
                                        {entry.type}
                                      </span>
                                    </td>
                                    <td>{entry.collection}</td>
                                    <td className="text-danger">
                                      {entry.debit > 0 ? formatAmount(entry.debit) : '-'}
                                    </td>
                                    <td className="text-success">
                                      {entry.credit > 0 ? formatAmount(entry.credit) : '-'}
                                    </td>
                                    <td className="font-weight-bold">
                                      {formatAmount(entry.balanceAfter)}
                                    </td>
                                    <td>{entry.remark || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          {/* Pagination */}
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <label>
                                Show{' '}
                                <select
                                  value={entriesPerPage}
                                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                  className="form-control form-control-sm d-inline-block"
                                  style={{ width: 'auto' }}
                                >
                                  <option value={10}>10</option>
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                  <option value={100}>100</option>
                                </select>
                                {' '}entries
                              </label>
                            </div>
                            
                            <div>
                              <p>
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredLedger.length)} of {filteredLedger.length} entries
                              </p>
                            </div>
                            
                            <div>
                              <nav>
                                <ul className="pagination pagination-sm">
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
                                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                    return (
                                      <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                        <button
                                          className="page-link"
                                          onClick={() => setCurrentPage(page)}
                                        >
                                          {page}
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
                    </>
                  ) : (
                    <div className="alert alert-info">
                      <h6>Please select a super agent to view their ledger entries</h6>
                    </div>
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