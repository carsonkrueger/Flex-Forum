import Button from "@/forms/Button";
import { SizeVariant } from "@/util/variants";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Button onPress={() => router.replace("/")} radius={SizeVariant.XL4} >
        <Text>btn</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  } 
});

