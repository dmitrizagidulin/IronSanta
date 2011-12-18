/*
*
* PlayState is the actual game play. We switch to it once user choses "Start game"
*
*/
//	var fps = document.getElementById("test")
	
	var bulletSpeed = 10
	var playerSpeed = 6
	
	var playerSelect = []
	var stagesCleared = {}
	var stages = {
		0: 'death',
		1: 'winter',
		2: 'cynicism',
		3: 'global_warming',
		4: 'dry_turkey'
	}
	
	var stageData = {
			'death':{
				'boss_name':'Death',
				'clause_weapon': 'cookie',
				'lucia_weapon': 'coffee'
			},
			'winter':{
				'boss_name':'Winter',
				'clause_weapon': 'cookie',
				'lucia_weapon': 'coffee'
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
	
	function allStages() {
		stageKeys = []
		for(i in stages) {
			stageKeys.push(stages[i])
		}
		return stageKeys
	}
	
	function allStagesClear() {
		for(var i in allStages()) {
			if(stagesCleared[allStages()[i]] != 1) {
				return false
			}
		}
		return true
	}
	
	function drawText(fontSize, fillColor, text, x, y) {
		jaws.context.font = "bold "+fontSize+"pt courier";
		jaws.context.lineWidth = 10
		jaws.context.fillStyle =  fillColor
		jaws.context.strokeStyle =  "rgba(200, 200, 200, 0.0)"
		jaws.context.fillText(text, x, y)
	}
	
	function PlayState() {
		var topBarHeight = 70
		var topBarWidth = 800
		var sideBarWidth = 100
		var gameAreaMinX = 0
		var gameAreaMaxX = jaws.width - sideBarWidth
		var gameAreaMinY = topBarHeight + 4
		var gameAreaMaxY = jaws.height - topBarHeight
		
		var player
		var playerTypes = {0:'clause', 1:'lucia'}
		var playerAvatars = {
			'clause':'img/santa_clause.png',
			'lucia':'img/santa_lucia.png'
		}
		
		var bullets = new jaws.SpriteList()
		var enemies = new jaws.SpriteList()
		
		this.currentStage = function() {
			return stages[playerSelect['stageSelected']]
		}
		
		this.bossName = function() {
			stageKey = this.currentStage()
			bossName = stageData[stageKey]['boss_name']
			return bossName
		}
		
		this.setup = function() { 
			playerChoice = playerTypes[playerSelect['charSelected']]
			
			avatar = playerAvatars[playerChoice]
			player = new jaws.Sprite({image: avatar, x: 10, y:gameAreaMinY + 50})
			player.can_fire = true
			jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
			jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])

			death = new jaws.Sprite({image: "img/skull.png", x: 500, y: 150})
			death.collision = false
			enemies.push(death)
		}
 
		this.update = function() {
			if(jaws.pressed("left"))  { player.x -= playerSpeed }
			if(jaws.pressed("right")) { player.x += playerSpeed }
			if(jaws.pressed("up"))    { player.y -= playerSpeed }
			if(jaws.pressed("down"))  { player.y += playerSpeed }
			if(jaws.pressed("space")) { 
				if(player.can_fire) {
					bullet = new jaws.Sprite({image: "img/ornament_green.png", x: player.rect().right, y:player.y})
					bullet.collision = false
//            bullets.push( new Bullet(player.rect().right, player.y) )
					bullets.push(bullet)
					player.can_fire = false
					setTimeout(function() { player.can_fire = true }, 100)
				}
			}
 
			forceInsideCanvas(player)

			bullets.forEach(function(sprite, index) {
				sprite.x += bulletSpeed
			})
			jaws.collideManyWithMany(bullets, enemies).forEach( function(pair, index) {
				pair[0].collision = true
				pair[1].collision = true
			});

			bullets.deleteIf(isOutsideCanvas) // delete items for which isOutsideCanvas(item) is true
			bullets.deleteIf(isHit)
			enemies.deleteIf(isHit)

			if(enemies.length == 0) {
				stagesCleared[this.currentStage()] = 1
				jaws.switchGameState(StageSelectState)
			}
			
//			fps.innerHTML = jaws.game_loop.fps
		}

		this.drawTopBar = function() {
			jaws.context.strokeStyle = 'Blue';
			jaws.context.lineWidth   = 2;
			jaws.context.strokeRect(3,  3, topBarWidth, topBarHeight);
			barPadding = 15
			defeatText = 'Defeat: ' + this.bossName()
			drawText(fontSize=15, fillColor='Black', defeatText, barPadding, barPadding*2)
		}

		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)
			this.drawTopBar()
			player.draw()
			bullets.drawIf(isAlive)  // will call draw() on all items in the list
			enemies.drawIf(isAlive)
		}
 
		function isHit(item) {
//    	  return item.rect.collideRect(death.rect)  
			return item.collision
		}

		function isAlive(item) {
			return !isHit(item) && !isOutsideCanvas(item)
		}

