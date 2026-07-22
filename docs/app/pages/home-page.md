---
aliases:
  - Home Page
tags:
  - page
---
# Home Page

A start page of the application.

Contains:
- Welcome title
- Little description
- Grid of [Comparison session](../../glossary/comparison-session.md)s
    - Clicking on row should navigate to [Comparison page](comparison-page.md)
    - Should have drop down filter (All, Unfinished, Finished)
- Grid of imported [Item Pack](../../glossary/item-pack.md)s
    - Header has:
        - "Create new pack" button - adds empty pack and navigates to [Pack management page](pack-management-page.md)
        - "Import pack" button - adds pack from file
    - Each row has:
        - Click on row navigates to [Comparison start page](comparison-start-page.md) with selected pack
        - "Download" button - downloads pack as file
        - "Delete" button - removes pack from the list
