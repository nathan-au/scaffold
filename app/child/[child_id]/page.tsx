"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"


export default function Page() {
  const params = useParams()
  const childId = params.child_id

  const [firstName, setFirstName] = useState("")
  const [totalStars, setTotalStars] = useState(0)
  const [activities, setActivities] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChild = async () => {
      const { data } = await supabase
        .from('children')
        .select('first_name, total_stars, activities(id, title, completed), rewards(id, title, star_cost, earned)')
        .eq('id', childId)
        .single()

      setFirstName(data?.first_name)
      setTotalStars(data?.total_stars)
      setActivities(data?.activities?.filter((a: any) => !a.completed) ?? [])
      setRewards(data?.rewards?.filter((r: any) => !r.completed) ?? [])
      setLoading(false)
    }
    fetchChild()
  }, [childId])

  return (

    <div>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <span className="loading loading-bars loading-xl text-primary"></span>
        </div>
      ) : 
      (
        <div className="min-h-screen justify-center items-center flex flex-col gap-5">
          <h1 className="text-6xl">Hi, {firstName}</h1>
          <div className="stats shadow">

            <div className="stat">
              <div className="stat-figure">
                <img src="https://img.icons8.com/?size=100&id=85448&format=png&color=fdc700" alt="Star" className="w-10" />
              </div>
              <div className="stat-title">Stars</div>
              <div className="stat-value">{totalStars}</div>
            </div>
          </div>
          <div className="flex flex-row gap-5">
            {activities.map((activity) => (
              <Link href={`../../activity/${activity.id}`} key={activity.id} className="btn w-100 h-50 text-3xl">
                {activity.title}
              </Link>
            ))}
          </div>
          <ul className="list bg-base-100 rounded-box shadow-md flex-auto">

            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Rewards Progress</li>
            {rewards.map((reward) => (
              <li key={reward.id} className="list-row">
                <div>
                  <div>{reward.title}</div>
                  <div className="text-xs font-semibold opacity-60">{reward.star_cost} Stars</div>
                </div>
                <div className="flex flex-row ml-auto">
                  <progress className="progress progress-primary w-56" value={totalStars / reward.star_cost * 100} max="100"></progress>
                </div>
              </li>
            ))}
            </ul>
        </div>
      )}

    </div>

    
    
  )
}