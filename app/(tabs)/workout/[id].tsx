import Modal from "@/components/modal";
import Exercise from "@/components/workout/Exercise";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const id = (useLocalSearchParams<{ id: string }>().id ?? 0) as number;
  const workout = useWorkoutStore((s) => s.workouts[id]);
  const [showModal, toggleModal] = useWorkoutStore((s) => [
    s.showModal,
    s.toggleModal,
  ]);

  return (
    <View style={[calcStyle.container, styles.container]}>
      <Text>workout {workout.name}</Text>
      <FlashList
        data={workout.exerciseIds}
        renderItem={({ item }) => <Exercise id={item} />}
        estimatedItemSize={100}
      />
      <Modal hidden={showModal} onPress={toggleModal} opacity={0.0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
  });
