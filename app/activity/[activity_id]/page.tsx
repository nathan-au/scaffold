"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../lib/supabase/client"
import Link from 'next/link'

export default function Page() {
  const params = useParams()
  const activityId = params.activity_id

  const [activityTitle, setActivityTitle] = useState("")
  const [activityChildId, setActivityChildId] = useState("")
  const [activityQuestions, setActivityQuestions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activityStarted, setActivityStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | number | null>(null)
  const [activityFinished, setActivityFinished] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchActivity = async () => {
      const { data } = await supabase
        .from('activities')
        .select('child_id, title, questions')
        .eq('id', activityId)
        .single()

      setActivityTitle(data?.title)
      setActivityChildId(data?.child_id)
      setActivityQuestions(data?.questions)

      setLoading(false)
    }

    fetchActivity()
  }, [activityId])

  const handleNext = async () => {
    const currentQuestion = activityQuestions[currentQuestionIndex]
    const isCorrect = selectedChoice == currentQuestion.answer
    const nextScore = isCorrect ? score + 1 : score

    if (isCorrect) {
      setScore(nextScore)
    }

    setSelectedChoice(null)
    if (currentQuestionIndex == (activityQuestions.length - 1)) {
      setActivityFinished(true)
      setActivityStarted(false)
      setCurrentQuestionIndex(0)

      const { data: activityData } = await supabase
        .from('activities')
        .select('completed')
        .eq('id', activityId)
        .single()

      if (activityData && !activityData.completed) {
        await supabase
          .from('activities')
          .update({ completed: true })
          .eq('id', activityId)

        const { data: childData } = await supabase
          .from('children')
          .select('total_stars')
          .eq('id', activityChildId)
          .single()

        if (childData) {
          await supabase
            .from('children')
            .update({ total_stars: childData.total_stars + nextScore })
            .eq('id', activityChildId)
        }
      }
    }
    else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    )
  }


  if (activityFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl">Activity complete!</h1>
        <h2 className="text-2xl">Score: {score} / {activityQuestions?.length}</h2>
        <Link href={`../../child/${activityChildId}`} className="btn btn-primary btn-outline">Back to Dashboard</Link>
      </div>
    )
  }
  else if (activityStarted) {
    const currentQuestion = activityQuestions[currentQuestionIndex]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl">{currentQuestion.prompt}</h1>

        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.choices.map((choice: string | number) => (
            <button key={currentQuestionIndex + "-" + choice} onClick={() => setSelectedChoice(choice)} className={`w-150 h-75 text-7xl btn btn-info ${selectedChoice == choice ? "" : "btn-outline"}`}>{choice}</button>
          ))}
        </div>
        <button onClick={handleNext} disabled={selectedChoice == null} className="btn btn-primary btn-wide">Next</button>

      </div>
    )
  }
  else {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl">{activityTitle}</h1>
        <button onClick={() => setActivityStarted(true)} className="btn btn-primary">Start Activity</button>
        <Link href={`../../child/${activityChildId}`} className="btn btn-primary btn-outline">Back to Dashboard</Link>
      </div>
    )
  }

}