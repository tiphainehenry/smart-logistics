/**
 * This file is part of the 1st Solidity Gas Golfing Contest.
 *
 * This work is licensed under Creative Commons Attribution ShareAlike 3.0.
 * https://creativecommons.org/licenses/by-sa/3.0/
 *
 * Author: Greg Hysen (hyszeth.eth)
 * Date: June 2018
 * Description: Sorts an array of integers.
 *              The primary algorithm is quicksort.
 *              The pivot is chosen using Median-of-3.
 *              Hoare partitioning is used to divide the array.
 *              Insertion sort is used for small partitions (<=7).
 *
 */

pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;


contract Sort {

    

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }





     function sort(uint[] memory input)
      public
      pure
      returns(uint[] memory)
    {
        // Base case
        if(input.length == 0) return input;

        // Run quicksort
        quickSort(
            input,                      // input array
            0,                          // start index
            input.length - 1,            // end index
            input[0],                   // value at start index
            input[input.length - 1]      // value and end index
        );
        return input;
     }

    /**
     * @dev Sorts an array of integers.
     *      The primary algorithm is quicksort.
     *      The pivot is chosen using Median-of-3.
     *      Hoare partitioning is used to divide the array.
     *      Insertion sort is used for small partitions (<=7).
     *
     * @param input The list of integers to sort.
     * @param lo Start index
     * @param hi End index
     * @param loElem Element at `lo`
     * @param hiElem Element at `hi`
     */
    function quickSort(
        uint[] memory input,
        uint lo,
        uint hi,
        uint loElem,
        uint hiElem
    )
     private
     pure
    {
        // Pivot (Median of 3)
        uint i = uint((hi+lo)/2);
        uint pivot = input[i];
        if(loElem >= pivot) { // [pivot, loElem] [hiElem]
            if(loElem <= hiElem) {
                // [pivot, loElem, hiElem]
                // Only swap pivot and loElem
                input[lo] = pivot;
                input[i] = loElem;
                (loElem, pivot) = (pivot, loElem);
            } else {
                // [pivot, hiElem, loElem] or [hiElem, pivot, loElem]
                if(hiElem >= pivot) {
                    // [pivot, hiElem, loElem]
                    input[lo] = pivot;
                    input[i] = hiElem;
                    input[hi] = loElem;
                    (loElem, pivot, hiElem) = (pivot, hiElem, loElem);
                } else {
                    // [hiElem, pivot, loElem]
                    input[lo] = hiElem;
                    input[hi] = loElem;
                    (loElem, hiElem) = (hiElem, loElem);
                }
            }
        } else {// if(loElem < pivot) { // [loElem, pivot] [hiElem]
            if(pivot >= hiElem) {
                // [loElem, hiElem, pivot] or [hiElem, loElem, pivot]
                if(hiElem >= loElem) {
                    // [loElem, hiElem, pivot]
                    input[i] = hiElem;
                    input[hi] = pivot;
                    (pivot, hiElem) = (hiElem, pivot);
                } else {
                    // [hiElem, loElem, pivot]
                    input[lo] = hiElem;
                    input[i] =  loElem;
                    input[hi] = pivot;
                    (loElem, pivot, hiElem) = (hiElem, loElem, pivot);
                }
            } else {
                // [loElem, pivot, hiElem]
                // Do nothing
            }
        }

        // Hoare partition algorithm
        // Note we skip the lo/hi elements because
        // they're already in the correct position.
        uint iElem;
        uint jElem;
        uint j = hi;
        i = lo;
        while(true) {
            // Bounds checking has been omitted for efficiency.
            // The Median-of-Three mitigates this edge case, but does not eliminate it.
            // In practice, add bounds checking to be safe.
            while((iElem=input[uint(++i)]) <= pivot) {}
            while((jElem=input[uint(--j)]) >= pivot) {}

            // When `i` and `j` cross we're finished partitioning.
            if(i >= j) {
                // Sort left
                if(j - lo <= 7) insertionSort(input, lo, j);
                else            quickSort(input, lo, j, loElem, jElem);
                // Sort right
                if(hi - i <= 7) return insertionSort(input, i, hi);
                                return  quickSort(input, i, hi, iElem, hiElem);
            }

            // Swap elements between partitions.
            input[uint(i)] = jElem;
            input[uint(j)] = iElem;
        }
    }

    /**
     * @dev Sorts an array of integers using a modified Insertion Sort.
     *      Maximum length is 7. For efficiency, we've completely unrolled
     *      the insertion sort loop. This saves about 100k gas.
     *
     * @param input The list of integers to sort.
     * @param lo Start index
     * @param hi End index
     */
    function insertionSort(
        uint[] memory input,
        uint lo,
        uint hi
    )
        private
        pure
    {
        // Base case
        if(lo == hi) return;
        
        // Increment `hi` so we can use `==` in our exit checks
        ++hi;

        // A variable is created as-needed for each element of `input`,
        // following alphabetical naming: [a, b, c, d, e, f, g]
        uint a = input[lo];
        // Index into `input`
        uint i = lo + 1;

        //// Run Insertion Sort ////

        // Iteration 1
        uint b = input[i];
        if(a > b) {
            (a, b) = (b, a);
        }
        if(++i == hi) {
            input[lo++] = a;
            input[lo++] = b;
            return;
        }

        // Iteration 2
        uint c = input[i];
        if(b > c) {
            (b, c) = (c, b);
            if(a > b) {
                (a, b) = (b, a);
            }
        }
        if(++i == hi) {
            input[lo++] = a;
            input[lo++] = b;
            input[lo++] = c;
            return;
        }

        // Iteration 3
        uint d = input[i];
        if(c > d) {
            (c, d) = (d, c);
            if(b > c) {
                (b, c) = (c, b);
                if(a > b) {
                    (a, b) = (b, a);
                }
            }
        }
        if(++i == hi) {
            input[lo++] = a;
            input[lo++] = b;
            input[lo++] = c;
            input[lo++] = d;
            return;
        }

        // Iteration 4
        uint e = input[i];
        if(d > e) {
            (d, e) = (e, d);
            if(c > d) {
                (c, d) = (d, c);
                if(b > c) {
                    (b, c) = (c, b);
                    if(a > b) {
                        (a, b) = (b, a);
                    }
                }
            }
        }
        if(++i == hi) {
            input[lo++] = a;
            input[lo++] = b;
            input[lo++] = c;
            input[lo++] = d;
            input[lo++] = e;
            return;
        }

        // Iteration 5
        uint f = input[i];
        if(e > f) {
            (e, f) = (f, e);
            if(d > e) {
                (d, e) = (e, d);
                if(c > d) {
                    (c, d) = (d, c);
                    if(b > c) {
                        (b, c) = (c, b);
                        if(a > b) {
                            (a, b) = (b, a);
                        }
                    }
                }
            }
        }
        if(++i == hi) {
            input[lo++] = a;
            input[lo++] = b;
            input[lo++] = c;
            input[lo++] = d;
            input[lo++] = e;
            input[lo++] = f;
            return;
        }

        // Iteration 6
        uint g = input[i];
        if(f > g) {
            (f, g) = (g, f);
            if(e > f) {
                (e, f) = (f, e);
                if(d > e) {
                    (d, e) = (e, d);
                    if(c > d) {
                        (c, d) = (d, c);
                        if(b > c) {
                            (b, c) = (c, b);
                            if(a > b) {
                                (a, b) = (b, a);
                            }
                        }
                    }
                }
            }
        }
        if(++i == hi) {
            input[lo++] = a;
            input[lo++] = b;
            input[lo++] = c;
            input[lo++] = d;
            input[lo++] = e;
            input[lo++] = f;
            input[lo++] = g;
            return;
        }

        // Iteration 7
        uint h = input[i];
        if(g > h) {
            (g, h) = (h, g);
            if(f > g) {
                (f, g) = (g, f);
                if(e > f) {
                    (e, f) = (f, e);
                    if(d > e) {
                        (d, e) = (e, d);
                        if(c > d) {
                            (c, d) = (d, c);
                            if(b > c) {
                                (b, c) = (c, b);
                                if(a > b) {
                                    (a, b) = (b, a);
                                }
                            }
                        }
                    }
                }
            }
        }
        if(++i == hi) {
            input[lo++] = a;
            input[lo++] = b;
            input[lo++] = c;
            input[lo++] = d;
            input[lo++] = e;
            input[lo++] = f;
            input[lo++] = g;
            input[lo++] = h;
            return;
        }
    }
}
