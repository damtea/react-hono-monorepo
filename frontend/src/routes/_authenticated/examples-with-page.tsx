import { LoadingPage } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

import { Pagination } from "@/components/pagination";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type TExampleSchema,
  exampleSchema,
} from "../../../../server/shared/sharedTypes";
type SearchParams = {
  page?: number;
  pageSize?: number;
};
export const Route = createFileRoute("/_authenticated/examples-with-page")({
  component: RouteComponent,
  pendingComponent: () => <LoadingPage />,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    if (
      typeof Number(search?.page) === "number" &&
      typeof Number(search?.pageSize) === "number"
    ) {
      return {
        page: Number(search.page) || 1,
        pageSize: Number(search.pageSize) || 10,
      };
    }
    return {};
  },
});
const queryKey = "examples-with-pagination";
async function fetchData(_page: number, _pageSize: number) {
  const response = await api.example["with-pagination"].$get({
    query: {
      page: _page.toString(),
      pageSize: _pageSize.toString(),
    },
  });
  return await response.json();
}

function RouteComponent() {
  const { page: start, pageSize: end } = Route.useSearch();

  const navigate = Route.useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(start || 1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const form = useForm<TExampleSchema>({
    resolver: zodResolver(exampleSchema),
  });
  const queryClient = useQueryClient();

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: [queryKey, start, end],
    enabled: Boolean(start) && Boolean(end),
    queryFn: async () => {
      if (start && end) {
        return await fetchData(start, end);
      }
    },
  });

  useLayoutEffect(() => {
    if (currentPage) {
      navigate({
        from: Route.path,
        search: {
          page: currentPage,
          pageSize: rowsPerPage,
        },
      });
    }
  }, [currentPage, navigate, rowsPerPage]);

  async function onSubmit(values: TExampleSchema) {
    await api.example.$post({
      json: values,
    });

    // refetch or mutate

    // refetch();
    await queryClient.invalidateQueries({ queryKey: [queryKey, start, end] });
    toast.success("Added Successfully");
    setOpenForm(false);
    form.reset();
  }
  function formDialog() {
    return (
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="gap-4 grid py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value?.toString() || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" isLoading={form.formState.isSubmitting}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        <Button
          disabled={isPending}
          onClick={() => {
            setOpenForm(true);
          }}
        >
          <PlusIcon />
          Add New
        </Button>
        <Button
          isLoading={isFetching}
          onClick={() => {
            refetch();
          }}
        >
          Refresh
        </Button>
      </div>

      <Table className="mt-2">
        {/* <TableCaption>A list of examples.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Identification</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array(rowsPerPage)
                .fill(1)
                .map((_, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="w-10">
                        <Skeleton className="h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4" />
                      </TableCell>
                    </TableRow>
                  );
                })
            : data?.slice(0, rowsPerPage).map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.contact}</TableCell>
                  <TableCell>
                    {dayjs(item.createdAt).format("DD MMMM YYYY @ hh:mm A")}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        onClick={() => {
                          navigate({
                            to: "/example-query",
                            search: (prev) => ({ ...prev, id: item.id }),
                          });
                        }}
                      >
                        Query
                      </Button>
                      <Button
                        onClick={() => {
                          navigate({
                            to: "/example-param/$id",
                            from: Route.path,
                            params: () => ({ id: item.id }),
                          });
                        }}
                      >
                        Params
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalRows={data?.length || 0}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        hideLabel
      />
      {formDialog()}
    </>
  );
}
