import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import { Id } from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { useMemo, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { flexWidths } from "./Exercise";

export type Props = {
  id: Id;
  idx: number;
};

export default function Set({ id, idx }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const set = useSetStore((s) => s.sets[id]);
  const [finished, setFinished] = useState<boolean>(false);
  const prevStr = useMemo(calcPrevStr, []);
  const calcStyle = useMemo(
    () => calcStyles(scheme, false, finished),
    [scheme],
  );

  function calcPrevStr(): string {
    if (set.prevReps === undefined && set.prevWeight === undefined) {
      return "-";
    }
    return `${set.prevWeight}x${set.prevReps}`;
  }

  const onCheckClick = () => {
    setFinished(true);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      <View style={styles.setContainer}>
        <Text>{idx + 1}</Text>
      </View>
      {/* prev */}
      <View style={styles.prevContainer}>
        <Text>{prevStr}</Text>
      </View>
      {/* weight */}
      <View style={styles.weightContainer}>
        <Text style={[styles.weight_reps, calcStyle.weight_reps]}>
          {set.weight}
        </Text>
      </View>
      {/* reps */}
      <View style={styles.repsContainer}>
        <Text style={[styles.weight_reps, calcStyle.weight_reps]}>
          {set.reps}
        </Text>
      </View>
      {/* check */}
      <View style={styles.checkContainer}>
        <TouchableOpacity
          style={[styles.check, calcStyle.check]}
          onPress={onCheckClick}
        ></TouchableOpacity>
      </View>
    </View>
  );
}

const borderRadius = 5;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 5,
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
    height: 20,
    width: 20,
  },
  weight_reps: {
    borderRadius: borderRadius,
  },
});

const calcStyles = (
  scheme: ColorScheme,
  isLocked: boolean,
  finished: boolean,
) =>
  StyleSheet.create({
    container: {
      backgroundColor: finished ? scheme.loQuaternary : "",
    },
    text: {
      color: scheme.primary,
    },
    check: {
      backgroundColor: scheme.quaternary,
    },
    weight_reps: {
      backgroundColor: isLocked ? "" : scheme.primary,
    },
  });
