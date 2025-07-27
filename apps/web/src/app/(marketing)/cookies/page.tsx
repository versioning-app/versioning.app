// app/cookies/page.tsx

export default function CookiePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

      <p className="mb-8">
        Effective Date: <strong>2025-07-27</strong>
      </p>

      <Section title="1. What Are Cookies?">
        <p>
          Cookies are small text files placed on your device (computer, phone,
          tablet) when you visit a website. They are widely used to make
          websites work, or work more efficiently, as well as to provide
          information to the site owners.
        </p>
      </Section>

      <Section title="2. How We Use Cookies">
        <p>
          We use cookies for several reasons, detailed below. This helps us
          provide you with a good experience when you browse our website and
          also allows us to improve our site.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Essential Cookies:</strong> These cookies are necessary for
            the website to function and cannot be switched off in our systems.
            They are usually only set in response to actions made by you which
            amount to a request for services, such as setting your privacy
            preferences, logging in, or filling in forms.
          </li>
          <li>
            <strong>Performance and Analytics Cookies:</strong> These cookies
            allow us to count visits and traffic sources so we can measure and
            improve the performance of our site. They help us to know which
            pages are the most and least popular and see how visitors move
            around the site. All information these cookies collect is aggregated
            and therefore anonymous.
          </li>
          <li>
            <strong>Functional Cookies:</strong> These cookies enable the
            website to provide enhanced functionality and personalization. They
            may be set by us or by third-party providers whose services we have
            added to our pages.
          </li>
        </ul>
      </Section>

      <Section title="3. Your Choices Regarding Cookies">
        <p>
          You can control and/or delete cookies as you wish. You can delete all
          cookies that are already on your computer and you can set most
          browsers to prevent them from being placed. If you do this, however,
          you may have to manually adjust some preferences every time you visit
          a site and some services and functionalities may not work.
        </p>
        <p>
          When you first visit our site, you will be presented with a cookie
          banner that allows you to accept or decline non-essential cookies.
        </p>
      </Section>

      <Section title="4. Changes to This Cookie Policy">
        <p>
          We may update our Cookie Policy from time to in order to reflect, for
          example, changes to the cookies we use or for other operational,
          legal, or regulatory reasons. Please re-visit this Cookie Policy
          regularly to stay informed about our use of cookies and related
          technologies.
        </p>
      </Section>

      <Section title="5. Contact Us">
        <p>
          If you have any questions about our use of cookies, please contact us
          at:{' '}
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
