var React = require('react');
var app = require('./../app.js');



var GameContainer = React.createClass({
	render: function() {
		return (
			<div className='gameContainer' style={containerStyle}>
				<h1>TicTacToe</h1>
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
		<div className='gameBoard'>
			<table style={containerStyle}>
				<tbody>
					<tr>
						<Square /><Square /><Square />
					</tr>
					<tr>
						<Square /><Square /><Square />
					</tr>
					<tr>
						<Square /><Square /><Square />
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
	    symbol: React.PropTypes.string.isRequired,
	    hover: false
  	},
  	getInitialState: function() {
		return {
			isFilled: false,
			symbol: 'O'
		}
	},
  	mouseOver: function() {
  		 this.setState({hover: true});
  	},
  	mouseOut: function() {
  		this.state({hover: false});
  	},
	render: function() {
		return (
			<td style={squareStyle}>{this.props.symbol}</td>
		)
	}
});

var squareStyle = {
	border: '1px solid black',
	padding: '15px',
	hover: 'cursor'
}

var containerStyle = {
	textAlign: 'center',
	margin: 'auto'
}


module.exports = GameContainer;
