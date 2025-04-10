import Link from 'next/link'

interface NoAccessProps {
  message: string
  showSubscribeButton?: boolean
}

export function NoAccess({ message }: NoAccessProps) {
  return (
    <div className="flex flex-col items-start justify-center pt-8 pb-10 w-full mx-auto">
      <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
        <div className="flex flex-col items-center justify-center w-full mt-10 gap-4">
          <p className="text-lg text-muted-foreground text-center">{message}</p>
          <Link
            href="/courses"
            className="px-4 py-2 bg-primary text-white rounded-sm font-semibold hover:bg-primary/90 transition"
          >
            Unlock Now
          </Link>
        </div>
      </div>
    </div>
  )
}
