/**
 * Comments:
 * 
 * i) There is no reason to use iifes if all you're doing is returning an object literal.
 * You can see this by removing all your iiefs and just setting square, board, player and game
 * equal to the object literals those functions return.  The behavior of the program won't change.
 *
 * The use-case for iiefs is if you need to do some work ahead of returning that object,
 * and somehow varying the object on that basis or including the results of the work. 
 * Otherwise iiefs are just ineffectual syntactic fluff.
 *
 * --- Makes sense. I  was just using the pattern to learn it :)
 *
 * ii) The 'getSquareIndexWithAttr' method on 'board' is confusing and unused.
 *
 * --- Removed
 *
 * iii) The'isFilled' method on 'board' is broken and unused.  It returns 'True' the very first time
 * it encounters a filled square.  You want to wait until you've seen that all squares are unfilled
 * before returning true.
 *
 * --- Removed
 *
 * iv) You keep track of the squares being filled separately from the number of squares filled on the board. 
 * It's generally not a good idea to keep track of the same piece of information in two different ways,
 * because they can diverge (e.g. someone else comes to your code and fills a square without going through
 * the board, so that the board doesn't know about it) making the code bug-prone in the future.  Go for
 * one 'source of truth'.  
 *
 * --- Removed reference filled square count on board and added fillSquaresCount function instead
 *
 * v) Same goes for 'score' on 'player'.  It's represented both by the value on the player object and
 * by the state of the board.  Every time you make a change that affects the score, you'll have to 
 * remember to change both places, which eventually will cause problems (e.g. you might change the code
 * and forget to call 'updateScore' on player).  If instead you ask the board to calculate a score for
 * a given player symbol, you maintain one 'source of truth'.
 *
 * --- I think I understand this, but I'm not sure how to practically go about refactoring the code.
 *
 * vi) The concept of 'points' is relatively opaque.  Reading through the code, it takes quite a lot of
 * jumping around and searching to figure out how and why you are using them (e.g. coming upon 
 * this.grid[i].points = Math.pow(2,i) first is confusing).  This is because things that refer to
 * points are spread way throughout all the code.  The 'square' holds them, the 'board' sets them, the 'player'
 * knows how to use them to determine a win.  This is very problematic - related things should be close together
 * in the code.
 * 
 * vii) The 'nextTurn' function on game is very long and contains a large number of conditional branches.
 * It's hard to read (so I didn't look at it carefully).  See if you can break this down into smaller helper
 * functions with fewer stacked try/catch blocks and conditional statements.
 */

//Dependencies
var prompt = require("prompt");
var Promise = require("promise");

//Symbol IIFE
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

		//Takes number of squares and builds the grid
		build: function() {
			for (var i = 0; i < this.squares; i++) {
				this.grid[i] = Object.create(square);
				this.grid[i].points = Math.pow(2,i); 
			}
		},

		//Updates the board with a symbol
		update: function(index, symbol) {
			this.grid[index].setSymbol(symbol);
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

        filledSquaresCount: function() {
            var count = 0;
            this.grid.forEach(function(square) {
               if (square.isFilled) {
                    count += 1;
               }
            });
            return count;
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
		},
        showEndMsg: function(msg) {
            board.showBoard();
            console.log(msg);
            game.endGame();
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
			return !!(this.board.filledSquaresCount() == this.board.squares && !(this.currentPlayer.isWinner()));
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



