declare const state: { lastBlock?: { timestamp?: number } } | undefined

// when state is stored it get encoded as a string to  so we need to reformat balances back to BigInts
export const restoreBalances = (balances) => {
  const _balances = {}
  for (const address in balances) {
    _balances[address] = BigInt(balances[address])
  }
  return _balances
}

export const restoreApprovals = (approvals) => {
  const _approvals = {}
  for (const owner in approvals) {
    _approvals[owner] = {}
    for (const operator in approvals[owner]) {
      _approvals[owner][operator] = BigInt(approvals[owner][operator])
    }
  }
  return _approvals
}

/** Consensus time only. Before genesis the deterministic timestamp is zero. */
export const chainTimestamp = (): number => {
  const timestamp = Number(typeof state === 'undefined' ? 0 : state?.lastBlock?.timestamp ?? 0)
  if (!Number.isSafeInteger(timestamp) || timestamp < 0) throw new Error('invalid chain timestamp')
  return timestamp
}
