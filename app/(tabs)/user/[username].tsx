import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Page() {
  const username = useLocalSearchParams<{ username: string }>().username;

  return (
    <View>
      <Text>{username}</Text>
    </View>
  );
}
