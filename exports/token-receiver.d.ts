export interface TokenReceiverState {
    tokenToReceive: address;
    tokenAmountToReceive: typeof BigNumber;
}
export default class TokenReceiver {
    #private;
    constructor(tokenToReceive: address, tokenAmountToReceive: typeof BigNumber, state: TokenReceiverState);
    get tokenToReceive(): string;
    get tokenAmountToReceive(): import("@ethersproject/bignumber").BigNumber;
    get state(): {
        tokenToReceive: string;
        tokenAmountToReceive: import("@ethersproject/bignumber").BigNumber;
    };
    /**
     * check if sender can pay
     * @returns {boolean} promise
     */
    canPay(): Promise<boolean>;
}
