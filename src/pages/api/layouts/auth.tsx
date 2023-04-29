import React, { PropsWithChildren } from "react";

import { Paper, Title, createStyles, rem } from "@mantine/core";
import { APPLICATION_NAME, AUTH_IMAGE_BACKGROUND_URL } from "@/constant";

type Props = {
  isRegister?: boolean;
};

const AuthLayout: React.FC<PropsWithChildren<Props>> = ({
  children,
  isRegister = false,
}) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome {!isRegister && "Back"} to {APPLICATION_NAME}
        </Title>{" "}
        {children}
      </Paper>
    </div>
  );
};

export default AuthLayout;

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: rem(969),
    backgroundSize: "cover",
    backgroundImage: `url(${AUTH_IMAGE_BACKGROUND_URL})`,
  },
  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(969),
    maxWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));
