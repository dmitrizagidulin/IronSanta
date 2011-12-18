function PlayerState() {
	this.charSelected = null
	
	this.currentCharSelected = function() {
		return this.playerTypes[this.charSelected]
	}
	
	this.currentAvatar = function() {
		return this.playerAvatars[this.currentCharSelected()]
	}
	
	this.playerAvatars = {
		'clause':'img/santa_clause.png',
		'lucia':'img/santa_lucia.png'
	}
	
	this.playerTypes = {
		0: 'clause', 
		1: 'lucia'
	}
	
	this.selectCharacter = function(index) {
		this.charSelected = index
	}
}