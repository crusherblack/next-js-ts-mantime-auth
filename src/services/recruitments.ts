import { api } from "@/lib/axios";

type GetPositionsParams = {
  description?: string;
  location?: string;
  page?: number;
  full_time?: string;
};

export const getPositions = (params: GetPositionsParams) => {
  return api.get("/recruitments/positions", {
    params,
  });
};

export const getDetailPosition = (id: string) => {
  return api.get("/recruitments/positions/" + id);
};
