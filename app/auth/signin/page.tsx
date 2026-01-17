import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-100 border p-4">
        <legend className="fieldset-legend">Sign In</legend>

        <label className="label">Email</label>
        <input type="email" className="input w-full validator" placeholder="Email" />

        <label className="label">Password</label>
        <input type="password" className="input w-full" placeholder="Password" />

        <Link href="../parent/dashboard" className="btn btn-primary mt-4">Sign In</Link>
      </fieldset>
    </div>
  )
}
