// app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-8">
        Effective Date: <strong>2025-07-27</strong>
      </p>

      <Section title="1. Introduction">
        <p>
          versioning.app (&#x22;we,&#x22; &#x22;our,&#x22; &#x22;us&#x22;)
          values your privacy and is committed to protecting your personal data.
          This Privacy Policy explains how we collect, use, and share
          information when you use our hosted services at{' '}
          <code>versioning.app</code> and related platforms.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>
          We collect information you provide directly and information
          automatically collected through your use of the Service, including:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Account information (e.g., name, email) when you register</li>
          <li>
            Usage data such as IP addresses, device information, and activity
            logs
          </li>
          <li>Cookies and tracking technologies to improve user experience</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide and maintain the Service</li>
          <li>Respond to support requests</li>
          <li>Improve our products and services</li>
          <li>Comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="4. Sharing Your Information">
        <p>We do not sell your personal data. We may share information with:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Service providers and partners who help us operate the Service
          </li>
          <li>Law enforcement or legal entities when required by law</li>
          <li>In connection with business transfers or acquisitions</li>
        </ul>
      </Section>

      <Section title="5. Data Security">
        <p>
          We implement reasonable technical and organizational measures to
          protect your data from unauthorized access, alteration, or
          destruction.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <p>
          You may have rights under applicable laws to access, correct, or
          delete your personal information. To exercise these rights or with any
          questions, contact us at{' '}
          <a
            href="mailto:privacy@versioning.app"
            className="text-blue-600 underline"
          >
            privacy@versioning.app
          </a>
          .
        </p>
      </Section>

      <Section title="7. Cookies and Tracking">
        <p>
          We use cookies and similar technologies to enhance your experience.
          You can control cookie settings through your browser.
        </p>
      </Section>

      <Section title="8. International Transfers">
        <p>
          Your data may be transferred and processed outside your country of
          residence, in accordance with applicable laws.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy occasionally. Continued use of the
          Service after changes indicates acceptance of the new terms.
        </p>
      </Section>

      <Section title="10. Contact Us">
        <p>
          For privacy questions or concerns, please contact us at{' '}
          <a
            href="mailto:privacy@versioning.app"
            className="text-blue-600 underline"
          >
            privacy@versioning.app
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
