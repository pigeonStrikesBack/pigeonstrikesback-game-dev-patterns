import { SpriteClass } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';

function getRect(collider) {
    
    const rect = {
        x: collider.x + (collider.anchor.x * collider.width),
        y: collider.y + (collider.anchor.x * collider.height),
        width: collider.width,
        height: collider.height,
    }


    while (collider.parent) {
        collider = collider.parent;
        rect.x += collider.x + (collider.anchor.x );
        rect.y += collider.y + (collider.anchor.y );
    }

    return rect;
}

export class Collider extends SpriteClass {
    constructor(overrides = { color: green }) {
        const gameObject = Object.assign({
            image: null,
            ttl: null,
            opacity: .2
        },
            overrides,
            parent
        )

        super(gameObject)
    }

    collidesWith(collider) {
        const rect1 = getRect(this);
        const rect2 = getRect(collider);

        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }
}