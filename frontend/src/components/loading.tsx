import { LoaderIcon } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="flex flex-col justify-center items-center h-[80dvh]">
      <LoaderIcon className="animate-spin" />
    </div>
  );
}
