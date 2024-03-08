import { useRouter } from 'next/router';
import Head from 'next/head';
import '@/styles/code-of-conduct.css'; // Update the import path as needed
import { CodeOfConductIcon } from '@/components/Icons'; // Update the path to your actual icon

export default function CodeOfConduct() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Code of Conduct</title>
      </Head>
      <div className='body-background'>
        <div className='code-of-conduct-container'>
          <header className='code-of-conduct-header'>
            <h1>Code Of Conduct <CodeOfConductIcon /></h1>
          </header>
          <main className="code-of-conduct-content">
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
