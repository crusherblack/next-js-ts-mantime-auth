import { ReactElement, useState } from "react";

import { useForm, zodResolver } from "@mantine/form";
import { TextInput, PasswordInput, Button, Text, Alert } from "@mantine/core";

import AuthLayout from "@/layouts/auth";
import Link from "@/components/generic/link";
import { schema } from "@/schemas/register";
import { IconAlertCircle } from "@tabler/icons-react";
import { useMutation } from "react-query";
import { postRegister } from "@/services/auth";
import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { serverApi } from "@/lib/axios";

function Register() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { getInputProps, onSubmit, isValid, reset } = useForm({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutate, isLoading, error } = useMutation(postRegister, {
    onSuccess: () => {
      setSuccess(true);
      reset();
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

  const handleRegister = onSubmit((values) => mutate(values));

  return (
    <>
      <form onSubmit={handleRegister}>
        {!!serverError && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Info!"
            color="red"
            mb="md"
          >
            {serverError}
          </Alert>
        )}
        {success && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Info!"
            color="green"
            mb="md"
          >
            Successfully Register, Please Login!!!
          </Alert>
        )}
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
          {...getInputProps("passwordConfirm")}
        />
        <Button
          type="submit"
          fullWidth
          mt="xl"
          size="md"
          disabled={!isValid()}
          loading={isLoading}
        >
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
