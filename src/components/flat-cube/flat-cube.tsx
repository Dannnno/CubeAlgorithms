import React, { useCallback, forwardRef, useImperativeHandle, useState, memo } from 'react';
import styles, { flatCube, cubeSide, cubeValue } from './flat-cube.module.scss';
import { ICube, SlotValue, SIDE_COUNT, SideId, ICubeSideView } from "../../models/geometry.ts";
import { ICubeRef, useDataBoundCube } from "../generic-cube";

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

export const FlatCube = forwardRef<ICubeRef, IFlatCubeProps<number>>((props, ref) => {
	const { cube, styleMap = DEFAULT_STYLE_MAP } = props;
	const size = cube.sideSize;
	const [_, forceRender] = useState(true);

	const cycleCubeState = useCallback((sideId: SideId, rowNum: number, colNum: number) => {
		const value = cube.getValue(sideId, rowNum, colNum);
		cube.setValue(sideId, rowNum, colNum, value >= 6 ? 0 : value = value + 1);
		forceRender(val => !val);
	}, [cube]);

	const onClick = useCallback((event: PointerEvent) => {
		const element = event.target;
		const { sideId, rowNum, colNum } = element.dataset;
		cycleCubeState(+sideId as SideId, +rowNum, +colNum);
	}, [cycleCubeState]);

	const heading = (
		<>
			<h3>I'm a cube</h3>
			<h4>With sides of length {size}</h4>
			<h5>Values:</h5>
		</>
	);

	const sides = [];
	cube.forEachSide(sideView => 
		sides.push(<FlatCubeSide side={sideView} styleMap={styleMap} onClick={onClick} />)
	);
	const cubeValues = (
		<div className={flatCube} style={{["--side-size"]: size}}>
			{...sides}
		</div>
	);

	return (
		<div>
			{heading}
			{cubeValues}
		</div>
	);
});

interface IFlatCubeSideProps<SideSize extends number> {
	readonly side: ICubeSideView<SideSize>;
	readonly styleMap: Record<SlotValue, IValueStyle>;
	readonly onClick: ClickEventHandler;
}

const FlatCubeSide: React.FC<IFlatCubeSideProps> = props => {
	const { side, styleMap, onClick } = props;
	const { sideId, sideSize } = side;
	const values = [];
	side.forEachValue((value, row, col) => {
		values.push(
			<FlatCubeValue 
				size={sideSize} 
				sideId={sideId} 
				styleMap={styleMap} 
				value={value} 
				rowNum={row} 
				colNum={col} 
				onClick={onClick}
			/>
		);
	});

	return (
		<p data-side-id={sideId} className={cubeSide} style={{["--side-size"]: sideSize}}>
			{...values}
		</p>
	);
};

interface IFlatCubeValueProps<SideSize extends number> {
	readonly size: AssertPositive<SideSize>;
	readonly sideId: SideId;
	readonly style: IValueStyle;
	readonly value: SlotValue;
	readonly rowNum: number;
	readonly colNum: number;
	readonly onClick: ClickEventHandler;
	readonly styleMap: Record<SlotValue, IValueStyle>;
}

const FlatCubeValue: React.FC<IFlatCubeValueProps> = props => {
	const { size, sideId, styleMap, value, rowNum, colNum, onClick } = props;
	const { fontColor, color } = styleMap[value] ?? DEFAULT_STYLE_MAP[value];
	const styles = {["--block-color"]: color, ["--block-text-color"]: fontColor};
	return (
		<span 
			data-side-id={sideId}
			data-row-num={rowNum}
			data-col-num={colNum}
			className={cubeValue} 
			style={styles}
			onClick={onClick}
		>
			{1 + rowNum * size + colNum}
		</span>
	);
};

export default FlatCube;
