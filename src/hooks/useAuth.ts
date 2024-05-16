import useUserStore from "@/stores/user";
import { routes } from "@/util/routes";
import { useRouter } from "expo-router";

export default function useAuth() {
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);

  if (userId === null) {
    router.navigate(routes.login);
  }
}
