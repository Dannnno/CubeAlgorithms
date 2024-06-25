import React, { ReducerState, Dispatch, ReducerAction } from "react";
import { useImmerReducer } from "use-immer";
import { Draft } from "immer";

import Cube, { ICube, SideId } from "../../models/geometry.ts";
import { forceNeverType } from "../../scripts/generics.ts";

export interface ICubeRenderState {
	readonly renderMode: CubeRenderMode;
	readonly size: number;
}

export const enum CubeRenderMode {
	FlatTwoD
}

export const enum CubeActionType {
	CycleValue
}

export type CubeAction = ICycleValueCubeAction;

export function useCubeReducer<SideSize extends number>(
	cubeSize: AssertPositive<SideSize>, 
	initialState?: ICube<typeof cubeSize>,
): [ReducerState<typeof reduceCube<SideSize>>, Dispatch<ReducerAction<typeof reduceCube<SideSize>>] {
	const startState = initialState ?? new Cube(cubeSize);
	return useImmerReducer(reduceCube, startState);
}

function reduceCube<SideSize extends number>(cubeDraft: Draft<ICube<SideSize>>, action: CubeAction): Draft<ICube<SideSize>> {

}

interface ICubeActionBase<TActionType extends CubeActionType = CubeActionType> {
	readonly type: TActionType;
}

interface ICycleValueCubeAction extends ICubeActionBase<CubeActionType.CycleValue> {
	readonly sideId: SideId;
	readonly rowNum: number;
	readonly colNum: number;
}
