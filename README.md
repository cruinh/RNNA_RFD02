## Intro

This is a simple mobile app listing all pokemon reported by `pokeapi.co/api/v2/pokemon`.  It was generated via `@react-native-community/cli init` and customized by hand.

![preview image](https://raw.githubusercontent.com/cruinh/RNNA_RFD02/refs/heads/main/app_preview.png)

The point of this project is to be used as a development target for speedrunning the initial creation of a fresh react native app, both for practice and for exploring basic differences between new major versions of react native.

## Note

To reiterate: this is a **completed** attempt at the speedrun described below.  To attempt a run yourself, all you need is a working, local react native development environment, an internet connection, and the rules.

## Speedrun Rules

The requirements for this run are as follows

- Start the project by generating a new react native app using `@react-native-community/cli init`
- Use the following npm packages:
  - react-native-safe-area-context
  - react-native-screens
  - axios
  - @react-navigation/elements
  - @react-navigation/native-stack
  - @react-navigation/native
  - @redux-js/toolkit
  - react-redux
- Rewrite the content of the app to display a flatlist.
- the list should display every pokemon returned by `https://pokeapi.co/api/v2/pokemon/`
- list should include infinite scroll and pull-to-refresh features
- items in the list should simply contain the pokemon's name
- tapping any item should navigate to a detail screen
- the detail screen should display the following details of the selected pokemon
  - name and number
  - "flavor text".  tapping this should allow cycling through all available versions of the flavor text from various games.
  - sprites for the pokemon
    - front and back for the default, shiny, female and female shiny variants
- the detail screen should also implement pull-to-refresh in order to reset the screen and re-fetch the detail information.

## How to run

You may wish to track your times running this exercise by using [LiveSplit](https://livesplit.org).  A set of splits for this program are provided in the `livesplit` folder at the root of the project. 