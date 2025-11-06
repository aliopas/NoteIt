import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../utils/noteApi";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await API_BASE_URL.get("/api/auth/me");
      return res.data.user;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}