import Image from "next/image";
import Link from "next/link"

export default function Page() {
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="navbar bg-base-100 shadow-sm absolute top-0">
          <div className="navbar-start">
            <a className="btn btn-ghost text-xl">Scaffold</a>

          </div>
          <div className="navbar-center">
            <a className="btn btn-ghost text-xl">Scaffold</a>
          </div>
          <div className="navbar-end">
            <a className="btn btn-ghost text-xl">Scaffold</a>

          </div>
        </div>
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
              quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
            <Link href="auth/signup" className="btn btn-primary mt-4">Get Started</Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-50 h-50">
          <Image src="/bee.png" alt="Bee" fill></Image>
        </div>

      </div>
    </div>
  );
}
