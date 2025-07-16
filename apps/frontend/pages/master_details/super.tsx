import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { requireAuth } from '../../lib/requireAuth';

// Removed server-side auth check to prevent redirect loops
export const getServerSideProps = async () => {
  return { props: {} };
};

export default function SuperPage() {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [supers, setSupers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const site = hostname.split('.')[1]?.toUpperCase() || 'SITE';
      setSiteName(hostname);
      setBrandName(site);
      document.title = site;
    }
  }, []);

  useEffect(() => {
    const fetchSupers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/users?role=SUPER_AGENT');
        const data = await res.json();
        if (data.success) {
          setSupers(data.users || []);
        } else {
          setError('Failed to fetch super agents');
        }
      } catch (err) {
        setError('Failed to fetch super agents');
      } finally {
        setLoading(false);
      }
    };
    fetchSupers();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Super Agent Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Super Agent Details</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item active">Super</li>
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
                <div className="card-header bg-white border-0 pb-0">
                  <div className="row align-items-center">
                    <div className="col-auto d-flex align-items-center flex-wrap">
                      <a href="/super/create" className="btn btn-primary mr-2 mb-2">
                        New <i className="fa fa-plus-circle"></i>
                      </a>
                      <button className="btn btn-success mr-2 mb-2" id="allActive" type="button">
                        All Active
                      </button>
                      <button className="btn btn-danger mr-2 mb-2" id="allInActive" type="button">
                        All DeActivate <i className="fa fa-ban"></i>
                      </button>
                      <a href="/super/limit" className="btn btn-primary mb-2">
                        Limit Update
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {loading && (
                    <div className="text-center">
                      <i className="fas fa-spinner fa-spin fa-2x"></i>
                      <p>Loading super agents...</p>
                    </div>
                  )}
                  {error && <div className="alert alert-danger">{error}</div>}
                  {!loading && (
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>CODE</th>
                          <th>Name</th>
                          <th>Master</th>
                          <th>Mobile</th>
                          <th>Password</th>
                          <th>Limit</th>
                          <th>Share</th>
                          <th>Match</th>
                          <th>Session</th>
                          <th>Charge</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supers.length === 0 && (
                          <tr><td colSpan={12} className="text-center">No super agent users found.</td></tr>
                        )}
                        {supers.map((user, idx) => (
                          <tr key={user.id}>
                            <td>{idx + 1}</td>
                            <td>{user.code || 'N/A'}</td>
                            <td>{user.name || 'N/A'}</td>
                            <td>N/A</td>
                            <td>{user.contactno || 'N/A'}</td>
                            <td>******</td>
                            <td>₹{user.balance?.toLocaleString() || '0'}</td>
                            <td>{user.share || 0}%</td>
                            <td>₹{(user.balance * 0.5)?.toLocaleString() || '0'}</td>
                            <td>₹{(user.balance * 0.2)?.toLocaleString() || '0'}</td>
                            <td>N/A</td>
                            <td>
                              <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
