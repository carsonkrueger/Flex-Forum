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
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
  TextInputFocusEventData,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import flexWidths from "@/util/setFlexWidths";
import { clamp, toFixedIfNecessary } from "@/util/num";

export type Props = {
  id: Id;
  idx: number;
};

const POSITIVE_NUM_REGEX = new RegExp("^\\d*(\\.\\d+)?$");

export default function Set({ id, idx }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const set = useWorkoutStore((s) => s.sets[id]);
  const setWeight = useWorkoutStore((s) => s.setWeight);
  const setReps = useWorkoutStore((s) => s.setReps);
  const toggleFinished = useWorkoutStore((s) => s.toggleFinished);
  const calcStyle = useMemo(
    () => calcStyles(scheme, set.finished),
    [scheme, set.finished],
  );
  const [tempWeight, setTempWeight] = useState<string | undefined>(
    set.weight?.toString(),
  );
  const [tempReps, setTempReps] = useState<string | undefined>(
    set.reps?.toString(),
  );

  const calcVolume = (weight?: number, reps?: number): number | undefined => {
    if (weight === undefined || reps === undefined) {
      return undefined;
    }
    return toFixedIfNecessary(clamp(weight * reps, 0, 99999), 1);
  };

  const curVolume = useMemo(
    () => calcVolume(set.weight, set.reps),
    [set.weight, set.reps],
  );
  const prevVolume = useMemo(
    () => calcVolume(set.prevWeight, set.prevReps),
    [set.prevWeight, set.prevReps],
  );

  const onCheckClick = () => {
    if (set.reps === undefined) {
      setReps(set.prevReps, id);
      setTempReps(set.prevReps?.toString());
    }
    if (set.weight === undefined) {
      setWeight(set.prevWeight, id);
      setTempWeight(set.prevWeight?.toString());
    }
    toggleFinished(id);
  };

  const OnEndEditingWeight = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => baseSetNum(e.nativeEvent.text, setTempWeight, setWeight);

  const OnEndEditingReps = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
  ) => baseSetNum(e.nativeEvent.text, setTempReps, setReps);

  const baseSetNum = (
    text: string,
    tempSetter: (p1: React.SetStateAction<string | undefined>) => void,
    storeSetter: (p1: number | undefined, p2: Id) => void,
  ) => {
    if (text.length !== 0 && !POSITIVE_NUM_REGEX.test(text)) {
      text = text.replaceAll(".", "");
      text = text.replaceAll("-", "");
      if (text.length !== 0 && !POSITIVE_NUM_REGEX.test(text)) {
        storeSetter(undefined, id);
        tempSetter("");
        return;
      }
    }
    let weight = text.length !== 0 ? Number(text) : undefined;
    storeSetter(weight, id);
    tempSetter(weight?.toString());
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      {/* set index */}
      <View style={styles.setContainer}>
        <Text style={[calcStyle.set_prev, calcStyle.text, styles.text]}>
          {idx + 1}
        </Text>
      </View>

      {/* prev volume */}
      <View style={styles.prevContainer}>
        <Text style={calcStyle.text}>{prevVolume}</Text>
      </View>

      {/* cur volume */}
      <View style={styles.prevContainer}>
        <Text style={calcStyle.text}>{curVolume}</Text>
      </View>

      {/* weight */}
      <View style={styles.weightContainer}>
        <TextInput
          value={tempWeight}
          editable={!set.finished}
          style={[
            styles.weight_reps,
            calcStyle.weight_reps,
            styles.text,
            calcStyle.text,
          ]}
          placeholder={set.prevWeight?.toString()}
          placeholderTextColor={scheme.primary}
          keyboardType="numeric"
          maxLength={5}
          onChangeText={setTempWeight}
          onEndEditing={OnEndEditingWeight}
          multiline={false}
        />
      </View>

      {/* reps */}
      <View style={styles.repsContainer}>
        <TextInput
          value={tempReps}
          editable={!set.finished}
          style={[
            styles.weight_reps,
            calcStyle.weight_reps,
            styles.text,
            calcStyle.text,
          ]}
          placeholder={set.prevReps?.toString()}
          placeholderTextColor={scheme.primary}
          keyboardType="numeric"
          maxLength={5}
          onChangeText={setTempReps}
          onEndEditing={OnEndEditingReps}
          multiline={false}
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
