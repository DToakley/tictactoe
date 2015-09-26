//Dependencies
var prompt = require("prompt");
var Promise = require("promise");

//Square parent object
var square = {
	symbol: " ",
	isFilled: false,
	points: 0
};

//Symbol setter
square.setSymbol = function(symbol) {
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
square.getSymbol = function() {
	return this.symbol;
};

//Board constructor function 
var board = {
	squares: 9,
	grid: []
};

//Takes number of squares and builds the grid
board.build = function() {
	for (var i = 0; i < this.squares; i++) {
		this.grid[i] = Object.create(square);
		this.grid[i].points = Math.pow(2,i); 
	}
};

//Updates the board with a symbol
board.update = function(index, symbol) {
	this.grid[index].setSymbol(symbol);
};

board.showBoard = function() {
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

board.filledSquaresCount = function() {
	var count = 0;
	this.grid.forEach(function(square) {
		if (square.isFilled) {
			count += 1;
		}
	});
	return count;
};

//Player object
var player = {
	symbol: "",
	score: 0,
	winOptions: [7, 56, 448, 73, 146, 292, 273, 84]
};

player.updateScore = function(points) {
	this.score += points;
};

player.isWinner = function() {
	for (var i = 0; i < this.winOptions.length; i++) {
		if ((this.winOptions[i] & this.score) == this.winOptions[i]) {
			return true;
		}
	}
	return false;
};

player.resetScore = function() {
	this.score = 0;
};

var game = {
};

game.newGame = function() {
	this.board = Object.create(board);
	this.board.build();
	this.playerX = Object.create(player);
	this.playerX.symbol = "X";
	this.playerO = Object.create(player);
	this.playerO.symbol = "O";
	this.playerX.resetScore();
	this.playerO.resetScore();
	this.currentPlayer = this.playerX;
	this.board.showBoard();
};

game.nextTurn = function() {	 
	
	var board = this.board,
		currentPlayer = this.currentPlayer,
		game = this;

	console.log("Player " + currentPlayer.symbol + "'s turn:" );
	
	var playerMove = new Promise(function(resolve, reject) {
		prompt.start();
		prompt.get(["row", "column"], function(err, results) {

			var row = Number(results.row),
                col = Number(results.column);
            resolve(game.resolveInputPromise(row, col));
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
            game.showEndMsg("Player " + currentPlayer.symbol + " wins!");
            return;
        }
        //Tie scenario
        if (game.isTie()) {
            game.showEndMsg("It's a tie!");
            return;
        }
		board.showBoard();
		game.nextTurn();	
	});
};


game.resolveInputPromise = function(row, col) {
    //Error in case user inputs an incorrect value
    if (isNaN(row) || isNaN(col) || row < 1 || row > 3 || col < 1 || col > 3) {
        reject(console.log("Whoops! Please enter a column or row from 1 to 3"));
        board.showBoard();
        game.nextTurn();
    }
    //If / else to determine the square index from input.
    if (row === 1) {
        return col - 1;
    }
    else if (row == 2) {
        return col + 2;
    }
    else {
        return col + 5;
    }
};

game.showEndMsg = function(msg) {
    board.showBoard();
    console.log(msg);
    game.endGame();
};

game.swapPlayer = function() {
	if (this.currentPlayer === this.playerX) {
		this.currentPlayer = this.playerO;
	}
	else {
		this.currentPlayer = this.playerX;
	}
};

game.isTie = function() {
	return !!(this.board.filledSquaresCount() == this.board.squares && !(this.currentPlayer.isWinner()));
};

game.endGame = function() {
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
			var game2 = Object.create(game);
			game2.newGame();
			game2.nextTurn();
		}
		else if (answer == "n" || answer == "no") {
			// custom console
			console.log("Thanks for playing!");
		}
	});
};

//Initialise first game
var newGame = Object.create(game);
newGame.newGame();
newGame.nextTurn();


