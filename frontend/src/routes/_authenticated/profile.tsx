import { LoadingPage } from "@/components/loading";
import { profileQueryOption } from "@/lib/profile";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  const { data } = useQuery(profileQueryOption);

  return <div>Hello {data?.userId}</div>;
}