/* Simular to example1 but now we're using jaws properties to get width and height of canvas instead */
/* This mainly since we let jaws handle the canvas now */
		function isOutsideCanvas(item) { 
			return (item.x < gameAreaMinX || item.y < gameAreaMinY || item.x > gameAreaMaxX || item.y > gameAreaMaxY) 
		}
		function forceInsideCanvas(item) {
			if(item.x < gameAreaMinX)                  { item.x = gameAreaMinX  }
			if(item.right > gameAreaMaxX)     { item.x = gameAreaMaxX - item.width }
			if(item.y < gameAreaMinY)                  { item.y = gameAreaMinY }
			if(item.bottom  > gameAreaMaxY)  { item.y = gameAreaMaxY - item.height }
		}
 
////      function Bullet(x, y) {
////        this.x = x
////        this.y = y
////        this.collision = false
////        this.draw = function() {
//////          this.x += 4
////          jaws.context.drawImage(jaws.assets.get("img/ornament_green.png"), this.x, this.y)
////        }
////      }
    }
	

	function IntroState() {
		this.setup = function() {
			jaws.preventDefaultKeys(["enter"])
			jaws.on_keydown(["enter"],  function()  { 
				jaws.switchGameState(StageSelectState) 
			})
		}
		
		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)
			drawText(15, "Black", "Intro goes here.", 250, 70)
			drawText(10, "Black", "(press Enter to start)", 250, 100)
		}
	}

	
	function StageSelectState() {
		var index = 0
		var items = ["Death", "Winter", "Cynicism", "Global Warming", "Dry Turkey"]
		
		this.setup = function() {
			if(allStagesClear()) {
				jaws.switchGameState(WinState)
			}
			
			index = 0
			jaws.preventDefaultKeys(["enter", "up", "down", "s", "w"])
			jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=items.length-1} } )
			jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=0} } )
			jaws.on_keydown(["enter"],  function()  {
				stageKey = stages[index]
				stageCleared = stagesCleared[stageKey]
				if(!stageCleared) {
					playerSelect['stageSelected'] = index
					jaws.switchGameState(PlayState) 
				}
			})
		}
		
		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)
			drawText(15, "Black", "These things harsh Santa's Zen.", 250, 70)
			drawText(15, "Green", "Destroy them.", 250, 100)

			// Draw stage select
			for (var i = 0; i < items.length; i++) {
				stageKey = stages[i]
				fillStyle = "Black"
				stageEnabled = true
				if(i == index) {
					selectMark = "> "
				} else {
					selectMark = "  "
				}
				
				if(stagesCleared[stageKey] == 1) {
					fillStyle = "Grey"
					stageEnabled = false
					if(i == index) {
						selectMark = "X "
					}
				} else if(i == index) {
					fillStyle = "Red"
				}
//				fillStyle = (i == index) ? "Red" : "Black"
				itemText = selectMark + items[i]
				drawText(14, fillStyle, itemText, 275, 160 + i * 30)
			}
		}
	}
	
/*
*
* MenuState is our lobby/welcome menu were gamer can chose start, high score and settings.
* For this example we have only implemented start. Start switches active game state by simply:
*   jaws.switchGameState(play)   (jaws.switchGameState(PlayState) would have worked too)
*
*/
	function MenuState() {
		var index = 0
		var items = ["Santa Claus", "Santa Lucia"]
		
		this.setup = function() {
			index = 0
			jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=items.length-1} } )
			jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=0} } )
//			jaws.on_keydown(["enter","space"],  function()  { if(items[index]=="Start") {jaws.switchGameState(PlayState) } } )
			jaws.on_keydown(["enter","space"],  function()  { 
				playerSelect['charSelected'] = index
				jaws.switchGameState(IntroState) 
			})
		}
		
		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)

			// Draw Title
			drawText(60, "Green", "Iron Santa", 200, 150)
			drawText(30, "Black", "(world battle)", 270, 200)

			drawText(18, "Black", "Select Your Santa:", 310, 300)
				
			// Draw character select
			for (var i = 0; i < items.length; i++) {
				fillStyle = (i == index) ? "Red" : "Grey"
				itemText = (i == index) ? "> "+items[i] : "  "+items[i]
				drawText(14, fillStyle, itemText, 350, 350 + i * 40)
			}
		}
	}
 
	function WinState() {
		this.setup = function() {
			i = 1
//			jaws.preventDefaultKeys(["enter"])
//			jaws.on_keydown(["enter"],  function()  { 
//				jaws.switchGameState(StageSelectState) 
//			})
		}
		
		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)
			drawText(15, "Black", "You win.", 250, 70)
			drawText(15, "Black", "All is right with the world", 250, 100)
		}
	}
	
/*
*
* Our script-entry point
*
*/
	window.onload = function() {
		jaws.assets.add("img/santa_clause.png")
		jaws.assets.add("img/santa_lucia.png")
		jaws.assets.add("img/ornament_green.png")
		jaws.assets.add("img/skull.png")
		jaws.start(MenuState)
	}