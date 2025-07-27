// app/privacy/page.tsx

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-8">
        Effective Date: <strong>2025-07-27</strong>
      </p>

      <Section title="1. Introduction">
        <p>
          Welcome to versioning.app. We are committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our Service. It also
          outlines your privacy rights.
        </p>
        <p>
          By using the Service, you agree to the collection and use of
          information in accordance with this policy. Please also read our{' '}
          <Link href="/terms" className="text-blue-600 underline">
            Terms of Service
          </Link>
          .
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>We may collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Personal Data:</strong> To provide and improve our Service,
            we may ask you to provide us with certain personally identifiable
            information, including but not limited to your email address, name,
            and payment information when you register for an account or purchase
            a license.
          </li>
          <li>
            <strong>Usage Data:</strong> We automatically collect information
            when you access and use the Service. This may include your IP
            address, browser type, browser version, the pages you visit, the
            time and date of your visit, and other diagnostic data.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong> We use cookies
            and similar technologies to track activity on our Service and store
            certain information. Please see our{' '}
            <Link href="/cookies" className="text-blue-600 underline">
              Cookie Policy
            </Link>{' '}
            for more details.
          </li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <p>We use the collected data for various purposes:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>To provide, operate, and maintain our Service.</li>
          <li>To manage your account and commercial license.</li>
          <li>To notify you about changes to our Service.</li>
          <li>To provide customer support and respond to your inquiries.</li>
          <li>
            To monitor the usage of our Service to detect, prevent, and address
            technical issues or security vulnerabilities.
          </li>
          <li>
            To comply with legal obligations, such as those related to financial
            records for commercial licenses.
          </li>
        </ul>
      </Section>

      <Section title="4. Data Sharing and Disclosure">
        <p>
          We do not sell your personal data. We may share your information in
          the following situations:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>With Service Providers:</strong> We may employ third-party
            companies to facilitate our Service (e.g., payment processors, cloud
            hosting). These third parties have access to your data only to
            perform these tasks on our behalf and are obligated not to disclose
            or use it for any other purpose.
          </li>
          <li>
            <strong>For Legal Requirements:</strong> We may disclose your data
            if required to do so by law or in response to valid requests by
            public authorities (e.g., a court or a government agency).
          </li>
          <li>
            <strong>To Enforce Our Rights:</strong> To enforce our Terms of
            Service and other agreements, including for billing and collection
            purposes.
          </li>
        </ul>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We will retain your Personal Data only for as long as is necessary for
          the purposes set out in this Privacy Policy. We will retain and use
          your data to the extent necessary to comply with our legal
          obligations, resolve disputes, and enforce our legal agreements and
          policies.
        </p>
      </Section>

      <Section title="6. Your Data Protection Rights (GDPR & UK Law)">
        <p>
          Under the laws of England and Wales, you have the following rights:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            The right to access, update, or delete the information we have on
            you.
          </li>
          <li>The right of rectification.</li>
          <li>The right to object to processing.</li>
          <li>The right of restriction.</li>
          <li>The right to data portability.</li>
          <li>The right to withdraw consent.</li>
        </ul>
        <p>
          To exercise these rights, please contact us at the email address
          below.
        </p>
      </Section>

      <Section title="7. Security">
        <p>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet or method of electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your Personal Data, we cannot guarantee its absolute
          security.
        </p>
      </Section>

      <Section title="8. Changes to This Privacy Policy">
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Effective Date&quot; at the top. You are advised to
          review this Privacy Policy periodically for any changes.
        </p>
      </Section>

      <Section title="9. Contact Us">
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:{' '}
          <Link
            href="mailto:privacy@versioning.app"
            className="text-blue-600 underline"
          >
            privacy@versioning.app
          </Link>
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
