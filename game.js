/*
*
* GameState is the actual game play. We switch to it once user choses "Start game"
*
*/
//	var fps = document.getElementById("test")
	
	var bulletSpeed = 10
	var playerSpeed = 6
	
	var stageList = new StageList()  // see stage.js
	var playerState = new PlayerState()  // see player.js
	
/**
 * Utility function to draw text
 * @param fontSize
 * @param fillColor
 * @param text
 * @param x
 * @param y
 */
	function drawText(fontSize, fillColor, text, x, y) {
		jaws.context.font = "bold "+fontSize+"pt courier";
		jaws.context.lineWidth = 10
		jaws.context.fillStyle =  fillColor
		jaws.context.strokeStyle =  "rgba(200, 200, 200, 0.0)"
		jaws.context.fillText(text, x, y)
	}
	
	function GameState() {
		var topBarHeight = 70
		var topBarWidth = 800
		var sideBarWidth = 100
		var gameAreaMinX = 0
		var gameAreaMaxX = jaws.width - sideBarWidth
		var gameAreaMinY = topBarHeight + 4
		var gameAreaMaxY = jaws.height - topBarHeight
		
		var player
		
		var bullets = new jaws.SpriteList()
		var enemies = null

		this.setup = function() { 
			avatar = playerState.currentAvatar()
			player = new jaws.Sprite({image: avatar, x: 10, y:gameAreaMinY + 50})
			player.can_fire = true
			jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
			jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])

			currentStage = stageList.currentStage()
			enemies = currentStage.enemies()
		}
 
		this.levelMarkCleared = function() {
			currentStage = stageList.currentStage()
			currentStage.nextLevelMarkCleared()
			if(currentStage.isCleared()) {
				jaws.switchGameState(StageSelectState)
			} else {
				// Stage not yet cleared, has more levels. 
				jaws.switchGameState(GameState)
			}
			
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
				this.levelMarkCleared()
			}
//			fps.innerHTML = jaws.game_loop.fps
		}

		this.drawTopBar = function() {
			jaws.context.strokeStyle = 'Blue';
			jaws.context.lineWidth   = 2;
			jaws.context.strokeRect(3,  3, topBarWidth, topBarHeight);
			barPadding = 15
			currentStage = stageList.currentStage()
			defeatText = 'Defeat: ' + stageList.currentBossName()
			drawText(fontSize=15, fillColor='Black', defeatText, barPadding, barPadding*2)
			currentLevel = currentStage.currentLevel()
			drawText(fontSize=15, fillColor='Black', "Level: "+currentLevel, barPadding + 400, barPadding*2)
			
			currentWeapon = currentStage.currentWeaponFor(playerState.currentCharSelected())
			drawText(fontSize=15, fillColor='Black', "Weapon: "+currentWeapon, barPadding + 400, barPadding*2 + 25)
		}

		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)
			this.drawTopBar()
			player.draw()
			bullets.drawIf(isAlive)  // will call draw() on all items in the list
			enemies.drawIf(isAlive)
		}
 
		function isHit(item) {
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
			jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
			jaws.preventDefaultKeys(["enter"])
			jaws.on_keydown(["enter"],  function()  { 
				jaws.switchGameState(StageSelectState) 
			})
		}
		
		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)
			drawText(12, "Black", "No matter what you've heard, Santa works alone.", 75, 70)
			drawText(12, "Black", "There is no Mrs. Claus. There are no reindeer or elves.", 75, 100)
			drawText(12, "Black", "He is a lone paladin of Christmas and all he wants is to do his work in peace.", 75, 130)
			drawText(10, "Black", "(press Enter to start)", 75, 160)
		}
	}
	
	function StageSelectState() {
		var index = 0
		var items = []
		
		this.setup = function() {
			if(stageList.allStagesClear()) {
				jaws.switchGameState(WinState)
			}
			
			items = []
			for(var i in stageList.allStages()) {
				stageKey = stageList.stages[i]
				stageName = stageList.stageData[stageKey]['boss_name']
				items.push(stageName)
			}
			
			index = 0
			jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
			jaws.preventDefaultKeys(["enter", "up", "down", "s", "w"])
			jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=items.length-1} } )
			jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=0} } )
			jaws.on_keydown(["enter"],  function()  {
				stageKey = stageList.stages[index]
				if(!stageList.isStageCleared(stageKey)) {
					stageList.selectStage(index)
					jaws.switchGameState(GameState) 
				}
			})
		}
		
		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)
			drawText(15, "Black", "These things harsh " + playerState.characterName() + "'s Zen.", 250, 70)
			drawText(15, "Green", "Destroy them.", 250, 100)

			// Draw stage select
			for (var i = 0; i < items.length; i++) {
				stageKey = stageList.stages[i]
				
				stageName = items[i]
				
				fillStyle = "Black"
				stageEnabled = true
				if(i == index) {
					selectMark = "> "
				} else {
					selectMark = "  "
				}
				
				if(stageList.isStageCleared(stageKey)) {
					fillStyle = "Grey"
					stageEnabled = false
					stageName += ' (defeated)'
					if(i == index) {
						selectMark = "X "
					}
				} else if(i == index) {
					fillStyle = "Red"
				}
//				fillStyle = (i == index) ? "Red" : "Black"
				itemText = selectMark + stageName
				drawText(14, fillStyle, itemText, 275, 160 + i * 30)
			}
		}
	}
	
/*
*
* Character select menu
*
*/
	function MenuState() {
		var index = 0
		var items = ["Santa Claus", "Santa Lucia"]
		
		this.setup = function() {
			index = 0
			jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=items.length-1} } )
			jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=0} } )
			jaws.on_keydown(["enter","space"],  function()  {
				playerState.selectCharacter(index)
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
//			jaws.preventDefaultKeys(["enter"])
//			jaws.on_keydown(["enter"],  function()  { 
//				jaws.switchGameState(StageSelectState) 
//			})
		}
		
		this.draw = function() {
			jaws.context.clearRect(0,0,jaws.width,jaws.height)
			drawText(12, "Black", "You win.", 75, 70)
			drawText(12, "Black", "All is right with the world", 75, 100)
			drawText(12, "Black", "The Arctic ice has been restored.", 75, 130)
			drawText(12, "Black", "Pluto is a planet again.", 75, 160)
			drawText(12, "Black", "All mortgages have been forgiven.", 75, 190)
			drawText(12, "Black", "Facebook respects your privacy.", 75, 210)
			drawText(12, "Black", "Firefly has been renewed.", 75, 240)
			drawText(12, "Black", "The vessels are mended.", 75, 270)
			drawText(12, "Black", "Happy holidays.", 75, 330)
		}
	}
	
/*
*
* Our script-entry point
*
*/
	window.onload = function() {
		playerState.initAssets()
		stageList.initAssets()
		jaws.start(MenuState)
	}