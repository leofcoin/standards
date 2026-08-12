// when state is stored it get encoded as a string to  so we need to reformat balances back to BigInts
const restoreBalances = (balances) => {
    const _balances = {};
    for (const address in balances) {
        _balances[address] = BigInt(balances[address]);
    }
    return _balances;
};
const restoreApprovals = (approvals) => {
    const _approvals = {};
    for (const owner in approvals) {
        _approvals[owner] = {};
        for (const operator in approvals[owner]) {
            _approvals[owner][operator] = BigInt(approvals[owner][operator]);
        }
    }
    return _approvals;
};
/** Consensus time only. Before genesis the deterministic timestamp is zero. */
const chainTimestamp = () => {
    const timestamp = Number(typeof state === 'undefined' ? 0 : state?.lastBlock?.timestamp ?? 0);
    if (!Number.isSafeInteger(timestamp) || timestamp < 0)
        throw new Error('invalid chain timestamp');
    return timestamp;
};

export { chainTimestamp, restoreApprovals, restoreBalances };
