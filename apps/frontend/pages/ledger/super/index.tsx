import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dayjs, { Dayjs } from 'dayjs';

interface Super {
  id: string;
  username: string;
  name: string;
  code: string;
  creditLimit: number;
  contactno?: string;
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
  transactionType?: string;
}

interface SuperWithLedger extends Super {
  ledger: LedgerEntry[];
}

interface LenaDenaSummary {
  name: string;
  contact: string;
  openBalance: number;
  currentBalance: number;
  closingBalance: number;
}

export default function AllSuperLedgerPage() {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [supers, setSupers] = useState<SuperWithLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('day')]);
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

  // Date range filter UI
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, idx: 0 | 1) => {
    const val = e.target.value;
    setDateRange(prev => {
      const newRange: [Dayjs, Dayjs] = [prev[0], prev[1]];
      newRange[idx] = dayjs(val);
      return newRange;
    });
  };

  // Calculate Lena He (payments to receive) and Dena He (payments to pay) for all supers
  const calculateLenaDenaSummary = () => {
    const lenaHe: LenaDenaSummary[] = [];
    const denaHe: LenaDenaSummary[] = [];
    const [startDate, endDate] = dateRange;
    filteredSupers.forEach(superAgent => {
      // Only use profit/loss ledger entries
      const profitLossLedger = superAgent.ledger.filter(entry => {
        const allowedTypes = ['WIN', 'LOSS', 'PNL_CREDIT', 'PNL_DEBIT'];
        const allowedTransactionTypes = ['BET', 'BET_SETTLEMENT', 'P&L'];
        return (
          allowedTypes.includes(entry.type) ||
          (entry.transactionType && allowedTransactionTypes.includes(entry.transactionType))
        );
      });
      // Opening balance: sum of all (credit - debit) before startDate
      const openingBalance = profitLossLedger
        .filter(entry => dayjs(entry.createdAt).isBefore(startDate, 'day'))
        .reduce((sum, entry) => sum + (entry.credit || 0) - (entry.debit || 0), 0);
      // Closing balance: sum of all (credit - debit) up to endDate (inclusive)
      const closingBalance = profitLossLedger
        .filter(entry => {
          const entryDate = dayjs(entry.createdAt);
          return entryDate.isBefore(endDate, 'day') || entryDate.isSame(endDate, 'day');
        })
        .reduce((sum, entry) => sum + (entry.credit || 0) - (entry.debit || 0), 0);
      // Current balance: net change in range
      const currentBalance = closingBalance - openingBalance;
      const summary: LenaDenaSummary = {
        name: `${superAgent.code} ${superAgent.name}`,
        contact: superAgent.contactno || 'N/A',
        openBalance: openingBalance,
        currentBalance: Math.abs(currentBalance),
        closingBalance: closingBalance
      };
      if (currentBalance > 0) {
        lenaHe.push(summary);
      } else if (currentBalance < 0) {
        denaHe.push(summary);
      }
    });
    return { lenaHe, denaHe };
  };

  const { lenaHe, denaHe } = calculateLenaDenaSummary();

  // Calculate totals
  const lenaHeTotal = {
    openBalance: lenaHe.reduce((sum, item) => sum + item.openBalance, 0),
    currentBalance: lenaHe.reduce((sum, item) => sum + item.currentBalance, 0),
    closingBalance: lenaHe.reduce((sum, item) => sum + item.closingBalance, 0)
  };

  const denaHeTotal = {
    openBalance: denaHe.reduce((sum, item) => sum + item.openBalance, 0),
    currentBalance: denaHe.reduce((sum, item) => sum + item.currentBalance, 0),
    closingBalance: denaHe.reduce((sum, item) => sum + item.closingBalance, 0)
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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
        <title>All Super Agent Ledger - {brandName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>All Super Agent Ledger</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">All Super Agent Ledger</li>
              </ol>
            </div>
          </div>
          {/* Date Range Picker UI */}
          <div className="row mb-3">
            <div className="col-12">
              <label style={{ fontWeight: 600, marginRight: 8 }}>Select Date Range:</label>
              <input type="date" value={dateRange[0].format('YYYY-MM-DD')} onChange={e => handleDateChange(e, 0)} style={{ marginRight: 8 }} />
              <input type="date" value={dateRange[1].format('YYYY-MM-DD')} onChange={e => handleDateChange(e, 1)} />
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
                  <h3 className="card-title">Super Agent Ledger Summary</h3>
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
                  
                  {/* Lena He Table - Payments to Receive */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="card card-success">
                        <div className="card-header">
                          <h3 className="card-title">
                            <i className="fas fa-arrow-down text-success mr-2"></i>
                            PAYMENT RECEIVING FROM (LENA HE)
                          </h3>
                        </div>
                        <div className="card-body p-0">
                          <div className="table-responsive">
                            <table className="table table-bordered table-striped mb-0">
                              <thead className="bg-success text-white">
                                <tr>
                                  <th>Name</th>
                                  <th>Contact</th>
                                  <th>Opening Balance</th>
                                  <th>Current Balance</th>
                                  <th>Closing Balance</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lenaHe.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.contact}</td>
                                    <td className="text-right">{formatAmount(item.openBalance)}</td>
                                    <td className="text-right">{formatAmount(item.currentBalance)}</td>
                                    <td className="text-right">{formatAmount(item.closingBalance)}</td>
                                  </tr>
                                ))}
                                {lenaHe.length === 0 && (
                                  <tr>
                                    <td colSpan={5} className="text-center text-muted">
                                      No payments to receive
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                              <tfoot className="bg-light">
                                <tr className="font-weight-bold">
                                  <td colSpan={2} className="text-right">Total:</td>
                                  <td className="text-right">{formatAmount(lenaHeTotal.openBalance)}</td>
                                  <td className="text-right">{formatAmount(lenaHeTotal.currentBalance)}</td>
                                  <td className="text-right">{formatAmount(lenaHeTotal.closingBalance)}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dena He Table - Payments to Pay */}
                  <div className="row">
                    <div className="col-12">
                      <div className="card card-danger">
                        <div className="card-header">
                          <h3 className="card-title">
                            <i className="fas fa-arrow-up text-danger mr-2"></i>
                            PAYMENT PAID TO (DENA HE)
                          </h3>
                        </div>
                        <div className="card-body p-0">
                          <div className="table-responsive">
                            <table className="table table-bordered table-striped mb-0">
                              <thead className="bg-danger text-white">
                                <tr>
                                  <th>Name</th>
                                  <th>Contact</th>
                                  <th>Opening Balance</th>
                                  <th>Current Balance</th>
                                  <th>Closing Balance</th>
                                </tr>
                              </thead>
                              <tbody>
                                {denaHe.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.contact}</td>
                                    <td className="text-right">{formatAmount(item.openBalance)}</td>
                                    <td className="text-right">{formatAmount(item.currentBalance)}</td>
                                    <td className="text-right">{formatAmount(item.closingBalance)}</td>
                                  </tr>
                                ))}
                                {denaHe.length === 0 && (
                                  <tr>
                                    <td colSpan={5} className="text-center text-muted">
                                      No payments to pay
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                              <tfoot className="bg-light">
                                <tr className="font-weight-bold">
                                  <td colSpan={2} className="text-right">Total:</td>
                                  <td className="text-right">{formatAmount(denaHeTotal.openBalance)}</td>
                                  <td className="text-right">{formatAmount(denaHeTotal.currentBalance)}</td>
                                  <td className="text-right">{formatAmount(denaHeTotal.closingBalance)}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="info-box bg-success">
                        <span className="info-box-icon">
                          <i className="fas fa-arrow-down"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Total to Receive (Lena He)</span>
                          <span className="info-box-number">{formatAmount(lenaHeTotal.currentBalance)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-box bg-danger">
                        <span className="info-box-icon">
                          <i className="fas fa-arrow-up"></i>
                        </span>
                        <div className="info-box-content">
                          <span className="info-box-text">Total to Pay (Dena He)</span>
                          <span className="info-box-number">{formatAmount(denaHeTotal.currentBalance)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 