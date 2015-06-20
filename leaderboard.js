PlayersList = new Meteor.Collection( 'players' );

if( Meteor.isClient ){
	Template.leaderboard.helpers({
		player: function(){
			return PlayersList.find( {}, {sort: {score: -1, name: 1}} );
		},
		'selectedClass': function(){
			var playerId = this._id;
			var selectedPlayer = Session.get( 'selectedPlayer' );
			if( playerId == selectedPlayer ){
				return "player--selected";
			}
		},
		'showSelectedPlayer': function(){
			var selectedPlayer = Session.get( 'selectedPlayer' );
			return PlayersList.findOne( selectedPlayer );
		}
	});

	Template.leaderboard.events({
		'click .player': function(){
			var playerId = this._id;
			Session.set( 'selectedPlayer', playerId );
		},
		'click .increment': function(){
			console.log('yo button');
			var selectedPlayer = Session.get( 'selectedPlayer' );
			var scoreAmountInput = document.getElementById( 'scoreAmount' );
			var scoreAmount = parseInt( scoreAmountInput.value );
			PlayersList.update( selectedPlayer, {$inc: {score: scoreAmount}} );
			scoreAmountInput.value = "";
		},
		'click .remove': function(){
			var selectedPlayer = Session.get( 'selectedPlayer' );
			var selectedPlayerName = PlayersList.findOne( selectedPlayer ).name;
			if ( ! confirm( 'Are you sure you want to delete the user, ' + selectedPlayerName + '?' ) ) {
				return
			}
			else {
				PlayersList.remove( selectedPlayer );
			}
		}
	});

	Template.addPlayerForm.events({
		'submit form': function( event ){
			event.preventDefault();
			var playerName = event.target.playerName.value;
			var playerScore = parseInt( event.target.playerScore.value );
			console.log( playerScore );
			PlayersList.insert({
				name: playerName,
				score: playerScore ? playerScore : 0
			});
			event.target.playerName.value = "";
			event.target.playerScore.value = "";
		}
	});
}