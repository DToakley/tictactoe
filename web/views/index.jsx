var React = require('react');

var GameContainer = React.createClass({
	render: function() {
		return (
			<div className="gameContainer">
				<h1>TicTacToe App</h1>
				<Board />
			</div>
		);
	}
});

var Board = React.createClass({
	getInitialState: function() {
	    return {
	    	numberOfSquares: 9, 
	    	filledSqaures: 0,
	    	squares: []
	    }
	},
	render: function() {
		return (
		<div className="gameBoard">
			<table style={tableStyle}>
				<tbody>
					<tr>
						<Square />
					</tr>
				</tbody>
			</table>
		</div>
		);
	}
});


var Square = React.createClass({
	
	propTypes: {
	    isFilled: React.PropTypes.bool.isRequired,
	    symbol: React.PropTypes.string.isRequired
  	},

	getInitialState: function() {
		return {
			isFilled: false,
			symbol: "O"
		}
	},
	render: function() {
		return (
			<td>X</td>
		)
	}
});


var tableStyle = {
	border: '1px solid black'
}


module.exports = GameContainer;
