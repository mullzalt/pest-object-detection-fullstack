import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/config')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/config"!</div>
}
