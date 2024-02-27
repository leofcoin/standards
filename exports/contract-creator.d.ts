export type ContractCreatorState = {
    contractCreator: address;
};
export default class ContractCreator {
    #private;
    constructor(state: ContractCreatorState);
    get _contractCreator(): string;
    get state(): ContractCreatorState;
    get _isContractCreator(): boolean;
}
