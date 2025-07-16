import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';

const mockClients = [
  { id: '1024724', name: 'C1024724 Ankit' },
  { id: '1024728', name: 'C1024728 Master' },
  { id: '1024732', name: 'C1024732 Akash' },
  { id: '1024735', name: 'C1024735 Vinod m' },
  { id: '1024737', name: 'C1024737 Vinayak' },
  { id: '1024742', name: 'C1024742 Shyam M' },
  { id: '1024752', name: 'C1024752 Bbb' },
  { id: '1024755', name: 'C1024755 Shiv' },
  { id: '1024756', name: 'C1024756 Naresh deepu' },
  { id: '1024757', name: 'C1024757 Lala3' },
];

export default function CashClientPage() {
  const [form, setForm] = useState({
    client: '',
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
        <title>Cash Transaction - Client</title>
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
                      <h4 className="text-capitalize">Client Ledger</h4>
                      <div className="form-row col-md-9">
                        <div className="form-group col-md-4">
                          <label htmlFor="name" className="text-capitalize">Client</label>
                          <select className="form-control" required id="name" name="client" value={form.client} onChange={handleChange}>
                            <option value="">Select ...</option>
                            {mockClients.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
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
