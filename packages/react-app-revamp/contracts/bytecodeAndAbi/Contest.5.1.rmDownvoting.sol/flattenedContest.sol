// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.0 ^0.8.1 ^0.8.19;

// lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol

// OpenZeppelin Contracts (last updated v4.9.0) (token/ERC20/IERC20.sol)

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

// lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol

// OpenZeppelin Contracts (last updated v4.9.4) (token/ERC20/extensions/IERC20Permit.sol)

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 *
 * ==== Security Considerations
 *
 * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
 * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
 * considered as an intention to spend the allowance in any specific way. The second is that because permits have
 * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
 * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
 * generally recommended is:
 *
 * ```solidity
 * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
 *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
 *     doThing(..., value);
 * }
 *
 * function doThing(..., uint256 value) public {
 *     token.safeTransferFrom(msg.sender, address(this), value);
 *     ...
 * }
 * ```
 *
 * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
 * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
 * {SafeERC20-safeTransferFrom}).
 *
 * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
 * contracts should have entry points that don't rely on permit.
 */
interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     *
     * CAUTION: See Security Considerations above.
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}

// lib/openzeppelin-contracts/contracts/utils/Address.sol

// OpenZeppelin Contracts (last updated v4.9.0) (utils/Address.sol)

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

// lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol

// OpenZeppelin Contracts (last updated v4.9.2) (utils/cryptography/MerkleProof.sol)

/**
 * @dev These functions deal with verification of Merkle Tree proofs.
 *
 * The tree and the proofs can be generated using our
 * https://github.com/OpenZeppelin/merkle-tree[JavaScript library].
 * You will find a quickstart guide in the readme.
 *
 * WARNING: You should avoid using leaf values that are 64 bytes long prior to
 * hashing, or use a hash function other than keccak256 for hashing leaves.
 * This is because the concatenation of a sorted pair of internal nodes in
 * the merkle tree could be reinterpreted as a leaf value.
 * OpenZeppelin's JavaScript library generates merkle trees that are safe
 * against this attack out of the box.
 */
library MerkleProof {
    /**
     * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
     * defined by `root`. For this, a `proof` must be provided, containing
     * sibling hashes on the branch from the leaf to the root of the tree. Each
     * pair of leaves and each pair of pre-images are assumed to be sorted.
     */
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    /**
     * @dev Calldata version of {verify}
     *
     * _Available since v4.7._
     */
    function verifyCalldata(bytes32[] calldata proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProofCalldata(proof, leaf) == root;
    }

    /**
     * @dev Returns the rebuilt hash obtained by traversing a Merkle tree up
     * from `leaf` using `proof`. A `proof` is valid if and only if the rebuilt
     * hash matches the root of the tree. When processing the proof, the pairs
     * of leafs & pre-images are assumed to be sorted.
     *
     * _Available since v4.4._
     */
    function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    /**
     * @dev Calldata version of {processProof}
     *
     * _Available since v4.7._
     */
    function processProofCalldata(bytes32[] calldata proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    /**
     * @dev Returns true if the `leaves` can be simultaneously proven to be a part of a merkle tree defined by
     * `root`, according to `proof` and `proofFlags` as described in {processMultiProof}.
     *
     * CAUTION: Not all merkle trees admit multiproofs. See {processMultiProof} for details.
     *
     * _Available since v4.7._
     */
    function multiProofVerify(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProof(proof, proofFlags, leaves) == root;
    }

    /**
     * @dev Calldata version of {multiProofVerify}
     *
     * CAUTION: Not all merkle trees admit multiproofs. See {processMultiProof} for details.
     *
     * _Available since v4.7._
     */
    function multiProofVerifyCalldata(
        bytes32[] calldata proof,
        bool[] calldata proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProofCalldata(proof, proofFlags, leaves) == root;
    }

    /**
     * @dev Returns the root of a tree reconstructed from `leaves` and sibling nodes in `proof`. The reconstruction
     * proceeds by incrementally reconstructing all inner nodes by combining a leaf/inner node with either another
     * leaf/inner node or a proof sibling node, depending on whether each `proofFlags` item is true or false
     * respectively.
     *
     * CAUTION: Not all merkle trees admit multiproofs. To use multiproofs, it is sufficient to ensure that: 1) the tree
     * is complete (but not necessarily perfect), 2) the leaves to be proven are in the opposite order they are in the
     * tree (i.e., as seen from right to left starting at the deepest layer and continuing at the next layer).
     *
     * _Available since v4.7._
     */
    function processMultiProof(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        // This function rebuilds the root hash by traversing the tree up from the leaves. The root is rebuilt by
        // consuming and producing values on a queue. The queue starts with the `leaves` array, then goes onto the
        // `hashes` array. At the end of the process, the last hash in the `hashes` array should contain the root of
        // the merkle tree.
        uint256 leavesLen = leaves.length;
        uint256 proofLen = proof.length;
        uint256 totalHashes = proofFlags.length;

        // Check proof validity.
        require(leavesLen + proofLen - 1 == totalHashes, "MerkleProof: invalid multiproof");

        // The xxxPos values are "pointers" to the next value to consume in each array. All accesses are done using
        // `xxx[xxxPos++]`, which return the current value and increment the pointer, thus mimicking a queue's "pop".
        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;
        // At each step, we compute the next hash using two values:
        // - a value from the "main queue". If not all leaves have been consumed, we get the next leaf, otherwise we
        //   get the next hash.
        // - depending on the flag, either another value from the "main queue" (merging branches) or an element from the
        //   `proof` array.
        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        if (totalHashes > 0) {
            require(proofPos == proofLen, "MerkleProof: invalid multiproof");
            unchecked {
                return hashes[totalHashes - 1];
            }
        } else if (leavesLen > 0) {
            return leaves[0];
        } else {
            return proof[0];
        }
    }

    /**
     * @dev Calldata version of {processMultiProof}.
     *
     * CAUTION: Not all merkle trees admit multiproofs. See {processMultiProof} for details.
     *
     * _Available since v4.7._
     */
    function processMultiProofCalldata(
        bytes32[] calldata proof,
        bool[] calldata proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        // This function rebuilds the root hash by traversing the tree up from the leaves. The root is rebuilt by
        // consuming and producing values on a queue. The queue starts with the `leaves` array, then goes onto the
        // `hashes` array. At the end of the process, the last hash in the `hashes` array should contain the root of
        // the merkle tree.
        uint256 leavesLen = leaves.length;
        uint256 proofLen = proof.length;
        uint256 totalHashes = proofFlags.length;

        // Check proof validity.
        require(leavesLen + proofLen - 1 == totalHashes, "MerkleProof: invalid multiproof");

        // The xxxPos values are "pointers" to the next value to consume in each array. All accesses are done using
        // `xxx[xxxPos++]`, which return the current value and increment the pointer, thus mimicking a queue's "pop".
        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;
        // At each step, we compute the next hash using two values:
        // - a value from the "main queue". If not all leaves have been consumed, we get the next leaf, otherwise we
        //   get the next hash.
        // - depending on the flag, either another value from the "main queue" (merging branches) or an element from the
        //   `proof` array.
        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        if (totalHashes > 0) {
            require(proofPos == proofLen, "MerkleProof: invalid multiproof");
            unchecked {
                return hashes[totalHashes - 1];
            }
        } else if (leavesLen > 0) {
            return leaves[0];
        } else {
            return proof[0];
        }
    }

    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? _efficientHash(a, b) : _efficientHash(b, a);
    }

    function _efficientHash(bytes32 a, bytes32 b) private pure returns (bytes32 value) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }
}

// lib/openzeppelin-contracts/contracts/utils/math/SafeCast.sol

// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/SafeCast.sol)
// This file was procedurally generated from scripts/generate/templates/SafeCast.js.

/**
 * @dev Wrappers over Solidity's uintXX/intXX casting operators with added overflow
 * checks.
 *
 * Downcasting from uint256/int256 in Solidity does not revert on overflow. This can
 * easily result in undesired exploitation or bugs, since developers usually
 * assume that overflows raise errors. `SafeCast` restores this intuition by
 * reverting the transaction when such an operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 *
 * Can be combined with {SafeMath} and {SignedSafeMath} to extend it to smaller types, by performing
 * all math on `uint256` and `int256` and then downcasting.
 */
