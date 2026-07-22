---
aliases:
  - Sticky mode
tags:
  - comparison-mode
---
# Sticky mode

**Sticky mode** is [Comparison Mode](../../glossary/comparison-mode.md) where the [Item](../../glossary/item.md)  that wins comparison stays for next round, but another one goes away forever.
It is suitable to find a single wining option in a fast way.

## Mode description

**Allows equals**: No

### General logic

Item that was selected stays for next round and then compared with random one.

### Pair selection

To form a comparison point we:
- Take a winner of previous comparison (or random item for first round)
- Random item

### Comparison count estimation

The count of estimation is estimated according to following formula:
`amount of items - 1`

## Result look

A winner item in the top.
A list of selections in comparisons.
