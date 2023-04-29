import React from "react";
import { GetServerSidePropsContext } from "next";
import { serverApi } from "@/lib/axios";
import { UserType } from "@/schemas/user";

const JobBoard = ({ user }: { user: UserType }) => {
  return <div>JobBoard: {JSON.stringify(user)}</div>;
};

export default JobBoard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  let _user = null;
  try {
    const response = await serverApi(ctx).get("/users/me");
    _user = response.data;
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: _user,
    },
  };
};
