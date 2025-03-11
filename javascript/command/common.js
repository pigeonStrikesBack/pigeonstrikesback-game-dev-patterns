const CANVAS = Object.freeze({
    width: 400,
    height: 400
})

class Entity {
    constructor(x, y, w = 10, h = 10) {
        this._color = "white"; // Default color
        this._size = createVector(w, h); // Size of the rectangle
        this._pos = createVector(x - w / 2, y - h / 2); // Position, centered
    }

    // Set the size of the Entity
    setSize(w, h) {
        this._size.set(w, h);
        return this._size;
    }

    // Set the position of the Entity, centered
    setPos(x, y) {
        this._pos.set(x - this._size.x / 2, y - this._size.y / 2);
        return this._pos;
    }

    // Move the Entity by a certain number of pixels
    move(x, y) {
        this._pos.add(x, y); // Update position vector
    }

    // Draw the Entity as a rectangle
    draw() {
        fill(this._color);
        noStroke();
        rect(this._pos.x, this._pos.y, this._size.x, this._size.y);
    }
}
