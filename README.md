# Licho game
Licho is a simple yet engaging two-player strategy game brought to life through the power of ChatGPT Canvas-supported development. This game started as a nostalgic idea from childhood—a game played countless times with pen and paper, now reimagined for the digital world.

The game is played on a 6x7 grid, with players taking turns placing numbers in adjacent cells, aiming to go as far as possible while following specific rules. Licho brings back the memories of old-school, strategic fun, where each move counts and a little bit of luck can go a long way.

## How to play
- Players: 2 (the second one is a computer opponent).
- Objective: Place the highest possible number on the grid.
- Rules:
  - The first player places the number 1 on any unblocked cell.
  - The next player places the number 2 on a neighboring cell (horizontally, vertically, or diagonally).
  - Subsequent moves must be made in cells that are adjacent to the last placed number, with the condition that the number can only be placed in a cell if there is an odd number of already numbered neighboring cells.
  - The game continues until no valid moves are left. The player who cannot make a move loses.

## Roadmap (potentially)
- Allow for human player 2.
- Generate a shape of the the board dynamically every time.
- Higher difficulty level, since the computer player is pretty easy for now.

## Technologies Used
- HTML, CSS, JavaScript: Core web technologies used to build the interactive gameplay.
