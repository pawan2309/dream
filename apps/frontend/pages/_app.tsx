import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);
// import { ConfigProvider, theme as antdTheme } from 'antd';
// import 'antd/dist/antd.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    let timeout: any;
    const refreshSession = async () => {
      clearTimeout(timeout);
      // Only try to refresh if the session cookie exists
      if (document.cookie.includes('betx_session')) {
        try {
          const res = await fetch('/api/auth/refresh', { method: 'POST' });
          if (!res.ok) {
            router.replace('/login');
          }
        } catch {
          router.replace('/login');
        }
        timeout = setTimeout(() => {
          router.replace('/login');
        }, 4.5 * 60 * 1000); // 4.5 minutes
      }
    };
    window.addEventListener('mousemove', refreshSession);
    window.addEventListener('keydown', refreshSession);
    // Initial call to set timer
    refreshSession();
    return () => {
      window.removeEventListener('mousemove', refreshSession);
      window.removeEventListener('keydown', refreshSession);
      clearTimeout(timeout);
    };
  }, [router]);

  useEffect(() => {
    // Add AdminLTE scripts in correct order
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initializeAdminLTE = async () => {
      try {
        // 1. Load jQuery first
        await loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/jquery/jquery.min.js');
        // 2. Load AdminLTE only after jQuery is loaded
        await loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/adminlte.min.js');
        // 3. Load all other scripts (these can be parallel)
        await Promise.all([
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/bootstrap/js/bootstrap.bundle.min.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables/jquery.dataTables.min.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/js/dataTables.responsive.min.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/datatables-responsive/js/responsive.bootstrap4.min.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/daterangepicker/daterangepicker.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/moment/moment.min.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/dist/js/demo.js'),
          loadScript('https://adminlite.s3.ap-south-1.amazonaws.com/adminlite/plugins/toastr/toastr.min.js')
        ]);

        // Initialize AdminLTE after scripts are loaded
        if ((window as any).AdminLTE) {
          (window as any).AdminLTE.init();
        }

        // Add AdminLTE classes
        document.body.classList.add('text-sm');
        
        // Set site name
        const hostname = window.location.hostname;
        const siteName = hostname.split(".")[1]?.toUpperCase() || 'SITE';
        document.title = siteName;
        
        const siteNameElement = document.getElementById('siteName');
        if (siteNameElement) {
          siteNameElement.textContent = hostname;
        }
        
        const brandNameElement = document.getElementById('brandName');
        if (brandNameElement) {
          brandNameElement.textContent = siteName;
        }

        // AdminLTE initialized successfully
      } catch (error) {
        console.error('Error loading AdminLTE scripts:', error);
      }
    };

    initializeAdminLTE();
  }, []);

  return (
    // <ConfigProvider theme={{ algorithm: antdTheme.darkAlgorithm }}>
      <Component {...pageProps} />
    // </ConfigProvider>
  );
} 
