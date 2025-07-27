// app/cookie-policy/page.tsx

export default function CookiePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

      <p className="mb-8">
        Effective Date: <strong>2025-07-27</strong>
      </p>

      <Section title="What Are Cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help us recognize you, remember your preferences, and
          provide certain features.
        </p>
      </Section>

      <Section title="Types of Cookies We Use">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Essential Cookies:</strong> Necessary for basic site
            functions, like maintaining your login session.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Collect anonymous info about
            how visitors use our site to improve functionality.
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember your preferences such
            as language or theme.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand visitor
            behavior using tools like Google Analytics.
          </li>
        </ul>
      </Section>

      <Section title="How We Use Cookies">
        <p>
          We use cookies to enable core features, improve user experience, and
          understand visitor interactions with our Service.
        </p>
      </Section>

      <Section title="Managing Cookies">
        <p>
          You can control and manage cookies through your browser settings.
          Blocking or deleting cookies may affect your experience or limit
          features.
        </p>
      </Section>

      <Section title="Third-Party Cookies">
        <p>
          Our site may use cookies from third-party services, like analytics
          providers, who have their own privacy policies.
        </p>
      </Section>

      <Section title="Changes to This Cookie Policy">
        <p>
          We may update this policy occasionally. Continued use after changes
          means you accept the updated policy.
        </p>
      </Section>

      <Section title="Contact Us">
        <p>
          Questions? Contact us at{' '}
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
