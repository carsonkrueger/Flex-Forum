import ContentModel, {
  downloadContent,
  WorkoutSummary,
} from "@/models/content-model";
import useSettingsStore from "@/stores/settings";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export type Props = {
  contentModel: ContentModel;
  width: number;
  aspectRatio?: number;
};

export default function PostImage({
  contentModel,
  width,
  aspectRatio = 1,
}: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  // const calcStyle = useMemo(
  //   () => calcStyles(width, aspectRatio, scheme),
  //   [scheme],
  // );
  const [workout, setWorkout] = useState<WorkoutSummary | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    downloadContent(contentModel, "json").then((data) => {
      let fr = new FileReader();
      fr.onload = () => {
        setWorkout(JSON.parse(fr.result as any));
      };
      fr.readAsText(data);
    });
  }, []);

  return <>{workout && <Text>{workout.workout_name}</Text>}</>;
}
