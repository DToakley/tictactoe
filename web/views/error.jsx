var React = require('react');

var error = React.createClass({
	render: function() {
		return (
			<div>
				<h1>{this.props.message}</h1>
				<h3>{this.props.error}</h3>
			</div>

		);
	}
})


module.exports = error;