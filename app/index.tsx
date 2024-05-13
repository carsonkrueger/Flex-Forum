import Button from "@/forms/Button";
import { SizeVariant } from "@/util/variants";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <Button radius={SizeVariant.XL4}>
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

