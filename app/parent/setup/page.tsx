"use client"

import Link from 'next/link'
import { useState } from 'react'


export default function Page() {

  const [english, setEnglish] = useState(true)
  const [math, setMath] = useState(true)
  const [science, setScience] = useState(true)

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-100 border p-4">
        <legend className="fieldset-legend">Child Profile</legend>

        <label className="label">First Name</label>
        <input type="text" className="input" placeholder="Full Name" />

        <label className="label">Age</label>
        <input type="number" className="input validator" required placeholder="Age (1-10)" min="1" max="10"/>
      </fieldset>

      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-100 border p-4">
        <legend className="fieldset-legend">Subject Options</legend>

        <label className="label cursor-pointer">
          <input type="checkbox" className="toggle" checked={english} onChange={() => setEnglish(!english)}/>
          <span className="ml-2">English</span>
        </label>

        <label className="label cursor-pointer">
          <input type="checkbox" className="toggle" checked={math} onChange={() => setMath(!math)}/>
          <span className="ml-2">Math</span>
        </label>

        <label className="label cursor-pointer">
          <input type="checkbox" className="toggle" checked={science} onChange={() => setScience(!science)}/>
          <span className="ml-2">Science</span>
        </label>


      </fieldset>
      <Link href="dashboard" className="btn btn-primary mt-4">Continue</Link>

    </div>
  )
}
