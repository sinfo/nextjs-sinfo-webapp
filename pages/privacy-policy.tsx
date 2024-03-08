// pages/privacy-policy.tsx
import { useRouter } from 'next/router';
import Head from 'next/head';
import '@/styles/privacy-policy.css'; // Update the import path as needed
import { PrivacyPolicyIcon } from '@/components/Icons'; // Update the path to your actual icon

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Privacy Policy - Member</title>
      </Head>
      <div className='body-background'>
        <div className='privacy-container'>
          <header className='privacy-header'>
            <h1>Privacy Policy <PrivacyPolicyIcon /></h1> 
            
          </header>
          <main className="privacy-content">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>

          </main>
          <div className="back-button-container">
            <button onClick={() => router.back()} className="back-button">
              Go back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
