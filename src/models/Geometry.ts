import { AssertPositive, LoopResult } from "../scripts/generics.ts";
import { assertIsClamped } from "../scripts/math.ts";

export interface ICube<SideSize extends number> {
	readonly sideSize: AssertPositive<SideSize>;

	getValue(sideId: SideId, rowNum: number, colNum: number): SlotValue;

	setValue(sideId: SideId, rowNum: number, colNum: number, value: SlotValue): void;

	forEachSide(callback: (sideView: ICubeSideView<SideSize>) => LoopResult | void): LoopResult;

	forEachValue(callback: (value: SlotValue, sideId: SideId, rowNum: number, colNum: number) => LoopResult | void): LoopResult;

	viewSide(sideId: SideId): ICubeSideView<SideSize>;

	checkSide(sideId: SideId): boolean;

	checkCube(): boolean;
}

export interface ICubeSideView<SideSize extends number> {
	readonly sideSize: AssertPositive<SideSize>;
	readonly sideId: SideId;

	check(): boolean;

	getValue(rowNum: number, colNum: number): SlotValue;

	setValue(rowNum: number, colNum: number, value: SlotValue): void;

	forEachValue(callback: (value: SlotValue, rowNum: number, colNum: number) => LoopResult | void): LoopResult;
}

export class Cube<SideSize extends number> implements ICube<SideSize> {
	public readonly sideSize: AssertPositive<SideSize>;
	private _sides: SlotValue[];

	public constructor(sideSize: AssertPositive<SideSize>) {
		this.sideSize = sideSize;
		this._sides = Array.from({length: SIDE_COUNT * this._sideBlockCount}, (_, ix) => this._getSideFromIndex(ix) + 1);
	}

	public getValue(sideId: SideId, rowNum: number, colNum: number): SlotValue {
		const index = this._coordsToIx(sideId, rowNum, colNum);
		return this._sides[index];
	}
	
	public setValue(sideId: SideId, rowNum: number, colNum: number, value: SlotValue): void {
		const index = this._coordsToIx(sideId, rowNum, colNum);
		this._sides[index] = value;
	}

	public checkSide(sideId: SideId): boolean {
		const [startIx, endIx] = this._getSideIndexRange(sideId);
		const compareTo = this._sides[startIx];
		return this._sides.slice(startIx, endIx).every(val => val === compareTo);
	}

	public checkCube(): boolean {
		return Array.from({length: SIDE_COUNT}, (_, ix) => ix).every(sideId => this.checkSide(sideId as SideId));
	}

	public forEachSide(callback: (sideView: ICubeSideView<SideSize>) => LoopResult | void): LoopResult {
		for (let sideId = 0; sideId < SIDE_COUNT; ++sideId) {
			if (callback(this.viewSide(sideId as SideId)) === LoopResult.StopLooping) {
				return LoopResult.StopLooping;
			}
		}
		return LoopResult.KeepLooping;
	}

	public forEachValue(callback: (value: SlotValue, sideId: SideId, rowNum: number, colNum: number) => LoopResult | void): LoopResult {
		for (let ix = 0; ix < this._sides.length; ++ix) {
			const [sideId, rowNum, colNum] = this._ixToCoords(ix);
			if (callback(this._sides[ix], sideId, rowNum, colNum) === LoopResult.StopLooping) {
				return LoopResult.StopLooping;
			}
		}
		return LoopResult.KeepLooping;
	}

	public viewSide(sideId: SideId): ICubeSideView<SideSize> {
		return {
			sideSize: this.sideSize,
			sideId,
			check: () => this.checkSide(sideId),
			getValue: (rowNum: number, colNum: number) => this.getValue(sideId, rowNum, colNum),
			setValue: (rowNum: number, colNum: number, value: SlotValue) => this.setValue(sideId, rowNum, colNum, value),
			forEachValue: (callback: (value: SlotValue, rowNum: number, colNum: number) => LoopResult | void): LoopResult => {
				const [startIx, endIx] = this._getSideIndexRange(sideId);
				for (let ix = startIx; ix < endIx; ++ix) {
					const [_, rowNum, colNum] = this._ixToCoords(ix);
					if (callback(this._sides[ix], rowNum, colNum) === LoopResult.StopLooping) {
						return LoopResult.StopLooping;
					}
				}
				return LoopResult.KeepLooping;
			}
		}
	}

	private _getSideIndexRange(sideId: SideId): [number, number] {
		const startIx = this._coordsToIx(sideId, 0, 0);
		const endIx = sideId === 5 ? this._sides.length : this._coordsToIx((sideId + 1) as SideId, 0, 0);
		return [startIx, endIx];
	}

	private get _sideBlockCount(): number {
		return this.sideSize * this.sideSize;
	}

	private _getSideFromIndex(index: number): SideId {
		return this._ixToCoords(index)[0];
	}

	private _getRowFromIndex(index: number): number {
		return this._ixToCoords(index)[1];
	}

	private _getColFromIndex(index: number): number {
		return this._ixToCoords(index)[2];
	}

	private _coordsToIx(sideId: SideId, rowNum: number, colNum: number): number {
		this._checkCoordinates(sideId, rowNum, colNum);
		return sideId * this._sideBlockCount + rowNum * this.sideSize + colNum;
	}

	private _ixToCoords(index: number): [SideId, number, number] {
		const sideBlockSize = this._sideBlockCount;
		const sideLength = this.sideSize;

		const sideId = Math.floor(index / sideBlockSize) as SideId;

		const offset = index % sideBlockSize;
		const rowNum = Math.floor(offset / sideLength);
		const colNum = offset % sideLength;

		this._checkCoordinates(sideId, rowNum, colNum);
		return [sideId, rowNum, colNum];
	}

	private _checkCoordinates(sideId: SideId, rowNum: number, colNum: number): void {
		assertIsClamped(sideId, 0, SIDE_COUNT, "sideId");
		const sideLength = this.sideSize;
		assertIsClamped(rowNum, 0, sideLength, "rowNum");
		assertIsClamped(colNum, 0, sideLength, "colNum");
	}
}

export const SIDE_COUNT = 6;
export type SideId = 0 | 1 | 2 | 3 | 4 | 5;
export type SlotValue = 1 | 2 | 3 | 4 | 5 | 6;
export type CubeSides = readonly [ICubeSide, ICubeSide, ICubeSide, ICubeSide, ICubeSide, ICubeSide];

export default Cube;