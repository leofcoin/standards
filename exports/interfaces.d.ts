export interface MetaState {
    creator: address;
    createdAt: bigint;
}
export declare interface RolesState extends MetaState {
    roles: {
        [index: string]: address[];
    };
}
export declare interface TokenState extends RolesState {
    holders: bigint;
    balances: {
        [address: address]: bigint;
    };
    approvals: {
        [owner: address]: {
            [operator: address]: bigint;
        };
    };
    totalSupply: bigint;
}
export interface VotingState extends MetaState {
    votes: {
        [id: string]: Vote;
    };
    votingDisabled: boolean;
    votingDuration: number;
}
export interface PrivateVotingState extends VotingState {
    voters: address[];
}
export type VoteResult = 0 | 0.5 | 1;
export type Vote = {
    title: string;
    method: string;
    args: any[];
    description: string;
    endTime: EpochTimeStamp;
    results?: {
        [address: string]: VoteResult;
    };
    finished?: boolean;
    enoughVotes?: boolean;
};
export interface VoteView extends Vote {
    id: string;
}
