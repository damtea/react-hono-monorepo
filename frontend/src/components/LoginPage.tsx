import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { project } from "@/utils/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  loginSchema,
  type TLoginSchema,
} from "../../../server/shared/sharedTypes";
import { GoogleLogo } from "./google-logo";
import { useQueryClient } from "@tanstack/react-query";
const defaultValues: TLoginSchema = {
  loginId: "",
  password: "",
};
export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  async function onSubmit(values: TLoginSchema) {
    const response = await api.auth.login.$post({
      json: values,
    });
    if (!response.ok) {
      return toast.error((await response.json()).message);
    }
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    await router.invalidate();
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-[97dvh]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start gap-2">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex justify-center items-center rounded-md w-6 h-6 text-primary-foreground">
              <img alt={project.name} src={project.logo} className="size-4" />
            </div>
            {project.name}
          </a>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <div className="w-full max-w-xs">
            <Form {...form}>
              <form
                className={cn("flex flex-col gap-6")}
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="font-bold text-2xl">Login to your account</h1>
                  <p className="text-balance text-muted-foreground text-sm">
                    Enter your email below to login to your account
                  </p>
                </div>
                <div className="gap-6 grid">
                  <FormField
                    control={form.control}
                    name="loginId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value}
                            type="email"
                            placeholder="posus@example.com"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="gap-2 grid">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <Link
                              tabIndex={-1}
                              to="/examples"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              Forgot your password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value}
                              type="password"
                              placeholder="Password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <div className="relative after:top-1/2 after:z-0 after:absolute after:inset-0 after:flex after:items-center after:border-t after:border-border text-center text-sm">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                  <Button variant="outline" className="w-full" type="button">
                    <GoogleLogo />
                    Sign in with Google
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="relative lg:flex justify-center items-center hidden bg-muted/50">
        <img src={project.logo} alt={project.name} className="size-56" />
      </div>
    </div>
  );
}
