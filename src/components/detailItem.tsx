import { Box, Text } from "@mantine/core";

const DetailItem = ({
  icon,
  label,
  labelSize = "sm",
}: {
  icon: JSX.Element;
  label: string;
  labelSize?: string;
}) => {
  return (
    <Box
      display="flex"
      style={{
        alignItems: "center",
        gap: 5,
      }}
    >
      {icon}
      <Text size={labelSize}>{label}</Text>
    </Box>
  );
};

export default DetailItem;
