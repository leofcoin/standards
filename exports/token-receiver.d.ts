import { IPublicVoting } from './voting/interfaces/public-voting.js';
import PublicVoting from './voting/public-voting.js';
import { VotingState } from './voting/types.js';
export interface TokenReceiverState extends VotingState {
    tokenToReceive: address;
    tokenReceiver: address;
    tokenAmountToReceive: typeof BigNumber;
    voteType: 'burn' | 'transfer';
}
export default class TokenReceiver extends PublicVoting implements IPublicVoting {
    #private;
    constructor(tokenToReceive: address, tokenAmountToReceive: typeof BigNumber, burns: boolean, state?: TokenReceiverState);
    get tokenToReceive(): string;
    get tokenAmountToReceive(): import("@ethersproject/bignumber").BigNumber;
    get tokenReceiver(): string;
    get state(): {
        tokenReceiver: string;
        tokenToReceive: string;
        tokenAmountToReceive: import("@ethersproject/bignumber").BigNumber;
        voteType: "burn" | "transfer";
        votes: {
            [id: string]: import("./voting/types.js").Vote;
        };
        votingDisabled: boolean;
        votingDuration: number;
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
    changeVoteType(type: TokenReceiverState['voteType']): Promise<void>;
    getTokensOut(amount: typeof BigNumber, receiver: address): void;
    changeTokenAmountToReceive(): void;
    changeTokenToReceive(): Promise<void>;
}
