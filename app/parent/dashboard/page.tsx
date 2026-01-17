"use client"

import { supabase } from "@/lib/supabase/client";
import React from "react";
import { useEffect, useState } from "react";


export default function Page() {

  const [children, setChildren] = useState<any[]>([]);
  useEffect(() => {
    supabase
      .from("children")
      .select("id, first_name")
      .then(({ data }) => setChildren(data ?? []));
  }, []);
  
  return (

    <div className="">

      <div className="tabs tabs-border flex justify-center">


        {children.map((child, i) => (

          <React.Fragment key={child.id}>

            <input type="radio" name="child_tabs" className="tab" aria-label={child.first_name} defaultChecked={i == 0}/>
            <div className="tab-content border-base-300 bg-base-100 p-10">
              <div className="flex flex-col items-center gap-5">
                <p>You're currently viewing {child.first_name}</p>

                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-figure">
                      <img src="https://img.icons8.com/?size=100&id=85448&format=png&color=fdc700" alt="Star" className="w-10"/>
                    </div>
                    <div className="stat-title">Stars</div>
                    <div className="stat-value">43</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure">
                      <img src="https://img.icons8.com/?size=100&id=85448&format=png&color=fdc700" alt="Star" className="w-10"/>
                    </div>
                    <div className="stat-title">Rewards Earned</div>
                    <div className="stat-value">43</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure">
                      <img src="https://img.icons8.com/?size=100&id=85448&format=png&color=fdc700" alt="Star" className="w-10"/>
                    </div>
                    <div className="stat-title">Activites Completed</div>
                    <div className="stat-value">43</div>
                  </div>
                </div>

                <div className="flex flex-row gap-5 w-full">
                  <ul className="list bg-base-100 rounded-box shadow-md flex-auto">
      
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Upcoming Activities</li>
                    
                    <li className="list-row">
                      <div>
                        <div>Math Activity</div>
                        <div className="text-xs font-semibold opacity-60">7 Questions</div>
                      </div>
                      <div className="flex flex-row ml-auto">
                        <button className="btn btn-square btn-ghost">
                          <img className="w-5" src="https://img.icons8.com/?size=100&id=85028&format=png&color=000000" alt="View" />
                        </button>
                        <button className="btn btn-square btn-ghost">
                          <img className="w-5" src="https://img.icons8.com/?size=100&id=86373&format=png&color=000000" alt="Edit" />
                        </button>
                      </div>
                    </li>

                  </ul>

                  <ul className="list bg-base-100 rounded-box shadow-md flex-auto">
      
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Available Rewards</li>
                    
                    <li className="list-row">
                      <div>
                        <div>Toy Car</div>
                        <div className="text-xs font-semibold opacity-60">89 Stars</div>
                      </div>
                      <div className="flex flex-row ml-auto">
                        <button className="btn btn-square btn-ghost">
                          <img className="w-5" src="https://img.icons8.com/?size=100&id=99933&format=png&color=000000" alt="Delete" />
                        </button>

                      </div>
                    </li>
                    <li className="list-row flex justify-center">
                        <button className="btn btn-square btn-ghost w-full" onClick={() => {
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


      </div>
      
      <dialog id="add_reward_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-4">Add Reward</h3>
          <form className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">                  
            <legend className="fieldset-legend">Reward Details</legend>

            <label className="label">Reward Name</label>
            <input type="text" className="input w-full" placeholder="e.g. Chocolate Chip Cookie" />

            <label className="label">Cost (Stars)</label>
            <input type="number" className="input w-full validator" placeholder="e.g. 40" />

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

      
    </div>
  )
}
