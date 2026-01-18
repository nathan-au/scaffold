"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "../../../lib/supabase/client"
import Link from 'next/link'
import { generateTTS } from "./actions"

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

  const handlePlayTTS = async (text: string) => {
    try {
      const base64 = await generateTTS(text);
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      audio.play();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="loading loading-bars loading-xl text-primary"></span>
      </div>
    )
  }


  if (activityFinished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-10">
        <h1 className="text-4xl">Activity complete.</h1>
        <h2 className="text-6xl text-primary">You earned {score} Stars!</h2>
        <Link href={`../../child/${activityChildId}`} className="btn btn-primary w-100 h-20 text-3xl">Continue</Link>
      </div>
    )
  }
  else if (activityStarted) {
    const currentQuestion = activityQuestions[currentQuestionIndex]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <p>Question {currentQuestionIndex + 1} of {activityQuestions.length}</p>
        <progress className="progress progress-primary w-150 progress-xl h-10" value={currentQuestionIndex / activityQuestions.length * 100} max="100"></progress>
        <div className="flex flex-row items-center gap-4 text-center">
          <h1 className="text-6xl font-bold">{currentQuestion.prompt}</h1>
        </div>

        <button className="btn btn-ghost btn-circle btn-lg" onClick={() => handlePlayTTS(currentQuestion.prompt)}>
            <img className="w-10" src="https://img.icons8.com/?size=100&id=101936&format=png&color=000000" alt="Speak" />
        </button>

        <div className="grid grid-cols-2 gap-5">
          {currentQuestion.choices.map((choice: string | number) => (
              <button
                key={currentQuestionIndex + "-" + choice}
                onClick={() => setSelectedChoice(choice)}
                className={`w-80 h-40 text-4xl btn btn-primary ${selectedChoice == choice ? "" : "btn-outline"}`}
              >
                {choice}
              </button>
          ))}
        </div>
        <button onClick={handleNext} disabled={selectedChoice == null} className="btn btn-primary w-60 h-20 text-2xl">Next</button>

      </div>
    )
  }
  else {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <h1 className="text-6xl">{activityTitle} Activity</h1>
        <button onClick={() => setActivityStarted(true)} className="btn btn-primary w-200 h-20 text-4xl">Start</button>
        <Link href={`../../child/${activityChildId}`} className="btn btn-ghost">Go Back</Link>
      </div>
    )
  }

}