import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <p>admin dashboard</p>
      <div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  )
}
