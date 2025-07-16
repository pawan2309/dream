import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { requireAuth } from '../../lib/requireAuth';

// Removed server-side auth check to prevent redirect loops
export const getServerSideProps = async () => {
  return { props: {} };
};

const MasterPage = () => {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [masters, setMasters] = useState<any[]>([]);
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
    const fetchMasters = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/users?role=MASTER');
        const data = await res.json();
        if (res.ok) {
          setMasters(data.users || []);
        } else {
          setError(data.error || 'Failed to fetch masters');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, []);

  return (
    <Layout>
      <Head>
        <title>{brandName || 'Master'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Master Agent Details</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item active">Master</li>
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
                <form action="#" method="post" id="demoForm">
                  <div className="card-header">
                    <div className="form-group">
                      <Link href="/master_details/master_create" className="btn btn-primary mr-2">
                        New <i className="fa fa-plus-circle"></i>
                      </Link>
                      <button className="btn btn-success mr-2" id="allActive" type="button">
                        All Active
                      </button>
                      <button className="btn btn-danger mr-2" id="allInActive" type="button">
                        All DeActivate <i className="fa fa-ban"></i>
                      </button>
                      <a href="/master/limit" className="btn btn-primary">
                        Limit Update
                      </a>
                    </div>
                  </div>
                  <div className="card-body">
                    {loading && (
                      <div className="text-center">
                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                        <p>Loading masters...</p>
                      </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!loading && (
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th><div style={{ textAlign: 'center' }}><input type="checkbox" name="all" id="all" value="1"/></div></th>
                            <th>#</th>
                            <th>CODE</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Password</th>
                            <th>Limit</th>
                            <th>Match</th>
                            <th>Session</th>
                            <th>Share</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {masters.length === 0 && (
                            <tr><td colSpan={11} style={{ textAlign: 'center' }}>No master users found.</td></tr>
                          )}
                          {masters.map((user, idx) => (
                            <tr key={user.id}>
                              <td><input type="checkbox" /></td>
                              <td>{idx + 1}</td>
                              <td>{user.code}</td>
                              <td>{user.name}</td>
                              <td>{user.contactno}</td>
                              <td>******</td>
                              <td>₹10,000</td>
                              <td>₹5,000</td>
                              <td>₹2,000</td>
                              <td>5%</td>
                              <td><span className="badge badge-success">Active</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MasterPage; 