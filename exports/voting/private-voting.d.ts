/// <reference types="@leofcoin/types/global" />
import { ContractCreatorState } from '../contract-creator.js';
import { IVoting } from './interfaces/i-voting.js';
import { VotingState } from './types.js';
import Voting from './voting.js';
export interface PrivateVotingState extends VotingState, ContractCreatorState {
    voters: address[];
}
export default class PrivateVoting extends Voting implements IVoting {
    #private;
    constructor(state: PrivateVotingState);
    get state(): PrivateVotingState;
    _canVote(): boolean;
    grantVotingPower(address: address, voteId: string): void;
    revokeVotingPower(address: address, voteId: string): void;
}
