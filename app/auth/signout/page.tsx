'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutPage() {
    const router = useRouter()

    useEffect(() => {
        const signOut = async () => {
            await supabase.auth.signOut()
            router.push('/')
        }
        signOut()
    }, [router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <span className="loading loading-bars loading-xl text-primary"></span>
        </div>
    )
}
