type Props = {
  color: string
}

export const ColorCircle = ({ color }: Props) => {
  return (
    <div
      className="rounded-full border p-4"
      style={{ backgroundColor: color }}
    />
  )
}
