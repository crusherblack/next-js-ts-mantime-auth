import React, { useMemo, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { serverApi } from "@/lib/axios";
import { UserType } from "@/schemas/user";
import { getDetailPosition } from "@/services/recruitments";
import { useQuery } from "react-query";
import {
  Box,
  Card,
  Container,
  Grid,
  Image,
  Skeleton,
  Text,
} from "@mantine/core";
import NavbarComponents from "@/components/navbar";
import { useRouter } from "next/router";
import { PositionType } from "@/schemas/positions";
import DetailItem from "@/components/detailItem";
import {
  IconArrowsExchange,
  IconCalendarStats,
  IconCurrentLocation,
} from "@tabler/icons-react";
import { IMAGE_FAILED } from "@/constant";

const SkeletonDetail = () => {
  return (
    <Grid>
      <Grid.Col md={12} lg={8}>
        <Skeleton height={700} />
      </Grid.Col>
      <Grid.Col md={12} lg={4}>
        <Skeleton height={200} mb="sm" />
        <Skeleton height={150} />
      </Grid.Col>
    </Grid>
  );
};

const JobBoardDetail = ({ user }: { user: UserType }) => {
  const router = useRouter();
  const positionId = router.query?.id;
  const [imageFailed, setImageFailed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["positions", positionId],
    queryFn: () => getDetailPosition(positionId as string),
  });

  const position: PositionType = useMemo(() => data?.data?.data || {}, [data]);

  return (
    <>
      <NavbarComponents tabs={["Home", "Post Job", "Portofolio"]} user={user} />

      <Container px="xs">
        {isLoading ? (
          <SkeletonDetail />
        ) : (
          <Grid>
            <Grid.Col md={12} lg={8}>
              <Box mt="sm">
                <Text size="xl" weight="bold">
                  {position.title}
                </Text>

                <DetailItem
                  icon={<IconArrowsExchange size="1rem" />}
                  label={position.type}
                  labelSize="md"
                />
                <DetailItem
                  icon={<IconCurrentLocation size="1rem" />}
                  label={position.location}
                  labelSize="md"
                />
                <DetailItem
                  icon={<IconCalendarStats size="1rem" />}
                  label={position.created_at}
                  labelSize="md"
                />

                <div
                  dangerouslySetInnerHTML={{ __html: position.description }}
                />
              </Box>
            </Grid.Col>
            <Grid.Col md={12} lg={4}>
              <Card>
                <Image
                  src={imageFailed ? IMAGE_FAILED : position.company_logo}
                  height={200}
                  width="100%"
                  alt={position.company}
                  style={{
                    objectFit: "cover",
                  }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    setImageFailed(true);
                  }}
                />

                <Text size="md" weight="bold" mt="md">
                  How To Apply?{" "}
                </Text>
                <div
                  dangerouslySetInnerHTML={{ __html: position.how_to_apply }}
                />
              </Card>
            </Grid.Col>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default JobBoardDetail;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  let _user = null;
  let _positions = [];
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
