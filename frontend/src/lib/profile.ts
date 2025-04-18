import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";

async function getProfile() {
  const response = await api.auth.$get();
  return await response.json();
}

export const profileQueryOption = queryOptions({
  queryKey: ["profile"],
  queryFn: getProfile,
  staleTime: Infinity,
});
