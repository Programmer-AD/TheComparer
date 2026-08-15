# <mark>The project is deprecated, see [reasons](#deprecation-note) below</mark>

# About project

The Comparer is frontend-only utility which helps to find out hidden preferences using set of simple comparsions.
See more project related information in [docs](./docs).


# Technologies

- Angular 22
- Specific browser features:
  - Indexed DB (as data store)
  - Canvas 2D Context (image rescaling)
  - File handling APIs (handling of packs export/import)


# Deprecation note

Deprecated as of 16 Aug. 2026.

## Reasons

Primary deprecation reason is that the **idea looked more interesting than end project**.
None of my surronding got the idea and even for me its boring to use (especially pack creation). 

Other reason is that **pack files are too big to preload them or even smoothly push into repository**.
Since there are no backend, to exchange packs easily **all images are included in pack file**.
This causes huge size and removes any possibility to deffer image loading.

## Unimplemented parts

After deprecation there are no plans to work on unimplemented parts.
Those part include:
- **Validations** - were omitted for first version since they are only applicable for pack creation and cannot really cause any issues;
- **Localization** - one of features which was planned to implement;
- **Pack format rethinking** - some way to decrease pack size (e.g. move out the images to separate file) which would allow;
- **Common pack prefetching** - thightly bound to previous item, currently you need click button to load common packs which is annoying.
