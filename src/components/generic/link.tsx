import React, { PropsWithChildren } from "react";

import { Anchor } from "@mantine/core";
import NextLink from "next/link";

type Props = {
  href: string;
};

const Link: React.FC<PropsWithChildren<Props>> = ({ href, children }) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <Anchor<"a"> weight={700}>{children}</Anchor>
    </NextLink>
  );
};

export default Link;