library SafeCast {
    /**
     * @dev Returns the downcasted uint248 from uint256, reverting on
     * overflow (when the input is greater than largest uint248).
     *
     * Counterpart to Solidity's `uint248` operator.
     *
     * Requirements:
     *
     * - input must fit into 248 bits
     *
     * _Available since v4.7._
     */
    function toUint248(uint256 value) internal pure returns (uint248) {
        require(value <= type(uint248).max, "SafeCast: value doesn't fit in 248 bits");
        return uint248(value);
    }

    /**
     * @dev Returns the downcasted uint240 from uint256, reverting on
     * overflow (when the input is greater than largest uint240).
     *
     * Counterpart to Solidity's `uint240` operator.
     *
     * Requirements:
     *
     * - input must fit into 240 bits
     *
     * _Available since v4.7._
     */
    function toUint240(uint256 value) internal pure returns (uint240) {
        require(value <= type(uint240).max, "SafeCast: value doesn't fit in 240 bits");
        return uint240(value);
    }

    /**
     * @dev Returns the downcasted uint232 from uint256, reverting on
     * overflow (when the input is greater than largest uint232).
     *
     * Counterpart to Solidity's `uint232` operator.
     *
     * Requirements:
     *
     * - input must fit into 232 bits
     *
     * _Available since v4.7._
     */
    function toUint232(uint256 value) internal pure returns (uint232) {
        require(value <= type(uint232).max, "SafeCast: value doesn't fit in 232 bits");
        return uint232(value);
    }

    /**
     * @dev Returns the downcasted uint224 from uint256, reverting on
     * overflow (when the input is greater than largest uint224).
     *
     * Counterpart to Solidity's `uint224` operator.
     *
     * Requirements:
     *
     * - input must fit into 224 bits
     *
     * _Available since v4.2._
     */
    function toUint224(uint256 value) internal pure returns (uint224) {
        require(value <= type(uint224).max, "SafeCast: value doesn't fit in 224 bits");
        return uint224(value);
    }

    /**
     * @dev Returns the downcasted uint216 from uint256, reverting on
     * overflow (when the input is greater than largest uint216).
     *
     * Counterpart to Solidity's `uint216` operator.
     *
     * Requirements:
     *
     * - input must fit into 216 bits
     *
     * _Available since v4.7._
     */
    function toUint216(uint256 value) internal pure returns (uint216) {
        require(value <= type(uint216).max, "SafeCast: value doesn't fit in 216 bits");
        return uint216(value);
    }

    /**
     * @dev Returns the downcasted uint208 from uint256, reverting on
     * overflow (when the input is greater than largest uint208).
     *
     * Counterpart to Solidity's `uint208` operator.
     *
     * Requirements:
     *
     * - input must fit into 208 bits
     *
     * _Available since v4.7._
     */
    function toUint208(uint256 value) internal pure returns (uint208) {
        require(value <= type(uint208).max, "SafeCast: value doesn't fit in 208 bits");
        return uint208(value);
    }

    /**
     * @dev Returns the downcasted uint200 from uint256, reverting on
     * overflow (when the input is greater than largest uint200).
     *
     * Counterpart to Solidity's `uint200` operator.
     *
     * Requirements:
     *
     * - input must fit into 200 bits
     *
     * _Available since v4.7._
     */
    function toUint200(uint256 value) internal pure returns (uint200) {
        require(value <= type(uint200).max, "SafeCast: value doesn't fit in 200 bits");
        return uint200(value);
    }

    /**
     * @dev Returns the downcasted uint192 from uint256, reverting on
     * overflow (when the input is greater than largest uint192).
     *
     * Counterpart to Solidity's `uint192` operator.
     *
     * Requirements:
     *
     * - input must fit into 192 bits
     *
     * _Available since v4.7._
     */
    function toUint192(uint256 value) internal pure returns (uint192) {
        require(value <= type(uint192).max, "SafeCast: value doesn't fit in 192 bits");
        return uint192(value);
    }

    /**
     * @dev Returns the downcasted uint184 from uint256, reverting on
     * overflow (when the input is greater than largest uint184).
     *
     * Counterpart to Solidity's `uint184` operator.
     *
     * Requirements:
     *
     * - input must fit into 184 bits
     *
     * _Available since v4.7._
     */
    function toUint184(uint256 value) internal pure returns (uint184) {
        require(value <= type(uint184).max, "SafeCast: value doesn't fit in 184 bits");
        return uint184(value);
    }

    /**
     * @dev Returns the downcasted uint176 from uint256, reverting on
     * overflow (when the input is greater than largest uint176).
     *
     * Counterpart to Solidity's `uint176` operator.
     *
     * Requirements:
     *
     * - input must fit into 176 bits
     *
     * _Available since v4.7._
     */
    function toUint176(uint256 value) internal pure returns (uint176) {
        require(value <= type(uint176).max, "SafeCast: value doesn't fit in 176 bits");
        return uint176(value);
    }

    /**
     * @dev Returns the downcasted uint168 from uint256, reverting on
     * overflow (when the input is greater than largest uint168).
     *
     * Counterpart to Solidity's `uint168` operator.
     *
     * Requirements:
     *
     * - input must fit into 168 bits
     *
     * _Available since v4.7._
     */
    function toUint168(uint256 value) internal pure returns (uint168) {
        require(value <= type(uint168).max, "SafeCast: value doesn't fit in 168 bits");
        return uint168(value);
    }

    /**
     * @dev Returns the downcasted uint160 from uint256, reverting on
     * overflow (when the input is greater than largest uint160).
     *
     * Counterpart to Solidity's `uint160` operator.
     *
     * Requirements:
     *
     * - input must fit into 160 bits
     *
     * _Available since v4.7._
     */
    function toUint160(uint256 value) internal pure returns (uint160) {
        require(value <= type(uint160).max, "SafeCast: value doesn't fit in 160 bits");
        return uint160(value);
    }

    /**
     * @dev Returns the downcasted uint152 from uint256, reverting on
     * overflow (when the input is greater than largest uint152).
     *
     * Counterpart to Solidity's `uint152` operator.
     *
     * Requirements:
     *
     * - input must fit into 152 bits
     *
     * _Available since v4.7._
     */
    function toUint152(uint256 value) internal pure returns (uint152) {
        require(value <= type(uint152).max, "SafeCast: value doesn't fit in 152 bits");
        return uint152(value);
    }

    /**
     * @dev Returns the downcasted uint144 from uint256, reverting on
     * overflow (when the input is greater than largest uint144).
     *
     * Counterpart to Solidity's `uint144` operator.
     *
     * Requirements:
     *
     * - input must fit into 144 bits
     *
     * _Available since v4.7._
     */
    function toUint144(uint256 value) internal pure returns (uint144) {
        require(value <= type(uint144).max, "SafeCast: value doesn't fit in 144 bits");
        return uint144(value);
    }

    /**
     * @dev Returns the downcasted uint136 from uint256, reverting on
     * overflow (when the input is greater than largest uint136).
     *
     * Counterpart to Solidity's `uint136` operator.
     *
     * Requirements:
     *
     * - input must fit into 136 bits
     *
     * _Available since v4.7._
     */
    function toUint136(uint256 value) internal pure returns (uint136) {
        require(value <= type(uint136).max, "SafeCast: value doesn't fit in 136 bits");
        return uint136(value);
    }

    /**
     * @dev Returns the downcasted uint128 from uint256, reverting on
     * overflow (when the input is greater than largest uint128).
     *
     * Counterpart to Solidity's `uint128` operator.
     *
     * Requirements:
     *
     * - input must fit into 128 bits
     *
     * _Available since v2.5._
     */
    function toUint128(uint256 value) internal pure returns (uint128) {
        require(value <= type(uint128).max, "SafeCast: value doesn't fit in 128 bits");
        return uint128(value);
    }

    /**
     * @dev Returns the downcasted uint120 from uint256, reverting on
     * overflow (when the input is greater than largest uint120).
     *
     * Counterpart to Solidity's `uint120` operator.
     *
     * Requirements:
     *
     * - input must fit into 120 bits
     *
     * _Available since v4.7._
     */
    function toUint120(uint256 value) internal pure returns (uint120) {
        require(value <= type(uint120).max, "SafeCast: value doesn't fit in 120 bits");
        return uint120(value);
    }

    /**
     * @dev Returns the downcasted uint112 from uint256, reverting on
     * overflow (when the input is greater than largest uint112).
     *
     * Counterpart to Solidity's `uint112` operator.
     *
     * Requirements:
     *
     * - input must fit into 112 bits
     *
     * _Available since v4.7._
     */
    function toUint112(uint256 value) internal pure returns (uint112) {
        require(value <= type(uint112).max, "SafeCast: value doesn't fit in 112 bits");
        return uint112(value);
    }

    /**
     * @dev Returns the downcasted uint104 from uint256, reverting on
     * overflow (when the input is greater than largest uint104).
     *
     * Counterpart to Solidity's `uint104` operator.
     *
     * Requirements:
     *
     * - input must fit into 104 bits
     *
     * _Available since v4.7._
     */
    function toUint104(uint256 value) internal pure returns (uint104) {
        require(value <= type(uint104).max, "SafeCast: value doesn't fit in 104 bits");
        return uint104(value);
    }

    /**
     * @dev Returns the downcasted uint96 from uint256, reverting on
     * overflow (when the input is greater than largest uint96).
     *
     * Counterpart to Solidity's `uint96` operator.
     *
     * Requirements:
     *
     * - input must fit into 96 bits
     *
     * _Available since v4.2._
     */
    function toUint96(uint256 value) internal pure returns (uint96) {
        require(value <= type(uint96).max, "SafeCast: value doesn't fit in 96 bits");
        return uint96(value);
    }

    /**
     * @dev Returns the downcasted uint88 from uint256, reverting on
     * overflow (when the input is greater than largest uint88).
     *
     * Counterpart to Solidity's `uint88` operator.
     *
     * Requirements:
     *
     * - input must fit into 88 bits
     *
     * _Available since v4.7._
     */
    function toUint88(uint256 value) internal pure returns (uint88) {
        require(value <= type(uint88).max, "SafeCast: value doesn't fit in 88 bits");
        return uint88(value);
    }

    /**
     * @dev Returns the downcasted uint80 from uint256, reverting on
     * overflow (when the input is greater than largest uint80).
     *
     * Counterpart to Solidity's `uint80` operator.
     *
     * Requirements:
     *
     * - input must fit into 80 bits
     *
     * _Available since v4.7._
     */
    function toUint80(uint256 value) internal pure returns (uint80) {
        require(value <= type(uint80).max, "SafeCast: value doesn't fit in 80 bits");
        return uint80(value);
    }

    /**
     * @dev Returns the downcasted uint72 from uint256, reverting on
     * overflow (when the input is greater than largest uint72).
     *
     * Counterpart to Solidity's `uint72` operator.
     *
     * Requirements:
     *
     * - input must fit into 72 bits
     *
     * _Available since v4.7._
     */
    function toUint72(uint256 value) internal pure returns (uint72) {
        require(value <= type(uint72).max, "SafeCast: value doesn't fit in 72 bits");
        return uint72(value);
    }

    /**
     * @dev Returns the downcasted uint64 from uint256, reverting on
     * overflow (when the input is greater than largest uint64).
     *
     * Counterpart to Solidity's `uint64` operator.
     *
     * Requirements:
     *
     * - input must fit into 64 bits
     *
     * _Available since v2.5._
     */
    function toUint64(uint256 value) internal pure returns (uint64) {
        require(value <= type(uint64).max, "SafeCast: value doesn't fit in 64 bits");
        return uint64(value);
    }

    /**
     * @dev Returns the downcasted uint56 from uint256, reverting on
     * overflow (when the input is greater than largest uint56).
     *
     * Counterpart to Solidity's `uint56` operator.
     *
     * Requirements:
     *
     * - input must fit into 56 bits
     *
     * _Available since v4.7._
     */
    function toUint56(uint256 value) internal pure returns (uint56) {
        require(value <= type(uint56).max, "SafeCast: value doesn't fit in 56 bits");
        return uint56(value);
    }

    /**
     * @dev Returns the downcasted uint48 from uint256, reverting on
     * overflow (when the input is greater than largest uint48).
     *
     * Counterpart to Solidity's `uint48` operator.
     *
     * Requirements:
     *
     * - input must fit into 48 bits
     *
     * _Available since v4.7._
     */
    function toUint48(uint256 value) internal pure returns (uint48) {
        require(value <= type(uint48).max, "SafeCast: value doesn't fit in 48 bits");
        return uint48(value);
    }

    /**
     * @dev Returns the downcasted uint40 from uint256, reverting on
     * overflow (when the input is greater than largest uint40).
     *
     * Counterpart to Solidity's `uint40` operator.
     *
     * Requirements:
     *
     * - input must fit into 40 bits
     *
     * _Available since v4.7._
     */
    function toUint40(uint256 value) internal pure returns (uint40) {
        require(value <= type(uint40).max, "SafeCast: value doesn't fit in 40 bits");
        return uint40(value);
    }

    /**
     * @dev Returns the downcasted uint32 from uint256, reverting on
     * overflow (when the input is greater than largest uint32).
     *
     * Counterpart to Solidity's `uint32` operator.
     *
     * Requirements:
     *
     * - input must fit into 32 bits
     *
     * _Available since v2.5._
     */
    function toUint32(uint256 value) internal pure returns (uint32) {
        require(value <= type(uint32).max, "SafeCast: value doesn't fit in 32 bits");
        return uint32(value);
    }

    /**
     * @dev Returns the downcasted uint24 from uint256, reverting on
     * overflow (when the input is greater than largest uint24).
     *
     * Counterpart to Solidity's `uint24` operator.
     *
     * Requirements:
     *
     * - input must fit into 24 bits
     *
     * _Available since v4.7._
     */
    function toUint24(uint256 value) internal pure returns (uint24) {
        require(value <= type(uint24).max, "SafeCast: value doesn't fit in 24 bits");
        return uint24(value);
    }

    /**
     * @dev Returns the downcasted uint16 from uint256, reverting on
     * overflow (when the input is greater than largest uint16).
     *
     * Counterpart to Solidity's `uint16` operator.
     *
     * Requirements:
     *
     * - input must fit into 16 bits
     *
     * _Available since v2.5._
     */
    function toUint16(uint256 value) internal pure returns (uint16) {
        require(value <= type(uint16).max, "SafeCast: value doesn't fit in 16 bits");
        return uint16(value);
    }

    /**
     * @dev Returns the downcasted uint8 from uint256, reverting on
     * overflow (when the input is greater than largest uint8).
     *
     * Counterpart to Solidity's `uint8` operator.
     *
     * Requirements:
     *
     * - input must fit into 8 bits
     *
     * _Available since v2.5._
     */
    function toUint8(uint256 value) internal pure returns (uint8) {
        require(value <= type(uint8).max, "SafeCast: value doesn't fit in 8 bits");
        return uint8(value);
    }

    /**
     * @dev Converts a signed int256 into an unsigned uint256.
     *
     * Requirements:
     *
     * - input must be greater than or equal to 0.
     *
     * _Available since v3.0._
     */
    function toUint256(int256 value) internal pure returns (uint256) {
        require(value >= 0, "SafeCast: value must be positive");
        return uint256(value);
    }

    /**
     * @dev Returns the downcasted int248 from int256, reverting on
     * overflow (when the input is less than smallest int248 or
     * greater than largest int248).
     *
     * Counterpart to Solidity's `int248` operator.
     *
     * Requirements:
     *
     * - input must fit into 248 bits
     *
     * _Available since v4.7._
     */
    function toInt248(int256 value) internal pure returns (int248 downcasted) {
        downcasted = int248(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 248 bits");
    }

    /**
     * @dev Returns the downcasted int240 from int256, reverting on
     * overflow (when the input is less than smallest int240 or
     * greater than largest int240).
     *
     * Counterpart to Solidity's `int240` operator.
     *
     * Requirements:
     *
     * - input must fit into 240 bits
     *
     * _Available since v4.7._
     */
    function toInt240(int256 value) internal pure returns (int240 downcasted) {
        downcasted = int240(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 240 bits");
    }

    /**
     * @dev Returns the downcasted int232 from int256, reverting on
     * overflow (when the input is less than smallest int232 or
     * greater than largest int232).
     *
     * Counterpart to Solidity's `int232` operator.
     *
     * Requirements:
     *
     * - input must fit into 232 bits
     *
     * _Available since v4.7._
     */
    function toInt232(int256 value) internal pure returns (int232 downcasted) {
        downcasted = int232(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 232 bits");
    }

    /**
     * @dev Returns the downcasted int224 from int256, reverting on
     * overflow (when the input is less than smallest int224 or
     * greater than largest int224).
     *
     * Counterpart to Solidity's `int224` operator.
     *
     * Requirements:
     *
     * - input must fit into 224 bits
     *
     * _Available since v4.7._
     */
    function toInt224(int256 value) internal pure returns (int224 downcasted) {
        downcasted = int224(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 224 bits");
    }

    /**
     * @dev Returns the downcasted int216 from int256, reverting on
     * overflow (when the input is less than smallest int216 or
     * greater than largest int216).
     *
     * Counterpart to Solidity's `int216` operator.
     *
     * Requirements:
     *
     * - input must fit into 216 bits
     *
     * _Available since v4.7._
     */
    function toInt216(int256 value) internal pure returns (int216 downcasted) {
        downcasted = int216(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 216 bits");
    }

    /**
     * @dev Returns the downcasted int208 from int256, reverting on
     * overflow (when the input is less than smallest int208 or
     * greater than largest int208).
     *
     * Counterpart to Solidity's `int208` operator.
     *
     * Requirements:
     *
     * - input must fit into 208 bits
     *
     * _Available since v4.7._
     */
    function toInt208(int256 value) internal pure returns (int208 downcasted) {
        downcasted = int208(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 208 bits");
    }

    /**
     * @dev Returns the downcasted int200 from int256, reverting on
     * overflow (when the input is less than smallest int200 or
     * greater than largest int200).
     *
     * Counterpart to Solidity's `int200` operator.
     *
     * Requirements:
     *
     * - input must fit into 200 bits
     *
     * _Available since v4.7._
     */
    function toInt200(int256 value) internal pure returns (int200 downcasted) {
        downcasted = int200(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 200 bits");
    }

    /**
     * @dev Returns the downcasted int192 from int256, reverting on
     * overflow (when the input is less than smallest int192 or
     * greater than largest int192).
     *
     * Counterpart to Solidity's `int192` operator.
     *
     * Requirements:
     *
     * - input must fit into 192 bits
     *
     * _Available since v4.7._
     */
    function toInt192(int256 value) internal pure returns (int192 downcasted) {
        downcasted = int192(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 192 bits");
    }

    /**
     * @dev Returns the downcasted int184 from int256, reverting on
     * overflow (when the input is less than smallest int184 or
     * greater than largest int184).
     *
     * Counterpart to Solidity's `int184` operator.
     *
     * Requirements:
     *
     * - input must fit into 184 bits
     *
     * _Available since v4.7._
     */
    function toInt184(int256 value) internal pure returns (int184 downcasted) {
        downcasted = int184(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 184 bits");
    }

    /**
     * @dev Returns the downcasted int176 from int256, reverting on
     * overflow (when the input is less than smallest int176 or
     * greater than largest int176).
     *
     * Counterpart to Solidity's `int176` operator.
     *
     * Requirements:
     *
     * - input must fit into 176 bits
     *
     * _Available since v4.7._
     */
    function toInt176(int256 value) internal pure returns (int176 downcasted) {
        downcasted = int176(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 176 bits");
    }

    /**
     * @dev Returns the downcasted int168 from int256, reverting on
     * overflow (when the input is less than smallest int168 or
     * greater than largest int168).
     *
     * Counterpart to Solidity's `int168` operator.
     *
     * Requirements:
     *
     * - input must fit into 168 bits
     *
     * _Available since v4.7._
     */
    function toInt168(int256 value) internal pure returns (int168 downcasted) {
        downcasted = int168(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 168 bits");
    }

    /**
     * @dev Returns the downcasted int160 from int256, reverting on
     * overflow (when the input is less than smallest int160 or
     * greater than largest int160).
     *
     * Counterpart to Solidity's `int160` operator.
     *
     * Requirements:
     *
     * - input must fit into 160 bits
     *
     * _Available since v4.7._
     */
    function toInt160(int256 value) internal pure returns (int160 downcasted) {
        downcasted = int160(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 160 bits");
    }

    /**
     * @dev Returns the downcasted int152 from int256, reverting on
     * overflow (when the input is less than smallest int152 or
     * greater than largest int152).
     *
     * Counterpart to Solidity's `int152` operator.
     *
     * Requirements:
     *
     * - input must fit into 152 bits
     *
     * _Available since v4.7._
     */
    function toInt152(int256 value) internal pure returns (int152 downcasted) {
        downcasted = int152(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 152 bits");
    }

    /**
     * @dev Returns the downcasted int144 from int256, reverting on
     * overflow (when the input is less than smallest int144 or
     * greater than largest int144).
     *
     * Counterpart to Solidity's `int144` operator.
     *
     * Requirements:
     *
     * - input must fit into 144 bits
     *
     * _Available since v4.7._
     */
    function toInt144(int256 value) internal pure returns (int144 downcasted) {
        downcasted = int144(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 144 bits");
    }

    /**
     * @dev Returns the downcasted int136 from int256, reverting on
     * overflow (when the input is less than smallest int136 or
     * greater than largest int136).
     *
     * Counterpart to Solidity's `int136` operator.
     *
     * Requirements:
     *
     * - input must fit into 136 bits
     *
     * _Available since v4.7._
     */
    function toInt136(int256 value) internal pure returns (int136 downcasted) {
        downcasted = int136(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 136 bits");
    }

    /**
     * @dev Returns the downcasted int128 from int256, reverting on
     * overflow (when the input is less than smallest int128 or
     * greater than largest int128).
     *
     * Counterpart to Solidity's `int128` operator.
     *
     * Requirements:
     *
     * - input must fit into 128 bits
     *
     * _Available since v3.1._
     */
    function toInt128(int256 value) internal pure returns (int128 downcasted) {
        downcasted = int128(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 128 bits");
    }

    /**
     * @dev Returns the downcasted int120 from int256, reverting on
     * overflow (when the input is less than smallest int120 or
     * greater than largest int120).
     *
     * Counterpart to Solidity's `int120` operator.
     *
     * Requirements:
     *
     * - input must fit into 120 bits
     *
     * _Available since v4.7._
     */
    function toInt120(int256 value) internal pure returns (int120 downcasted) {
        downcasted = int120(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 120 bits");
    }

    /**
     * @dev Returns the downcasted int112 from int256, reverting on
     * overflow (when the input is less than smallest int112 or
     * greater than largest int112).
     *
     * Counterpart to Solidity's `int112` operator.
     *
     * Requirements:
     *
     * - input must fit into 112 bits
     *
     * _Available since v4.7._
     */
    function toInt112(int256 value) internal pure returns (int112 downcasted) {
        downcasted = int112(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 112 bits");
    }

    /**
     * @dev Returns the downcasted int104 from int256, reverting on
     * overflow (when the input is less than smallest int104 or
     * greater than largest int104).
     *
     * Counterpart to Solidity's `int104` operator.
     *
     * Requirements:
     *
     * - input must fit into 104 bits
     *
     * _Available since v4.7._
     */
    function toInt104(int256 value) internal pure returns (int104 downcasted) {
        downcasted = int104(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 104 bits");
    }

    /**
     * @dev Returns the downcasted int96 from int256, reverting on
     * overflow (when the input is less than smallest int96 or
     * greater than largest int96).
     *
     * Counterpart to Solidity's `int96` operator.
     *
     * Requirements:
     *
     * - input must fit into 96 bits
     *
     * _Available since v4.7._
     */
    function toInt96(int256 value) internal pure returns (int96 downcasted) {
        downcasted = int96(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 96 bits");
    }

    /**
     * @dev Returns the downcasted int88 from int256, reverting on
     * overflow (when the input is less than smallest int88 or
     * greater than largest int88).
     *
     * Counterpart to Solidity's `int88` operator.
     *
     * Requirements:
     *
     * - input must fit into 88 bits
     *
     * _Available since v4.7._
     */
    function toInt88(int256 value) internal pure returns (int88 downcasted) {
        downcasted = int88(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 88 bits");
    }

    /**
     * @dev Returns the downcasted int80 from int256, reverting on
     * overflow (when the input is less than smallest int80 or
     * greater than largest int80).
     *
     * Counterpart to Solidity's `int80` operator.
     *
     * Requirements:
     *
     * - input must fit into 80 bits
     *
     * _Available since v4.7._
     */
    function toInt80(int256 value) internal pure returns (int80 downcasted) {
        downcasted = int80(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 80 bits");
    }

    /**
     * @dev Returns the downcasted int72 from int256, reverting on
     * overflow (when the input is less than smallest int72 or
     * greater than largest int72).
     *
     * Counterpart to Solidity's `int72` operator.
     *
     * Requirements:
     *
     * - input must fit into 72 bits
     *
     * _Available since v4.7._
     */
    function toInt72(int256 value) internal pure returns (int72 downcasted) {
        downcasted = int72(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 72 bits");
    }

    /**
     * @dev Returns the downcasted int64 from int256, reverting on
     * overflow (when the input is less than smallest int64 or
     * greater than largest int64).
     *
     * Counterpart to Solidity's `int64` operator.
     *
     * Requirements:
     *
     * - input must fit into 64 bits
     *
     * _Available since v3.1._
     */
    function toInt64(int256 value) internal pure returns (int64 downcasted) {
        downcasted = int64(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 64 bits");
    }

    /**
     * @dev Returns the downcasted int56 from int256, reverting on
     * overflow (when the input is less than smallest int56 or
     * greater than largest int56).
     *
     * Counterpart to Solidity's `int56` operator.
     *
     * Requirements:
     *
     * - input must fit into 56 bits
     *
     * _Available since v4.7._
     */
    function toInt56(int256 value) internal pure returns (int56 downcasted) {
        downcasted = int56(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 56 bits");
    }

    /**
     * @dev Returns the downcasted int48 from int256, reverting on
     * overflow (when the input is less than smallest int48 or
     * greater than largest int48).
     *
     * Counterpart to Solidity's `int48` operator.
     *
     * Requirements:
     *
     * - input must fit into 48 bits
     *
     * _Available since v4.7._
     */
    function toInt48(int256 value) internal pure returns (int48 downcasted) {
        downcasted = int48(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 48 bits");
    }

    /**
     * @dev Returns the downcasted int40 from int256, reverting on
     * overflow (when the input is less than smallest int40 or
     * greater than largest int40).
     *
     * Counterpart to Solidity's `int40` operator.
     *
     * Requirements:
     *
     * - input must fit into 40 bits
     *
     * _Available since v4.7._
     */
    function toInt40(int256 value) internal pure returns (int40 downcasted) {
        downcasted = int40(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 40 bits");
    }

    /**
     * @dev Returns the downcasted int32 from int256, reverting on
     * overflow (when the input is less than smallest int32 or
     * greater than largest int32).
     *
     * Counterpart to Solidity's `int32` operator.
     *
     * Requirements:
     *
     * - input must fit into 32 bits
     *
     * _Available since v3.1._
     */
    function toInt32(int256 value) internal pure returns (int32 downcasted) {
        downcasted = int32(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 32 bits");
    }

    /**
     * @dev Returns the downcasted int24 from int256, reverting on
     * overflow (when the input is less than smallest int24 or
     * greater than largest int24).
     *
     * Counterpart to Solidity's `int24` operator.
     *
     * Requirements:
     *
     * - input must fit into 24 bits
     *
     * _Available since v4.7._
     */
    function toInt24(int256 value) internal pure returns (int24 downcasted) {
        downcasted = int24(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 24 bits");
    }

    /**
     * @dev Returns the downcasted int16 from int256, reverting on
     * overflow (when the input is less than smallest int16 or
     * greater than largest int16).
     *
     * Counterpart to Solidity's `int16` operator.
     *
     * Requirements:
     *
     * - input must fit into 16 bits
     *
     * _Available since v3.1._
     */
    function toInt16(int256 value) internal pure returns (int16 downcasted) {
        downcasted = int16(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 16 bits");
    }

    /**
     * @dev Returns the downcasted int8 from int256, reverting on
     * overflow (when the input is less than smallest int8 or
     * greater than largest int8).
     *
     * Counterpart to Solidity's `int8` operator.
     *
     * Requirements:
     *
     * - input must fit into 8 bits
     *
     * _Available since v3.1._
     */
    function toInt8(int256 value) internal pure returns (int8 downcasted) {
        downcasted = int8(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 8 bits");
    }

    /**
     * @dev Converts an unsigned uint256 into a signed int256.
     *
     * Requirements:
     *
     * - input must be less than or equal to maxInt256.
     *
     * _Available since v3.0._
     */
    function toInt256(uint256 value) internal pure returns (int256) {
        // Note: Unsafe cast below is okay because `type(int256).max` is guaranteed to be positive
        require(value <= uint256(type(int256).max), "SafeCast: value doesn't fit in an int256");
        return int256(value);
    }
}

// src/governance/utils/GovernorSorting.sol

/**
 * @dev Logic for sorting and ranking.
 */
abstract contract GovernorSorting {
    // TLDR: This code maintains a sorted array.

    // Because of the array rule below, the actual number of rankings that this contract will be able to track is determined by three things:
    //      - RANK_LIMIT
    //      - Woulda Beens (WBs)
    //          The number of would-be ranked proposals (at the end of the contest if rankings were counted
    //          without taking out deleted proposals) within the limit that are deleted and do not have other, non-deleted proposals
    //          with the same amounts of votes/that are tied with them.
    //      - To Tied or Deleted (TTDs), or to a previous TTD
    //          The number of times a proposal's newValue goes into an index to tie it; an index that is already tied; an index that was last deleted;
    //          or an index that wasn't garbage collected because it went to either one of last three cases or an index that also wasn't garbage
    //          collected because of the same recursive logic, from a ranking that was in the tracked rankings at the time that vote was cast.
    //
    // The equation to calcluate how many rankings this contract will actually be able to track is:
    // # of rankings GovernorSorting can track for a given contest = RANK_LIMIT - WBs - TTDs
    //
    // With this in mind, it is strongly reccomended to set RANK_LIMIT sufficiently high to create a buffer for
    // WBs and TTDs that may occur in your contest. The thing to consider with regard to making it too high is just
    // that it is more gas for users on average the higher that RANK_LIMIT is set.

    uint256 public sortingEnabled; // Either 0 for false or 1 for true
    uint256 public rankLimit; // RULE: Cannot be 0

    // RULE: array length can never end lower than it started a transaction, otherwise erroneous ranking can happen
    uint256[] public sortedRanks; // value is votes counts, has the constraint of no duplicate values.

    constructor(uint256 sortingEnabled_, uint256 rankLimit_) {
        sortingEnabled = sortingEnabled_;
        rankLimit = rankLimit_;
    }

    /**
     * @dev See {GovernorCountingSimple-getNumProposalsWithThisManyVotes}.
     */
    function getNumProposalsWithThisManyVotes(uint256 votes) public view virtual returns (uint256 count);

    /**
     * @dev Get the sortedRanks array.
     */
    function getSortedRanks() public view returns (uint256[] memory sortedRanksArray) {
        return sortedRanks;
    }

    /**
     * @dev Insert a new value into sortedRanks (this function is strictly O(n) or better).
     *      We know at this point that the idx where it should go is in [0, sortedRanks.length - 1].
     */
    function _insertRank(
        uint256 oldValue,
        uint256 newValue,
        uint256 sortedRanksLength,
        uint256[] memory sortedRanksMemVar
    ) internal {
        // find the index to insert newValue at
        uint256 insertingIndex;
        for (uint256 index = 0; index < sortedRanksLength; index++) {
            // is this value already in the array? (is this a TTD or to a previous TTD?)
            if (newValue == sortedRanksMemVar[index]) {
                // if so, we don't need to insert anything and the oldValue of this doesn't get cleaned up
                return;
            }

            if (newValue > sortedRanksMemVar[index]) {
                insertingIndex = index;
                break;
            }
        }

        // are we checking for the oldValue?
        bool checkForOldValue = (oldValue > 0) && (getNumProposalsWithThisManyVotes(oldValue) == 0); // if there are props left with oldValue votes, we don't want to remove it
        bool haveFoundOldValue = false;

        // DO ANY SHIFTING? - we do not need to if 1. if we're checking for oldValue and 2. oldValue is at insertingIndex - if both of those are the case, then we don't need to update anything besides insertingIndex.
        if (!(checkForOldValue && (sortedRanksMemVar[insertingIndex] == oldValue))) {
            // DO SHIFTING FROM (insertingIndex, sortedRanksLength)?
            //      - if insertingIndex == sortedRanksLength - 1, then there's nothing after it to shift down.
            //      - also if this is the case + oldValue's not at insertingIndex, then don't need to worry about oldValue bc it's not in the array.
            if (!(insertingIndex == sortedRanksLength - 1)) {
                // SHIFT UNTIL/IF YOU FIND OLD VALUE IN THE RANGE (insertingIndex, sortedRanksLength) - go through and shift everything down until/if we hit oldValue.
                // if we hit the limit then the last item will just be dropped).
                for (uint256 index = insertingIndex + 1; index < sortedRanksLength; index++) {
                    sortedRanks[index] = sortedRanksMemVar[index - 1];

                    // STOP ONCE YOU FIND OLD VALUE - if I'm looking for it, once I shift a value into the index oldValue was in (if it's in here) I can stop!
                    if (checkForOldValue && (sortedRanksMemVar[index] == oldValue)) {
                        haveFoundOldValue = true;
                        break;
                    }
                }
            }

            // SHIFT INTO NEW INDEX? - if we didn't run into oldValue and we wouldn't be trying to shift into index RANK_LIMIT, then
            // go ahead and shift what was in sortedRanksLength - 1 into the next idx
            if (!haveFoundOldValue && (sortedRanksLength < rankLimit)) {
                sortedRanks.push(sortedRanksMemVar[sortedRanksLength - 1]);
            }
        }

        // SET INSERTING IDX - now that everything's been accounted for, let's correctly set sortedRanks[insertingIndex]
        sortedRanks[insertingIndex] = newValue;
    }

    /**
     * @dev Keep things sorted as we go.
     *      Only works for no downvoting bc dealing w what happens when something leaves the top ranks and needs to be *replaced* is an issue that necessitates the sorting of all the others, which we don't want to do bc gas.
     *      Invariant: Because of no downvoting, and that a vote of 0 is not allowed, newValue will always be greater than oldValue.
     */
    function _updateRanks(uint256 oldValue, uint256 newValue) internal {
        uint256 sortedRanksLength = sortedRanks.length; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        // FIRST ENTRY? - if this is the first item ever then we just need to put it in idx 0 and that's it
        if (sortedRanksLength == 0) {
            sortedRanks.push(newValue);
            return;
        }

        // SMALLER THAN CURRENT SMALLEST VAL?
        // this also means that the old value was 0 (or less than the lowest value if sortedRanks.length == RANK_LIMIT and/or the array is full), so all good with regards to oldValue.
        if (newValue < sortedRanksMemVar[sortedRanksLength - 1]) {
            if (sortedRanksLength == rankLimit) {
                // if we've reached the size limit of sortedRanks, then we're done here
                return;
            } else {
                // otherwise, put this value in the index after the current smallest value
                sortedRanks.push(newValue);
                return;
            }
        }

        // SO IT'S IN [0, sortedRanksLength - 1]!
        // find where it should go and insert it.
        _insertRank(oldValue, newValue, sortedRanksLength, sortedRanksMemVar);
    }
}

// src/governance/utils/GovernorMerkleVotes.sol

// Forked from https://github.com/Anish-Agnihotri/merkle-airdrop-starter/blob/master/contracts/src/MerkleClaimERC20.sol

/// ============ Imports ============

 // OZ: MerkleProof

/// @title GovernorMerkleVotes
abstract contract GovernorMerkleVotes {
    /// ============ Immutable storage ============

    /// @notice Participant inclusion roots
    bytes32 public submissionMerkleRoot;
    bytes32 public votingMerkleRoot;

    /// ============ Errors ============

    /// @notice Thrown if address/amount are not part of Merkle tree
    error NotInMerkle();

    /// ============ Constructor ============

    /// @notice Creates a new GovernorMerkleVotes contract
    /// @param _submissionMerkleRoot of participants
    /// @param _votingMerkleRoot of participants
    constructor(bytes32 _submissionMerkleRoot, bytes32 _votingMerkleRoot) {
        submissionMerkleRoot = _submissionMerkleRoot; // Update root
        votingMerkleRoot = _votingMerkleRoot; // Update root
    }

    /// ============ Functions ============

    /// @notice Allows checking of proofs for an address
    /// @param addressToCheck address of participant
    /// @param amount to check that the participant has the correct amount
    /// @param proof merkle proof to prove address and amount are in tree
    /// @param voting true if this is for a voting proof, false if this is for a submission proof
    function checkProof(address addressToCheck, uint256 amount, bytes32[] calldata proof, bool voting)
        public
        view
        returns (bool verified)
    {
        // Verify merkle proof, or revert if not in tree
        bytes32 leaf = keccak256(abi.encodePacked(addressToCheck, amount));
        bool isValidLeaf = voting
            ? MerkleProof.verify(proof, votingMerkleRoot, leaf)
            : MerkleProof.verify(proof, submissionMerkleRoot, leaf);
        if (!isValidLeaf) revert NotInMerkle();
        return true;
    }
}

// lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol

// OpenZeppelin Contracts (last updated v4.9.3) (token/ERC20/utils/SafeERC20.sol)

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using Address for address;

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(IERC20 token, address spender, uint256 value) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance + value));
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, oldAllowance - value));
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeWithSelector(token.approve.selector, spender, value);

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, 0));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Use a ERC-2612 signature to set the `owner` approval toward `spender` on `token`.
     * Revert on invalid signature.
     */
    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        require(returndata.length == 0 || abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return
            success && (returndata.length == 0 || abi.decode(returndata, (bool))) && Address.isContract(address(token));
    }
}

// src/governance/Governor.sol

// Forked from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/Governor.sol

/**
 * @dev Core of the governance system, designed to be extended though various modules.
 */
abstract contract Governor is GovernorSorting, GovernorMerkleVotes {
    using SafeCast for uint256;

    enum ContestState {
        NotStarted,
        Active,
        Canceled,
        Queued,
        Completed
    }

    enum Metadatas {
        Target,
        Safe,
        Fields
    }

    enum Actions {
        Submit,
        Vote
    }

    struct IntConstructorArgs {
        uint256 contestStart;
        uint256 votingDelay;
        uint256 votingPeriod;
        uint256 numAllowedProposalSubmissions;
        uint256 maxProposalCount;
        uint256 sortingEnabled;
        uint256 rankLimit;
        uint256 percentageToCreator;
        uint256 costToPropose;
        uint256 costToVote;
        uint256 payPerVote;
    }

    struct ConstructorArgs {
        IntConstructorArgs intConstructorArgs;
        address creatorSplitDestination;
        address jkLabsSplitDestination;
        string metadataFieldsSchema;
    }

    struct TargetMetadata {
        address targetAddress;
    }

    struct SafeMetadata {
        address[] signers;
        uint256 threshold;
    }

    struct FieldsMetadata {
        // all of these have max length of MAX_FIELDS_METADATA_LENGTH as enforced in validateProposalData()
        address[] addressArray;
        string[] stringArray;
        uint256[] uintArray;
    }

    struct ProposalCore {
        address author;
        bool exists;
        string description;
        TargetMetadata targetMetadata;
        SafeMetadata safeMetadata;
        FieldsMetadata fieldsMetadata;
    }

    event JokeraceCreated(
        string version,
        string name,
        string prompt,
        address creator,
        uint256 contestStart,
        uint256 votingDelay,
        uint256 votingPeriod
    );
    event ProposalCreated(uint256 proposalId, address proposer, string proposalDescription);
    event ProposalsDeleted(uint256[] proposalIds);
    event ContestCanceled();
    event VoteCast(address indexed voter, uint256 proposalId, uint256 numVotes);
    event CreatorPaymentReleased(address to, uint256 amount);
    event JkLabsPaymentReleased(address to, uint256 amount);

    uint256 public constant METADATAS_COUNT = uint256(type(Metadatas).max) + 1;
    uint256 public constant MAX_FIELDS_METADATA_LENGTH = 10;
    uint256 public constant AMOUNT_FOR_SUMBITTER_PROOF = 10000000000000000000;
    address public constant JK_LABS_ADDRESS = 0xDc652C746A8F85e18Ce632d97c6118e8a52fa738; // our hot wallet that we collect revenue to
    string private constant VERSION = "5.1"; // Private as to not clutter the ABI

    string public name; // The title of the contest
    string public prompt;
    address public creator;
    uint256 public contestStart; // The Unix timestamp that the contest starts at.
    uint256 public votingDelay; // Number of seconds that submissions are open.
    uint256 public votingPeriod; // Number of seconds that voting is open.
    uint256 public numAllowedProposalSubmissions; // The number of proposals that an address who is qualified to propose can submit for this contest.
    uint256 public maxProposalCount; // Max number of proposals allowed in this contest.
    uint256 public percentageToCreator;
    uint256 public costToPropose;
    uint256 public costToVote;
    uint256 public payPerVote; // If this contest is pay per vote (as opposed to pay per vote transaction).
    address public creatorSplitDestination; // Where the creator split of revenue goes.
    address public jkLabsSplitDestination; // Where the jk labs split of revenue goes.
    string public metadataFieldsSchema; // JSON Schema of what the metadata fields are

    uint256[] public proposalIds;
    uint256[] public deletedProposalIds;
    mapping(uint256 => bool) public proposalIsDeleted;
    bool public canceled;
    mapping(uint256 => ProposalCore) public proposals;
    mapping(address => uint256) public numSubmissions;
    address[] public proposalAuthors;
    address[] public addressesThatHaveVoted;

    mapping(address => uint256) public addressTotalVotes;
    mapping(address => bool) public addressTotalVotesVerified;
    mapping(address => bool) public addressSubmitterVerified;

    error AuthorIsNotSender(address author, address sender);
    error ZeroSignersInSafeMetadata();
    error ZeroThresholdInSafeMetadata();
    error AddressFieldMetadataArrayTooLong();
    error StringFieldMetadataArrayTooLong();
    error UintFieldMetadataArrayTooLong();
    error UnexpectedMetadata(Metadatas unexpectedMetadata);
    error EmptyProposalDescription();

    error IncorrectCostSent(uint256 msgValue, uint256 costToVote);

    error AddressNotPermissionedToSubmit();
    error ContestMustBeQueuedToPropose(ContestState currentState);
    error ContestMustBeActiveToVote(ContestState currentState);
    error SenderSubmissionLimitReached(uint256 numAllowedProposalSubmissions);
    error ContestSubmissionLimitReached(uint256 maxProposalCount);
    error DuplicateSubmission(uint256 proposalId);

    error CannotVoteOnDeletedProposal();
    error NeedAtLeastOneVoteToVote();
    error CannotVoteLessThanOneVoteInPayPerVote();

    error NeedToSubmitWithProofFirst();
    error NeedToVoteWithProofFirst();

    error OnlyCreatorCanDelete();
    error OnlyCreatorCanSetName();
    error OnlyCreatorCanSetPrompt();
    error CannotDeleteWhenCompletedOrCanceled();
    error CannotSetWhenCompletedOrCanceled();

    error OnlyCreatorOrJkLabsCanCancel();
    error CannotCancelWhenCompletedOrCanceled();
    error ContestAlreadyCanceled();

    error CannotUpdateWhenCompletedOrCanceled();

    error OnlyJkLabsCanAmend();
    error OnlyCreatorCanAmend();

    constructor(string memory name_, string memory prompt_, ConstructorArgs memory constructorArgs_) {
        name = name_;
        prompt = prompt_;
        creator = msg.sender;
        contestStart = constructorArgs_.intConstructorArgs.contestStart;
        votingDelay = constructorArgs_.intConstructorArgs.votingDelay;
        votingPeriod = constructorArgs_.intConstructorArgs.votingPeriod;
        numAllowedProposalSubmissions = constructorArgs_.intConstructorArgs.numAllowedProposalSubmissions;
        maxProposalCount = constructorArgs_.intConstructorArgs.maxProposalCount;
        percentageToCreator = constructorArgs_.intConstructorArgs.percentageToCreator;
        costToPropose = constructorArgs_.intConstructorArgs.costToPropose;
        costToVote = constructorArgs_.intConstructorArgs.costToVote;
        payPerVote = constructorArgs_.intConstructorArgs.payPerVote;
        creatorSplitDestination = constructorArgs_.creatorSplitDestination;
        jkLabsSplitDestination = constructorArgs_.jkLabsSplitDestination;
        metadataFieldsSchema = constructorArgs_.metadataFieldsSchema;

        emit JokeraceCreated(
            VERSION,
            name_,
            prompt_,
            msg.sender,
            constructorArgs_.intConstructorArgs.contestStart,
            constructorArgs_.intConstructorArgs.votingDelay,
            constructorArgs_.intConstructorArgs.votingPeriod
        ); // emit upon creation to be able to easily find jokeraces on a chain
    }

    function version() public pure returns (string memory) {
        return VERSION;
    }

    function hashProposal(ProposalCore memory proposal) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(proposal)));
    }

    function state() public view returns (ContestState) {
        if (canceled) {
            return ContestState.Canceled;
        }

        if (contestStart >= block.timestamp) {
            return ContestState.NotStarted;
        }

        if (voteStart() >= block.timestamp) {
            return ContestState.Queued;
        }

        if (contestDeadline() >= block.timestamp) {
            return ContestState.Active;
        }

        return ContestState.Completed;
    }

    /**
     * @dev Return all proposals.
     */
    function getAllProposalIds() public view returns (uint256[] memory) {
        return proposalIds;
    }

    /**
     * @dev Return all proposal authors.
     */
    function getAllProposalAuthors() public view returns (address[] memory) {
        return proposalAuthors;
    }

    /**
     * @dev Return all addresses that have voted.
     */
    function getAllAddressesThatHaveVoted() public view returns (address[] memory) {
        return addressesThatHaveVoted;
    }

    /**
     * @dev Return all deleted proposals.
     */
    function getAllDeletedProposalIds() public view returns (uint256[] memory) {
        return deletedProposalIds;
    }

    /**
     * @dev Return all authors of deleted proposals.
     */
    function getAllAuthorsOfDeletedProposals() public view returns (address[] memory) {
        uint256[] memory deletedProposalIdsMemVar = deletedProposalIds;
        address[] memory authorsArray = new address[](deletedProposalIdsMemVar.length);
        for (uint256 i = 0; i < deletedProposalIdsMemVar.length; i++) {
            authorsArray[i] = proposals[deletedProposalIdsMemVar[i]].author;
        }
        return authorsArray;
    }

    /**
     * @dev Timestamp the contest vote begins. Votes open at the end of this block, so it is possible to propose
     * during this block.
     */
    function voteStart() public view returns (uint256) {
        return contestStart + votingDelay;
    }

    /**
     * @dev Returns if a proposal has been deleted or not.
     */
    function contestDeadline() public view returns (uint256) {
        return voteStart() + votingPeriod;
    }

    /**
     * @dev Retrieve proposal data.
     */
    function getProposal(uint256 proposalId) public view returns (ProposalCore memory) {
        return proposals[proposalId];
    }

    /**
     * @dev Set the contest name.
     */
    function setName(string memory newName) public returns (string memory) {
        if (msg.sender != creator) revert OnlyCreatorCanSetName();
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotSetWhenCompletedOrCanceled();
        }

        name = newName;
        return newName;
    }

    /**
     * @dev Set the contest prompt.
     */
    function setPrompt(string memory newPrompt) public returns (string memory) {
        if (msg.sender != creator) revert OnlyCreatorCanSetPrompt();
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotSetWhenCompletedOrCanceled();
        }

        prompt = newPrompt;
        return newPrompt;
    }

    /**
     * @dev Remove deleted proposalIds from forVotesToProposalIds and decrement copy counts of the forVotes of proposalIds.
     */
    function _multiRmProposalIdFromVotesMap(uint256[] calldata proposalIds) internal virtual;

    /**
     * @dev Register a vote with a given support and voting weight.
     *
     * Note: Support is generic and can represent various things depending on the voting system used.
     */
    function _countVote(uint256 proposalId, address account, uint256 numVotes, uint256 totalVotes) internal virtual;

    /**
     * @dev Verifies that `account` is permissioned to propose via merkle proof.
     */
    function verifyProposer(address account, bytes32[] calldata proof) public {
        if (!addressSubmitterVerified[account]) {
            if (submissionMerkleRoot == 0) {
                // if the submission root is 0, then anyone can submit
                return;
            }
            checkProof(account, AMOUNT_FOR_SUMBITTER_PROOF, proof, false); // will revert with NotInMerkle if not valid
            addressSubmitterVerified[account] = true;
        }
    }

    /**
     * @dev Verifies that all of the metadata in the proposal is valid.
     */
    function validateProposalData(ProposalCore memory proposal) public view {
        if (proposal.author != msg.sender) revert AuthorIsNotSender(proposal.author, msg.sender);
        for (uint256 index = 0; index < METADATAS_COUNT; index++) {
            Metadatas currentMetadata = Metadatas(index);
            if (currentMetadata == Metadatas.Target) {
                continue; // nothing to check here since strictly typed to address
            } else if (currentMetadata == Metadatas.Safe) {
                if (proposal.safeMetadata.signers.length == 0) revert ZeroSignersInSafeMetadata();
                if (proposal.safeMetadata.threshold == 0) revert ZeroThresholdInSafeMetadata();
            } else if (currentMetadata == Metadatas.Fields) {
                if (proposal.fieldsMetadata.addressArray.length > MAX_FIELDS_METADATA_LENGTH) {
                    revert AddressFieldMetadataArrayTooLong();
                }
                if (proposal.fieldsMetadata.stringArray.length > MAX_FIELDS_METADATA_LENGTH) {
                    revert StringFieldMetadataArrayTooLong();
                }
                if (proposal.fieldsMetadata.uintArray.length > MAX_FIELDS_METADATA_LENGTH) {
                    revert UintFieldMetadataArrayTooLong();
                }
            } else {
                revert UnexpectedMetadata(currentMetadata);
            }
        }
        if (bytes(proposal.description).length == 0) revert EmptyProposalDescription();
    }

    /**
     * @dev Determines that the correct amount was sent with the transaction and returns that correct amount.
     */
    function _determineCorrectAmountSent(Actions currentAction, uint256 numVotes) internal returns (uint256) {
        uint256 actionCost;
        if (currentAction == Actions.Submit) {
            actionCost = costToPropose;
        } else if (currentAction == Actions.Vote) {
            if (payPerVote == 1) {
                if (numVotes < 1 ether) revert CannotVoteLessThanOneVoteInPayPerVote();
                actionCost = costToVote * (numVotes / 1 ether); // we don't allow <1 vote to be cast in a pay per vote txn bc of this, would underflow
            } else {
                actionCost = costToVote;
            }
        } else {
            actionCost = 0;
        }

        if (msg.value != actionCost) revert IncorrectCostSent(msg.value, actionCost);
        return actionCost;
    }

    /**
     * @dev Distribute the cost of an action to the creator and jk labs based on _percentageToCreator.
     */
    function _distributeCost(uint256 actionCost) internal {
        if (actionCost > 0) {
            // Send cost to creator and jk labs split destinations
            uint256 sendingToJkLabs = (msg.value * (100 - percentageToCreator)) / 100;
            if (sendingToJkLabs > 0) {
                Address.sendValue(payable(jkLabsSplitDestination), sendingToJkLabs);
                emit JkLabsPaymentReleased(jkLabsSplitDestination, sendingToJkLabs);
            }

            uint256 sendingToCreator = msg.value - sendingToJkLabs;
            if (sendingToCreator > 0) {
                Address.sendValue(payable(creatorSplitDestination), sendingToCreator); // creator gets the extra wei in the case of rounding
                emit CreatorPaymentReleased(creator, sendingToCreator);
            }
        }
    }

    /**
     * @dev Create a new proposal.
     */
    function propose(ProposalCore calldata proposal, bytes32[] calldata proof) public payable returns (uint256) {
        uint256 actionCost = _determineCorrectAmountSent(Actions.Submit, 0);

        verifyProposer(msg.sender, proof);
        validateProposalData(proposal);
        uint256 proposalId = _castProposal(proposal);

        _distributeCost(actionCost);

        return proposalId;
    }

    /**
     * @dev Create a new proposal without a proof if you have already proposed with a proof.
     */
    function proposeWithoutProof(ProposalCore calldata proposal) public payable returns (uint256) {
        uint256 actionCost = _determineCorrectAmountSent(Actions.Submit, 0);

        if (submissionMerkleRoot != 0) {
            // if the submission root is 0, then anyone can submit; otherwise, this address needs to have been verified
            if (!addressSubmitterVerified[msg.sender]) revert NeedToSubmitWithProofFirst();
        }
        validateProposalData(proposal);
        uint256 proposalId = _castProposal(proposal);

        _distributeCost(actionCost);

        return proposalId;
    }

    function _castProposal(ProposalCore memory proposal) internal returns (uint256) {
        if (state() != ContestState.Queued) revert ContestMustBeQueuedToPropose(state());
        if (numSubmissions[msg.sender] == numAllowedProposalSubmissions) {
            revert SenderSubmissionLimitReached(numAllowedProposalSubmissions);
        }
        if ((proposalIds.length - deletedProposalIds.length) == maxProposalCount) {
            revert ContestSubmissionLimitReached(maxProposalCount);
        }

        uint256 proposalId = hashProposal(proposal);
        if (proposals[proposalId].exists) revert DuplicateSubmission(proposalId);

        proposalIds.push(proposalId);
        proposals[proposalId] = proposal;
        numSubmissions[msg.sender] += 1;
        proposalAuthors.push(msg.sender);

        emit ProposalCreated(proposalId, msg.sender, proposal.description);

        return proposalId;
    }

    /**
     * @dev Delete proposals.
     *
     * Emits a {IGovernor-ProposalsDeleted} event.
     */
    function deleteProposals(uint256[] calldata proposalIdsToDelete) public {
        if (msg.sender != creator) revert OnlyCreatorCanDelete();
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotDeleteWhenCompletedOrCanceled();
        }

        for (uint256 index = 0; index < proposalIdsToDelete.length; index++) {
            uint256 currentProposalId = proposalIdsToDelete[index];
            if (!proposalIsDeleted[currentProposalId]) {
                // if this proposal hasn't already been deleted
                proposalIsDeleted[currentProposalId] = true;
                // this proposal now won't count towards the total number allowed in the contest
                // it will still count towards the total number of proposals that the user is allowed to submit though
                deletedProposalIds.push(currentProposalId);
            }
        }

        // we only do sorting if downvoting is disabled and if sorting is enabled
        if (sortingEnabled == 1) {
            // remove proposalIds from votesToProposalIds (could contain proposalIds that have been deleted before, that's ok though)
            _multiRmProposalIdFromVotesMap(proposalIdsToDelete);
        }

        emit ProposalsDeleted(proposalIds);
    }

    /**
     * @dev Cancels the contest.
     *
     * Emits a {IGovernor-ContestCanceled} event.
     */
    function cancel() public {
        if ((msg.sender != creator) && (msg.sender != JK_LABS_ADDRESS)) revert OnlyCreatorOrJkLabsCanCancel();

        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotCancelWhenCompletedOrCanceled();
        }

        canceled = true;

        emit ContestCanceled();
    }

    /**
     * @dev Verifies that `account` is permissioned to vote with `totalVotes` via merkle proof.
     */
    function verifyVoter(address account, uint256 totalVotes, bytes32[] calldata proof) public {
        if (votingMerkleRoot != 0 && !addressTotalVotesVerified[account]) {
            checkProof(account, totalVotes, proof, true); // will revert with NotInMerkle if not valid
            addressTotalVotes[account] = totalVotes;
            addressTotalVotesVerified[account] = true;
        }
    }

    /**
     * @dev Cast a vote with a merkle proof.
     */
    function castVote(uint256 proposalId, uint256 totalVotes, uint256 numVotes, bytes32[] calldata proof)
        public
        payable
        returns (uint256)
    {
        uint256 actionCost = _determineCorrectAmountSent(Actions.Vote, numVotes);

        if (proposalIsDeleted[proposalId]) revert CannotVoteOnDeletedProposal();
        verifyVoter(msg.sender, totalVotes, proof);

        _distributeCost(actionCost);

        return _castVote(proposalId, msg.sender, numVotes);
    }

    /**
     * @dev Cast a vote without a proof if you have already voted with a proof.
     */
    function castVoteWithoutProof(uint256 proposalId, uint256 numVotes) public payable returns (uint256) {
        uint256 actionCost = _determineCorrectAmountSent(Actions.Vote, numVotes);

        if (proposalIsDeleted[proposalId]) revert CannotVoteOnDeletedProposal();
        if (votingMerkleRoot != 0 && !addressTotalVotesVerified[msg.sender]) revert NeedToVoteWithProofFirst();

        _distributeCost(actionCost);

        return _castVote(proposalId, msg.sender, numVotes);
    }

    /**
     * @dev Internal vote casting mechanism: Check that the vote is pending, that it has not been cast yet, retrieve
     * voting weight using addressTotalVotes() and call the {_countVote} internal function.
     *
     * Emits a {IGovernor-VoteCast} event.
     */
    function _castVote(uint256 proposalId, address account, uint256 numVotes) internal returns (uint256) {
        if (state() != ContestState.Active) revert ContestMustBeActiveToVote(state());
        if (numVotes == 0) revert NeedAtLeastOneVoteToVote();

        _countVote(proposalId, account, numVotes, addressTotalVotes[account]);

        addressesThatHaveVoted.push(msg.sender);

        emit VoteCast(account, proposalId, numVotes);

        return addressTotalVotes[account];
    }

    /**
     * ONLY FOR USE IN EMERGENCIES, if you change this users will not be able to play in your contest on the JokeRace frontend.
     */
    function setSubmissionMerkleRoot(bytes32 newSubmissionMerkleRoot) public {
        if (msg.sender != creator) revert OnlyCreatorCanAmend();
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotUpdateWhenCompletedOrCanceled();
        }
        submissionMerkleRoot = newSubmissionMerkleRoot;
    }

    /**
     * ONLY FOR USE IN EMERGENCIES, if you change this users will not be able to play in your contest on the JokeRace frontend.
     */
    function setVotingMerkleRoot(bytes32 newVotingMerkleRoot) public {
        if (msg.sender != creator) revert OnlyCreatorCanAmend();
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotUpdateWhenCompletedOrCanceled();
        }
        votingMerkleRoot = newVotingMerkleRoot;
    }

    function setCreatorSplitDestination(address newCreatorSplitDestination) public {
        if (msg.sender != creator) revert OnlyCreatorCanAmend();
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotUpdateWhenCompletedOrCanceled();
        }
        creatorSplitDestination = newCreatorSplitDestination;
    }

    function setJkLabsSplitDestination(address newJkLabsSplitDestination) public {
        if (msg.sender != JK_LABS_ADDRESS) revert OnlyJkLabsCanAmend();
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotUpdateWhenCompletedOrCanceled();
        }
        jkLabsSplitDestination = newJkLabsSplitDestination;
    }
}

// src/governance/extensions/GovernorCountingSimple.sol

// Forked from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/extensions/GovernorCountingSimple.sol

/**
 * @dev Extension of {Governor} for simple vote counting.
 */
abstract contract GovernorCountingSimple is Governor {
    struct ProposalVote {
        uint256 proposalVoteCount;
        address[] addressesVoted;
        mapping(address => uint256) addressVoteCount;
    }

    uint256 public totalVotesCast; // Total votes cast in contest so far
    mapping(address => uint256) public addressTotalCastVoteCount;
    mapping(uint256 => ProposalVote) public proposalVoteStructs;

    mapping(uint256 => uint256[]) public votesToProposalIds;

    error MoreThanOneProposalWithThisManyVotes();
    error NotEnoughVotesLeft();

    error RankCannotBeZero();
    error RankIsNotInSortedRanks();
    error IndexHasNotBeenPopulated();

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function proposalVotes(uint256 proposalId) public view returns (uint256 voteCount) {
        return proposalVoteStructs[proposalId].proposalVoteCount;
    }

    /**
     * @dev Accessor to how many votes an address has cast for a given proposal.
     */
    function proposalAddressVotes(uint256 proposalId, address userAddress) public view returns (uint256 voteCount) {
        return proposalVoteStructs[proposalId].addressVoteCount[userAddress];
    }

    /**
     * @dev Accessor to which addresses have cast a vote for a given proposal.
     */
    function proposalAddressesHaveVoted(uint256 proposalId) public view returns (address[] memory) {
        ProposalVote storage proposalVote = proposalVoteStructs[proposalId];
        return proposalVote.addressesVoted;
    }

    /**
     * @dev Accessor to how many votes an address has cast total for the contest so far.
     */
    function contestAddressTotalVotesCast(address userAddress) public view returns (uint256 userTotalVotesCast) {
        return addressTotalCastVoteCount[userAddress];
    }

    /**
     * @dev Accessor to the internal vote counts for a given proposal.
     */
    function allProposalTotalVotes()
        public
        view
        returns (uint256[] memory proposalIdsReturn, uint256[] memory proposalVoteCountsArrayReturn)
    {
        uint256[] memory proposalIdsMemVar = getAllProposalIds();
        uint256[] memory proposalVoteCountsArray = new uint256[](proposalIdsMemVar.length);
        for (uint256 i = 0; i < proposalIdsMemVar.length; i++) {
            proposalVoteCountsArray[i] = proposalVoteStructs[proposalIdsMemVar[i]].proposalVoteCount;
        }
        return (proposalIdsMemVar, proposalVoteCountsArray);
    }

    /**
     * @dev Get the whole array in `votesToProposalIds` for a given votes amount.
     */
    function getProposalsWithThisManyVotes(uint256 votes)
        public
        view
        returns (uint256[] memory proposalsWithThisManyVotes)
    {
        return votesToProposalIds[votes];
    }

    /**
     * @dev Get the number of proposals that have a given number of votes.
     */
    function getNumProposalsWithThisManyVotes(uint256 votes) public view override returns (uint256 count) {
        return votesToProposalIds[votes].length;
    }

    /**
     * @dev Get the only proposal id with this many votes.
     * NOTE: Should only get called at a point at which you are sure there is only one proposal id
     *       with a certain number of votes (we only use it in the RewardsModule after ties have
     *       been checked for).
     */
    function getOnlyProposalIdWithThisManyVotes(uint256 votes) public view returns (uint256 proposalId) {
        if (votesToProposalIds[votes].length != 1) revert MoreThanOneProposalWithThisManyVotes();
        return votesToProposalIds[votes][0];
    }

    /**
     * @dev Get the idx of sortedRanks considered to hold the queried rank taking deleted proposals into account.
     *      A rank has to have > 0 votes to be considered valid.
     */
    function getRankIndex(uint256 rank) public view returns (uint256 rankIndex) {
        if (rank == 0) revert RankCannotBeZero();

        uint256 sortedRanksLength = sortedRanks.length; // only check state var once to save on gas
        uint256[] memory sortedRanksMemVar = sortedRanks; // only check state var once to save on gas

        uint256 counter = 1;
        for (uint256 index = 0; index < sortedRanksLength; index++) {
            // if this is a value of a deleted proposal or an ungarbage collected oldValue, go forwards without
            // incrementing the counter
            if (getNumProposalsWithThisManyVotes(sortedRanksMemVar[index]) == 0) {
                continue;
            }
            // if the counter is at the rank we are looking for, then return with it
            if (counter == rank) {
                return index;
            }
            counter++;
        }

        // if there's no valid index for that rank in sortedRanks, revert
        revert RankIsNotInSortedRanks();
    }

    /**
     * @dev Returns whether a given index in sortedRanks is tied or is below a tied rank.
     */
    function isOrIsBelowTiedRank(uint256 idx) public view returns (bool atOrBelowTiedRank) {
        if (idx > sortedRanks.length - 1) {
            // if `idx` hasn't been populated, then it's not a valid index to be checking and something is wrong
            revert IndexHasNotBeenPopulated();
        }

        for (uint256 index = 0; index < idx + 1; index++) {
            if (getNumProposalsWithThisManyVotes(sortedRanks[index]) > 1) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Remove this proposalId from the list of proposalIds that share its current votes
     *      value in votesToProposalIds.
     */
    function _rmProposalIdFromVotesMap(uint256 proposalId, uint256 votes) internal {
        uint256[] memory votesToPropIdMemVar = votesToProposalIds[votes]; // only check state var once to save on gas
        for (uint256 i = 0; i < votesToPropIdMemVar.length; i++) {
            if (votesToPropIdMemVar[i] == proposalId) {
                // swap with last item and pop bc we don't care about order.
                // makes things cleaner (than just deleting) and saves on gas if there end up being a ton of proposals that pass
                // through having a certain number of votes throughout the contest.
                votesToProposalIds[votes][i] = votesToPropIdMemVar[votesToPropIdMemVar.length - 1];
                votesToProposalIds[votes].pop();
                break;
            }
        }
    }

    /**
     * @dev See {Governor-_multiRmProposalIdFromForVotesMap}.
     */
    function _multiRmProposalIdFromVotesMap(uint256[] calldata proposalIdsToDelete) internal override {
        for (uint256 i = 0; i < proposalIdsToDelete.length; i++) {
            uint256 currentProposalId = proposalIdsToDelete[i];
            uint256 currentProposalsVotes = proposalVoteStructs[currentProposalId].proposalVoteCount;

            // remove this proposalId from the list of proposalIdsToDelete that share its current votes
            // value in votesToProposalIds
            _rmProposalIdFromVotesMap(currentProposalId, currentProposalsVotes);
        }
    }

    /**
     * @dev See {Governor-_countVote}.
     */
    function _countVote(uint256 proposalId, address account, uint256 numVotes, uint256 totalVotes) internal override {
        ProposalVote storage proposalVote = proposalVoteStructs[proposalId];

        if ((votingMerkleRoot != 0) && (numVotes > (totalVotes - addressTotalCastVoteCount[account]))) {
            revert NotEnoughVotesLeft();
        }

        bool firstTimeVoting = (proposalVote.addressVoteCount[account] == 0);

        proposalVote.proposalVoteCount += numVotes;
        proposalVote.addressVoteCount[account] += numVotes;

        if (firstTimeVoting) {
            proposalVote.addressesVoted.push(account);
        }
        addressTotalCastVoteCount[account] += numVotes;
        totalVotesCast += numVotes;

        // sorting and consequently rewards module compatibility is only available if downvoting is disabled and sorting enabled
        if (sortingEnabled == 1) {
            uint256 newVotes = proposalVote.proposalVoteCount; // only check state var once to save on gas
            uint256 oldVotes = newVotes - numVotes;

            // update map of forVotes => proposalId[] to be able to go from rank => proposalId.
            // if oldVotes is 0, then this proposal will not already be in this map, so we don't need to rm it
            if (oldVotes > 0) {
                _rmProposalIdFromVotesMap(proposalId, oldVotes);
            }
            votesToProposalIds[newVotes].push(proposalId);

            _updateRanks(oldVotes, newVotes);
        }
    }
}

// src/governance/extensions/GovernorEngagement.sol

/**
 * @dev Extension of {Governor} for engagement features.
 */
abstract contract GovernorEngagement is Governor {
    struct CommentCore {
        address author;
        uint256 timestamp;
        uint256 proposalId;
        string commentContent;
    }

    /**
     * @dev Emitted when a comment is created.
     */
    event CommentCreated(uint256 commentId);

    /**
     * @dev Emitted when comments are deleted.
     */
    event CommentsDeleted(uint256[] commentIds);

    uint256[] public commentIds;
    uint256[] public deletedCommentIds;
    mapping(uint256 => CommentCore) public comments;
    mapping(uint256 => uint256[]) public proposalComments;
    mapping(uint256 => bool) public commentIsDeleted;

    error OnlyCreatorOrAuthorCanDeleteComments(uint256 failedToDeleteCommentId);
    error CannotCommentWhenCompletedOrCanceled();

    /**
     * @dev Hashing function used to build the comment id from the comment details.
     */
    function hashComment(CommentCore memory commentObj) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(commentObj)));
    }

    /**
     * @dev Return all commentIds.
     */
    function getAllCommentIds() public view returns (uint256[] memory) {
        return commentIds;
    }

    /**
     * @dev Return all deleted commentIds.
     */
    function getAllDeletedCommentIds() public view returns (uint256[] memory) {
        return deletedCommentIds;
    }

    /**
     * @dev Return a comment object.
     */
    function getComment(uint256 commentId) public view returns (CommentCore memory) {
        return comments[commentId];
    }

    /**
     * @dev Return the array of commentIds on a given proposalId.
     */
    function getProposalComments(uint256 proposalId) public view returns (uint256[] memory) {
        return proposalComments[proposalId];
    }

    /**
     * @dev Comment on a proposal.
     *
     * Emits a {CommentCreated} event.
     */
    function comment(uint256 proposalId, string memory commentContent) public returns (uint256) {
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotCommentWhenCompletedOrCanceled();
        }

        CommentCore memory commentObject = CommentCore({
            author: msg.sender,
            timestamp: block.timestamp,
            proposalId: proposalId,
            commentContent: commentContent
        });
        uint256 commentId = hashComment(commentObject);

        commentIds.push(commentId);
        comments[commentId] = commentObject;
        proposalComments[proposalId].push(commentId);

        emit CommentCreated(commentId);

        return commentId;
    }

    /**
     * @dev Delete comments.
     *
     * Emits a {CommentsDeleted} event.
     */
    function deleteComments(uint256[] memory commentIdsParam) public {
        if (state() == ContestState.Completed || state() == ContestState.Canceled) {
            revert CannotDeleteWhenCompletedOrCanceled();
        }

        uint256 commentIdsParamMemVar = commentIdsParam.length;

        for (uint256 index = 0; index < commentIdsParamMemVar; index++) {
            uint256 currentCommentId = commentIdsParam[index];

            if ((msg.sender != creator) && (msg.sender != comments[currentCommentId].author)) {
                revert OnlyCreatorOrAuthorCanDeleteComments(currentCommentId);
            }

            if (!commentIsDeleted[currentCommentId]) {
                commentIsDeleted[currentCommentId] = true;
                deletedCommentIds.push(currentCommentId);
            }
        }

        emit CommentsDeleted(commentIdsParam);
    }
}

// src/modules/RewardsModule.sol

// Forked from OpenZeppelin Contracts (v4.7.0) (finance/PaymentSplitter.sol)

/**
 * @title RewardsModule
 * @dev This contract allows to split Ether payments among a group of accounts. The sender does not need to be aware
 * that the Ether will be split in this way, since it is handled transparently by the contract.
 *
 * The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each
 * account to a number of shares. Of all the Ether that this contract receives, each account will then be able to claim
 * an amount proportional to the percentage of total shares they were assigned. The distribution of shares is set at the
 * time of contract deployment and can't be updated thereafter.
 *
 * `RewardsModule` follows a _pull payment_ model. This means that payments are not automatically forwarded to the
 * accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release}
 * function.
 *
 * NOTE: This contract assumes that ERC20 tokens will behave similarly to native tokens (Ether). Rebasing tokens, and
 * tokens that apply fees during transfers, are likely to not be supported as expected. If in doubt, we encourage you
 * to run tests before sending real value to this contract.
 */
contract RewardsModule {
    event PayeeAdded(uint256 ranking, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event ERC20PaymentReleased(IERC20 indexed token, address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);
    event RewardWithdrawn(address by, uint256 amount);
    event ERC20RewardWithdrawn(IERC20 indexed token, address by, uint256 amount);

    uint256 public totalShares;
    uint256 public totalReleased;

    mapping(uint256 => uint256) public shares; // Getter for the amount of shares held by a ranking.
    mapping(uint256 => uint256) public released; // Getter for the amount of Ether already released to a ranking.
    uint256[] public payees;
    string private constant VERSION = "5.1"; // Private as to not clutter the ABI

    mapping(IERC20 => uint256) public erc20TotalReleased;
    mapping(IERC20 => mapping(uint256 => uint256)) public erc20Released;

    GovernorCountingSimple public underlyingContest;
    address public creator;
    bool public paysOutTarget; // If true, pay out target address; if false, pay out proposal author.
    bool public canceled; // A rewards module must be canceled in order to withdraw funds, and once canceled it can no longer release funds, only withdraw

    error PayeesSharesLengthMismatch();
    error MustHaveAtLeastOnePayee();
    error TotalSharesCannotBeZero();
    error MustHaveSortingEnabled();
    error ContestMustBeCompleted();
    error PayoutRankCannotBeZero();
    error RankingHasNoShares();
    error AccountNotDueNativePayment();
    error CannotPayOutToZeroAddress();
    error AccountNotDueERC20Payment();
    error OnlyCreatorCanWithdraw();
    error RankingCannotBeZero();
    error SharesCannotBeZero();
    error AccountAlreadyHasShares();
    error CannotReleaseCanceledModule();
    error MustBeCanceledToWithdraw();

    /**
     * @dev Creates an instance of `RewardsModule` where each ranking in `payees` is assigned the number of shares at
     * the matching position in the `shares` array.
     *
     * All rankings in `payees` must be non-zero. Both arrays must have the same non-zero length, and there must be no
     * duplicates in `payees`.
     */
    constructor(
        uint256[] memory payees_,
        uint256[] memory shares_,
        GovernorCountingSimple underlyingContest_,
        bool paysOutTarget_
    ) payable {
        if (payees_.length != shares_.length) revert PayeesSharesLengthMismatch();
        if (payees_.length == 0) revert MustHaveAtLeastOnePayee();

        for (uint256 i = 0; i < payees_.length; i++) {
            _addPayee(payees_[i], shares_[i]);
        }

        if (totalShares == 0) revert TotalSharesCannotBeZero();

        paysOutTarget = paysOutTarget_;
        underlyingContest = underlyingContest_;
        creator = msg.sender;
    }

    /**
     * @dev The Ether received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Ether without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Ether.
     */
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @dev Version of the rewards module.
     */
    function version() public pure returns (string memory) {
        return VERSION;
    }

    /**
     * @dev Getter for list of rankings that will be paid out.
     */
    function getPayees() public view returns (uint256[] memory) {
        return payees;
    }

    /**
     * @dev Getter for the underlying contest.
     */
    function getUnderlyingContest() public view returns (GovernorCountingSimple) {
        return underlyingContest;
    }

    /**
     * @dev Getter for the amount of payee's releasable Ether.
     */
    function releasable(uint256 ranking) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + totalReleased;
        return _pendingPayment(ranking, totalReceived, released[ranking]);
    }

    /**
     * @dev Getter for the amount of payee's releasable `token` tokens. `token` should be the address of an
     * IERC20 contract.
     */
    function releasable(IERC20 token, uint256 ranking) public view returns (uint256) {
        uint256 totalReceived = token.balanceOf(address(this)) + erc20TotalReleased[token];
        return _pendingPayment(ranking, totalReceived, erc20Released[token][ranking]);
    }

    /**
     * @dev Run release checks.
     */
    function runReleaseChecks(uint256 ranking) public view {
        if (underlyingContest.sortingEnabled() != 1) revert MustHaveSortingEnabled();
        if (underlyingContest.state() != Governor.ContestState.Completed) revert ContestMustBeCompleted();
        if (ranking == 0) revert PayoutRankCannotBeZero();
        if (shares[ranking] == 0) revert RankingHasNoShares();
        if (canceled == true) revert CannotReleaseCanceledModule();
    }

    /**
     * @dev Return address to pay out for a given ranking.
     */
    function getAddressToPayOut(uint256 ranking) public view returns (address) {
        address addressToPayOut;
        uint256 determinedRankingIdxInSortedRanks = underlyingContest.getRankIndex(ranking);

        // if the ranking that we land on is tied or it's below a tied ranking, send to creator
        if (underlyingContest.isOrIsBelowTiedRank(determinedRankingIdxInSortedRanks)) {
            addressToPayOut = creator;
        }
        // otherwise, determine proposal at ranking and pay out according to that
        else {
            uint256 rankValue = underlyingContest.sortedRanks(determinedRankingIdxInSortedRanks);
            Governor.ProposalCore memory rankingProposal = underlyingContest.getProposal(
                underlyingContest.getOnlyProposalIdWithThisManyVotes(rankValue) // if no ties there should only be one
            );
            addressToPayOut = paysOutTarget ? rankingProposal.targetMetadata.targetAddress : rankingProposal.author;
        }

        return addressToPayOut;
    }

    /**
     * @dev Cancels the rewards module.
     */
    function cancel() public {
        canceled = true;
    }

    /**
     * @dev Triggers a transfer to `ranking` of the amount of Ether they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */
    function release(uint256 ranking) public {
        runReleaseChecks(ranking);

        uint256 payment = releasable(ranking);

        if (payment == 0) revert AccountNotDueNativePayment();

        // totalReleased is the sum of all values in released.
        // If "totalReleased += payment" does not overflow, then "released[account] += payment" cannot overflow.
        totalReleased += payment;
        unchecked {
            released[ranking] += payment;
        }

        address payable addressToPayOut = payable(getAddressToPayOut(ranking));

        if (addressToPayOut == address(0)) revert CannotPayOutToZeroAddress();

        emit PaymentReleased(addressToPayOut, payment);
        Address.sendValue(addressToPayOut, payment);
    }

    /**
     * @dev Triggers a transfer to `ranking` of the amount of `token` tokens they are owed, according to their
     * percentage of the total shares and their previous withdrawals. `token` must be the address of an IERC20
     * contract.
     */
    function release(IERC20 token, uint256 ranking) public {
        runReleaseChecks(ranking);

        uint256 payment = releasable(token, ranking);

        if (payment == 0) revert AccountNotDueERC20Payment();

        // erc20TotalReleased[token] is the sum of all values in erc20Released[token].
        // If "erc20TotalReleased[token] += payment" does not overflow, then "erc20Released[token][account] += payment" cannot overflow.
        erc20TotalReleased[token] += payment;
        unchecked {
            erc20Released[token][ranking] += payment;
        }

        address payable addressToPayOut = payable(getAddressToPayOut(ranking));

        if (addressToPayOut == address(0)) revert CannotPayOutToZeroAddress();

        emit ERC20PaymentReleased(token, addressToPayOut, payment);
        SafeERC20.safeTransfer(token, addressToPayOut, payment);
    }

    function withdrawRewards() public {
        if (msg.sender != creator) revert OnlyCreatorCanWithdraw();
        if (canceled != true) revert MustBeCanceledToWithdraw();

        emit RewardWithdrawn(creator, address(this).balance);
        Address.sendValue(payable(creator), address(this).balance);
    }

    function withdrawRewards(IERC20 token) public {
        if (msg.sender != creator) revert OnlyCreatorCanWithdraw();

        emit ERC20RewardWithdrawn(token, creator, token.balanceOf(address(this)));
        SafeERC20.safeTransfer(token, payable(creator), token.balanceOf(address(this)));
    }

    /**
     * @dev internal logic for computing the pending payment of a `ranking` given the token historical balances and
     * already released amounts.
     */
    function _pendingPayment(uint256 ranking, uint256 totalReceived, uint256 alreadyReleased)
        private
        view
        returns (uint256)
    {
        return (totalReceived * shares[ranking]) / totalShares - alreadyReleased;
    }

    /**
     * @dev Add a new payee to the contract.
     * @param ranking The ranking of the payee to add.
     * @param shares_ The number of shares owned by the payee.
     */
    function _addPayee(uint256 ranking, uint256 shares_) private {
        if (ranking == 0) revert RankingCannotBeZero();
        if (shares_ == 0) revert SharesCannotBeZero();
        if (shares[ranking] != 0) revert AccountAlreadyHasShares();

        payees.push(ranking);
        shares[ranking] = shares_;
        totalShares = totalShares + shares_;
        emit PayeeAdded(ranking, shares_);
    }
}

// src/governance/extensions/GovernorModuleRegistry.sol

/**
 * @dev Extension of {Governor} for module management.
 */
abstract contract GovernorModuleRegistry is Governor {
    event OfficialRewardsModuleSet(RewardsModule oldOfficialRewardsModule, RewardsModule newOfficialRewardsModule);

    RewardsModule public officialRewardsModule;

    error OnlyCreatorCanSetRewardsModule();

    /**
     * @dev Get the official rewards module contract for this contest (effectively reverse record).
     */
    function setOfficialRewardsModule(RewardsModule officialRewardsModule_) public {
        if (msg.sender != creator) revert OnlyCreatorCanSetRewardsModule();
        RewardsModule oldOfficialRewardsModule = officialRewardsModule;
        officialRewardsModule = officialRewardsModule_;
        emit OfficialRewardsModuleSet(oldOfficialRewardsModule, officialRewardsModule_);
    }
}

// src/Contest.sol

contract Contest is GovernorCountingSimple, GovernorModuleRegistry, GovernorEngagement {
    error PayPerVoteMustBeEnabledForAnyoneCanVote();

    constructor(
        string memory _name,
        string memory _prompt,
        bytes32 _submissionMerkleRoot,
        bytes32 _votingMerkleRoot,
        ConstructorArgs memory _constructorArgs
    )
        Governor(_name, _prompt, _constructorArgs)
        GovernorSorting(_constructorArgs.intConstructorArgs.sortingEnabled, _constructorArgs.intConstructorArgs.rankLimit)
        GovernorMerkleVotes(_submissionMerkleRoot, _votingMerkleRoot)
    {
        if (_votingMerkleRoot == 0 && _constructorArgs.intConstructorArgs.payPerVote == 0) {
            revert PayPerVoteMustBeEnabledForAnyoneCanVote();
        }
    }
}

