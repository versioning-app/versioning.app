import { UnderlinedLink } from '@/components/common/underlined-link';
import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Cookie Policy for Versioning.app
      </h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 2024-08-12</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device (computer,
          smartphone, tablet) when you visit a website. They are used to make
          websites work more efficiently, as well as to provide information to
          the owners of the site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. How We Use Cookies</h2>
        <p className="mb-2">
          At Versioning.app, we use cookies to enhance your browsing experience.
          Specifically, we use cookies to:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li>Remember your login information and ensure secure login.</li>
          <li>
            Understand how you use our site to improve its performance and
            functionality.
          </li>
          <li>Remember your preferences, such as language and region.</li>
          <li>Provide social media features and personalized content.</li>
          <li>Deliver advertisements that are relevant to your interests.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          3. Types of Cookies We Use
        </h2>
        <p className="mb-2">
          We use the following types of cookies on our website:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li>
            <strong>Essential Cookies:</strong> These cookies are necessary for
            the website to function and cannot be turned off in our systems.
            They are typically set in response to actions made by you, such as
            logging in or filling out forms.
          </li>
          <li>
            <strong>Performance Cookies:</strong> These cookies help us
            understand how visitors interact with our website by collecting and
            reporting information anonymously.
          </li>
          <li>
            <strong>Functional Cookies:</strong> These cookies enable the
            website to provide enhanced functionality and personalization. They
            may be set by us or by third-party providers whose services we have
            added to our pages.
          </li>
          <li>
            <strong>Targeting Cookies:</strong> These cookies may be set through
            our site by our advertising partners. They may be used to build a
            profile of your interests and show you relevant ads on other sites.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          4. Managing Your Cookie Preferences
        </h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You
          can set your cookie preferences by adjusting the settings on your
          browser. Please note that disabling cookies may affect the
          functionality of our website and your ability to use certain features.
        </p>
        <p>
          Most web browsers allow some control of most cookies through the
          browser settings. To find out more about cookies, including how to see
          what cookies have been set and how to manage and delete them, visit{' '}
          <a
            href="https://www.aboutcookies.org"
            className="text-blue-600 hover:underline"
          >
            www.aboutcookies.org
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Third-Party Cookies</h2>
        <p>
          In some cases, we may use third-party cookies provided by trusted
          partners. These cookies may track your activity across different
          websites to build a profile of your interests. You can opt out of
          third-party cookies by adjusting your browser settings or visiting the
          third party&#x27;s website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          6. Changes to This Cookie Policy
        </h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes
          in our practices or for other operational, legal, or regulatory
          reasons. We encourage you to review this policy periodically to stay
          informed about our use of cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Cookie Policy or our
          use of cookies, please contact us at:
        </p>
        <address className="not-italic">
          versioning.app
          <br />
          Email:{' '}
          <UnderlinedLink href="mailto:cookies@versioning.app">
            cookies@versioning.app
          </UnderlinedLink>
        </address>
      </section>
    </div>
  );
}
