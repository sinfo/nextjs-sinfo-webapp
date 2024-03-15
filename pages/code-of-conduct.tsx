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
            <span className="icon section-icon icon-multimedia-12 align-center"></span>
              <div className="col-md-12">
                <p>All attendees, speakers, sponsors and volunteers at SINFO are required to agree with the following code of
                  conduct. Organisers will enforce this code throughout the event. We are expecting cooperation from all
                  participants to help ensuring a safe environment for everybody.</p>
              </div>
              <br />
              <div className="col-md-12">
                <h3>Need Help?</h3>

                <p>You can reach us through our email geral@sinfo.org.</p>

                <h3>The quick version</h3>

                <p>SINFO is dedicated to providing a harassment-free conference experience for everyone, regardless of gender,
                  age, sexual orientation, disability, physical appearance, body size, race, or religion (or lack thereof). We do
                  not tolerate harassment of conference participants in any form. Sexual language and imagery is not appropriate
                  for any conference venue, including talks, workshops, parties, Twitter and other online media. Conference
                  participants violating these rules may be sanctioned or expelled from the conference at the discretion of the
                  conference organisers.</p>

                <h3>The less quick version</h3>

                <p>We do not tolerate harassment of event participants in any form and we expect all participants to conduct
                  themselves in a professional and appropriate manner. Conference participants violating these rules may be
                  sanctioned or expelled from the conference, without a refund, at the discretion of the conference organisers.
                  Harassment includes verbal comments that reinforce social structures of domination related to gender, gender
                  identity and expression, sexual orientation, disability, physical appearance, body size, race, age, religion,
                  sexual images in public spaces, deliberate intimidation, stalking, following, harassing photography or
                  recording, sustained disruption of talks or other events, inappropriate physical contact, and unwelcome sexual
                  attention. Participants asked to stop any harassing behaviour are expected to comply immediately. Sponsors are
                  also subject to the anti-harassment policy. In particular, sponsors should not use sexualised images,
                  activities, or other material. Booth staff (including volunteers) should not use sexualised
                  clothing/uniforms/costumes, or otherwise create a sexualised environment.If a participant engages in harassing
                  behavior, the conference organisers may take any action they deem appropriate, including warning the offender or
                  expulsion from the conference with no refund. If you are being harassed, notice that someone else is being
                  harassed, or have any other concerns, please contact a member of the SINFO staff immediately. SINFO staff can be
                  identified as they'll be wearing branded t-shirts. SINFO staff will be happy to help participants contact venue
                  security or local law enforcement, provide escorts, or otherwise assist those experiencing harassment to feel
                  safe for the duration of the conference. We value your attendance. We expect participants to follow these rules
                  at conference and workshop venues and conference-related social events.</p>
              </div>
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
