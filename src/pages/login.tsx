import { ReactElement } from "react";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Text,
} from "@mantine/core";
import AuthLayout from "./layouts/auth";
import Link from "./components/generic/link";

import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(4),
});

function Login() {
  const { getInputProps, onSubmit, isValid } = useForm({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  return (
    <>
      <form onSubmit={onSubmit((values) => console.log(values))}>
        <TextInput
          label="Email address"
          placeholder="hello@gmail.com"
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
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button type="submit" fullWidth mt="xl" size="md" disabled={!isValid()}>
          Login
        </Button>
      </form>

      <Text ta="center" mt="md">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </Text>
    </>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
