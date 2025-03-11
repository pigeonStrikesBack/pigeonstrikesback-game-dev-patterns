const speed = 2;
let player;

function setup() {
  createCanvas(CANVAS.width, CANVAS.height);
  player = new Entity(width/2, height/2, 50, 50)
}

function draw() {
  background(0); // Black background
  player.draw(); // Draw the player

  // Example movement: Move with arrow keys
  let commands = []

  if (keyIsDown(LEFT_ARROW))
    commands.push(new MovementEntityCommand(-speed, 0));
  if (keyIsDown(RIGHT_ARROW))
    commands.push(new MovementEntityCommand(speed, 0));
  if (keyIsDown(UP_ARROW))
    commands.push(new MovementEntityCommand(0, -speed));
  if (keyIsDown(DOWN_ARROW))
    commands.push(new MovementEntityCommand(0, speed));

  console.log(commands);

  commands.forEach(command => {
    command.execute(player);
  });
}

class EntityCommand {
  execute(entity) { console.log("ayo i'm here"); }
}

class MovementEntityCommand extends EntityCommand {

  constructor(x, y) {
    this._x = x
    this._y = y
  }

  execute(entity) {
    entity.move(this._x, this._y);
  }
}