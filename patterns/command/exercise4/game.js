import { Text, Vector } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';
import { PlayerEntity, EnemyEntity } from './entities.js';
import { Keyboard } from './keyboard.js';

export const game = {

    setup(canvas, context) {
        this.canvas = canvas;
        this.context = context;

        this.player = new PlayerEntity({
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: 20,
            height: 20,
            color: "green",
            anchor: { x: .5, y: .5 }
        }, 100, 100);

        // Create an enemy a bit offset from the player
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 200;
        const points = [];

        for (let i = 0; i < 64; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            points.push(Vector(x, y));
        }

        this.enemy = new EnemyEntity({
            x: centerX + radius,
            y: centerY,
            width: 20,
            height: 20,
            color: 'red',
            anchor: { x: .5, y: .5 }
        }, 50, 50, points);
        
        
        Keyboard.setup([
            'w', 'a', 's', 'd',
            'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
            'k'
        ]);

        this.infoText = Text({
            text: "Move with WASD or Arrow keys.\nPress [K] to attack the enemy.",
            font: "16px Arial",
            color: "black",
            x: canvas.width / 2,
            y: canvas.height - 20,
            anchor: { x: 0.5, y: 1 }
        });
    },

    handleInput() {
        Keyboard.update();

        const direction = Vector(0, 0);
        if (Keyboard.getKeyState('w').down || Keyboard.getKeyState('ArrowUp').down) {
            direction.y -= 1;
        }
        if (Keyboard.getKeyState('s').down || Keyboard.getKeyState('ArrowDown').down) {
            direction.y += 1;
        }
        if (Keyboard.getKeyState('a').down || Keyboard.getKeyState('ArrowLeft').down) {
            direction.x -= 1;
        }
        if (Keyboard.getKeyState('d').down || Keyboard.getKeyState('ArrowRight').down) {
            direction.x += 1;
        }

        const cmd = this.player.MoveCommand(direction.normalize())
        this.player.enqueueCommand(cmd);

        if (Keyboard.getKeyState('k').isPressed) {
            const attackCommand = this.player.AttackCommand(this.enemy, 10);
            this.player.enqueueCommand(attackCommand);
        }
    },

    update(dt) {
        this.handleInput();
        this.player.update(dt);
        this.enemy.update(dt, this.player);
    },

    render() {
        this.infoText.render();
        this.player.render();
        this.enemy.render();
    }
};
