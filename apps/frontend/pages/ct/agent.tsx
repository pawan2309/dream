import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

const mockAgents = [
  { id: 'A1001', name: 'A1001 Agent1' },
  { id: 'A1002', name: 'A1002 Agent2' },
  { id: 'A1003', name: 'A1003 Agent3' },
];

export default function CashAgentPage() {
  const [form, setForm] = useState({
    agent: '',
    collection: '1',
    amount: '',
    paymentType: 'Payment Paid',
    remark: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setMessage('Submitted (mock)!');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Layout>
      <Head>
        <title>Cash Transaction - Agent</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="content-wrapper">
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
                <div className="card">
                  <form id="myForm" onSubmit={handleSubmit}>
                    <div className="card-header ">
                      <h4 className="text-capitalize">Agent Ledger</h4>
                      <div className="form-row col-md-9">
                        <div className="form-group col-md-4">
                          <label htmlFor="name" className="text-capitalize">Agent</label>
                          <select className="form-control" required id="name" name="agent" value={form.agent} onChange={handleChange}>
                            <option value="">Select ...</option>
                            {mockAgents.map(a => (
                              <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="collection">Collection</label>
                          <select className="form-control custom-select" required id="collection" name="collection" value={form.collection} onChange={handleChange}>
                            <option value="1">CA1 CASH</option>
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="amount">Amount</label>
                          <input type="number" className="form-control" step="any" id="amount" name="amount" value={form.amount} onChange={handleChange} required />
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="type">Payment Type</label>
                          <select className="form-control custom-select" required id="type" name="paymentType" value={form.paymentType} onChange={handleChange}>
                            <option value="Payment Paid">PAYMENT - DENA</option>
                            <option value="Payment Received">RECEIPT - LENA</option>
                          </select>
                        </div>
                        <div className="form-group col-md-4">
                          <label htmlFor="remark">Remark</label>
                          <input type="text" className="form-control" id="remark" name="remark" value={form.remark} onChange={handleChange} />
                        </div>
                        <div className="form-group col-md-4">
                          <label className="control-label text-purple" htmlFor="btn">&nbsp;</label>
                          <button className="form-control btn-primary" name="isSubmit" value="true" type="submit" disabled={submitting}>Submit</button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      {message && <div className="alert alert-success"><h6>{message}</h6></div>}
                      <div className="alert alert-warning">
                        <h6>No Record Found</h6>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
} 