import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import useWorkoutStore, { Id } from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { useMemo, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import flexWidths from "@/util/setFlexWidths";

export type Props = {
  id: Id;
  idx: number;
};

export default function Set({ id, idx }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const set = useSetStore((s) => s.sets[id]);
  const [setWeight, setReps] = useSetStore((s) => [s.setWeight, s.setReps]);
  const [finished, setFinished] = useState<boolean>(false);
  const prevStr = useMemo(calcPrevStr, []);
  const calcStyle = useMemo(
    () => calcStyles(scheme, finished),
    [scheme, finished],
  );

  function calcPrevStr(): string {
    if (set.prevReps === undefined && set.prevWeight === undefined) {
      return "-";
    }
    return `${set.prevWeight}x${set.prevReps}`;
  }

  const onCheckClick = () => {
    setFinished((prev) => !prev);
  };

  const onChangeTextWeight = (t: string) => {
    let weight = t as unknown as number;
    setWeight(weight, id);
  };

  const onChangeTextReps = (t: string) => {
    let reps = t as unknown as number;
    setReps(reps, id);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      {/* set index */}
      <View style={styles.setContainer}>
        <Text style={[calcStyle.set_prev, calcStyle.text, styles.text]}>
          {idx + 1}
        </Text>
      </View>
      {/* prev */}
      <View style={styles.prevContainer}>
        <Text style={calcStyle.text}>{prevStr}</Text>
      </View>
      {/* weight */}
      <View style={styles.weightContainer}>
        <TextInput
          value={set.weight?.toString()}
          editable={!finished}
          style={[
            styles.weight_reps,
            calcStyle.weight_reps,
            styles.text,
            calcStyle.text,
          ]}
          placeholder={set.prevWeight?.toString()}
          placeholderTextColor={scheme.loTertiary}
          keyboardType="numeric"
          maxLength={3}
          onChangeText={onChangeTextWeight}
        />
      </View>
      {/* reps */}
      <View style={styles.repsContainer}>
        <TextInput
          editable={!finished}
          style={[
            styles.weight_reps,
            calcStyle.weight_reps,
            styles.text,
            calcStyle.text,
          ]}
          placeholder={set.prevReps?.toString()}
          placeholderTextColor={scheme.loTertiary}
          keyboardType="numeric"
          maxLength={3}
          onChangeText={onChangeTextReps}
        />
      </View>
      {/* check */}
      <View style={styles.checkContainer}>
        <TouchableOpacity
          style={[styles.check, calcStyle.check]}
          onPress={onCheckClick}
        >
          <Ionicons name="checkmark" size={28} color={scheme.loQuaternary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const borderRadius = 5;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  setContainer: {
    flex: flexWidths.set,
    alignItems: "center",
  },
  prevContainer: {
    flex: flexWidths.prev,
    alignItems: "center",
  },
  weightContainer: {
    flex: flexWidths.weight,
    alignItems: "center",
  },
  repsContainer: {
    flex: flexWidths.reps,
    alignItems: "center",
  },
  checkContainer: {
    flex: flexWidths.check,
    alignItems: "center",
  },
  check: {
    borderRadius: borderRadius,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  weight_reps: {
    borderRadius: borderRadius,
    paddingHorizontal: 5,
    width: "100%",
    maxWidth: 50,
  },
});

const calcStyles = (scheme: ColorScheme, finished: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: finished ? scheme.quaternary : scheme.primary,
    },
    text: {
      color: finished ? scheme.loQuaternary : scheme.tertiary,
    },
    set_prev: {
      color: finished ? scheme.loQuaternary : scheme.tertiary,
    },
    check: {
      backgroundColor: finished ? scheme.loQuaternary : scheme.quaternary,
    },
    weight_reps: {
      backgroundColor: finished ? scheme.quaternary : scheme.secondary,
    },
  });
