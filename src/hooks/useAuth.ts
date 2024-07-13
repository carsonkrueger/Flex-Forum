import useUserStore from "@/stores/user";
import { routes } from "@/util/routes";
import { useRouter } from "expo-router";

export default function useAuth() {
  const router = useRouter();
  const username = useUserStore((state) => state.username);

  if (username === null) {
    router.navigate(routes.login);
  }
}
