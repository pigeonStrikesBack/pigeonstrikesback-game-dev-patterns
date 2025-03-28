import { SpriteClass, Vector } from 'https://cdn.jsdelivr.net/npm/kontra@10.0.2/+esm';
import { Queue, Stack } from './ds.js';
import { Collider } from './collision.js'
import { game } from './game.js';

export class StaticEntity extends SpriteClass {

    constructor(gameObject) {
        super(gameObject)

        // Command history for undo/redo support.
        this.commandHistory = new Stack();
        this.redoStack = new Stack();
        this.commandQueue = new Queue();
    }

    Command(action, undo = () => { }) {
        return { execute: action, undo: undo };
    }

    MacroCommand(commands) {
        return this.Command(
            (entity) => commands.forEach((cmd) => cmd.execute(entity)),
            (entity) => [...commands].reverse().forEach((cmd) => cmd.undo(entity))
        );
    }

    enqueueCommand(command) {
        this.commandQueue.enqueue(command);
        this.redoStack = new Stack();
    }

    undoLastCommand() {
        const lastCommand = this.commandHistory.pop();
        if (lastCommand) {
            lastCommand.undo(this);
            this.redoStack.push(lastCommand);
        }
    }

    redoLastCommand() {
        const lastRedoCommand = this.redoStack.pop();
        if (lastRedoCommand) {
            lastRedoCommand.execute(this);
            this.commandHistory.push(lastRedoCommand);
        }
    }

    update(dt) {
        super.update(dt);
        while (!this.commandQueue.isEmpty()) {
            const cmd = this.commandQueue.dequeue();
            cmd.execute(this);
            this.commandHistory.push(cmd);
        }
    }

    render() {
        super.render();
    }
}

export class KinematicEntity extends StaticEntity {

    constructor(gameObject, speed) {
        super(gameObject);
        this.speed = speed;
        this.direction = Vector(0, 0);
        this.velocity = Vector(0, 0);
    }

    MoveCommand(direction = Vector(0, 0)) {
        return this.Command(
            () => {
                this.direction = direction;
            }
        );
    }
    
    update(dt) {
        super.update(dt);
        this.velocity = this.direction.scale(this.speed)
    }

    render() {
        super.render();
    }
}

export class LivingEntity extends KinematicEntity {

    constructor(gameObject, speed, maxHealth = 100) {
        super(gameObject, speed);
        this._maxHealth = maxHealth;
        this._health = maxHealth;
        this._isAlive = true;

        // An attack collider slightly larger than the main sprite.
        this.hitBox = new Collider({
            x: 0, y: 0,
            width: this.width + 20,
            height: this.height + 20,
            color: 'red',
            parent: this,
            anchor: Vector(.5, .5)
        })

        this.hurtBox = new Collider({
            x: 0, y: 0,
            width: this.width + 10,
            height: this.height + 10,
            color: 'green',
            parent: this,
            anchor: Vector(.5, .5)
        })

        this.children = [this.hurtBox, this.hitBox]
    }

    get health() {
        return this._health;
    }

    set health(value) {
        this._health = Math.min(value, this._maxHealth);

        if (this.health <= 0) {
            this._isAlive = false;
            this.onDeath();
        }
    }

    get isAlive() { return this._isAlive; }

    directionTo(target) {
        return target.subtract(this.position).normalize()
    }

    takeDamage(damage) {
        if(this.isAlive)
            this.health -= damage;
    }

    onDeath() {
        console.log("LivingEntity has died.");
    }

    AttackCommand(target, damage) {
        return this.Command(
            () => {
                if (this.hitBox.collidesWith(target.hurtBox)) {
                    if (target.takeDamage) { target.takeDamage(damage); }
                }
            }
        );
    }

    update(dt) {
        if (this.isAlive) {
            this.advance(dt);
            super.update(dt);
        }
    }

    render() {
        if(this.isAlive) {
            super.render();
        }
    }
}

export class PlayerEntity extends LivingEntity {
    constructor(gameObject, speed, maxHealth) {
        super(gameObject, speed, maxHealth);
        this.hitBox.height += 20;
        this.hitBox.width += 20;
    }

    onDeath() { console.log('player ded'); };
}

export class EnemyEntity extends LivingEntity {

    constructor(gameObject, speed, maxHealth, waypoints = []) {
        super(gameObject, speed, maxHealth);
        this.waypoints = waypoints;
        this.currentWaypointIndex = 0;
    }

    PatrolCommand() {
        return this.Command(
            () => {
                if (this.waypoints.length === 0) return;

                const targetWaypoint = this.waypoints[this.currentWaypointIndex];
                const direction = this.directionTo(targetWaypoint);
                this.enqueueCommand(this.MoveCommand(direction));

                // If the enemy is close to the waypoint, update to the next one.
                if (this.position.distance(targetWaypoint) < 5) {
                    this.currentWaypointIndex =
                        (this.currentWaypointIndex + 1) % this.waypoints.length;
                }
            }
        );
    }

    FleeCommand(player) {
        return this.Command(
            () => {
                let fleeDirection;
                if (this.position.distance(player.position) < 100) {
                    fleeDirection = this.directionTo(player.position).scale(-1);
                } else {
                    fleeDirection = Vector(0, 0);
                }
                
                this.enqueueCommand(this.MoveCommand(fleeDirection));
            }
        );
    }

    onDeath() { console.log('enemy ded'); };

    update(dt, player) {
        if (this.hitBox.collidesWith(player.hurtBox)) {
            this.enqueueCommand(this.AttackCommand(player, 10));
        }
        
        if (this.health < this._maxHealth) {
            this.enqueueCommand(this.FleeCommand(player));
        }
        else {
            this.enqueueCommand(this.PatrolCommand());
        }
        
        super.update(dt);
    }
}
