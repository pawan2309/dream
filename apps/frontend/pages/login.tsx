import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const SESSION_COOKIE = 'betx_session';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [siteName, setSiteName] = useState('SITE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Set site name on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const site = hostname.split('.')[1]?.toUpperCase() || 'SITE';
      setSiteName(site);
      document.title = site;
      const titleBox = document.getElementById('titleBox');
      if (titleBox) {
        titleBox.innerHTML = `<a href=\"#\"> </b>BetX Boss Admin</a>`;
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submitting login form
    setError('');
    setLoading(true);
    try {
      // About to send fetch to /api/auth/login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
              const data = await res.json();
        // Received response
      if (!data.success && data.message === 'Contact admin') {
        setError('Contact admin');
      } else if (!data.success && data.message === 'Password wrong') {
        setError('Password wrong');
      } else if (data.success) {
        setError('');
        router.push('/');
      } else {
        setError('Unknown error.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{siteName}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="_csrf" content="4c1e546e-781f-4a8f-9f6a-1f695a383a1e" />
        <meta name="_csrf_header" content="X-CSRF-TOKEN" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback" />
        <link rel="stylesheet" type="text/css" href="/adminlite/plugins/fontawesome-free/css/all.min-26386564b5cf1594be24059af1cd0db9.css" />
        <link rel="stylesheet" type="text/css" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/icheck-bootstrap/icheck-bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/css/adminlte.min.css" />
      </Head>
      <div className="hold-transition login-page" style={{ minHeight: '100vh' }}>
        <div className="login-box">
          <div className="login-logo" id="titleBox">
            {/* Site name will be set by useEffect */}
          </div>
          <div className="card">
            <div className="card-body login-card-body">
              <p className="login-box-msg">Sign in to start your session</p>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form autoComplete="off" onSubmit={handleSubmit}>
                <input type="hidden" name="_csrf" value="4c1e546e-781f-4a8f-9f6a-1f695a383a1e" />
                <div className="input-group mb-3 margin-top">
                  <input
                    type="text"
                    className="form-control"
                    autoComplete="username"
                    placeholder="username"
                    autoFocus
                    required
                    id="username"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope"></span>
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="password"
                    required
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <div className="input-group-append" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                    <div className="input-group-text">
                      <span className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} title={showPassword ? 'Hide password' : 'Show password'}></span>
                    </div>
                  </div>
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock"></span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-8">
                    <div className="icheck-primary">
                      <input
                        type="checkbox"
                        id="remember_me"
                        name="remember_me"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <label htmlFor="remember_me">
                        Remember Me
                      </label>
                    </div>
                  </div>
                </div>
                <div className="social-auth-links text-center mb-3">
                  <button
                    type="submit"
                    name="submit"
                    className="form-control btn btn-info btn-block"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Scripts for AdminLTE and Bootstrap */}
        <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/jquery/jquery.min.js"></script>
        <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/adminlte.min.js"></script>
      </div>
    </>
  );
};

export default LoginPage; 