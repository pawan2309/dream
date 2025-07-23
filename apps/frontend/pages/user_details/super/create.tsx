import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';

const SuperAgentCreatePage = () => {
  const router = useRouter();
  const [showParentDialog, setShowParentDialog] = useState(true);
  const [masters, setMasters] = useState<any[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<string>('');
  const [form, setForm] = useState({
    code: 'Auto Generated',
    name: '',
    reference: '',
    password: '',
    contactno: '',
    balance: '',
    share: '',
    commissionType: '',
    casinoShare: '',
    casinoCommission: '',
    casinoStatus: false,
    matchCommission: '',
    sessionCommission: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all masters for parent selection
    const fetchMasters = async () => {
      try {
        const res = await fetch('/api/users?role=MASTER');
        const data = await res.json();
        if (data.success && data.users) {
          setMasters(data.users);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchMasters();
  }, []);

  const handleParentContinue = () => {
    if (!selectedMaster) {
      alert('Please select a Master');
      return;
    }
    setShowParentDialog(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : value
    }));
  };

  const generatePassword = () => {
    const randomPassword = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
    setForm(prev => ({ ...prev, password: randomPassword.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          role: 'SUPER_AGENT',
          parentId: selectedMaster,
          creditLimit: Number(form.balance),
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Super Agent created successfully! Redirecting...');
        setTimeout(() => router.push('/user_details/super'), 1500);
      } else {
        setError(data.message || 'Failed to create Super Agent');
      }
    } catch (err) {
      setError('Failed to create Super Agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {showParentDialog && (
        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Master</h5>
                <button type="button" className="close" onClick={() => router.push('/user_details/super')}>&times;</button>
              </div>
              <div className="modal-body">
                <select className="form-control" value={selectedMaster} onChange={e => setSelectedMaster(e.target.value)}>
                  <option value="">Select Master</option>
                  {masters.map((master: any) => (
                    <option key={master.id} value={master.id}>{master.code} ({master.name})</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => router.push('/user_details/super')}>Close</button>
                <button className="btn btn-primary" onClick={handleParentContinue}>Continue</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!showParentDialog && (
        <section className="content-header pb-2">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6"><h1 className="text-capitalize">Super Agent</h1></div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active text-capitalize">New Super Agent</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}
      {!showParentDialog && (
        <section className="content">
          <form onSubmit={handleSubmit}>
            <div className="row g-0 g-sm-3">
              <div className="col-md-6">
                <div className="card tbaleCard card-primary">
                  <div className="px-2 cardHeaderOfCollection bg-primary">
                    <h3 className="card-title collectionTitle">General</h3>
                    <div className="card-tools ms-auto">
                      <button type="button" className="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fas fa-minus"></i></button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="form-group"><label>Code</label><input type="text" className="form-control shadow-none" readOnly value={form.code} /></div>
                    <div className="form-group"><label>Name</label><input type="text" name="name" className="form-control shadow-none" required value={form.name} onChange={handleChange} /></div>
                    <div className="form-group"><label>Reference</label><input type="text" name="reference" className="form-control shadow-none" required value={form.reference} onChange={handleChange} /></div>
                    <div className="form-group"><label>Password</label><div className="input-group "><input type="text" name="password" className="form-control shadow-none" required value={form.password} onChange={handleChange} /><span className="input-group-append"><button type="button" className="generate-password btn btn-info btn-flat" onClick={generatePassword}>Generate Password</button></span></div></div>
                    <div className="form-group"><label>Contact No</label><input type="number" name="contactno" className="form-control shadow-none" required value={form.contactno} onChange={handleChange} /></div>
                    <div className="form-group"><label>Balance</label><input type="number" name="balance" className="form-control shadow-none" value={form.balance} onChange={handleChange} /></div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card card-secondary">
                  <div className="bg-secondary px-2 cardHeaderOfCollection"><h3 className="card-title collectionTitle">Share and Commission</h3><div className="card-tools ms-auto"><button type="button" className="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fas fa-minus"></i></button></div></div>
                  <div className="card-body">
                    <div className="form-group row mb-0"><div className="form-group col-md-6"><label>Super Agent Share</label><input type="number" max="98.5" min="0" name="share" placeholder="Share" className="form-control shadow-none" step="0.01" required value={form.share} onChange={handleChange} /></div><div className="form-group col-md-6"><label>My Share</label><input type="number" placeholder="Share" className="form-control shadow-none" readOnly value={98.5} /></div></div>
                    <div className="form-group"><label>Commission Type</label><select name="commissionType" className="form-control shadow-none" value={form.commissionType} onChange={handleChange}><option value="NoCommission">No Commission</option><option value="BetByBet">Bet By Bet</option></select></div>
                    {form.commissionType === 'BetByBet' && (
                      <>
                        <div className="form-group row mb-0"><div className="form-group col-md-6"><label>Match Commission</label><input type="number" name="matchCommission" className="form-control" placeholder="Match Commission" value={form.matchCommission || ''} onChange={handleChange} /></div><div className="form-group col-md-6"><label>My Match Commission</label><input type="number" className="form-control" readOnly value={2} /></div></div>
                        <div className="form-group row mb-0"><div className="form-group col-md-6"><label>Session Commission</label><input type="number" name="sessionCommission" className="form-control" placeholder="Session Commission" value={form.sessionCommission || ''} onChange={handleChange} /></div><div className="form-group col-md-6"><label>My Session Commission</label><input type="number" className="form-control" readOnly value={3} /></div></div>
                      </>
                    )}
                    <div className="form-group row mb-0 "><div className="form-group col-md-6"><label>Super Agent Casino Share</label><input type="number" min="0" max="98.5" name="casinoShare" placeholder="Share" className="form-control shadow-none" step="0.01" required value={form.casinoShare} onChange={handleChange} /></div><div className="form-group col-md-6"><label>My Casino Share</label><input type="number" placeholder="Share" className="form-control shadow-none" readOnly value={98.5} /></div></div>
                    <div className="form-group row mb-0"><div className="form-group col-md-6"><label>Casino Commission</label><input type="number" name="casinoCommission" className="form-control shadow-none" required value={form.casinoCommission} onChange={handleChange} /></div><div className="form-group col-md-6"><label>My Casino Commission</label><input type="number" className="form-control shadow-none" readOnly value={2} /></div></div>
                    <div className="form-group row mb-0"><label>Casino Status</label><div className="form-group col-md-6"><label className="switch"><input type="checkbox" name="casinoStatus" checked={form.casinoStatus} onChange={handleChange} /><span className="slider round"></span></label></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mx-0 "><div className="col-12 subowner-cancel-create mb-4 px-0"><button type="button" className="btn btn-secondary" onClick={() => router.push('/user_details/super')}>Cancel</button><button type="submit" className="btn btn-success float-right" disabled={loading}>{loading ? 'Creating...' : 'Create New Super Agent'}</button></div></div>
            {success && <div className="alert alert-success mt-3">{success}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </section>
      )}
    </Layout>
  );
};

export default SuperAgentCreatePage; 