import React, { useEffect, useMemo, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { serverApi } from "@/lib/axios";
import { UserType } from "@/schemas/user";
import { getPositions } from "@/services/recruitments";
import {
  Box,
  Image,
  Card,
  Container,
  createStyles,
  rem,
  Text,
  Button,
  Skeleton,
  TextInput,
  Grid,
  Checkbox,
} from "@mantine/core";
import NavbarComponents from "@/components/navbar";
import { PositionType } from "@/schemas/positions";
import { IMAGE_FAILED } from "@/constant";
import { IconArrowsExchange, IconCurrentLocation } from "@tabler/icons-react";
import { IconCalendarStats } from "@tabler/icons-react";
import { IconBriefcase } from "@tabler/icons-react";
import Link from "next/link";
import DetailItem from "@/components/detailItem";
import { useDebounce } from "@/hooks/useDebounce";

const SkeletonList = () => {
  return (
    <>
      {[...Array(10)].map((_, index) => (
        <Skeleton key={index} height={180} mb="sm" />
      ))}
    </>
  );
};

const Item = ({ position }: { position: PositionType }) => {
  const { classes } = useStyles();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link
      href={`/job-board/${position?.id}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        mb="sm"
        className={classes.item}
      >
        <Image
          src={imageFailed ? IMAGE_FAILED : position?.company_logo}
          height={160}
          width={200}
          alt={position?.company}
          style={{
            objectFit: "cover",
          }}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            setImageFailed(true);
          }}
        />
        <Box>
          <Text size="md" weight="bold">
            {position?.company}
          </Text>
          <DetailItem
            icon={<IconBriefcase size="1rem" />}
            label={position?.title}
          />
          <DetailItem
            icon={<IconArrowsExchange size="1rem" />}
            label={position?.type}
          />
          <DetailItem
            icon={<IconCurrentLocation size="1rem" />}
            label={position?.location}
          />
          <DetailItem
            icon={<IconCalendarStats size="1rem" />}
            label={position?.created_at}
          />
        </Box>
      </Card>
    </Link>
  );
};

const JobBoard = ({ user }: { user: UserType }) => {
  const [searchDescription, setsearchDescription] = useState<string | null>(
    null
  );
  const searchDescriptionValue = useDebounce(searchDescription, 300);

  const [searchLocation, setsearchLocation] = useState<string | null>(null);
  const searchLocationValue = useDebounce(searchLocation, 300);

  const [isFulltime, setIsFulltime] = useState<boolean>(false);

  const [positions, setPositions] = useState<PositionType[]>([]);

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleGetPositions = async () => {
    try {
      const { data } = await getPositions({
        page: 1,
        description: searchDescriptionValue,
        location: searchLocationValue,
        full_time: isFulltime ? "true" : "false",
      });

      setPositions(data?.data?.positions);
    } catch (error) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      setIsLoadingMore(true);
      const { data } = await getPositions({
        page,
        description: searchDescriptionValue,
        location: searchLocationValue,
        full_time: isFulltime ? "true" : "false",
      });

      setPositions((prev) => [...prev, ...data?.data?.positions]);
    } catch (error) {
      setError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    handleGetPositions();
  }, [searchDescriptionValue, searchLocationValue, isFulltime]);

  useEffect(() => {
    if (page > 1) {
      handleLoadMore();
    }
  }, [page]);

  const filteredPositions = useMemo(
    () => positions.filter((item) => item?.id),
    [positions]
  );

  return (
    <>
      <NavbarComponents tabs={["Home", "Post Job", "Portofolio"]} user={user} />
      <Container px="xs">
        {isLoading ? (
          <SkeletonList />
        ) : (
          <Box>
            <Grid>
              <Grid.Col md={12} lg={5}>
                <TextInput
                  placeholder="Search Position"
                  size="md"
                  width="100%"
                  mb="sm"
                  value={searchDescription as string}
                  onChange={(e) => setsearchDescription(e.target.value)}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={5}>
                <TextInput
                  placeholder="Search Location"
                  size="md"
                  width="100%"
                  mb="sm"
                  value={searchLocation as string}
                  onChange={(e) => setsearchLocation(e.target.value)}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={2}>
                <Checkbox
                  label="Full Time Only"
                  mt="xs"
                  size="md"
                  onChange={(e) => setIsFulltime(e.target.checked)}
                  checked={isFulltime}
                />
              </Grid.Col>
            </Grid>

            {filteredPositions?.length > 0 &&
              filteredPositions
                .filter((item) => item?.id)
                ?.map((position) => (
                  <Item key={position?.id} position={position} />
                ))}
            {!error && filteredPositions.length > 0 && (
              <Button
                mb="md"
                fullWidth
                onClick={() => setPage((prev) => prev + 1)}
                loading={isLoadingMore}
              >
                Load More
              </Button>
            )}
          </Box>
        )}
      </Container>
    </>
  );
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

const useStyles = createStyles((theme) => ({
  item: {
    padding: rem(5),
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    ":hover": {
      cursor: "pointer",
      opacity: 0.8,
    },
  },
}));
