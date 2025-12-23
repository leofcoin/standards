import { MetaState } from './types.js';
export default class Meta {
    #private;
    constructor(state?: MetaState);
    /**
     * get state object for snapshotting
     */
    get state(): {};
    get creator(): address;
    get createdAt(): bigint;
}
