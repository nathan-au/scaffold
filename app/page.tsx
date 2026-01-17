import Link from "next/link"

export default function Page() {
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen w-full">
        <div className="navbar bg-base-100 shadow-sm absolute top-0">
          <div className="navbar-start">
            
            <a className="btn btn-ghost text-xl">Scaffold</a>

          </div>
          <div className="navbar-center">
              <ul className="menu menu-horizontal px-1">
                <li><Link href="#features">Solution</Link></li>
                <li><Link href="#faq">FAQ</Link></li>
              </ul>
          </div>
          <div className="navbar-end gap-2">
            <Link href="auth/signin" className="btn btn-primary btn-outline">Sign In</Link>
            <Link href="auth/signup" className="btn btn-primary">Get Started</Link>

          </div>
        </div>
        <div className="hero-content w-full">
          <div className="flex flex-col gap-5 items-center">
            <p className="text-8xl">Turn Screen Time Into Learning Time</p>
            <p className="text-4xl">Scaffold is a reward-based learning reinforcement platform that transforms idle screen time into meaningful growth.</p>
            
              <Link href="auth/signup" className="btn btn-primary">Get Started For FREE</Link>
          </div>
          
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-5 p-10">
        
        <h2 className="text-5xl">Too Much Roblox, Not Enough Knowledge</h2>

        <div className="grid grid-cols-2 gap-5">
          <div className="card bg-base-100 w-96 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Card title!</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            </div>
          </div>
          <div className="card bg-base-100 w-96 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Card title!</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            </div>
          </div>
          <div className="card bg-base-100 w-96 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Card title!</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            </div>
          </div>
          <div className="card bg-base-100 w-96 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Card title!</h2>
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
            </div>
          </div>

        </div>



      </div>
    </div>
  );
}
