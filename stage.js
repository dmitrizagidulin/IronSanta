function Stage(id, data) {
	this.id = id
	this.bossName = data.boss_name
	this.weapons = data.weapons
	
	this.currentLevel = function() {
		return 1
	}
	
	this.currentWeaponFor = function(charType) {
		return 'Ornament'
	}
	
	this.enemies = function() {
		enemies = new jaws.SpriteList()
		death = new jaws.Sprite({image: "img/skull.png", x: 500, y: 150})
		death.collision = false
		enemies.push(death)
		return enemies
	}
}

function StageList() {
	this.currentStageIdx = null
	this.stages = {
		0: 'death',
		1: 'winter',
		2: 'cynicism',
		3: 'global_warming',
		4: 'dry_turkey'
	}
	this.stageData = {
		'death':{
			'boss_name':'Death'
		},
		'winter':{
			'boss_name':'Winter'
		},
		'cynicism':{
			'boss_name':'Cynicism'
		},
		'global_warming':{
			'boss_name':'Global Warming'
		},
		'dry_turkey':{
			'boss_name':'Dry Turkey'
		}
	}
	this.stagesCleared = {}

	this.currentBossName = function() {
		stageKey = this.currentStageId()
		bossName = this.stageData[stageKey]['boss_name']
		return bossName
	}
	
	this.currentStage = function() {
		stageId = this.currentStageId()
		stageData = this.stageData[stageId]
		return new Stage(stageId, stageData)
	}
	
	this.currentStageId = function() {
		return this.stages[this.currentStageIdx]
	}
	
	this.currentStageMarkCleared = function() {
		this.stagesCleared[this.currentStageId()] = 1
	}
	
	this.initAssets = function() {
		jaws.assets.add("img/ornament_green.png")
		jaws.assets.add("img/skull.png")
	}
	
	this.isStageCleared = function(stageId) {
		return this.stagesCleared[stageId] == 1
	}
	
	this.selectStage = function(index) {
		this.currentStageIdx = index
	}
	
	this.allStages = function() {
		stageKeys = []
		for(i in this.stages) {
			stageKeys.push(this.stages[i])
		}
		return stageKeys
	}

	this.allStagesClear = function() {
		for(var i in this.allStages()) {
			if(!this.isStageCleared(i)) {
				return false
			}
		}
		return true
	}
}
