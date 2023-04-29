import { ReactElement, useState } from "react";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Text,
} from "@mantine/core";
import AuthLayout from "@/layouts/auth";
import Link from "@/components/generic/link";
import { Alert } from "@mantine/core";

import { useForm, zodResolver } from "@mantine/form";
import { schema } from "@/schemas/login";
import { useMutation } from "react-query";
import { postLogin } from "@/services/auth";
import { IconAlertCircle } from "@tabler/icons-react";
import { setCookie } from "cookies-next";
import Router from "next/router";
import axios, { AxiosError } from "axios";
import { serverApi } from "@/lib/axios";
import { GetServerSidePropsContext } from "next";

function Login() {
  const [serverError, setServerError] = useState<string | null>(null);

  const { getInputProps, onSubmit, isValid } = useForm({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate, isLoading, error } = useMutation(postLogin, {
    onSuccess: (response) => {
      setCookie("token", response.data.accessToken);

      Router.replace("/job-board");
    },
    onError: (err: AxiosError) => {
      if (axios.isAxiosError(err)) {
        const serverError =
          //@ts-ignore
          error.response?.data?.error?.[0]?.message ||
          //@ts-ignore
          error.response?.data?.message;

        setServerError(serverError);
      } else {
        setServerError("Runtime Error");
      }
    },
  });

  const handleLogin = onSubmit((values) => mutate(values));

  return (
    <>
      <form onSubmit={handleLogin}>
        {!!error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Info!"
            color="red"
            mb="md"
          >
            {serverError}
          </Alert>
        )}

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
        <Button
          type="submit"
          fullWidth
          mt="xl"
          size="md"
          disabled={!isValid()}
          loading={isLoading}
        >
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    if (ctx?.req?.headers?.cookie) {
      const response = await serverApi(ctx).get("/users/me");
      const user = response.data;

      if (user) {
        return {
          redirect: {
            destination: "/job-board",
            permanent: false,
          },
        };
      }
    }

    return {
      props: {},
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
