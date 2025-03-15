import { init, GameLoop } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';
import { game } from './game.js'

document.addEventListener("DOMContentLoaded", function () {
    const { canvas, context } = init();

    // Game loop definition
    const loop = GameLoop({
        update: (dt) => game.update(dt),
        render: () => game.render(),
    });

    // Initialize and start the game
    game.setup(canvas, context);
    loop.start();
});
