---
aliases:
  - ELO Ranking mode
tags:
  - comparison-mode
---
# ELO Ranking mode

**ELO Ranking mode** is [Comparison Mode](../../glossary/comparison-mode.md) where the item rating is built using ELO System.
It allows to build a full overview of ones preferences.

## Mode description

**Allows equals**: Yes

## Params

| Name                  | Default | Description                             |
| --------------------- | ------- | --------------------------------------- |
| Amount of rounds      | 5       | Amount of comparison rounds             |
| Starting rating delta | 60      | A maximum rating change for first round |
| Ending rating delta   | 10      | A maximum rating change for last round  |

### General logic

Each item gets a 2000 rating initially.
Then during few comparison rounds the rating gets updated. 

The rating is updated using ELO formulas:
> Estimated result = `1 / (1 + 10**((opponent rating - item rating)/400))`;
> Rating update = `item rating + Coefficient * (Actual result - Estimated result)`;
> Where Coefficient decreases from starting rating delta to ending one across rounds;
> Result values: 0 - item was not selected, 0.5 - equal, 1 - selected;

### Pair selection

To form a comparison pair we:
- select random item with smallest compare participation times
- select item with nearest rating to first one with smallest compare participation times

This way all items would be compared same amount of times.

### Comparison count estimation

The count of estimation is estimated according to following formula:
`Amount of rounds * amount of items / 2`

## Result look

Grid of all [Item](../../glossary/item.md)s sorted by rating descending.
