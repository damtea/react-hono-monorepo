import { LoadingPage } from "@/components/loading";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
export const Route = createFileRoute("/_authenticated/example-param/$id")({
  component: RouteComponent,
  pendingComponent: () => <LoadingPage />,
});
async function fetchData(id: string) {
  const response = await api.example["param"][":id"].$get({
    param: {
      id: id,
    },
  });
  return await response.json();
}
function RouteComponent() {
  const { id } = Route.useParams();
  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ["example-with-query", id],
    enabled: !!id,
    queryFn: async () => {
      if (id) return await fetchData(id);
    },
  });

  return (
    <>
      <Button
        isLoading={isFetching}
        onClick={() => {
          refetch();
        }}
      >
        Refetch
      </Button>

      <Table className="mt-4">
        {/* <TableCaption>A list of examples.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Sl No.</TableHead>
            <TableHead>Identification</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <TableRow>
              <TableHead className="w-10">
                <Skeleton className="h-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4" />
              </TableHead>
            </TableRow>
          ) : (
            <TableRow>
              <TableHead className="w-10">1</TableHead>
              <TableHead>{data?.id}</TableHead>
              <TableHead>{data?.name}</TableHead>
              <TableHead>{data?.contact}</TableHead>
              <TableHead>
                {dayjs(data?.createdAt).format("DD MMMM YYYY @ hh:mm A")}
              </TableHead>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
