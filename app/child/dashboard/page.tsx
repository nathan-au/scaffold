import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">Hi, Nathan!</h1>
        <p>What would you like to do today?</p>
        <div className="grid grid-cols-2 gap-4">
          <Link href="./activity/english" className="w-100 h-50 text-7xl btn">English</Link>
          <Link href="./activity/math" className="w-100 h-50 text-7xl btn">Math</Link>
          <Link href="./activity/science" className="w-100 h-50 text-7xl btn">Science</Link>
        </div>
    </div>
  )
}