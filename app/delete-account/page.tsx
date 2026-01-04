'use client'

import { useState } from 'react'

export default function DeleteAccount() {
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!confirmed) {
      alert('Please confirm that you understand your data will be permanently deleted.')
      return
    }

    setStatus('sending')

    try {
      const mailtoLink = `mailto:qdoapphelp@gmail.com?subject=${encodeURIComponent(
        '[Qdo] Account Deletion Request'
      )}&body=${encodeURIComponent(
        `ACCOUNT DELETION REQUEST\n\nEmail: ${email}\n\nReason for deletion: ${reason || 'Not specified'}\n\nI confirm that I want to permanently delete my Qdo account and all associated data.`
      )}`

      window.location.href = mailtoLink
      setStatus('success')
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Delete Your Qdo Account</h1>
        <p className="text-gray-600 mb-6">
          We&apos;re sorry to see you go. Use this form to request deletion of your Qdo account and all associated data.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-2">What happens when you delete your account:</h2>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Your account credentials (email) will be permanently deleted</li>
            <li>• All your tasks and projects will be permanently deleted</li>
            <li>• Your user preferences and settings will be removed</li>
            <li>• This action cannot be undone</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">Data Deletion Timeline:</h2>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Account deletion requests are processed within <strong>30 days</strong></li>
            <li>• You will receive a confirmation email once deletion is complete</li>
            <li>• No data is retained after deletion, except as required by law</li>
          </ul>
        </div>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              Your email client should open with the deletion request. If it doesn&apos;t, please email us
              directly at{' '}
              <a href="mailto:qdoapphelp@gmail.com" className="underline">
                qdoapphelp@gmail.com
              </a>{' '}
              with subject &quot;Account Deletion Request&quot;.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Account Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
              placeholder="Enter the email associated with your Qdo account"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for leaving (optional)
            </label>
            <textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition resize-none"
              placeholder="Help us improve by sharing why you're leaving"
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="confirm" className="ml-2 text-sm text-gray-700">
              I understand that deleting my account will permanently remove all my data including tasks,
              projects, and account information. This action cannot be undone.
            </label>
          </div>

          <button
            type="submit"
            disabled={status === 'sending' || !confirmed}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Processing...' : 'Request Account Deletion'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Alternative: Delete from the App</h3>
          <p className="text-gray-600 text-sm mb-4">
            You can also delete your account directly from the Qdo app:
          </p>
          <ol className="text-gray-600 text-sm list-decimal list-inside space-y-1">
            <li>Open the Qdo app</li>
            <li>Go to Settings</li>
            <li>Tap &quot;Delete Account&quot;</li>
            <li>Confirm your decision</li>
          </ol>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:qdoapphelp@gmail.com" className="text-blue-600 hover:underline">
              qdoapphelp@gmail.com
            </a>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Qdo - Eisenhower Matrix Task Manager
          </p>
        </div>
      </div>
    </div>
  )
}
