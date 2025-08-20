"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Handle the auth callback
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL params
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')

        if (error) {
          console.error('Auth error:', error)
          router.push('/?error=auth_failed')
          return
        }

        if (code) {
          // Store the auth code in localStorage for now
          localStorage.setItem('civic_auth_code', code)
          localStorage.setItem('civic_auth_authenticated', 'true')
          router.push('/dashboard')
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/?error=callback_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen matrix-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold neon-text font-mono mb-2">Authenticating...</h2>
        <p className="text-green-400/70 font-mono">Please wait while we complete your sign-in</p>
      </div>
    </div>
  )
}
