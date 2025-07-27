// app/terms/page.tsx

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-8">
        Effective Date: <strong>July 27, 2025</strong>
      </p>

      <Section title="1. Use of the Service">
        <p>
          You may use the Service only in compliance with these Terms of
          Service, our{' '}
          <Link href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </Link>
          , our{' '}
          <Link href="/cookies" className="text-blue-600 underline">
            Cookie Policy
          </Link>
          , and all applicable laws and regulations. You are responsible for
          your conduct, your data, and ensuring your use is lawful.
        </p>
        <p>
          <strong>Self-hosting:</strong> For deployments outside of the official
          versioning.app platforms, use of the software via self-hosting is
          permitted **only for non-commercial purposes** by individuals and{' '}
          <u>small businesses</u>. Medium and large enterprises, or any entity
          wishing to use the software for commercial purposes, must obtain a
          commercial license from versioning.app, even if self-hosting.
        </p>
        <p>
          For the purposes of this license, small businesses are defined as an
          entity that has either:
          <br />
          <ul className="list-disc list-inside">
            <li>Less than 250 employees</li>
            <li>Annual revenues of less than £1,000,000 GBP</li>
          </ul>
          <br />
          Medium and large enterprises are defined as an entity that has either:
          <br />
          <ul className="list-disc list-inside">
            <li>250 or more employees</li>
            <li>Annual revenues of £1,000,000 GBP or more</li>
          </ul>
        </p>
      </Section>

      <Section title="2. Account Registration">
        <p>
          To access certain features on our official platform, you may be
          required to register an account. You must provide accurate information
          and keep your credentials secure. You are responsible for all activity
          under your account.
        </p>
      </Section>

      <Section title="3. Intellectual Property & Licensing">
        <p>
          Unless stated otherwise, all content and functionality on this
          platform is © 2024–2025 versioning.app. The source code for this
          software is made available under a modified AGPL-3.0 license with
          strict non-commercial restrictions. Use of this hosted service does
          not grant any rights to use, modify, or distribute the source code
          without a separate commercial license. Refer to our GitHub repository
          for full source code licensing details.
        </p>
      </Section>

      <Section title="4. Custom Agreements">
        <p>
          Notwithstanding the terms laid out in this document, we may offer
          custom terms of service, commercial licenses, or enterprise agreements
          to qualifying entities. If you are a medium or large enterprise, or
          have specific use cases not covered by these standard terms, please
          contact us to discuss a tailored agreement.
        </p>
        <p>
          In the event a custom agreement is executed, its terms shall supersede
          any and all other terms and licenses, including but not limited to
          these Terms of Service and any open-source licenses governing the
          source code. The custom agreement will exclusively govern your rights
          and obligations regarding access to the Service, use of the source
          code, and all other related matters.
        </p>
        <p>
          All custom agreements must be in writing and signed by an authorized
          representative of versioning.app to be considered valid. Please direct
          all such inquiries to{' '}
          <a
            href="mailto:license@versioning.app"
            className="text-blue-600 underline"
          >
            license@versioning.app
          </a>
          .
        </p>
      </Section>

      <Section title="5. Restrictions">
        <ul className="list-disc list-inside space-y-2">
          <li>
            Do not use the Service for commercial or competitive purposes
            without explicit written consent.
          </li>
          <li>
            Do not resell, sublicense, or provide access to third parties
            without a valid commercial agreement.
          </li>
          <li>
            Do not interfere with or degrade the performance or integrity of the
            platform.
          </li>
          <li>
            Do not reverse-engineer or replicate any aspect of the Service.
          </li>
          <li>
            Do not use automation tools (bots, crawlers, scrapers, headless
            browsers) to extract or interact with content.
          </li>
          <li>Do not scrape, harvest, or collect data programmatically.</li>
          <li>
            Do not use the Service or its content to train, fine-tune, or
            evaluate AI/ML models (including LLMs) without prior written
            permission.
          </li>
        </ul>
      </Section>

      <Section title="6. Modifications">
        <p>
          We reserve the right to modify or discontinue any part of the Service
          at any time without notice. Continued use after changes implies
          acceptance of the new terms.
        </p>
      </Section>

      <Section title="7. Termination">
        <p>
          We may suspend or terminate your access at any time, with or without
          notice, if you breach these terms or if required by law. Upon
          termination, your right to use the Service ends immediately.
        </p>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <p>
          The Service is provided “as is” and “as available” with no warranties,
          express or implied. We do not guarantee uptime, security, or accuracy.
        </p>
      </Section>

      <Section title="9. Limitation of Liability">
        <p>
          versioning.app shall not be liable for indirect, incidental, or
          consequential damages. Our total liability is limited to the amount
          (if any) you paid to us in the 12 months prior to the claim.
        </p>
      </Section>

      <Section title="10. Governing Law">
        <p>
          These Terms are governed by the laws of England and Wales. Disputes
          will be resolved in the courts of England.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          For legal notices or licensing questions, contact us at{' '}
          <a
            href="mailto:license@versioning.app"
            className="text-blue-600 underline"
          >
            license@versioning.app
          </a>
          .
        </p>
      </Section>

      <p className="text-xs mt-12 text-gray-500 dark:text-gray-400">
        Last updated: July 27, 2025
      </p>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
