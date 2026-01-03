export const metadata = {
  title: 'Privacy Policy - Qdo',
  description: 'Privacy Policy for Qdo - Eisenhower Matrix Task Manager',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy for Qdo</h1>
        <p className="text-gray-500 mb-8">Last Updated: January 3, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700">
            Qdo (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>

          <h3 className="text-lg font-medium text-gray-800 mb-2">Account Information</h3>
          <p className="text-gray-700 mb-2">When you create an account, we collect:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
            <li>Email address</li>
            <li>Authentication credentials (encrypted)</li>
          </ul>

          <p className="text-gray-700 mb-2">If you sign in with Google or Apple, we receive:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
            <li>Your name (as provided by the authentication provider)</li>
            <li>Email address</li>
            <li>Unique account identifier</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-2">User Content</h3>
          <p className="text-gray-700 mb-2">We store the following data you create within the app:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
            <li>Tasks (title, description, urgency, importance, status)</li>
            <li>Projects (name, description)</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-2">Automatically Collected Information</h3>
          <p className="text-gray-700 mb-2">We may automatically collect:</p>
          <ul className="list-disc list-inside text-gray-700 ml-4">
            <li>Device type and operating system</li>
            <li>App version</li>
            <li>Crash logs and performance data (for improving app stability)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 mb-2">We use your information to:</p>
          <ul className="list-disc list-inside text-gray-700 ml-4">
            <li>Provide and maintain the Qdo service</li>
            <li>Authenticate your identity</li>
            <li>Sync your tasks and projects across devices</li>
            <li>Improve app performance and fix bugs</li>
            <li>Respond to your support requests</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
          <p className="text-gray-700 mb-4">
            Your data is stored securely using Supabase, a trusted cloud database provider.
            We implement industry-standard security measures including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
            <li>Encrypted data transmission (HTTPS/TLS)</li>
            <li>Secure authentication protocols</li>
            <li>Row-level security for data isolation</li>
          </ul>
          <p className="text-gray-700">Your tasks and projects are private and only accessible to you.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Sharing</h2>
          <p className="text-gray-700 mb-2">We do <strong>not</strong>:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
            <li>Sell your personal information</li>
            <li>Share your data with third parties for marketing purposes</li>
            <li>Use your task content for advertising</li>
          </ul>
          <p className="text-gray-700 mb-2">We may share information only:</p>
          <ul className="list-disc list-inside text-gray-700 ml-4">
            <li>With service providers who help us operate the app (e.g., cloud hosting)</li>
            <li>If required by law or legal process</li>
            <li>To protect our rights or the safety of users</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
          <p className="text-gray-700 mb-2">Qdo uses the following third-party services:</p>
          <ul className="list-disc list-inside text-gray-700 ml-4">
            <li><strong>Supabase</strong>: Database and authentication</li>
            <li><strong>Google Sign-In</strong>: Optional authentication</li>
            <li><strong>Apple Sign-In</strong>: Optional authentication</li>
            <li><strong>Expo</strong>: App development platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-2">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
            <li>Access your personal data</li>
            <li>Update or correct your information</li>
            <li>Delete your account and associated data</li>
            <li>Export your data</li>
          </ul>
          <p className="text-gray-700">
            To exercise these rights, contact us at{' '}
            <a href="mailto:qdoapphelp@gmail.com" className="text-blue-600 hover:underline">
              qdoapphelp@gmail.com
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Retention</h2>
          <p className="text-gray-700">
            We retain your data for as long as your account is active. If you delete your account,
            we will delete your personal data within 30 days, except where we are required to retain it by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
          <p className="text-gray-700">
            Qdo is not intended for children under 13. We do not knowingly collect personal information
            from children under 13. If you believe we have collected such information, please contact us immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of significant changes
            by posting the new policy in the app or via email.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-2">If you have questions about this Privacy Policy, please contact us at:</p>
          <p className="text-gray-700">
            <strong>Email</strong>:{' '}
            <a href="mailto:qdoapphelp@gmail.com" className="text-blue-600 hover:underline">
              qdoapphelp@gmail.com
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Website</strong>:{' '}
            <a href="https://qdo.app" className="text-blue-600 hover:underline">
              https://qdo.app
            </a>
          </p>
        </section>

        <hr className="my-8 border-gray-200" />

        <p className="text-gray-600 text-center">
          By using Qdo, you agree to this Privacy Policy.
        </p>
      </div>
    </div>
  )
}
