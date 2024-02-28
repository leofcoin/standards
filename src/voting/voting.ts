import ContractCreator, { ContractCreatorState } from '../contract-creator.js'
import { Vote, VoteResult, VoteView, VotingState } from './types.js'
export default class Voting extends ContractCreator {
  #votes: VotingState['votes'] = {}
  #votingDisabled: boolean = false
  #votingDuration: number = 172800000
  constructor(state) {
    super(state)
    if (state) {
      this.#votes = state.votes
      this.#votingDisabled = state.votingDisabled
      this.#votingDuration = state.votingDuration
    }
  }

  get votes() {
    return { ...this.#votes }
  }

  get votingDuration() {
    return this.#votingDuration
  }

  get votingDisabled() {
    return this.#votingDisabled
  }

  get state() {
    return {
      ...super.state,
      votingDisabled: this.#votingDisabled,
      votingDuration: this.#votingDuration
    }
  }

  #canVote() {
    // @ts-expect-error
    return this._canVote?.()
  }

  #beforeVote() {
    // @ts-expect-error
    return this._beforeVote?.()
  }

  #afterVote() {
    // @ts-expect-error
    return this._afterVote?.()
  }

  /**
   * create vote
   * @param {string} vote
   * @param {string} description
   * @param {number} endTime
   * @param {string} method function to run when agree amount is bigger
   */
  createVote(title: string, description: string, endTime: EpochTimeStamp, method: string, args: any[] = []) {
    if (!this.#canVote()) throw new Error(`Not allowed to create a vote`)
    const id = crypto.randomUUID()
    this.#votes[id] = {
      title,
      description,
      method,
      endTime,
      args
    }
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
    if (!this.#canVote()) throw new Error(`Not allowed to vote`)
    await this.#beforeVote()

    this.#votes[voteId][msg.sender] = vote
    await this.#afterVote()
  }

  get votesInProgress() {
    return Object.entries(this.#votes)
      .filter(([id, vote]) => !vote.finished)
      .map(([id, vote]) => {
        return { ...vote, id }
      })
  }
  #disableVoting() {
    this.#votingDisabled = true
  }

  disableVoting() {
    if (!this.#canVote()) throw new Error('not a allowed')
    else {
      this.createVote(
        `disable voting`,
        `Warning this disables all voting features forever`,
        new Date().getTime() + this.#votingDuration,
        '#disableVoting',
        []
      )
    }
  }

  _sync() {
    for (const vote of this.votesInProgress) {
      if (vote.endTime < new Date().getTime()) this.#endVoting(vote.id)
    }
  }
}
