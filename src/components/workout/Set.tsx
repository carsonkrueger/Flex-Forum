import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import { Id } from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { useEffect, useMemo, useState } from "react";
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
  const setWeight = useSetStore((s) => s.setWeight);
  const setReps = useSetStore((s) => s.setReps);
  const toggleFinished = useSetStore((s) => s.toggleFinished);
  const calcStyle = useMemo(
    () => calcStyles(scheme, set.finished),
    [scheme, set.finished],
  );

  const calcVolume = (weight?: number, reps?: number): number | undefined => {
    if (weight === undefined || reps === undefined) {
      return undefined;
    }
    return weight * reps;
  };

  const curVolume = useMemo(
    () => calcVolume(set.weight, set.reps),
    [set.weight, set.reps],
  );
  const prevVolume = useMemo(
    () => calcVolume(set.weight, set.reps),
    [set.prevWeight, set.prevReps],
  );

  const onCheckClick = () => {
    if (set.reps === undefined) {
      setReps(set.prevReps, id);
    }
    if (set.weight === undefined) {
      setReps(set.prevWeight, id);
    }
    toggleFinished(id);
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
        <Text style={calcStyle.text}>{prevVolume}</Text>
      </View>

      {/* prev */}
      <View style={styles.prevContainer}>
        <Text style={calcStyle.text}>{curVolume}</Text>
      </View>

      {/* weight */}
      <View style={styles.weightContainer}>
        <TextInput
          value={set.weight?.toString()}
          editable={!set.finished}
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
          multiline={true}
        />
      </View>

      {/* reps */}
      <View style={styles.repsContainer}>
        <TextInput
          value={set.reps?.toString()}
          editable={!set.finished}
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
          multiline={true}
        />
      </View>

      {/* check */}
      <View style={styles.checkContainer}>
        <TouchableOpacity
          style={[styles.check, calcStyle.check]}
          onPress={onCheckClick}
        >
          <Ionicons
            name="checkmark"
            size={28}
            color={set.finished ? scheme.secondary : scheme.primary}
          />
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
    flex: flexWidths.prevVol,
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
      backgroundColor: finished ? scheme.secondary : scheme.primary,
    },
    text: {
      color: finished ? scheme.primary : scheme.tertiary,
    },
    set_prev: {
      color: finished ? scheme.primary : scheme.tertiary,
    },
    check: {
      backgroundColor: finished ? scheme.primary : scheme.quaternary,
    },
    weight_reps: {
      backgroundColor: finished ? scheme.secondary : scheme.secondary,
    },
  });
