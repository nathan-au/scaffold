'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Page() {

  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return
    }

    const { error } = await supabase.from('children').insert([{ 
      first_name: firstName, 
      parent_id: user.id,
    }])
    
    if (error) {
      setLoading(false)
    } else {
      router.push('/parent/dashboard')
    }

  }

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center">
      <form className="fieldset bg-base-200 border-base-300 rounded-box w-100 border p-4" onSubmit={handleSubmit}>
        <legend className="fieldset-legend">Child Profile</legend>

        <label className="label">First Name</label>
        <input type="text" className="input w-full" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>

        <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </form>

    </div>
  )
}
