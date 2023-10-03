import { BillboardForm } from '@/components/forms/billboard-form'

type Props = {}

export default function Page(props: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm />
      </div>
    </div>
  )
}
