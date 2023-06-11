# JOE A PLATFORMER CHANGE LOG

## 2023-06-10: 1.1.0, The Bullet Update
- Added canon blocks! Activate them with a chain, and then they will shoot a bullet with the specified direction, speed, and size.
- Added bullets! These come from canons, and act like blocks that can move around. Only some blocks can be used with bullets.
- Added the loop option to chain start blocks. It is enabled by default. Its behaviour is self-explanatory.
- Added the piercing field, which lets bullets survive multiple collisions with the player.
- Blocks with no texture now get draw as missing texture. For Fun.
- Fixed a bug where xOffset and yOffset would not affect blocks when drawing the block select bar.
- the graphics are kind of placeholer, but i also dont plan on replacing them

## 2023-06-09: 1.0.0, The Portal Update
- Added portal lines display. Press P to toggle it. When active, portals will draw a line to their destination.
- Due to limitations with the original game, I can't make it reactive whenever you change the X/Y values when editing portals. Sorry.
- ...But, that doesn't really matter because of the clipboard feature! Select a tile with C+Middle Click, and its position will be copied to the clipboard. The next portal you place will have its destination set to that position.
- Advanced portal info displays the current clipboard position.
- mobile users go to hell