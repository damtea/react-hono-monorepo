import { LoadingPage } from "@/components/loading";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
  pendingComponent: () => <LoadingPage />,
});

function RouteComponent() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <Button
        disabled={theme === "system"}
        onClick={async () => {
          setTheme("system");
          toast("You are in system theme.");
        }}
      >
        Switch to System
      </Button>
      <Button
        disabled={theme === "dark"}
        onClick={async () => {
          setTheme("dark");
          toast("You are in dark mode");
        }}
      >
        Switch to Dark
      </Button>
      <Button
        disabled={theme === "light"}
        onClick={async () => {
          setTheme("light");
          toast("You are in light mode");
        }}
      >
        Switch to Light
      </Button>
    </div>
  );
}
