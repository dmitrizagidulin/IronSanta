function Enemy(enemyId) {
	this.bestiary = {
		'skull':{
			'sprite':'img/skull.png',
			x: 500,
			y: 150
		},
		'death':{
			'sprite':'img/death.png',
			x: 500,
			y: 150
		},
		'winter':{
			'sprite':'img/winter.png',
			x: 500,
			y: 150
		},
		'cynicism':{
			'sprite':'img/cynicism.png',
			x: 500,
			y: 150
		},
		'globalwarming':{
			'sprite':'img/globalwarming.png',
			x: 500,
			y: 150
		},
		'dryturkey':{
			'sprite':'img/dryturkey.png',
			x: 500,
			y: 150
		},
		'snowman':{
			'sprite':'img/snowman.jpeg',
			x: 500,
			y: 150
		},
		'skeleton':{
			'sprite':'img/skeleton.gif',
			x: 500,
			y: 150
		},
		'oil':{
			'sprite':'img/oil.png',
			x: 500,
			y: 150
		},
		'hipster':{
			'sprite':'img/hipster.png',
			x: 500,
			y: 150
		}
	}
	this.enemyId = enemyId
	this.data = this.bestiary[this.enemyId]
	
	this.spriteImage = this.data['sprite']
	this.x = this.data['x']
	this.y = this.data['y']
	
	this.getSprite = function() {
		return new jaws.Sprite({image: this.spriteImage, x: this.x, y: this.y})
	}
}

function Stage(id, data, stageList) {
	this.id = id
	this.bossName = data.boss_name
	this.cleared = false
	this.data = data
	this.weapons = this.data.weapons
	this.totalLevels = 1  // hardcode for now
	this.level = 1
	this.stageList = stageList
	
	this.currentLevel = function() {
		return this.level
	}
	
	this.currentWeaponFor = function(charType) {
		return 'Ornament'
	}
	
	this.enemyList = function() {
		return this.levelData().enemies
	}
	
	this.enemies = function() {
		enemies = new jaws.SpriteList()
		enemyList = this.enemyList()
		for(i in enemyList) {
			enemyId = enemyList[i]
			enemy = new Enemy(enemyId)
			sprite = enemy.getSprite()
			sprite.collision = false
			enemies.push(sprite)
		}
		return enemies
	}
	
	this.isCleared = function() {
		return this.cleared
	}
	
	this.levelData = function() {
		return this.data.levels[this.level]
	}
	
	this.nextLevelMarkCleared = function() {
		
		if(this.level >= this.totalLevels) {
			this.stageMarkCleared()
		} else {
			this.level += 1
		}
	}
	
	this.stageMarkCleared = function() {
		this.cleared = true
		this.stageList.currentStageMarkCleared()
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
			'boss_name':'Death',
			'levels':{
				1: {
					'enemies': ['death']
				}
			}
		},
		'winter':{
			'boss_name':'Winter',
			'levels':{
				1: {
					'enemies': ['winter']
				}
			}
		},
		'cynicism':{
			'boss_name':'Cynicism',
			'levels':{
				1: {
					'enemies': ['cynicism']
				}
			}
		},
		'global_warming':{
			'boss_name':'Global Warming',
			'levels':{
				1: {
					'enemies': ['globalwarming']
				}
			}
		},
		'dry_turkey':{
			'boss_name':'Dry Turkey',
			'levels':{
				1: {
					'enemies': ['dryturkey']
				}
			}
		}
	}
	this.currentStageObj = null
	this.stagesCleared = {}

	this.currentBossName = function() {
		stageKey = this.currentStageId()
		bossName = this.stageData[stageKey]['boss_name']
		return bossName
	}
	
	
	this.currentStage = function() {
		return this.currentStageObj
	}
	
	this.currentStageId = function() {
		return this.stages[this.currentStageIdx]
	}
	
	this.currentStageMarkCleared = function() {
		this.stagesCleared[this.currentStageId()] = 1
	}
	
	this.initAssets = function() {
		jaws.assets.add("img/ornament_green.png")
		jaws.assets.add("img/death.png")
		jaws.assets.add("img/winter.png")
		jaws.assets.add("img/cynicism.png")
		jaws.assets.add("img/globalwarming.png")
		jaws.assets.add("img/dryturkey.png")
	}
	
	this.isStageCleared = function(stageId) {
		return this.stagesCleared[stageId] == 1
	}
	
/**
 * Player has made a selection from the Stage Select screen
 */
	this.selectStage = function(index) {
		this.currentStageIdx = index
		stageId = this.currentStageId()
		stageData = this.stageData[stageId]
		this.currentStageObj = new Stage(stageId, stageData, this)
	}
	
	this.allStages = function() {
		stageKeys = []
		for(i in this.stages) {
			stageKeys.push(this.stages[i])
		}
		return stageKeys
	}

	this.allStagesClear = function() {
		return (stageList.stagesCleared['winter'] == 1) && 
		(stageList.stagesCleared['death'] == 1) &&
		(stageList.stagesCleared['cynicism'] == 1) &&
		(stageList.stagesCleared['global_warming'] == 1) &&
		(stageList.stagesCleared['dry_turkey'] == 1) 
//		for(var i in this.allStages()) {
//			if(!this.isStageCleared(i)) {
//				return false
//			}
//		}
//		return true
	}
}
