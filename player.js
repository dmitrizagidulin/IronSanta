function PlayerState() {
	this.hp = this.maxHp
	
	this.characterName = function() {
		return this.playerData[this.currentCharSelected()]['name']
	}
	
	this.charSelected = null
	
	this.currentCharSelected = function() {
		return this.playerTypes[this.charSelected]
	}
	
	this.currentAvatar = function() {
		return this.playerData[this.currentCharSelected()]['avatar']
	}
	
	this.initAssets = function() {
		jaws.assets.add("img/heart_full.png")
		jaws.assets.add("img/santa_clause.png")
		jaws.assets.add("img/lucia.png")
	}
	
	this.playerData = {
		'clause':{
			'name':'Santa Claus',
			'avatar':'img/santa_clause.png'
		},
		'lucia':{
			'name':'Santa Lucia',
			'avatar':'img/lucia.png'
		}
	}
	
	this.playerTypes = {
		0: 'clause', 
		1: 'lucia'
	}
	
	this.selectCharacter = function(index) {
		this.charSelected = index
	}
}

PlayerState.prototype.maxHp = 3

PlayerState.prototype.doCollideWith = function(item) {
	this.hp -= 1
}

PlayerState.prototype.isDead = function() {
	return this.hp <= 0
}