# Cetno-Licho game
Cetno-Licho is a simple yet engaging two-player strategy game brought to life as a test of GPT o1 model supported development. This game started as a nostalgic idea from childhood game played countless times with pen and paper, now reimagined for the digital world. THe title words come from Proto-Slavic languages. **Cetno** meand something regular or even. **Licho** meant something strange, rogue or odd. In the game the words simply mean **odd and even numbers**.  

The game is accessible here: https://xraysight.github.io/cetno-licho/

## How to play
- Players: 2
- Objective: Place the highest possible number on the grid.
- Rules:
  - The game is played on a 6x7 grid (6 columns and 7 rows).
  - Some cells are blocked and cannot be used.
  - Player 1 starts by placing the number 1 on any unblocked cell.
  - Players take turns placing the next number on an adjacent cell.
  - Cetno mode - numbers can only be placed when an even number of neighboring cells are taken.
  - Licho mode - numbers can only be placed when an odd number of neighboring cells are taken.
  - The game ends when a player cannot make a move.
  - The last player to make a valid move wins.
  - Use the "Settings" button to configure game settings.
-  When playing with computer Easy and Normal difficulty can be selected.
-  The game board shape can be randomized in the game settings.

## Technologies Used
- Built with HTML, and structured with external CSS (`style.css`) and JavaScript (`script.js`) files for cleaner code organization.

## Key Enhancements
- **Code Organization:** CSS and JavaScript have been refactored into external files (`style.css` and `script.js`) for improved maintainability and readability.
- **Accessibility:** Significant improvements have been made to enhance accessibility, including:
    - Robust keyboard navigation for all interactive elements, including the game board cells.
    - ARIA attributes (roles, states, and properties like `aria-label`, `aria-disabled`) for better screen reader support and understanding of game elements and status.
    - Improved color contrast for player pieces against their cell backgrounds.
    - Focus management for modal dialogs (Help and Settings overlays) to ensure focus is trapped and restored correctly.
    - Live regions (`aria-live`) for game status and winner announcements.
- **Visual Polish:** Minor visual and responsive design adjustments have been implemented for a better user experience across different screen sizes.
- **Code Readability:** JavaScript code has been commented more thoroughly to explain complex functions and logic.

## Development
This project was developed with the assistance of an AI model, focusing on iterative refinement of code, accessibility, and documentation.
The process involved:
- Initial game logic and UI scaffolding.
- Separating inline CSS and JavaScript into external files.
- Enhancing JavaScript code readability with comments and consistent formatting.
- Conducting an accessibility review and implementing improvements for keyboard navigation, ARIA support, and focus management.
- Performing a visual polish review to improve UI elements like color contrast and responsiveness.
- Reviewing and confirming the soundness of the core game logic.
- Updating documentation (this README) to reflect changes.

[end of README.md]
