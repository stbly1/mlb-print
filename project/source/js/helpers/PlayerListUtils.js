import {sortBy} from '../helpers/sortUtils';
import {filterByPosition} from '../helpers/filterUtils';

export function getFavoritedPlayers(players, type=null) {
	if (!players) {
		return;
	}

	var typeBool = function (typeToCheck) {
		return type ? typeToCheck = type : true;
	}
	return players.filter( p => (typeBool(p.type) && p.isFavorited && !(p.cost > 0)))
}

export function getUnusedPlayers (players) {
	if (!players) {
		return;
	}
	return players.filter( player => !player.isSelected );
}

export function rankPlayers (players, category, descending=true) {

	players = sortBy(players, category, !descending);

	if (descending) {
		players.reverse();
	}

	return players.map(function (player, index) {
		player.rank = index + 1;
		return player;
	});
}

export function getMatchingPlayers (players, query) {

	var searchValueString = query.toLowerCase(),
		matchingValues = players;

	if (searchValueString.length >= 2) {
		matchingValues = players.filter(function (selection) {
			var selectionValue = selection.name.toLowerCase();
			var eachWord = selectionValue.split(' '),
				valueMatch;

			for(var i=0; i<eachWord.length; i++) {
				if (eachWord[i].indexOf(searchValueString) === 0 || selectionValue.indexOf(searchValueString) === 0) {
					valueMatch = true;
				}
			}

			return valueMatch;
		});
	}

	return matchingValues;
}

export function getPlayerList (players, listSize, positionalConditions) {

	var playersSortedBySGP = sortBy(players, 'sgp').reverse();

	var draftablePlayers = playersSortedBySGP.slice(0, listSize);
	var unusedPlayers = playersSortedBySGP.slice(listSize, 1000);

	positionalConditions.forEach(function (condition) {
		var currentPlayersOfType = filterByPosition(draftablePlayers, condition.name);
		if (currentPlayersOfType.length < condition.minimum) {
			condition.invoked = true;

			var difference = condition.minimum - currentPlayersOfType.length;
			var selectableUnusedPlayers = filterByPosition(unusedPlayers, condition.name);
			var playersToAdd = selectableUnusedPlayers.slice(0,difference);
			var playersToRemove = [];
			var removeIndex = draftablePlayers.length-1;
			while (difference > 0) {
				var playerToTryRemoving = draftablePlayers[removeIndex];
				var okayToUse = true;
				positionalConditions.forEach(function (conditionCheck) {

					if (playerToTryRemoving.pos === conditionCheck.name) {
						okayToUse = false;
					}
				});
				if (okayToUse) {
					playersToRemove.push(playerToTryRemoving);
					difference--;
				}
				removeIndex--;
			}

			playersToRemove.forEach(function (playerToRemove) {
				var index = draftablePlayers.indexOf(playerToRemove);
				draftablePlayers.splice( index, 1 );
				unusedPlayers.push(playerToRemove);
			});

			playersToAdd.forEach(function (playerToAdd){
				unusedPlayers.splice( unusedPlayers.indexOf(playerToAdd), 1 );
			});
			draftablePlayers = draftablePlayers.concat(playersToAdd);
		}
	});

	draftablePlayers = rankPlayers(draftablePlayers, 'sgp');
	unusedPlayers = rankPlayers(unusedPlayers, 'sgp');

	// }
	return [
		draftablePlayers,
		unusedPlayers
	]

}