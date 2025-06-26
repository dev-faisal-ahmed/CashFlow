import { useForm } from "react-hook-form";
import { TSigUpForm } from "./auth-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "./auth-schema";
import { useMutation } from "@tanstack/react-query";
import { signup } from "./auth-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignup = () => {
  const form = useForm<TSigUpForm>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(signupSchema),
  });

  const { mutate, isPending } = useMutation({ mutationKey: ["auth"], mutationFn: signup });
  const router = useRouter();

  const handleSignup = form.handleSubmit((formData) => {
    const { name, email, password } = formData;
    mutate(
      { name, email, password },
      {
        onSuccess: (res) => {
          toast.success(res.message);
          form.reset();
          router.push("/");
        },
      },
    );
  });

  return { form, handleSignup, isPending };
};
