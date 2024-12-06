/* tslint:disable */
/* eslint-disable */
/**
* @param {string} name
*/
export function greet(name: string): void;
/**
*/
export function run(): void;
/**
*/
export class GitSession {
  free(): void;
/**
* @param {NodeId} node
* @returns {Promise<string>}
*/
  fetch_node(node: NodeId): Promise<string>;
}
/**
*/
export class HyperAstDb {
  free(): void;
/**
* @param {string} api_addr
*/
  constructor(api_addr: string);
/**
* @returns {GitSession}
*/
  git(): GitSession;
/**
* @returns {ScratchPadSession}
*/
  scratch_pad(): ScratchPadSession;
}
/**
*/
export class NodeId {
  free(): void;
}
/**
*/
export class ScratchPadSession {
  free(): void;
/**
* @param {number} prev
* @param {Float32Array} path
* @param {string} typ
*/
  snap_build(prev: number, path: Float32Array, typ: string): void;
/**
* @param {number} prev
* @param {Float32Array} path
* @param {string} typ
* @param {string} label
*/
  snap_build_with_label(prev: number, path: Float32Array, typ: string, label: string): void;
/**
* @param {number} prev
* @param {Float32Array} path
*/
  snap_build_empty(prev: number, path: Float32Array): void;
/**
* @param {NodeId} node
* @returns {Promise<string>}
*/
  fetch_node(node: NodeId): Promise<string>;
}
