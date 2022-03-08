import type { FlockParams } from "./FlockParams";
import type { JsAgent } from "./JsAgent";

export interface JsFlock { members: Array<JsAgent>, params: FlockParams<number>, }