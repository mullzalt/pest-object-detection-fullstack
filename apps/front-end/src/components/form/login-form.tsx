import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "@/queries/auth";
import { signInSchema, type SignIn } from "@hama/data-access";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "./field-info";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: signIn,
  });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {} as SignIn,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: signInSchema,
    },
    onSubmit: ({ value, formApi }) => {
      mutateAsync(
        { json: value },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["session"],
              exact: true,
              refetchType: "all",
            });
            router.invalidate();
            await navigate({ to: "/dashboard" });
            return;
          },
          onError: (error) => {
            formApi.setErrorMap({
              onSubmit: error.message,
            });

            formApi.setFieldValue("password", () => "");
          },
        },
      );
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <Subscribe
                selector={(state) => [state.errorMap]}
                children={([errorMap]) =>
                  errorMap.onSubmit ? (
                    <em className="text-sm font-medium text-destructive">
                      {errorMap.onSubmit?.toString()}
                    </em>
                  ) : null
                }
              />

              <Field name="email">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="your@email.com"
                      autoFocus
                    />
                    <div className="text-xs">
                      <FieldInfo field={field} />
                    </div>
                  </div>
                )}
              </Field>

              <Field name="password">
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Password</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                    />
                    <div className="text-xs">
                      <FieldInfo field={field} />
                    </div>
                  </div>
                )}
              </Field>
              <Subscribe
                selector={(state) => [state.isSubmitting, state.canSubmit]}
              >
                {([isSubmitting, canSubmit]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit || isSubmitting}
                  >
                    Login
                  </Button>
                )}
              </Subscribe>
            </div>
            <div className="mt-4 text-center text-sm">
              {/* Don&apos;t have an account?{" "} */}
              {/* <a href="#" className="underline underline-offset-4"> */}
              {/*   Sign up */}
              {/* </a> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
