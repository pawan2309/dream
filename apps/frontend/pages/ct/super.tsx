import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

interface Super {
  id: string;
  name: string;
  code: string;
  creditLimit: number;
}

interface LedgerEntry {
  id: string;
  date: string;
  collectionName: string;
  debit: number;
  credit: number;
  balance: number;
  paymentType: string;
  remark: string;
}

export default function CashSuperPage() {
  const [form, setForm] = useState({
    super: '',
    collection: '1',
    amount: '',
    paymentType: 'Payment Paid',
    remark: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [supers, setSupers] = useState<Super[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    fetchSupers();
  }, []);

  useEffect(() => {
    if (form.super) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [form.super]);

  const fetchSupers = async () => {
    try {
      const response = await fetch('/api/users?role=SUPER_AGENT');
      if (response.ok) {
        const data = await response.json();
        setSupers(Array.isArray(data) ? data : data.users || []);
      } else {
        setError('Failed to fetch super agents');
      }
    } catch (err) {
      setError('Error fetching super agents');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!form.super) return;
    setLoadingTransactions(true);
    try {
      const response = await fetch(`/api/users/${form.super}/ledger`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.ledger) {
          setTransactions(data.ledger);
        } else {
          setTransactions([]);
        }
      } else {
        setError('Failed to fetch transactions');
        setTransactions([]);
      }
    } catch (err) {
      setError('Error fetching transactions');
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/users/${form.super}/manual-ledger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(form.amount),
          type: form.paymentType,
          remark: form.remark,
          collection: form.collection,
        }),
      });

      if (response.ok) {
        setMessage('Transaction completed successfully!');
        setForm(prev => ({ ...prev, amount: '', remark: '' }));
        // Refresh supers and transactions to get updated data
        fetchSupers();
        fetchTransactions();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to process transaction');
      }
    } catch (err) {
      setError('Error processing transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSuperData = supers.find(superAgent => superAgent.id === form.super);

  // Calculate totals from fetched transactions
  const totalDebit = transactions.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = transactions.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  const currentBalance = totalCredit - totalDebit;

  return (
    <Layout>
      <Head>
        <title>Cash Transaction - Super</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Cash Transaction</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Cash Transaction</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <form id="myForm" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="col-12 mb-3">
                    <h4 className="text-capitalize">Super Ledger</h4>
                  </div>
                  <div className="form-row col-md-12">
                    <div className="form-group col-md-4">
                      <label htmlFor="super" className="text-capitalize">Super</label>
                      <select 
                        className="form-control" 
                        required 
                        id="super" 
                        name="super" 
                        value={form.super} 
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select Super Agent...</option>
                        {supers.map(superAgent => (
                          <option key={superAgent.id} value={superAgent.id}>
                            {superAgent.code} - {superAgent.name} (₹{superAgent.creditLimit.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="collection">Collection</label>
                      <select 
                        className="form-control custom-select" 
                        required 
                        id="collection" 
                        name="collection" 
                        value={form.collection} 
                        onChange={handleChange}
                      >
                        <option value="1">CA1 CASH</option>
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="amount">Amount</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        step="any" 
                        id="amount" 
                        name="amount" 
                        value={form.amount} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="type">Payment Type</label>
                      <select 
                        className="form-control custom-select" 
                        required 
                        id="type" 
                        name="paymentType" 
                        value={form.paymentType} 
                        onChange={handleChange}
                      >
                        <option value="Payment Paid">PAYMENT - DENA</option>
                        <option value="Payment Received">RECEIPT - LENA</option>
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="remark">Remark</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="remark" 
                        name="remark" 
                        value={form.remark} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="control-label text-purple" htmlFor="btn">&nbsp;</label>
                      <button 
                        className="form-control btn-primary" 
                        name="isSubmit" 
                        value="true" 
                        type="submit" 
                        disabled={submitting || loading}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="alert alert-danger">
                    <h6>{error}</h6>
                  </div>
                )}
                {message && (
                  <div className="alert alert-success">
                    <h6>{message}</h6>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Transaction History Table */}
          {form.super && (
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <h4>Transaction History</h4>
                </div>
                <div>
                  {loadingTransactions ? (
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      <p>Loading transaction history...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Collection Name</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Balance</th>
                            <th>Payment Type</th>
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Total Amount Row */}
                          <tr className="table-info font-weight-bold">
                            <td colSpan={3}>Total Amount</td>
                            <td>₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td>₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td className="text-primary">₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          
                          {/* Individual Transaction Rows */}
                          {transactions.map((entry, index) => (
                            <tr key={entry.id}>
                              <td>{index + 1}</td>
                              <td>{new Date(entry.createdAt).toLocaleString('en-IN')}</td>
                              <td>{entry.collection}</td>
                              <td>₹{(entry.debit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td>₹{(entry.credit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td>₹{(entry.balanceAfter || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td>{entry.type}</td>
                              <td>{entry.remark || ''}</td>
                            </tr>
                          ))}
                          
                          {transactions.length === 0 && (
                            <tr>
                              <td colSpan={8} className="text-center">No transactions found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
} 