import useUserStore from "@/stores/user";
import { ROUTES } from "@/util/routes";
import { useRouter } from "expo-router";

export default function useAuth() {
  const router = useRouter();
  const username = useUserStore((state) => state.username);

  if (username === null) {
    router.navigate(ROUTES.login);
  }
}
