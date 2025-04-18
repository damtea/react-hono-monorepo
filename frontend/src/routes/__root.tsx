import { Button } from "@/components/ui/button";
import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { HomeIcon } from "lucide-react";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

function RootComponent() {
  return <Outlet />;
}

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-[80dvh] text-center">
      <div>
        <p className="font-semibold text-2xl">404</p>
        <p className="font-semibold text-lg">Page not found!</p>
      </div>
      <Link to="/">
        <Button>
          <HomeIcon /> Go to Homepage
        </Button>
      </Link>
    </div>
  );
}
function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-[80dvh] text-center">
      <div>
        <p className="font-semibold text-2xl">Oops!</p>
        <p className="font-semibold text-lg">Something went wrong...</p>
        <p className="font-semibold text-lg">Error Message: {error.message}</p>
      </div>
      <Link to="/">
        <Button>
          <HomeIcon /> Go to Homepage
        </Button>
      </Link>
    </div>
  );
}
