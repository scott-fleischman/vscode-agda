# vscode-agda

Agda support for Visual Studio Code

## Status

This extension has not yet been uploaded to the [Visual Studio
Marketplace](https://marketplace.visualstudio.com/). I am planning to make an
initial release once basic support for interaction points (e.g., goal dispaly
and filling) are implemented.

## Current Features

- highlighting
  - [x] approximate synchronous highlighting
  - [x] accurate asynchronous highlighting (`agda --interaction`)

- static analysis
  - [x] error diagnostics

## Current Issues

The current implementation of accurate highlighting via `agda --interaction` has
some usability issues. In particular, it uses editor decorations for the
highlighting and these are cleared for a given editor when it is marked as no
longer visible in the application workspace. For instance, this visibility
change happens if you are editing a file with multiple tabs open and switch
away from the current tab to another (the other tab becoming visible now).

What we currently do is cache the highlighting data so that when a tab for a
loaded agda file is reactivated the highlighting is reapplied. However, this
only happens if the editor for the tab is not "dirty", i.e., if it is not in an
unsaved state when the tab is reactivated.

The reason we do not reapply the highlighting data for a "dirty" editor tab is
because the highlighting data computed from `agda` is from the last known state
of the file on the filesystem, which no longer corresponds to the contents of
the editor buffer for that file.

There are two solutions to this problem we are investigating.

One solution would be to recompute the highlighting data from the buffer
decorations directly. This is probably not possible without changes to the
vscode API and even if it is it might be hard to do properly.

Another more likely solution would be to compute deltas to the highlighting data
based on buffer edits the user has made since the file was last loaded into
`agda`. This is technically straightforward but requires some care to implement
efficiently and without introducing other issues.

But after having said all of that, this limitation is not a show stopper in
practice anyway. The user can either take care to save the current tab before
switching to another or just manually reload (or save) the file again once they
reactivate the tab and that will refresh the highlighting.
