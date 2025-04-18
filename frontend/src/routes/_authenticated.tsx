import { LoadingPage } from "@/components/loading";
import LoginPage from "@/components/LoginPage";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { profileQueryOption } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  pendingComponent: () => <LoadingPage />,
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    const profile = await queryClient.fetchQuery(profileQueryOption);
    return { profile: profile };
  },
});

function RouteComponent() {
  const { profile } = Route.useRouteContext();
  if (!profile || !profile.userId) {
    return <LoginPage />;
  }
  return (
    <>
      <Navbar />
      <div className="mx-auto p-4 container">
        <Outlet />
      </div>
    </>
  );
}

function Navbar() {
  const queryClient = useQueryClient();
  const router = useRouter();

  async function logout() {
    await api.auth.logout.$get();
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await router.invalidate();
  }

  return (
    <nav className="flex items-center gap-4 bg-foreground dark:bg-background p-4">
      <div className="flex flex-1 items-center gap-4">
        <Link to="/" className="text-white">
          {({ isActive }) => {
            return (
              <span className={cn(isActive && "font-semibold")}>Home</span>
            );
          }}
        </Link>
        <Link to="/profile" className="text-white">
          {({ isActive }) => {
            return (
              <span className={cn(isActive && "font-semibold")}>Profile</span>
            );
          }}
        </Link>
        <Link to="/examples" className="text-white">
          {({ isActive }) => {
            return (
              <span className={cn(isActive && "font-semibold")}>Examples</span>
            );
          }}
        </Link>
        <Link to="/examples-with-page" className="text-white">
          {({ isActive }) => {
            return (
              <span className={cn(isActive && "font-semibold")}>
                Examples (fetch with Pagination)
              </span>
            );
          }}
        </Link>
      </div>
      <Button variant={"destructive"} onClick={logout}>
        Logout
      </Button>
    </nav>
  );
}
