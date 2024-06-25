import React, { useState, useImperativeHandle } from 'react';
import { ICube, SideId } from "../../models/geometry.ts";

export interface ICubeRef<SideSize extends number> {
	cycleValue(sideId: SideId, rowNum: number, colNum: number): void;
}

export function useDataBoundCube<SideSize extends number>(cube: ICube<SideSize>, ref: React.RefObject<unknown>): void {
	const cubeRef = useRef(cube);
	useImperativeHandle(ref, () => {
		return {
			cycleValue: (sideId: SideId, rowNum: number, colNum: number): void => {
				const safeCube = cubeRef.current;
				if (!safeCube) {
					return;
				}
				const value = safeCube.getValue(sideId, rowNum, colNum);
				// this works b/c value is actually 1-indexed, so this will always make sure we have a safe value in range [1, 6]
				safeCube.setValue(sideId, rowNum, colNum, (value % 6) + 1);
			}
		}
	});
}
