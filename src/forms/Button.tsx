import { SizeVariant } from "@/util/variants";
import React, { ComponentProps } from "react";
import { StyleSheet, TouchableOpacity, Text} from "react-native";

export type TouchableProps = ComponentProps<typeof TouchableOpacity>;
export type Props = {
    radius?: SizeVariant
    text?: string
    textEnd?: boolean
}

export default function Button(props: TouchableProps & Props) {
    return (
    <TouchableOpacity style={[styles.button, { borderRadius: radiusSize(props.radius)}]} {...props}>
        {props.textEnd && !props.textEnd && <Text>{props.text}</Text>}
        {props.children}
        {props.textEnd && props.textEnd && <Text>{props.text}</Text>}
    </TouchableOpacity>
    )
}

function radiusSize(v?: SizeVariant): number {
    switch (v) {
        case SizeVariant.XL4: return 16;
        case SizeVariant.XL3: return 14;
        case SizeVariant.XL2: return 12;
        case SizeVariant.XL: return 10;
        case SizeVariant.LG: return 8;
        case SizeVariant.SM: return 4;
        case SizeVariant.XS: return 2;
        default:
        case SizeVariant.MD: return 6;
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

