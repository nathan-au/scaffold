"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import english_activity from "../../../../data/english_activity.json"
import math_activity from "../../../../data/math_activity.json"
import science_activity from "../../../../data/science_activity.json"
import Link from 'next/link'

export default function Page() {
  const params = useParams()
  const subject = params.subject

  const [activityStarted, setActivityStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | number | null>(null)  
  const [activityCompleted, setActivityCompleted] = useState(false)

  let activity
  switch (subject) {
    case "math":
      activity = math_activity
      break
    case "english":
      activity = english_activity
      break
    case "science":
      activity = science_activity
      break
    default:
      return <div>Activity not found</div>
  }

  const activityQuestions = activity.questions

  const handleNext = () => {
    setSelectedChoice(null)
    if (currentQuestionIndex == (activityQuestions.length - 1)) {
      setActivityCompleted(true)
      setActivityStarted(false)
      setCurrentQuestionIndex(0)
    }
    else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  if (activityCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl">Activity complete!</h1>
        <Link href="../dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    )
  }
  else if (activityStarted) {
    const currentQuestion = activityQuestions[currentQuestionIndex]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl">{currentQuestion.prompt}</h1>

        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.choices.map((choice) => (
            <button key={currentQuestionIndex + "-" + choice} onClick={() => setSelectedChoice(choice)} className={`w-150 h-75 text-7xl btn btn-info ${selectedChoice == choice ? "" : "btn-outline"}`}>{choice}</button>
          ))}
        </div>
        <button onClick={handleNext} className="btn btn-primary btn-wide">Next</button>

      </div>
    )
  }
  else {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl">{activity.activity_title}</h1>
        <button onClick={() => setActivityStarted(true)} className="btn btn-primary">Start Activity</button>
        <Link href="../dashboard" className="btn btn-primary btn-outline">Back to Dashboard</Link>
      </div>
    )
  }
  
}