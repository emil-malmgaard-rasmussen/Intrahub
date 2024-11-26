import React from "react";
import Svg, { Path } from "react-native-svg";

interface ICloseSvg {
    height?: number;
    width?: number;
    color?: string;
    style?: any;
}

const CloseSvg = (props: ICloseSvg) => {
    const { height, width, color, style } = props;

    return (
        <Svg
            height={height ? height : 24}
            width={width ? width : 24}
            style={style}
            viewBox="0 0 24 24"
        >
            <Path
                fill={color}
                d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
        </Svg>
    );
};

export default CloseSvg;
