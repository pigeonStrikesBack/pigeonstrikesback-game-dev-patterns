# Exercise Overview:

You will create a basic achievement system where the player picks up items in the game. Upon picking up an item, an achievement is unlocked, and an associated sound plays. The achievement will be displayed in the form of a text message that will disappear after a short time.

## Requirements:

- A **Player sprite** that can move around the game world.
- **Item sprites** that the player can collect.
- A **custom Observer pattern** to handle notifications when an item is picked up and when an achievement is unlocked.
- **Achievement System** that:
  - Unlocks achievements when certain items are collected.
  - Displays a text message with the achievement name.
  - Plays a sound when the achievement is unlocked.

## Steps to Complete the Exercise:

1. **Set Up Phaser Game:**
   Initialize a simple Phaser game with basic configurations like width, height, and background color.

2. **Create the Player and Item Sprites:**
   Create a player sprite that can move and item sprites scattered in the game world that can be picked up.

3. **Implement the Observer Pattern:**
   - The **Achievement System** will act as an observer, listening to events triggered by the collection of items.
   - The **Player** will be the subject, notifying the achievement system when an item is picked up.

4. **Create Achievements:**
   - For example, unlocking "First Item" when the first item is collected, and "Item Hoarder" when 5 items are collected.
   
5. **Display the Achievement:**
   - When an achievement is unlocked, show a text message on the screen and play a sound.

---

## [Example Solution](./example_solution.md)

