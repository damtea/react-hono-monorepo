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

import { ConfirmDialog } from "@/components/confirm-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  TExample,
  type TExampleSchema,
  exampleSchema,
} from "../../../../server/shared/sharedTypes";
export const Route = createFileRoute("/_authenticated/examples")({
  component: RouteComponent,
  pendingComponent: () => <LoadingPage />,
});
const queryKey = "examples-with-pagination";
async function fetchData() {
  const response = await api.example.$get();
  if (!response.ok) toast.error("Server error.");
  return await response.json();
}

const defaultValues = {
  id: "",
  name: "",
  contact: "",
};

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [waiting, startWaiting] = useTransition();
  const form = useForm<TExampleSchema>({
    resolver: zodResolver(exampleSchema),
    defaultValues,
  });
  const selectedId = form.watch("id");
  const queryClient = useQueryClient();
  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: fetchData,
  });

  const mutation = useMutation({
    onMutate: async (newValue: TExample) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });

      queryClient.setQueryData([queryKey], (prev: TExample[] = []) =>
        selectedId
          ? prev.map((item) => {
              if (item.id === selectedId) return newValue;
              else return item;
            })
          : [...prev, newValue]
      );
    },
  });

  async function onSubmit(values: TExampleSchema) {
    let result;
    if (selectedId) {
      result = await api.example[":id"].$put({
        json: values,
        param: {
          id: selectedId,
        },
      });
    } else {
      result = await api.example.$post({
        json: values,
      });
    }
    const newValue = await result.json();
    mutation.mutate(newValue);

    // refetch or mutate

    // refetch();
    toast.success(`${selectedId ? "Updated" : "Added"} successfully`);
    setOpenForm(false);
    form.reset(defaultValues);
  }
  function formDialog() {
    return (
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedId ? "Edit" : "Add New"} Item</DialogTitle>
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
                        <Input {...field} value={field.value} />
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
                          value={field.value?.toString()}
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
  async function handleDelete() {
    if (selectedId) {
      startWaiting(async () => {
        await api.example["delete"][":id"].$get({
          param: {
            id: selectedId,
          },
        });
        refetch();
      });
    }
  }

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        <Button
          disabled={isPending}
          onClick={() => {
            form.reset(defaultValues);
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
            <TableHead className="w-20">Sl No.</TableHead>
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
            : data
                ?.slice(
                  (currentPage - 1) * rowsPerPage,
                  (currentPage - 1) * rowsPerPage + rowsPerPage
                )
                .map((item, index: number) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-10">{index + 1}</TableCell>
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
                              params: () => ({ id: item.id }),
                            });
                          }}
                        >
                          Params
                        </Button>
                        <Button
                          onClick={() => {
                            form.reset({
                              id: item.id,
                              name: item.name,
                              contact: item.contact || undefined,
                            });
                            setOpenForm(true);
                          }}
                        >
                          Edit
                        </Button>
                        <ConfirmDialog
                          title="Are you absolutely sure?"
                          description="This action cannot be undone. This will permanently delete your
                  item and remove your data from our servers."
                          actionFn={handleDelete}
                          // size="icon"
                          variant="destructive"
                          cancelFn={() => {
                            form.reset(defaultValues);
                          }}
                          disabled={waiting}
                          onOpen={() => {
                            form.reset({
                              id: item.id,
                              name: item.name,
                              contact: item.contact || undefined,
                            });
                          }}
                        >
                          Delete
                        </ConfirmDialog>
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
      />
      {formDialog()}
    </>
  );
}
