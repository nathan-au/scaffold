"use client"

import Link from "next/link"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Page() {
  const [children, setChildren] = useState<{ id: string; first_name: string }[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchChildren = async () => {
      const { data } = await supabase
        .from("children")
        .select("id, first_name")
        .order("first_name")
      setChildren(data ?? [])
      setLoading(false)
    }

    fetchChildren()
  }, [])

  return (

    <div>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <span className="loading loading-bars loading-xl text-primary"></span>
        </div>
      ) : 
      (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5">
          <p className="text-5xl">Who's learning?</p>
          <div className="flex flex-row gap-5">
            {children.map((child) => (
              <Link href={`/child/${child.id}`} className="w-60 h-30 text-3xl btn btn-primary" key={child.id}>{child.first_name}</Link>
            ))}
            <Link href="../../parent/dashboard" className="w-60 h-30 text-3xl btn btn-primary" key={"parent"}>{"Parent"}</Link>

          </div>
        </div>
      )}
    </div>

  )

      
}
