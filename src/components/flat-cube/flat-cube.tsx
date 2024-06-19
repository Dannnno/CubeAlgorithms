import React, { useState, useCallback } from 'react';
import styles, { flatCube, cubeSide, cubeValue } from './flat-cube.module.scss';
import { ICube, SlotValue, SIDE_COUNT, SideId } from "../../models/geometry.ts";

interface IFlatCubeProps<SideSize extends number> {
	readonly cube: ICube<SideSize>;

	readonly styleMap?: Record<SlotValue, IValueStyle>;
}

interface IValueStyle {
	readonly color: string;
	readonly fontColor: string;
}

const DEFAULT_STYLE_MAP: Record<SlotValue, IValueStyle> = {
	[1]: { fontColor: "black", color: "red" },
	[2]: { fontColor: "black", color: "white" },
	[3]: { fontColor: "black", color: "orange" },
	[4]: { fontColor: "black", color: "cyan" },
	[5]: { fontColor: "black", color: "green" },
	[6]: { fontColor: "black", color: "yellow" },
};

export const FlatCube: React.FC<IFlatCubeProps> = props => {
	const { cube, styleMap = DEFAULT_STYLE_MAP} = props;
	const size = cube.sideSize;

	const heading = (
		<>
			<h3>I'm a cube</h3>
			<h4>With sides of length {size}</h4>
			<h5>Values:</h5>
		</>
	);

	const cubeSideStyles = {["--side-size"]: size};
	const sides = [];
	for (let sideId = 0; sideId < SIDE_COUNT; ++sideId) {
		const side = [];
		for (let rowNum = 0; rowNum < size; ++rowNum) {
			for (let colNum = 0; colNum < size; ++colNum) {
				const value = cube.getValue(sideId, rowNum, colNum);
				const { fontColor, color } = styleMap[value] ?? DEFAULT_STYLE_MAP[value];
				const styles = {["--block-color"]: color, ["--block-text-color"]: fontColor};
				side.push(<span className={cubeValue} style={styles}>{1 + rowNum * size + colNum}</span>);
			}
		}
		sides.push(<p className={cubeSide} style={cubeSideStyles}>{...side}</p>);
	}
	const cubeValues = (
		<div className={flatCube} style={cubeSideStyles}>
			{...sides}
		</div>
	);

	return (
		<div>
			{heading}
			{cubeValues}
		</div>
	);
};

export default FlatCube;
