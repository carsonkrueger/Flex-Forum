import Svg, { G, Rect, Defs } from "react-native-svg";

export type Props = {
  fill: string;
};

export default function Icon({ fill }: Props) {
  return (
    <Svg
      width="20.944235mm"
      height="20.944233mm"
      viewBox="0 0 20.944234 20.944233"
      id="svg1"
      // xmlns="http://www.w3.org/2000/svg"
    >
      {/* <Defs
       id="defs1" /> */}
      <G id="layer1" transform="translate(-4.5823533,-3.6284616)">
        <Rect
          // style="fill:#ff5555;stroke-width:0.291296"
          fill={fill}
          strokeWidth={0.291296}
          id="rect3"
          width="28.018867"
          height="3.8525946"
          x="-13.33493"
          y="18.689436"
          ry="1.9262972"
          transform="rotate(-45)"
        />
        <Rect
          // style="fill:#ff5555;stroke-width:0.110443"
          fill={fill}
          strokeWidth={0.11443}
          id="rect3-7"
          width="4.0277123"
          height="3.8525946"
          x="-1.3393526"
          y="30.685013"
          ry="1.9262972"
          transform="rotate(-45)"
        />
        <Rect
          // style="fill:#ff5555;stroke-width:0.218559"
          fill={fill}
          strokeWidth={0.218559}
          id="rect3-6"
          width="15.77306"
          height="3.8525946"
          x="-7.2120266"
          y="24.81234"
          ry="1.9262972"
          transform="rotate(-45)"
        />
      </G>
    </Svg>
  );
}
