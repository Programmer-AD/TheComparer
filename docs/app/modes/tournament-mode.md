---
aliases:
  - Tournament mode
tags:
  - comparison-mode
---
# Tournament mode

**Tournament mode** is [Comparison Mode](../../glossary/comparison-mode.md) where [[Item]]s are compared like teams on tournament - winners go to next round and compared with each other, while others get dropped.

It is suitable to find the best item and track other preferences.
This mode does not provide real rating-like evaluation since it could be that all items in one semi-finalist path would be worse then all in another one which makes it a uneven.

## Mode description

**Allows equals**: No

### General logic

Items that were selected stay for next round and compared with each other.

If count of items doesn't fit the grid ideally, some item with most comparisons would randomly get to next round. 
Worst-case example:
> Round 1: 33 items: 16 pairs + 1 item
> Round 2: 17 items: 8 pairs + 1 item
> Round 3: 9 items: 4 pairs + 1 item
> Round 4: 5 items: 2 pairs + 1 item
> Round 5: 2 items: 1 pair

### Pair selection

To form a comparison point we initially take 2 random items.
Then we randomly compare items that were selected in previous round.

### Comparison count estimation

The count of estimation is estimated according to following algorithm:
- `remaining item count = item count`
- `While item count > 1`:
    - `pair count = remaining item count / 2`
    - `leftover item = remaining item count % 2`
    - `estimate += pair count`
    - `remaining item count = pair count + leftover item`

## Result look

Ideally, as a tournament tree.
For now as list of items ordered by won comparison count.
