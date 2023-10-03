import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Copy, Server } from 'lucide-react'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

type Props = {
  title: string
  description: string
  variant: 'public' | 'admin'
}

const textMap: Record<Props['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
}

const variantMap: Record<Props['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
}

export const ApiCallout = (props: Props) => {
  const { title, description, variant = 'public' } = props

  const onCopy = () => {
    navigator.clipboard.writeText(description)
    toast({
      title: 'Copied',
      description: `API Route copied to the clipboard`,
      variant: 'green',
    })
  }

  return (
    <Alert>
      <div className="flex flex-row items-center gap-2">
        <Server className="mb-1 h-4 w-4" />
        <AlertTitle className="flex items-center gap-x-2">
          {title}
          <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
        </AlertTitle>
      </div>

      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>

        <Button className="ab" variant="outline" size="icon" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
