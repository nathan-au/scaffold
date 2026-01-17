"use client"

import { supabase } from "@/lib/supabase/client";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link"


export default function Page() {

  const [children, setChildren] = useState<any[]>([]);
  const [rewardName, setRewardName] = useState("");
  const [rewardCost, setRewardCost] = useState<number | "">("")
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true)


  const fetchData = async () => {
    const { data } = await supabase
      .from("children")
      .select("id, first_name, total_stars, activities(id, title, questions, completed), rewards(id, title, star_cost, earned)")
      .order("first_name")
    setChildren(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleDeleteReward = async (rewardId: string) => {
    const { error } = await supabase
      .from("rewards")
      .delete()
      .eq("id", rewardId)
      

    if (!error) {
      fetchData();
    }
  };

  const handleAddReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !rewardName || !rewardCost) return;

    const { error } = await supabase
      .from("rewards")
      .insert({
        child_id: selectedChildId,
        title: rewardName,
        star_cost: rewardCost,
        earned: false
      });

    if (!error) {
      setRewardName("")
      setRewardCost("")
      fetchData();
      (document.getElementById("add_reward_modal") as HTMLDialogElement).close();
    }

  };

  return (

    <div>
    
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <span className="loading loading-bars loading-xl text-primary"></span>
        </div>

      ) : 
      (
        <div className="">
          <div className="tabs tabs-border flex justify-center">
            <Link href="../auth/who" className="btn btn-square btn-ghost absolute left-0"><img className="w-5" src="https://img.icons8.com/?size=100&id=115603&format=png&color=000000" alt="Who" /></Link>

            {children.map((child, i) => (
              <React.Fragment key={child.id}>
                <input type="radio" name="child_tabs" className="tab" aria-label={child.first_name} defaultChecked={i == 0} />
                <div className="tab-content border-base-300 bg-base-100 p-10">
                  <div className="flex flex-col items-center gap-5">
                    <p>You're currently viewing {child.first_name}</p>

                    <div className="stats shadow">
                      <div className="stat">
                        <div className="stat-figure">
                          <img src="https://img.icons8.com/?size=100&id=85448&format=png&color=fdc700" alt="Star" className="w-10" />
                        </div>
                        <div className="stat-title">Stars</div>
                        <div className="stat-value">{child.total_stars}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-figure">
                          <img src="https://img.icons8.com/?size=100&id=85448&format=png&color=fdc700" alt="Star" className="w-10" />
                        </div>
                        <div className="stat-title">Rewards Earned</div>
                        <div className="stat-value">{child.rewards?.filter((r: { earned: boolean }) => r.earned).length ?? 0}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-figure">
                          <img src="https://img.icons8.com/?size=100&id=85448&format=png&color=fdc700" alt="Star" className="w-10" />
                        </div>
                        <div className="stat-title">Activites Completed</div>
                        <div className="stat-value">{child.activities?.filter((a: { completed: boolean }) => a.completed).length ?? 0}</div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-5 w-full">
                      <ul className="list bg-base-100 rounded-box shadow-md flex-auto">

                        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Upcoming Activities</li>

                        {child.activities?.filter((a: { completed: boolean }) => !a.completed).map((activity: { id: string; title: string; questions: any }) =>
                          <li key={activity.id} className="list-row">
                            <div>
                              <div>{activity.title}</div>
                              <div className="text-xs font-semibold opacity-60">{activity.questions.length ?? 0} Questions</div>
                            </div>
                            <div className="flex flex-row ml-auto">
                              <button className="btn btn-square btn-ghost" onClick={() => {
                                setSelectedActivity(activity);
                                (document.getElementById('view_activity_modal') as HTMLDialogElement).showModal();
                              }}>
                                <img className="w-5" src="https://img.icons8.com/?size=100&id=85028&format=png&color=000000" alt="View" />
                              </button>
                              <button className="btn btn-square btn-ghost" onClick={() => {
                                setSelectedActivity(activity);
                                (document.getElementById('edit_activity_modal') as HTMLDialogElement).showModal();
                              }}>
                                <img className="w-5" src="https://img.icons8.com/?size=100&id=86373&format=png&color=000000" alt="Edit" />
                              </button>
                            </div>
                          </li>


                        )}

                      </ul>

                      <ul className="list bg-base-100 rounded-box shadow-md flex-auto">

                        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Available Rewards</li>

                        {child.rewards?.filter((r: { earned: boolean }) => !r.earned).map((reward: { id: string; title: string, star_cost: number }) =>

                          <li key={reward.id} className="list-row">
                            <div>
                              <div>{reward.title}</div>
                              <div className="text-xs font-semibold opacity-60">{reward.star_cost} Stars</div>
                            </div>
                            <div className="flex flex-row ml-auto">
                              <button className="btn btn-square btn-ghost" onClick={() => handleDeleteReward(reward.id)}>
                                <img className="w-5" src="https://img.icons8.com/?size=100&id=99933&format=png&color=000000" alt="Delete" />
                              </button>

                            </div>
                          </li>

                        )}

                        <li className="list-row flex justify-center">
                          <button className="btn btn-square btn-ghost w-full" onClick={() => {
                            setSelectedChildId(child.id);
                            const modal = document.getElementById('add_reward_modal');
                            if (modal) (modal as HTMLDialogElement).showModal();
                          }}>
                            <img className="w-5" src="https://img.icons8.com/?size=100&id=84991&format=png&color=000000" alt="Add" />
                          </button>
                        </li>

                      </ul>
                    </div>
                  </div>
                </div>

              </React.Fragment>

            ))}

            <Link href="setup" className="btn btn-square btn-ghost"><img className="w-5" src="https://img.icons8.com/?size=100&id=84991&format=png&color=000000" alt="Add" /></Link>
            <Link href="../auth/signout" className="btn btn-square btn-ghost absolute right-0"><img className="w-5" src="https://img.icons8.com/?size=100&id=82792&format=png&color=000000" alt="Sign Out" /></Link>


          </div>

          <dialog id="add_reward_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg pb-4">Add Reward</h3>
              <form className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4" onSubmit={handleAddReward}>
                <legend className="fieldset-legend">Reward Details</legend>

                <label className="label">Reward Name</label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Chocolate Chip Cookie"
                  value={rewardName}
                  onChange={(e) => setRewardName(e.target.value)}
                  required
                />

                <label className="label">Cost (Stars)</label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="e.g. 40"
                  value={rewardCost}
                  onChange={(e) => setRewardCost(Number(e.target.value))}
                  required
                  min="1"
                />

                <div className="flex flex-row mt-4 justify-center">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      const modal = document.getElementById("add_reward_modal") as HTMLDialogElement;
                      modal.close();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Add Reward</button>
                </div>
              </form>
            </div>
          </dialog>

          <dialog id="view_activity_modal" className="modal">
            {selectedActivity && (
              <div className="modal-box">
                <h3 className="font-bold text-lg pb-4">{selectedActivity.title} Activity</h3>
                {selectedActivity.questions.map((question: any) => (
                  <div key={question.id} className="mt-2">
                    <p>{question.id}. {question.prompt}</p>
                    <div className="ml-4">
                      {question.choices.map((choice: any, i: number) => (
                        <span key={choice} className={choice == question.answer ? "text-success" : ""}>{choice}{i < question.choices.length - 1 ? ", " : ""}</span>
                      ))}

                    </div>
                    
                  </div>
                ))}
              </div>
            )}
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>


          <dialog id="edit_activity_modal" className="modal">
            {selectedActivity && (
              <div className="modal-box">
                <h3 className="font-bold text-lg pb-4">Edit Activity</h3>
                <form className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
                  <legend className="fieldset-legend">Activity Details</legend>

                  <label className="label">Activity Title</label>
                  <input type="text" className="input w-full" defaultValue={selectedActivity.title} placeholder="e.g. Rocks Activity" key={selectedActivity.id + "_title"} />

                  <label className="label">Prompt AI for activity</label>
                  <textarea className="textarea h-40 w-full" placeholder="e.g. Create an activity with 8 questions about the types of rocks."></textarea>

                  <div className="flex flex-row mt-4 justify-center">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        const modal = document.getElementById("edit_activity_modal") as HTMLDialogElement;
                        modal.close();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>

                </form>
              </div>
            )}
          </dialog>

        </div>

      )}

    </div>


  )

  
}
