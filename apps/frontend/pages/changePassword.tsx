import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setError('Error changing password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Change Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback" />
        <link rel="stylesheet" href="/adminlite/plugins/fontawesome-free/css/all.min-26386564b5cf1594be24059af1cd0db9.css" />
        <link rel="stylesheet" href="https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/css/adminlte.min.css" />
      </Head>

      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Change Password</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item"><a href="/profile">Profile</a></li>
                  <li className="breadcrumb-item active">Change Password</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">Change Your Password</h3>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="card-body">
                      {error && (
                        <div className="alert alert-danger">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="alert alert-success">
                          {success}
                        </div>
                      )}

                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="card-footer">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Changing Password...' : 'Change Password'}
                      </button>
                      <a href="/profile" className="btn btn-secondary ml-2">
                        Cancel
                      </a>
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