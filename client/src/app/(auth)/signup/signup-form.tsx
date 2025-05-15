"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schemas
const singupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(4, "Password is too short"),
  confirmPassword: z.string(),
});

// Main Types
type SignupFormSchema = z.infer<typeof singupFormSchema>;

// Main Component
type SignupFormProps = { onSubmit: (formData: SignupFormSchema) => void };

export const SignupForm = ({ onSubmit }: SignupFormProps) => {
  const form = useForm<SignupFormSchema>({ resolver: zodResolver(singupFormSchema) });
  const handleSignup = form.handleSubmit((formData) => onSubmit(formData));

  return (
    <Form {...form}>
      <form onSubmit={handleSignup}></form>
    </Form>
  );
};

// Hooks

// Functions
