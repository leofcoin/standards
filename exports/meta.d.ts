export interface MetaState {
    creator: address;
    createdAt: bigint;
}
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
