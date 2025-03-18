
# Exercise 2: Shared Bullet Sprite in a Top-Down Shooter  

## Goal
Create a simple player that can fire bullets.  

## Instructions
- Create one `BulletType` that holds the shared bullet texture.  
- Each bullet object stores `x`, `y`, and `angle` (extrinsic state) and uses the shared texture when rendering.  
- On mouse click (or key press), spawn a bullet at player position and move it forward.  

## Bonus

Stretch goal: Add a max bullet limit and reuse bullets (you'll end up brushing against pooling without needing a full Pool pattern!).  