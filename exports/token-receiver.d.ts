/// <reference types="@leofcoin/types/global" />
import { IVoting } from './voting/interfaces/i-voting.js';
import PublicVoting, { PublicVotingState } from './voting/public-voting.js';
export interface TokenReceiverState extends PublicVotingState {
    tokenToReceive: address;
    tokenReceiver: address;
    tokenAmountToReceive: bigint;
    voteType: 'burn' | 'transfer';
}
export default class TokenReceiver extends PublicVoting implements IVoting {
    #private;
    constructor(tokenToReceive: address, tokenAmountToReceive: bigint, burns: boolean, state?: TokenReceiverState);
    get tokenToReceive(): string;
    get tokenAmountToReceive(): bigint;
    get tokenReceiver(): string;
    get state(): {
        tokenReceiver: string;
        tokenToReceive: string;
        tokenAmountToReceive: bigint;
        voteType: "burn" | "transfer";
        votes: {
            [id: string]: import("./voting/types.js").Vote;
        };
        votingDisabled: boolean;
        votingDuration: number;
        contractCreator: string;
    };
    /**
     * check if sender can pay
     * @returns {boolean} promise
     */
    _canVote(): Promise<boolean>;
    _beforeVote(): Promise<any>;
    /**
     * check if sender can pay
     * @returns {boolean} promise
     */
    _payTokenToReceive(): Promise<boolean>;
    /**
     * check if sender can pay
     * @returns {boolean} promise
     */
    _burnTokenToReceive(): Promise<boolean>;
    _canPay(): Promise<any>;
    changeVoteType(type: TokenReceiverState['voteType']): Promise<void>;
    getTokensOut(amount: bigint, receiver: address): void;
    changeTokenAmountToReceive(): void;
    changeTokenToReceive(): Promise<void>;
}
