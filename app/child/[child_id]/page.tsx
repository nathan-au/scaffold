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

  const fetchChild = async (silent = false) => {
    if (!childId) return
    if (!silent) setLoading(true)
    const { data } = await supabase
      .from('children')
      .select('first_name, total_stars, activities(id, title, completed), rewards(id, title, star_cost, earned)')
      .eq('id', childId)
      .order('star_cost', {
        referencedTable: 'rewards',
        ascending: true
      })
      .single()

    setFirstName(data?.first_name)
    setTotalStars(data?.total_stars)
    setActivities(data?.activities?.filter((a: any) => !a.completed).splice(0, 4) ?? [])
    setRewards(data?.rewards?.filter((r: any) => !r.earned) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchChild()
  }, [childId])

  const handleRedeem = async (rewardId: string, starCost: number) => {
    try {
      // 1. Mark the reward as redeemed (earned = true)
      const { error: rewardError } = await supabase
        .from('rewards')
        .update({ earned: true })
        .eq('id', rewardId)

      if (rewardError) throw rewardError

      // 2. Deduct the stars from the child's total
      const { error: childError } = await supabase
        .from('children')
        .update({ total_stars: totalStars - starCost })
        .eq('id', childId)

      if (childError) throw childError

      // 3. Refresh data
      await fetchChild(true)
    } catch (error) {
      console.error("Redemption failed:", error)
      alert("Failed to redeem reward. Please try again.")
    }
  }

  return (

    <div>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center" >
          <span className="loading loading-bars loading-xl text-primary"></span>
        </div>
      ) :
        (
          <div className="min-h-screen justify-center items-center flex flex-col gap-5">
            <Link href="../auth/signout" className="btn btn-square btn-ghost absolute right-0 top-0"><img className="w-5" src="https://img.icons8.com/?size=100&id=82792&format=png&color=000000" alt="Sign Out" /></Link>

            <h1 className="text-6xl font-bold">Hi, {firstName}!</h1>
            <div className="join shadow rounded-xl items-start bg-base-100">
              <div className="stats join-item">
                <div className="stat">
                  <div className="stat-figure">
                    <img src="https://img.icons8.com/?size=100&id=85448&format=png&color=fdc700" alt="Star" className="w-10" />
                  </div>
                  <div className="stat-value">{totalStars}</div>
                </div>
              </div>
              <ul className="list bg-base-100 rounded-box join-item">
                {rewards.map((reward) => (
                  <li key={reward.id} className="list-row items-center">
                    <div>
                      <div>{reward.title}</div>
                      <div className="text-xs font-semibold opacity-60">{reward.star_cost} Stars</div>
                    </div>

                    <div className="flex flex-row ml-auto items-center gap-2">
                      <progress className="progress progress-primary w-56" value={totalStars / reward.star_cost * 100} max="100"></progress>

                      {totalStars >= reward.star_cost ? (
                        <button
                          className="btn btn-square btn-ghost"
                          onClick={() => handleRedeem(reward.id, reward.star_cost)}
                        >
                          <img className="w-5" src="https://img.icons8.com/?size=100&id=85026&format=png&color=000000" alt="Redeem" />
                        </button>
                      ) :
                        (
                          <button className="btn btn-square btn-ghost" disabled>
                            <img className="w-5" src="https://img.icons8.com/?size=100&id=85026&format=png&color=ffffff" alt="Redeem" />
                          </button>
                        )}
                    </div>


                  </li>
                ))}
              </ul>

            </div>

            <h2 className="text-3xl">Your Activities: {activities.length === 0 && "0"}</h2>
            <div className="grid grid-cols-2 gap-5">
              {activities.map((activity) => (
                <Link href={`../../activity/${activity.id}`} key={activity.id} className="btn btn-primary btn-outline border-5 w-100 h-30 text-2xl">
                  {activity.title}
                </Link>
              ))}
            </div>

          </div>
        )}

    </div>



  )
}