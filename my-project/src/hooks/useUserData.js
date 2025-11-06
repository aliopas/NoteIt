import { useQuery } from "@tanstack/react-query";
import { getAllUserData } from "../utils/noteApi";

export function useUserData() {
  return useQuery({
    queryKey: ["userData"],
    queryFn: getAllUserData,
    staleTime: 1000 * 60 * 5, 
    retry: false,
  });
}
