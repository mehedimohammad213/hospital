import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CMS_API_URL } from '@/lib/cms';

export default function APIProxy() {
    const router = useRouter();

    useEffect(() => {
        const currentPath = window.location.pathname;
        const apiPath = currentPath.replace('/api', '');
        window.location.href = `${CMS_API_URL.replace(/\/$/, '')}${apiPath}`;
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Redirecting to API...</h2>
                <p>Please wait while we redirect you to the API endpoint.</p>
            </div>
        </div>
    );
}
