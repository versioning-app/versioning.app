// app/terms/page.tsx

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-8">
        Effective Date: <strong>2025-07-27</strong>
      </p>

      <Section title="1. Use of the Service">
        <p>
          You may use the Service only in compliance with these Terms of
          Service, our{' '}
          <a href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </a>
          , and all applicable laws and regulations. You are responsible for
          your conduct, your data, and ensuring your use is lawful.
        </p>
        <p>
          <strong>Self-hosting:</strong> Use of the software via self-hosted
          deployments is permitted only for individuals and{' '}
          <u>small businesses</u>. Medium and large enterprises must obtain a
          commercial license from versioning.app, even if self-hosting. Please
          contact us for licensing inquiries.
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
          To access certain features, you may be required to register an
          account. You must provide accurate information and keep your
          credentials secure. You are responsible for all activity under your
          account.
        </p>
      </Section>

      <Section title="3. Intellectual Property & Licensing">
        <p>
          Unless stated otherwise, all content and functionality on this
          platform is © 2024–2025 versioning.app. Source code may be licensed
          under AGPL-3.0 with non-commercial restrictions. Use of this hosted
          service does not grant rights to use or distribute the source code
          without a commercial license. Refer to our GitHub source code for
          details.
        </p>
      </Section>

      <Section title="4. Restrictions">
        <ul className="list-disc list-inside space-y-2">
          <li>
            Do not use the Service for commercial or competitive purposes
            without written consent.
          </li>
          <li>
            Do not resell, sublicense, or provide access to third parties.
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

      <Section title="5. Modifications">
        <p>
          We reserve the right to modify or discontinue any part of the Service
          at any time without notice. Continued use after changes implies
          acceptance of the new terms.
        </p>
      </Section>

      <Section title="6. Termination">
        <p>
          We may suspend or terminate your access at any time, with or without
          notice, if you breach these terms or if required by law. Upon
          termination, your right to use the Service ends immediately.
        </p>
      </Section>

      <Section title="7. Disclaimer of Warranties">
        <p>
          The Service is provided “as is” and “as available” with no warranties,
          express or implied. We do not guarantee uptime, security, or accuracy.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          versioning.app shall not be liable for indirect, incidental, or
          consequential damages. Total liability is limited to the amount (if
          any) paid to us in the 12 months prior to the claim.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          These Terms are governed by the laws of England and Wales. Disputes
          will be resolved in the courts of England.
        </p>
      </Section>

      <Section title="10. Contact">
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
        Last updated: 2025-07-27
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
