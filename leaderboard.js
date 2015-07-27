PlayersList = new Meteor.Collection( 'players' );
CraftData = new Meteor.Collection( 'craftData' );

if( Meteor.isClient ){

	Meteor.subscribe( 'thePlayers' );
	Meteor.subscribe( 'craftData' );

	Template.leaderboard.helpers({
		player: function(){
			var currentUserId = Meteor.userId();
			return PlayersList.find( {createdBy: currentUserId}, {sort: {score: -1, name: 1}} );
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
			var currentUserId = Meteor.userId();
			var playerScore = parseInt( event.target.playerScore.value );
			console.log( playerScore );
			PlayersList.insert({
				name: playerName,
				score: playerScore ? playerScore : 0,
				createdBy: currentUserId
			});
			event.target.playerName.value = "";
			event.target.playerScore.value = "";
		}
	});

	Meteor.call('checkCraft');
}

if ( Meteor.isServer ) {

	Meteor.publish( 'thePlayers', function(){
		var currentUserId = this.userId;
		return PlayersList.find({createdBy: currentUserId});
	});

	Meteor.publish( 'craftData', function(){
		return CraftData.find();
	});

	Meteor.methods({checkCraft: function ( userId ) {
	  //check( userId, String );
	  this.unblock();
	  try {
	    var result = HTTP.get( "http://craft-api.dev/api/blog/first-title" );
	    CraftData.insert( result.data );
	    //console.log( result.data );
	  } catch (e) {
	    // Got a network error, time-out or HTTP error in the 400 or 500 range.
	    return false;
	  }
	}});

}