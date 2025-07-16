import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

// Removed server-side auth check to prevent redirect loops
export const getServerSideProps = async () => {
  return { props: {} };
};

const UserCreatePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: 'Auto Generated',
    name: '',
    reference: '',
    password: '',
    contactno: '',
    share: 0.0,
    cshare: 0.0,
    icshare: 0.0,
    mobileshare: 100.0,
    session_commission_type: 'No Comm',
    matchcommission: 0.0,
    sessioncommission: 0.0,
    casinocommission: 0.0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check session validity on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const res = await fetch('/api/auth/session');
        console.log('Session response status:', res.status);
        const data = await res.json();
        console.log('Session data:', data);
        if (data.valid) {
          console.log('Session is valid');
          setIsSessionValid(true);
        } else {
          console.log('Session invalid, will redirect to login');
          // Small delay to prevent immediate redirect
          setTimeout(() => {
            router.replace('/login');
          }, 100);
          return;
        }
      } catch (error) {
        console.error('Session check error:', error);
        setTimeout(() => {
          router.replace('/login');
        }, 100);
        return;
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  // Generate random password on component mount
  useEffect(() => {
    const randomPassword = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
    setFormData(prev => ({ ...prev, password: randomPassword.toString() }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const randomPassword = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
    setFormData(prev => ({ ...prev, password: randomPassword.toString() }));
  };

  const handleCommissionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      session_commission_type: value,
      matchcommission: value === 'No Comm' ? 0.0 : 2.0,
      sessioncommission: value === 'No Comm' ? 0.0 : 3.0,
      casinocommission: value === 'No Comm' ? 0.0 : 2.0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get current user's session to determine parentId
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      
      if (!sessionData.valid) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      // Prepare user data for API
      const userData = {
        ...formData,
        role: 'SUB', // This form is for creating Sub Agents
        parentId: sessionData.user.id // Set the current user as parent
      };

      console.log('Creating user with data:', userData);
      
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      console.log('User creation response:', data);
      
      if (data.success) {
        alert('User created successfully!');
        router.push('/master_details/sub');
      } else {
        const errorMessage = data.error || data.message || 'Unknown error';
        alert('Failed to create user: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <Layout>
        <div className="content-wrapper">
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Loading...</h1>
                </div>
              </div>
            </div>
          </div>
          <section className="content">
            <div className="container-fluid">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin fa-2x"></i>
                <p>Checking session...</p>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    );
  }

  // Redirect if session is invalid
  if (!isSessionValid) {
    return null; // Will redirect to login
  }

  return (
    <Layout>
      <Head>
        <title>Create User</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback" />
        <link rel="stylesheet" href="/adminlite/plugins/fontawesome-free/css/all.min-26386564b5cf1594be24059af1cd0db9.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/css/responsive.bootstrap4.min.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/css/adminlte.min.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/overlayScrollbars/css/OverlayScrollbars.min.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/toastr/toastr.min.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/select2/css/select2.min.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/daterangepicker/daterangepicker.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css" />
      </Head>

      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Sub Agent</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/master_details/sub">Sub Agent</a></li>
                <li className="breadcrumb-item active">New Sub Agent</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">General</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="code">Code</label>
                    <input 
                      type="text" 
                      id="code" 
                      placeholder="" 
                      readOnly
                      className="form-control" 
                      name="code" 
                      value={formData.code}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="form-control" 
                      placeholder="Name"
                      minLength={2} 
                      required 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reference">Reference</label>
                    <input 
                      type="text" 
                      id="reference" 
                      className="form-control" 
                      placeholder="Reference"
                      required 
                      name="reference" 
                      value={formData.reference}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Password"
                        minLength={6}
                        id="password" 
                        required 
                        name="password" 
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <span className="input-group-append">
                        <button 
                          type="button"
                          className="btn btn-info btn-flat"
                          onClick={generatePassword}
                        >
                          Generate Password
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mobile">Contact No</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="mobile"
                      placeholder="Mobile No" 
                      required 
                      name="contactno" 
                      value={formData.contactno}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card card-secondary">
                <div className="card-header">
                  <h3 className="card-title">Share and Commission</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="form-group row">
                    <div className="form-group col-md-6">
                      <label htmlFor="share">Sub Agent Share</label>
                      <input 
                        type="number" 
                        max={94.0} 
                        min={0} 
                        placeholder="Share" 
                        className="form-control"
                        id="share"
                        step="0.01"
                        required 
                        name="share" 
                        value={formData.share}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="mshare">My Share</label>
                      <input 
                        type="number" 
                        placeholder="Share" 
                        className="form-control"
                        value={94.0 - formData.share} 
                        id="mshare" 
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="form-group col-md-6">
                      <label htmlFor="cshare">Sub Casino Agent Share</label>
                      <input 
                        type="number" 
                        max={94.0} 
                        min={0} 
                        placeholder="Casino Share" 
                        className="form-control"
                        id="cshare"
                        step="0.01"
                        required 
                        name="cshare" 
                        value={formData.cshare}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="cmshare">My Casino Share</label>
                      <input 
                        type="number" 
                        placeholder="Share" 
                        className="form-control"
                        value={94.0 - formData.cshare} 
                        id="cmshare" 
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="form-group col-md-6">
                      <label htmlFor="icshare">Sub Int. Casino Share</label>
                      <input 
                        type="number" 
                        max={0.0} 
                        min={0} 
                        placeholder="Casino Share" 
                        className="form-control"
                        id="icshare"
                        step="0.01"
                        required 
                        name="icshare" 
                        value={formData.icshare}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="icmshare">My Int. Casino Share</label>
                      <input 
                        type="number" 
                        placeholder="Share" 
                        className="form-control"
                        value={0.0 - formData.icshare} 
                        id="icmshare" 
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="form-group col-md-6">
                      <label htmlFor="mobile_share">Sub Agent Mobile Share</label>
                      <input 
                        type="number" 
                        min={0} 
                        placeholder="Mobile Share"
                        className="form-control" 
                        max={100.0} 
                        step="0.01"
                        id="mobile_share" 
                        required 
                        name="mobileshare" 
                        value={formData.mobileshare}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="mobileshare">My Mobile Share</label>
                      <input 
                        type="number" 
                        min={0} 
                        placeholder="Mobile Share"
                        className="form-control" 
                        max={100} 
                        step="0.01"
                        readOnly 
                        required 
                        id="mobileshare" 
                        name="mobileshare" 
                        value={100.0 - formData.mobileshare}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="session_commission_type">Commission Type</label>
                    <select 
                      id="session_commission_type" 
                      className="form-control"
                      value={formData.session_commission_type}
                      onChange={handleCommissionTypeChange}
                    >
                      <option value="No Comm">No Comm</option>
                      <option value="Bet by Bet">Bet by Bet</option>
                    </select>
                  </div>

                  <div className="form-group row">
                    <div className="form-group col-md-6">
                      <label htmlFor="match_commission">Match Commission</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Match" 
                        min={0}
                        max={2.0} 
                        step="0.01"
                        id="match_commission" 
                        required 
                        name="matchcommission"
                        value={formData.matchcommission}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="mc">My Match Commission</label>
                      <input 
                        id="mc" 
                        type="text" 
                        min={0} 
                        max={3} 
                        value={2.0 - formData.matchcommission}
                        className="form-control"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="form-group col-md-6">
                      <label htmlFor="session_commission">Session Commission</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Match" 
                        min={0}
                        max={3.0} 
                        step="0.01"
                        id="session_commission" 
                        required 
                        name="sessioncommission"
                        value={formData.sessioncommission}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="sc">My Session Commission</label>
                      <input 
                        type="number" 
                        id="sc"
                        className="form-control"
                        placeholder="Session Commission"
                        value={3.0 - formData.sessioncommission}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="form-group col-md-6">
                      <label htmlFor="casino_commission">Casino Commission</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Match" 
                        min={0}
                        max={2.0} 
                        step="0.01"
                        id="casino_commission" 
                        required 
                        name="casinocommission"
                        value={formData.casinocommission}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="cc">My Casino Commission</label>
                      <input 
                        type="number" 
                        id="cc"
                        className="form-control"
                        placeholder="Session Commission"
                        value={2.0 - formData.casinocommission}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <a href="/master_details/sub" className="btn btn-secondary">Cancel</a>
              <button 
                type="submit" 
                className="btn btn-success float-right"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create New Sub Agent'}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Scripts */}
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/jquery/jquery.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables/jquery.dataTables.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/adminlte.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/daterangepicker/daterangepicker.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/moment/moment.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/demo.js"></script>
      <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/toastr/toastr.min.js"></script>
    </Layout>
  );
};

export default UserCreatePage; 