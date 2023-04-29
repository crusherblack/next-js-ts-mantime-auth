import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import { GetServerSidePropsContext } from "next";

export default function Home() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return <></>;
}
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};
