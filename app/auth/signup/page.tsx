'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/parent/setup')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <form className="fieldset bg-base-200 border-base-300 rounded-box w-100 border p-4" onSubmit={handleSignUp}>
        
        <legend className="fieldset-legend">Parent Sign Up</legend>

        <label className="label">Email</label>
        <input type="email" className="input w-full validator" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

        <label className="label">Password</label>
        <input type="password" className="input w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

        <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        </form>
    </div>
  )
}
