type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  )
}
