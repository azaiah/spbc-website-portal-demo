import type { ReactNode } from 'react'
import { useDocumentMeta } from '@/components/useDocumentMeta'
import { church } from '@/config/site'
import { Container } from '../ui'

// TODO: confirm with church — have the church's counsel review both policies before launch.
const UPDATED = 'October 21, 2026'

function Policy({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <section className="bg-parchment pt-36 pb-14"><Container><p className="font-caps font-semibold text-ember">Last updated {UPDATED}</p><h1 className="display text-5xl sm:text-6xl mt-4">{title}</h1></Container></section>
      <section className="bg-morning py-16"><Container><div className="max-w-3xl space-y-6 text-xl leading-relaxed text-ink [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-10 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-grow [&_a]:underline">{children}</div></Container></section>
    </>
  )
}

export function Privacy() {
  useDocumentMeta('Privacy Policy | The Saint Paul’s Baptist Church', 'How The Saint Paul’s Baptist Church collects, uses and protects your information.')
  return (
    <Policy title="Privacy Policy">
      <p>{church.name} (“we”) respects your privacy. This policy explains what we collect through this website and the Saint Paul’s Everywhere member and staff hub, and how we use it. Online giving, the SPBC app and member accounts are provided by our partners (Pushpay and our church management system) under their own privacy policies.</p>
      <h2>What we collect</h2>
      <ul><li>Information you send us in forms: your name, phone, email, prayer requests, help requests, event registrations and visit plans.</li><li>Giving happens on Pushpay’s secure pages. Card and bank details never touch this website.</li><li>Basic, anonymous site usage to improve the website.</li></ul>
      <h2>How we use it</h2>
      <ul><li>To respond to you, follow up on requests and provide pastoral care.</li><li>To send giving receipts and year-end statements.</li><li>To share church news, only if you ask us to.</li></ul>
      <h2>Prayer and care requests</h2>
      <p>Requests marked private are visible only to pastoral staff. Care and help requests are seen only by the people assigned to follow up.</p>
      <h2>Sharing</h2>
      <p>We do not sell or rent your information. We share it only with service providers who help us run the website, giving and communications, or when required by law.</p>
      <h2>Your choices</h2>
      <p>You may ask us to update or delete your information or stop sending messages at any time: call {church.phone}.</p>
      <h2>Children</h2>
      <p>This website is not directed to children under 13. Youth program registrations are completed by a parent or guardian.</p>
    </Policy>
  )
}

export function Terms() {
  useDocumentMeta('Terms of Use | The Saint Paul’s Baptist Church', 'Terms of use for The Saint Paul’s Baptist Church website and Saint Paul’s Everywhere.')
  return (
    <Policy title="Terms of Use">
      <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Use of the site</h2>
      <p>Use the site and Saint Paul’s Everywhere only for lawful purposes and in a way that respects others. Do not try to access accounts or information that are not yours.</p>
      <h2>Gifts</h2>
      <p>Gifts are voluntary contributions to {church.name} and are processed by Pushpay. If you believe a gift was made in error, call the church at {church.phone}.</p>
      <h2>Content</h2>
      <p>Photos, text and media on this site belong to {church.name} or are used with permission. Please ask before reusing them.</p>
      <h2>Links</h2>
      <p>We link to other sites, such as Pushpay, YouTube, Facebook and Google Maps, for convenience. We are not responsible for their content or policies.</p>
      <h2>Contact</h2>
      <p>{church.name}, 4247 Creighton Road, Henrico, VA 23223 · 700 E. Belt Boulevard, Richmond, VA 23224 · {church.phone}.</p>
    </Policy>
  )
}
