import type { Metadata } from 'next'

// Published from the policy the CoS drafted and parked in marketing/privacy-policy-DRAFT.md.
// The internal note in that file said to publish once the site is genuinely public, which it now
// is. The text is unchanged apart from removing that note. Legal copy: AA reviews before promotion.
const SENS = { ink: '#0b1530', inkSoft: '#475069', rule: '#dfe4ee' } as const

export const metadata: Metadata = {
  title: 'Privacy Policy | sensAi',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '88px 24px 120px' }}>
        <a href="/" style={{ fontSize: 13.5, color: '#7a849c', textDecoration: 'none' }}>&larr; Back</a>
        <div style={{ height: 28 }} />
        <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: -1, lineHeight: 1.15, color: SENS.ink }}>Privacy Policy</h1>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `<strong>Last updated:</strong> 14 August 2026` }} />
        <h2 style={{ margin: "38px 0 0", fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: SENS.ink }}>Who we are</h2>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `This website is operated by <strong>NOVA CVM Solutions SL</strong>, a company registered in Spain ("we", "us").` }} />
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `For any question about this policy or about your data, contact us at <strong>privacy@novacvm.com</strong>.` }} />
        <h2 style={{ margin: "38px 0 0", fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: SENS.ink }}>What we collect</h2>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `<strong>Information you give us.</strong> If you complete a form on this site, we collect the details you enter — your name, email address, company, job title, company size, and anything you write in the free-text field.` }} />
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `<strong>Basic usage information.</strong> We use privacy-friendly, cookieless analytics to understand how the site is used — pages viewed, approximate region, device type, referring link. This does not identify you personally, and we do not build advertising profiles.` }} />
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `<strong>We do not use tracking cookies</strong>, and we do not use this site to track you across other websites.` }} />
        <h2 style={{ margin: "38px 0 0", fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: SENS.ink }}>Why we use it, and on what basis</h2>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `We use the information you submit to respond to your enquiry and to discuss whether working together makes sense. Our lawful basis is our legitimate interest in responding to business enquiries directed to us, and — where you have asked us to contact you — the steps taken at your request prior to entering into an agreement.` }} />
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `We use usage information on the basis of our legitimate interest in understanding and improving our website.` }} />
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `We do <strong>not</strong> sell your data, and we do not share it for advertising.` }} />
        <h2 style={{ margin: "38px 0 0", fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: SENS.ink }}>Who else sees it</h2>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `We use a small number of service providers to run the site and handle enquiries — website hosting, form processing, analytics, email, and our internal customer-relationship records. They process the data on our instructions only. We may also disclose information where the law requires it.` }} />
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `Some of these providers may process data outside the European Economic Area. Where that happens, appropriate safeguards (such as the European Commission's standard contractual clauses) are in place.` }} />
        <h2 style={{ margin: "38px 0 0", fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: SENS.ink }}>How long we keep it</h2>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `We keep enquiry details for as long as needed to deal with your enquiry and, where a business relationship follows, for the life of that relationship plus the period required by applicable accounting and legal rules. If no relationship develops, we delete or anonymise the details within 24 months. Usage analytics are retained in aggregate form only.` }} />
        <h2 style={{ margin: "38px 0 0", fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: SENS.ink }}>Your rights</h2>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `You have the right to ask us for a copy of the personal data we hold about you, to have it corrected or deleted, to object to or restrict how we use it, and to receive it in a portable format. You may exercise any of these rights by emailing <strong>privacy@novacvm.com</strong>; we will respond within the period required by law.` }} />
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `If you believe we have handled your data improperly, you may lodge a complaint with the Spanish data protection authority (Agencia Española de Protección de Datos, aepd.es) or with the supervisory authority in your own country.` }} />
        <h2 style={{ margin: "38px 0 0", fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: SENS.ink }}>Changes</h2>
        <p style={{ margin: "14px 0 0", fontSize: 15.5, lineHeight: 1.7, color: SENS.inkSoft }} dangerouslySetInnerHTML={{ __html: `If we change this policy we will update the date at the top of this page.` }} />
      </div>
    </main>
  )
}
