import { Sprite } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';
import { getRandomHSVColor } from './color.js';

// Entity class to represent the player or any other game object
export class Entity {
    // Constructor to initialize the entity with position (x, y), size (w, h), and color
    constructor(x, y, w = 10, h = 10, color = 'random') {
        // Create a sprite using Kontra.js with the provided position, size, and color
        this.sprite = Sprite({
            x,  // X position of the entity
            y,  // Y position of the entity
            width: w,  // Width of the entity
            height: h,  // Height of the entity
            color: color === 'random' ? getRandomHSVColor() : color,  // If color is 'random', generate a random color
            anchor: { x: 0.5, y: 0.5 }  // Anchor point for the sprite, center of the entity
        });
    }

    // Method to move the entity by a certain amount in the x and y directions
    move(dx, dy, speed) {
        this.sprite.x += dx * speed;  // Update the x position
        this.sprite.y += dy * speed;  // Update the y position
    }

    // Render the entity on the screen using the sprite's render method
    render() {
        this.sprite.render();  // Draw the sprite on the canvas
    }
}

// Base class for commands that affect entities (abstract command class)
export class EntityCommand {
    constructor() {
        // Constructor can be left empty or expanded in the future
    }

    // Abstract method to be implemented by specific command subclasses
    execute(entity) {
        throw new Error("execute() must be implemented in subclass");
    }

    undo(entity) {
        throw new Error("undo() must be implemented in subclass");
    }

    // Return a string representation of the command for debugging/logging purposes
    toString() {
        return this.constructor.name;  // Default string format: Class name of the command
    }
}

// Command class to move an entity in a given direction with a specified speed
export class EntityMoveCommand extends EntityCommand {
    constructor(dx, dy, speed = 10) {
        super()
        this.direction = { x: dx, y: dy };  // Set the direction of movement (dx, dy)
        this.speed = speed;  // Set the movement speed
    }

    // Implement the execute method to perform the move on the entity
    execute(entity) {
        entity.move(this.direction.x, this.direction.y, this.speed);  // Move the entity based on the direction and speed
    }

    undo(entity) {
        entity.move(-this.direction.x, -this.direction.y, this.speed);
    }

    // Return a string describing the command (useful for debugging/logging)
    toString() {
        return `EntityMoveCommand -> direction: (${this.direction.x}, ${this.direction.y}), speed: ${this.speed} pixels`;
    }
}
