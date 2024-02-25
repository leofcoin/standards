export type VoteResult = 0 | 0.5 | 1;
export type Vote = {
    title: string;
    method: string;
    args: any[];
    description: string;
    endTime: EpochTimeStamp;
    results?: {
        [address: address]: VoteResult;
    };
    finished?: boolean;
    enoughVotes?: boolean;
};
export type VotingState = {
    voters: address[];
    votes: {
        [id: string]: Vote;
    };
    votingDisabled: boolean;
};
export interface VoteView extends Vote {
    id: string;
}
export default class Voting {
    #private;
    constructor(state: VotingState);
    get votes(): {
        [x: string]: Vote;
    };
    get voters(): {
        [x: number]: string;
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): string;
        push(...items: string[]): number;
        concat(...items: ConcatArray<string>[]): string[];
        concat(...items: (string | ConcatArray<string>)[]): string[];
        join(separator?: string): string;
        reverse(): string[];
        shift(): string;
        slice(start?: number, end?: number): string[];
        sort(compareFn?: (a: string, b: string) => number): string[];
        splice(start: number, deleteCount?: number): string[];
        splice(start: number, deleteCount: number, ...items: string[]): string[];
        unshift(...items: string[]): number;
        indexOf(searchElement: string, fromIndex?: number): number;
        lastIndexOf(searchElement: string, fromIndex?: number): number;
        every<S extends string>(predicate: (value: string, index: number, array: string[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any): U[];
        filter<S_1 extends string>(predicate: (value: string, index: number, array: string[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
        reduce(callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
        reduce(callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: string, currentIndex: number, array: string[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
        reduceRight(callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: string, currentIndex: number, array: string[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends string>(predicate: (value: string, index: number, obj: string[]) => value is S_2, thisArg?: any): S_2;
        find(predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string;
        findIndex(predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): number;
        fill(value: string, start?: number, end?: number): string[];
        copyWithin(target: number, start: number, end?: number): string[];
        entries(): IterableIterator<[number, string]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<string>;
        includes(searchElement: string, fromIndex?: number): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U_3 | readonly U_3[], thisArg?: This): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D): FlatArray<A, D>[];
        at(index: number): string;
        [Symbol.iterator](): IterableIterator<string>;
        [Symbol.unscopables]: {
            [x: number]: boolean;
            length?: boolean;
            toString?: boolean;
            toLocaleString?: boolean;
            pop?: boolean;
            push?: boolean;
            concat?: boolean;
            join?: boolean;
            reverse?: boolean;
            shift?: boolean;
            slice?: boolean;
            sort?: boolean;
            splice?: boolean;
            unshift?: boolean;
            indexOf?: boolean;
            lastIndexOf?: boolean;
            every?: boolean;
            some?: boolean;
            forEach?: boolean;
            map?: boolean;
            filter?: boolean;
            reduce?: boolean;
            reduceRight?: boolean;
            find?: boolean;
            findIndex?: boolean;
            fill?: boolean;
            copyWithin?: boolean;
            entries?: boolean;
            keys?: boolean;
            values?: boolean;
            includes?: boolean;
            flatMap?: boolean;
            flat?: boolean;
            at?: boolean;
            [Symbol.iterator]?: boolean;
            readonly [Symbol.unscopables]?: boolean;
        };
    };
    get votingDisabled(): boolean;
    /**
     *
     */
    get state(): {};
    get inProgress(): VoteView[];
    /**
     * create vote
     * @param {string} vote
     * @param {string} description
     * @param {number} endTime
     * @param {string} method function to run when agree amount is bigger
     */
    createVote(title: string, description: string, endTime: EpochTimeStamp, method: string, args?: any[]): void;
    canVote(address: address): boolean;
    vote(voteId: string, vote: VoteResult): void;
    disableVoting(): void;
    grantVotingPower(address: address, voteId: string): void;
    revokeVotingPower(address: address, voteId: string): void;
    sync(): void;
}
