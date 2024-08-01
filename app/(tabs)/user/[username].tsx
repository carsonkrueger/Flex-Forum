import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Page() {
  const username = useLocalSearchParams<{ username: string }>().username;

  return (
    <View style={[styles.container]}>
      <View style={[styles.headerContainer]}>
        <Text>{username}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  headerContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
