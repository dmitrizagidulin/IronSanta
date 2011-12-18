function PlayerState() {
	this.charSelected = null
	
	this.selectCharacter = function(index) {
		this.charSelected = index
	}
}