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

export default function CollectionPage() {
  const [siteName, setSiteName] = useState('');
  const [brandName, setBrandName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const site = hostname.split('.')[1]?.toUpperCase() || 'SITE';
      setSiteName(hostname);
      setBrandName(site);
      document.title = site;
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>Collection Details</title>
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
      {/* Main content directly in fragment, no <div className='content-wrapper'> */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Collection Details</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                <li className="breadcrumb-item active">Collection</li>
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
                      <a href="/collection/create" className="btn btn-primary">
                        New <i className="fa fa-plus-circle"></i>
                      </a>
                    </div>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th><div style={{ textAlign: 'center' }}><input type="checkbox" name="all" id="all" value="1" /></div></th>
                          <th>#</th>
                          <th>CODE</th>
                          <th>Name</th>
                          <th>Reference</th>
                          <th>Contact No.</th>
                          <th>Account No.</th>
                          <th>Collection Type</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Data rows will go here. For now, this is a stub. */}
                      </tbody>
                      <tfoot></tfoot>
                    </table>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer and aside removed as requested */}
    </Layout>
  );
} 