import TokenReceiver, { TokenReceiverState } from '../token-receiver.js'
import PrivateVoting from './private-voting.js'

export type VoteResult = 0 | 0.5 | 1

export type PublicVote = {
  title: string
  method: string
  args: any[]
  description: string
  endTime: EpochTimeStamp
  results?: { [address: address]: VoteResult }
  finished?: boolean
  enoughVotes?: boolean
}

export interface PublicVotingState extends TokenReceiverState {
  votes: {
    [id: string]: PublicVote
  }
  votingDisabled: boolean
}
export interface VoteView extends PublicVote {
  id: string
}

/**
 * allows everybody that has a balance greater or equeal then/to tokenAmountToReceive to vote
 */
export default class PublicVoting extends TokenReceiver {
  #votes: PublicVotingState['votes']
  #votingDisabled: boolean

  constructor(tokenToReceive: address, tokenAmountToReceive: typeof BigNumber, state: PublicVotingState) {
    super(tokenToReceive, tokenAmountToReceive, state)
    if (state) {
      this.#votes = state.votes
      this.#votingDisabled = state.votingDisabled
    }
  }

  get votes() {
    return { ...this.#votes }
  }

  get votingDisabled() {
    return this.#votingDisabled
  }

  /**
   *
   */
  get state(): PublicVotingState {
    return { ...super.state, votes: this.#votes, votingDisabled: this.#votingDisabled }
  }

  get inProgress(): VoteView[] {
    return Object.entries(this.#votes)
      .filter(([id, vote]) => !vote.finished)
      .map(([id, vote]) => {
        return { ...vote, id }
      })
  }
  /**
   * create vote
   * @param {string} vote
   * @param {string} description
   * @param {number} endTime
   * @param {string} method function to run when agree amount is bigger
   */

  createVote(title: string, description: string, endTime: EpochTimeStamp, method: string, args: any[] = []) {
    if (!this.canVote(msg.sender)) throw new Error(`Not allowed to create a vote`)
    const id = crypto.randomUUID()
    this.#votes[id] = {
      title,
      description,
      method,
      endTime,
      args
    }
  }

  canVote(address: address) {
    return this.canPay()
  }

  #endVoting(voteId) {
    let agree = Object.values(this.#votes[voteId].results).filter((result) => result === 1)
    let disagree = Object.values(this.#votes[voteId].results).filter((result) => result === 0)
    if (agree.length > disagree.length && this.#votes[voteId].enoughVotes)
      this[this.#votes[voteId].method](...this.#votes[voteId].args)
    this.#votes[voteId].finished = true
  }

  async vote(voteId: string, vote: VoteResult) {
    vote = Number(vote) as VoteResult
    if (vote !== 0 && vote !== 0.5 && vote !== 1) throw new Error(`invalid vote value ${vote}`)
    if (!this.#votes[voteId]) throw new Error(`Nothing found for ${voteId}`)
    const ended = new Date().getTime() > this.#votes[voteId].endTime
    if (ended && !this.#votes[voteId].finished) this.#endVoting(voteId)
    if (ended) throw new Error('voting already ended')
    if (!this.canVote(msg.sender)) throw new Error(`Not allowed to vote`)
    await msg.staticCall(this.tokenToReceive, 'burn', [this.tokenAmountToReceive])
    this.#votes[voteId][msg.sender] = vote
  }

  #disableVoting() {
    this.#votingDisabled = true
  }

  disableVoting() {
    if (!this.canVote(msg.sender)) throw new Error('not a allowed')
    else {
      this.createVote(
        `disable voting`,
        `Warning this disables all voting features forever`,
        new Date().getTime() + 172800000,
        '#disableVoting',
        []
      )
    }
  }

  sync() {
    for (const vote of this.inProgress) {
      if (vote.endTime < new Date().getTime()) this.#endVoting(vote.id)
    }
  }
}
