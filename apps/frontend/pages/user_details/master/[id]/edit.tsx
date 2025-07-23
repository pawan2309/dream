import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';

const EditMaster = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
          setForm({
            code: data.user.code || '',
            name: data.user.name || '',
            reference: data.user.reference || '',
            password: '',
            contactno: data.user.contactno || '',
            flatShare: data.user.flatShare || 'No',
            casinoPlay: data.user.casinoStatus ? 'Yes' : 'No',
            share: data.user.share || '',
            commissionType: data.user.commissionType || 'NoCommission',
            matchCommission: data.user.matchCommission || '',
            sessionCommission: data.user.sessionCommission || '',
            casinoShare: data.user.casinoShare || '',
            casinoCommission: data.user.casinoCommission || '',
          });
        } else setError('Failed to fetch user');
        setLoading(false);
      })
      .catch(() => { setError('Failed to fetch user'); setLoading(false); });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const randomPassword = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
    setForm((prev: any) => ({ ...prev, password: randomPassword.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          reference: form.reference,
          password: form.password,
          contactno: form.contactno,
          commissionType: form.commissionType,
          casinoStatus: form.casinoPlay === 'Yes',
          share: form.share,
          matchCommission: form.commissionType === 'BetByBet' ? form.matchCommission : null,
          sessionCommission: form.commissionType === 'BetByBet' ? form.sessionCommission : null,
          casinoShare: form.casinoShare,
          casinoCommission: form.casinoCommission,
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('User updated successfully!');
        router.push('/user_details/master');
      } else setError(data.message || 'Failed to update user');
    } catch {
      setError('Failed to update user');
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div className="alert alert-danger">{error}</div></Layout>;
  if (!user) return <Layout><div>User not found</div></Layout>;

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card tbaleCard card-primary">
              <div className="bg-primary px-2 cardHeaderOfCollection d-flex justify-content-between align-items-center">
                <div className="card-title collectionTitle mb-0">General</div>
                <div className="card-tools ms-auto"><button type="button" className="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fas fa-minus"></i></button></div>
              </div>
              <div className="card-body">
                <div className="form-group"><label>Code</label><input type="text" className="form-control" readOnly value={form.code} /></div>
                <div className="form-group"><label>Name</label><input type="text" name="name" className="form-control" required value={form.name} onChange={handleChange} /></div>
                <div className="form-group"><label>Reference</label><input type="text" name="reference" className="form-control" required value={form.reference} onChange={handleChange} /></div>
                <div className="form-group"><label>Password</label><div className="input-group "><input type="text" name="password" className="form-control" value={form.password} onChange={handleChange} /><span className="input-group-append"><button type="button" className="generate-password btn btn-info btn-flat" onClick={generatePassword}>Generate Password</button></span></div></div>
                <div className="form-group"><label>Contact No</label><input type="number" name="contactno" className="form-control" required value={form.contactno} onChange={handleChange} /></div>
                <div className="form-group"><label>Flat Share</label><select name="flatShare" className="form-control" value={form.flatShare} onChange={handleChange}><option value="No">No</option><option value="Yes">Yes</option></select></div>
                <div className="form-group"><label>Casino Play</label><select name="casinoPlay" className="form-control" value={form.casinoPlay} onChange={handleChange}><option value="No">No</option><option value="Yes">Yes</option></select></div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card card-secondary">
              <div className="bg-secondary px-2 cardHeaderOfCollection d-flex justify-content-between align-items-center"><div className="card-title collectionTitle mb-0">Share and Commission</div><div className="card-tools ms-auto"><button type="button" className="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse"><i className="fas fa-minus"></i></button></div></div>
              <div className="card-body">
                <div className="form-group row mb-0">
                  <div className="form-group col-md-4"><label>Master Share</label><input type="number" name="share" className="form-control" value={form.share} onChange={handleChange} placeholder="Share" /></div>
                  <div className="form-group col-md-4"><label>My Share</label><input type="number" className="form-control" name="myShare" value={98.5} readOnly /></div>
                </div>
                <div className="form-group"><label>Commission Type</label><select name="commissionType" className="form-control" value={form.commissionType} onChange={handleChange}><option value="NoCommission">No Commission</option><option value="BetByBet">Bet By Bet</option></select></div>
                {form.commissionType === 'BetByBet' && (
                  <>
                    <div className="form-group row mb-0">
                      <div className="form-group col-md-6"><label>Match Commission</label><input type="number" name="matchCommission" className="form-control" value={form.matchCommission} onChange={handleChange} placeholder="Match Commission" /></div>
                      <div className="form-group col-md-6"><label>My Match Commission</label><input type="number" className="form-control" value={2} readOnly /></div>
                    </div>
                    <div className="form-group row mb-0">
                      <div className="form-group col-md-6"><label>Session Commission</label><input type="number" name="sessionCommission" className="form-control" value={form.sessionCommission} onChange={handleChange} placeholder="Session Commission" /></div>
                      <div className="form-group col-md-6"><label>My Session Commission</label><input type="number" className="form-control" value={3} readOnly /></div>
                    </div>
                  </>
                )}
                <div className="form-group row mb-0">
                  <div className="form-group col-md-4"><label>Master Casino Share</label><input type="number" name="casinoShare" className="form-control" value={form.casinoShare} onChange={handleChange} placeholder="Casino Share" /></div>
                  <div className="form-group col-md-4"><label>My Casino Share</label><input type="number" className="form-control" name="myCasinoShare" value={98.5} readOnly /></div>
                </div>
                <div className="form-group row mb-0">
                  <div className="form-group col-md-6"><label>Casino Commission</label><input type="number" name="casinoCommission" className="form-control" value={form.casinoCommission} onChange={handleChange} /></div>
                  <div className="form-group col-md-6"><label>My Casino Commission</label><input type="number" className="form-control" value={2} readOnly /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mx-0 "><div className="col-12 subowner-cancel-create mb-4 px-0"><button type="button" className="btn btn-secondary" onClick={() => router.push('/user_details/master')}>Cancel</button><button type="submit" className="btn btn-success float-right">Update master</button></div></div>
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </Layout>
  );
};

export default EditMaster; 