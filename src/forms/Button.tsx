import { SizeVariant } from "@/util/variants";
import React, { ComponentProps } from "react";
import { StyleSheet, TouchableOpacity} from "react-native";

export type TouchableProps = ComponentProps<typeof TouchableOpacity>;
export type Props = {
    radius: SizeVariant
}

export default function Button(props: TouchableProps & Props) {
    return (
    <TouchableOpacity {...props} style={[styles.button, { borderRadius: radius_style(props.radius)}]}>
        {props.children}
    </TouchableOpacity>
    )
}

function radius_style(v: SizeVariant): number {
    switch (v) {
        case SizeVariant.XL4: return 14;
        case SizeVariant.XL3: return 12;
        case SizeVariant.XL2: return 10;
        case SizeVariant.XL: return 8;
        case SizeVariant.LG: return 6;
        case SizeVariant.SM: return 4;
        case SizeVariant.XS: return 3;
        default:
        case SizeVariant.MD: return 5;
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "black",
        paddingHorizontal: 2,
        paddingVertical: 1,
        borderRadius: 40
    }
})

