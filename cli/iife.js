//Dependancies 
var prompt = require("prompt");
var Promise = require("promise");

//Symobl IIFE
var square = (function() {
	
	return {
		symbol: " ",
		isFilled: false,
		points: 0,

		//Symbol setter
		setSymbol: function (symbol) {
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
		},
		//Symbol getter 
		getSymbol: function() {
			return this.symbol;
		}
	};

})();

//Board IIFE
var board = (function() {
	
	return {

		squares: 9,
		grid: [],
		filledSquares: 0,

		//Takes number of suqares and builds the grid 
		build: function() {
			for (var i = 0; i < this.squares; i++) {
				this.grid[i] = Object.create(square);
				this.grid[i].points = Math.pow(2,i); 
			}
		},

		getSquareIndexWithAttr: function(attr, value) {
			return this.grid.map(function(square) {
				return square[attr];
			}).indexOf(value);
		},

		//Updates the board with a symbol
		update: function(index, symbol) {
			this.grid[index].setSymbol(symbol);
			this.filledSquares++;
		},

		showBoard: function() {
			var result = "",
				newLineKeys = [2,5,8];
			this.grid.forEach(function (_, index) {
					result += this.grid[index].getSymbol() + "|";
					if (newLineKeys.indexOf(index) !== -1) {
						result += "\n";
					}
				}, this);
			console.log(result);
		},

		isFilled: function() {
			for (var i = 0; i < this.grid.length; i++) {
				if (!(this.grid[i].isFilled)) {
					return false;
				}
				else {
					return true;
				}
			}
		}
	};
})();

//Player IIFE

var player = (function() {
		
	return {

		symbol: "",
		score: 0,
		winOptions: [7, 56, 448, 73, 146, 292, 273, 84],

		updateScore: function(points) {
			this.score += points;
		},

		isWinner: function() {
			for (var i = 0; i < this.winOptions.length; i++) {
				if ((this.winOptions[i] & this.score) == this.winOptions[i]) {
					return true;
				}
			}
			return false;
		},

		resetScore: function() {
			this.score = 0;
		}
	};

})();

//Game IIFE 
var game = (function() {
	
	return {
		newGame: function() {
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
		},

		nextTurn: function() {	 
			
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
					//If / else to detwermine the square index from input. 
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
		},

		swapPlayer: function() {
			if (this.currentPlayer === this.playerX) {
				this.currentPlayer = this.playerO;
			}
			else {
				this.currentPlayer = this.playerX;
			}
		},

		isTie: function() {
			if (this.board.filledSquares == this.board.squares && !(this.currentPlayer.isWinner())) {
				return true;
			}
			return false;
		},

		endGame: function() {
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
		}
	};
})();

game.newGame();
game.nextTurn();



