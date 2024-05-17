import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";

export default function Page() {
  const router = useRouter();
  const id = useLocalSearchParams<{ id: string }>().id;
  return <Text>workout {id}</Text>;
}
