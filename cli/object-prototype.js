//Dependencies
var prompt = require("prompt");
var Promise = require("promise");

//Symbol constructor function
function Square(points) {
	this.symbol = " ";
	this.isFilled = false;
	this.points = points;
}

//Symbol setter
Square.prototype.setSymbol = function(symbol) {
	if (this.isFilled === true) {
		throw {
			name: "filledSquare",
			message: "That square is already filled!"
		};
	}
	else {
		this.symbol = symbol;
		this.isFilled = true;
	}
};

//Symbol getter
Square.prototype.getSymbol = function() {
	return this.symbol;
};

//Board constructor function
function Board(squares) {
	this.squares = squares;
	this.grid = [];
}

//Takes number of squares and builds the grid
Board.prototype.build = function() {
	for (var i = 0; i < this.squares; i++) {
		this.grid[i] = new Square(Math.pow(2,i));
	}
};

//Updates the board with a symbol
Board.prototype.update = function(index, symbol) {
	this.grid[index].setSymbol(symbol);
};

Board.prototype.showBoard = function() {
	var result = "",
		newLineKeys = [2,5,8];
	this.grid.forEach(function (_, index) {
			result += this.grid[index].getSymbol() + "|";
			if (newLineKeys.indexOf(index) !== -1) {
				result += "\n";
			}
		}, this);
	console.log(result);
};

Board.prototype.filledSquaresCount = function() {
	var count = 0;
	this.grid.forEach(function(square) {
		if (square.isFilled) {
			count += 1;
		}
	});
	return count;
}

//Player constructor function
function Player(symbol) {
	this.symbol = symbol;
	this.score = 0;
	this.winOptions = [7, 56, 448, 73, 146, 292, 273, 84];
}

Player.prototype.updateScore = function(points) {
	this.score += points;
};

Player.prototype.isWinner = function() {
	for (var i = 0; i < this.winOptions.length; i++) {
		if ((this.winOptions[i] & this.score) == this.winOptions[i]) {
			return true;
		}
	}
	return false;
};

Player.prototype.resetScore = function() {
	this.score = 0;
};

function Game() {
}

Game.prototype.newGame = function() {
	this.board = new Board(9);
	this.board.build();
	this.playerX = new Player("X");
	this.playerO = new Player("O");
	this.playerX.resetScore();
	this.playerO.resetScore();
	this.currentPlayer = this.playerX;
	this.board.showBoard();
};

Game.prototype.nextTurn = function() {

	var board = this.board,
		currentPlayer = this.currentPlayer,
		game = this;
	console.log("Player " + currentPlayer.symbol + "'s turn:" );

	var playerMove = new Promise(function(resolve, reject) {
		prompt.start();
		prompt.get(["row", "column"], function(err, results) {

            var row = Number(results.row),
				col = Number(results.column);

			//Error in case user inputs an incorrect value
			if (isNaN(row) || isNaN(col) || row < 1 || row > 3 || col < 1 || col > 3) {
				reject(console.log("Whoops! Please enter a column or row from 1 to 3"));
				board.showBoard();
				game.nextTurn();
			}
			//If / else to determine the square index from input.
			if (row === 1) {
				resolve(col - 1);
			}
			else if (row == 2) {
				resolve(col + 2);
			}
			else {
				resolve(col + 5);
			}
		});

	});
	playerMove.then(function(result) {
		try {
			board.update(result, currentPlayer.symbol);
			currentPlayer.updateScore(board.grid[result].points);
			game.swapPlayer();
		}
		catch (error) {
			console.log(error.message);
		}
		//Win scenario
		if (currentPlayer.isWinner()) {
			board.showBoard();
			console.log("Player " + currentPlayer.symbol + " wins!");
			game.endGame();
			return;
		}
		//Tie scenario
		if (game.isTie()) {
			board.showBoard();
			console.log("It's a tie!");
			game.endGame();
			return;
		}
		board.showBoard();
		game.nextTurn();
	});
};

Game.prototype.swapPlayer = function() {
	if (this.currentPlayer === this.playerX) {
		this.currentPlayer = this.playerO;
	}
	else {
		this.currentPlayer = this.playerX;
	}
};

Game.prototype.isTie = function() {
	return !!(this.board.filledSquaresCount() == this.board.squares && !(this.currentPlayer.isWinner()));
};

Game.prototype.endGame = function() {
	console.log("Want to play again?");

	var schema = {
		properties: {
			answer: {
				pattern: /^(n|no|NO|No|y|yes|Yes|YES)$/,
				message: "Please answer 'yes' or 'no'.",
				required: true
			}
		}
	};

	prompt.start();
	prompt.get(schema, function(err, result) {
		var answer = result.answer.toLowerCase();
		if (answer == "y" || answer == "yes") {
			var game = new Game();
			game.newGame();
			game.nextTurn();
		}
		else if (answer == "n" || answer == "no") {
			console.log("Thanks for playing!");
		}
	});
};
//Initialise first game
var game = new Game();
game.newGame();
game.nextTurn();



