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

| Name                  | Default | Description                                      |
| --------------------- | ------- | ------------------------------------------------ |
| Amount of rounds      | 5       | Amount of comparison rounds                      |
| Coefficient           | 200     | A maximum rating change in one selection         |
| Max rating difference | 400     | A maximum difference in rating of compared items |

### General logic

Each item gets a 2000 rating initially.
Then during few comparison rounds the rating gets updated. 

The rating is updated using ELO formulas:
> Estimated result = `1 / (1 + 10**((opponent rating - item rating)/400))`;
> Rating update = `item rating + Coefficient * (Actual result - Estimated result)`;
> Result values: 0 - item was not selected, 0.5 - equal, 1 - selected;

### Pair selection

To form a comparison pair we:
- select item with smallest compare participation times and highest rating (if few - random of them)
- select random item with smallest compare participation times and rating difference within allowed limit (if no such items - ease rating difference requirement)

This way all items would be compared same amount of times.

### Comparison count estimation

The count of estimation is estimated according to following formula:
`Amount of rounds * amount of items / 2`

## Result look

Grid of all [Item](../../glossary/item.md)s sorted by rating descending.
