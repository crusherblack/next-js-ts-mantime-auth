import { ReactElement } from "react";

import { useForm, zodResolver } from "@mantine/form";
import { TextInput, PasswordInput, Button, Text } from "@mantine/core";
import { z } from "zod";

import AuthLayout from "./layouts/auth";
import Link from "./components/generic/link";

const schema = z
  .object({
    name: z.string().min(2, { message: "Name should have at least 2 letters" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

function Register() {
  const { getInputProps, onSubmit, isValid } = useForm({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <>
      <form onSubmit={onSubmit((values) => console.log(values))}>
        <TextInput
          label="Full Name"
          placeholder="Fadhil Darma Putera Zagoto"
          size="md"
          {...getInputProps("name")}
        />
        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
          mt="md"
          size="md"
          {...getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          {...getInputProps("password")}
        />
        <PasswordInput
          label="Password"
          placeholder="Retype Your password"
          mt="md"
          size="md"
          {...getInputProps("confirmPassword")}
        />
        <Button type="submit" fullWidth mt="xl" size="md" disabled={!isValid()}>
          Register
        </Button>
      </form>

      <Text ta="center" mt="md">
        Already Have Account? <Link href="/login">Login</Link>
      </Text>
    </>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout isRegister>{page}</AuthLayout>;
};

export default Register;
