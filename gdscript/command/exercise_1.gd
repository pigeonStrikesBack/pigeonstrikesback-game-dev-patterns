extends Node2D

class Character2DCommand:
	func execute(character: CharacterBody2D, delta):
		pass
		
class Character2DMovementCommand extends Character2DCommand:
	var _x = 0
	var _y = 0
	var _speed = 0
	
	func _init(x: int, y: int, speed:float):
		self._x = x
		self._y = y
		self._speed = speed
	
	func execute(character: CharacterBody2D, delta):
		var direction : Vector2 = Vector2(self._x, self._y)
		character.position = character.position + (direction * self._speed * delta)

@onready var player : CharacterBody2D = %Player
var speed = 500
var commandQueue = []

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey:
		if event.is_pressed() and event.keycode == KEY_LEFT:
			commandQueue.push_front(Character2DMovementCommand.new(-1, 0, speed))
		elif event.is_pressed() and event.keycode == KEY_RIGHT:
			commandQueue.push_front(Character2DMovementCommand.new(1, 0, speed))
		elif event.is_pressed() and event.keycode == KEY_UP:
			commandQueue.push_front(Character2DMovementCommand.new(0, -1, speed))
		elif event.is_pressed() and event.keycode == KEY_DOWN:
			commandQueue.push_front(Character2DMovementCommand.new(0, 1, speed))

func _process(delta: float) -> void:
	while len(commandQueue) > 0:
		commandQueue.pop_back().execute(player, delta)
