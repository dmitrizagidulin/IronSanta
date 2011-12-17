    /*
    *
    * PlayState is the actual game play. We switch to it once user choses "Start game"
    *
    */
    var fps = document.getElementById("test")
    function PlayState() {
      var player
      var bullets = new jaws.SpriteList()
      var enemies = new jaws.SpriteList()
      
      this.setup = function() {
        player = new jaws.Sprite({image: "img/pixel_santa1.png", x: 10, y:100})
        player.can_fire = true
        jaws.on_keydown("esc",  function() { jaws.switchGameState(MenuState) })
        jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
        
        death = new jaws.Sprite({image: "img/skull.png", x: 500, y: 150})
        death.collision = false
        enemies.push(death)
      }
 
      this.update = function() {
        if(jaws.pressed("left"))  { player.x -= 2 }
        if(jaws.pressed("right")) { player.x += 2 }
        if(jaws.pressed("up"))    { player.y -= 2 }
        if(jaws.pressed("down"))  { player.y += 2 }
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
        	sprite.x += 4
//        	if(sprite.rect().collideRect(death.rect())) {
//        		sprite.collision = true
//        	}
        })
        jaws.collideManyWithMany(bullets, enemies).forEach( function(pair, index) {
          pair[0].collision = true
          pair[1].collision = true
        });
        
        bullets.deleteIf(isOutsideCanvas) // delete items for which isOutsideCanvas(item) is true
        bullets.deleteIf(isHit)
        enemies.deleteIf(isHit)
        
        fps.innerHTML = jaws.game_loop.fps
      }
 
      this.draw = function() {
        jaws.context.clearRect(0,0,jaws.width,jaws.height)
        player.draw()
        bullets.draw()  // will call draw() on all items in the list
        enemies.draw()

      }
 
      function isHit(item) {
//    	  return item.rect.collideRect(death.rect)  
    	  return item.collision
      }
      
      
      
      /* Simular to example1 but now we're using jaws properties to get width and height of canvas instead */
      /* This mainly since we let jaws handle the canvas now */
      function isOutsideCanvas(item) { 
        return (item.x < 0 || item.y < 0 || item.x > jaws.width || item.y > jaws.height) 
      }
      function forceInsideCanvas(item) {
        if(item.x < 0)                  { item.x = 0  }
        if(item.right > jaws.width)     { item.x = jaws.width - item.width }
        if(item.y < 0)                  { item.y = 0 }
        if(item.bottom  > jaws.height)  { item.y = jaws.height - item.height }
      }
 
      function Bullet(x, y) {
        this.x = x
        this.y = y
        this.collision = false
        this.draw = function() {
//          this.x += 4
          jaws.context.drawImage(jaws.assets.get("img/ornament_green.png"), this.x, this.y)
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
      var items = ["Start", "Settings", "Highscore"]
 
      this.setup = function() {
        index = 0
        jaws.on_keydown(["down","s"],       function()  { index++; if(index >= items.length) {index=items.length-1} } )
        jaws.on_keydown(["up","w"],         function()  { index--; if(index < 0) {index=0} } )
        jaws.on_keydown(["enter","space"],  function()  { if(items[index]=="Start") {jaws.switchGameState(PlayState) } } )
      }
 
      this.draw = function() {
        jaws.context.clearRect(0,0,jaws.width,jaws.height)
        for(var i=0; items[i]; i++) {
          // jaws.context.translate(0.5, 0.5)
          jaws.context.font = "bold 50pt terminal";
          jaws.context.lineWidth = 10
          jaws.context.fillStyle =  (i == index) ? "Red" : "Black"
          jaws.context.strokeStyle =  "rgba(200,200,200,0.0)"
          jaws.context.fillText(items[i], 30, 100 + i * 60)
        }  
      }
    }
 
    /*
    *
    * Our script-entry point
    *
    */
    window.onload = function() {
      jaws.assets.add("img/pixel_santa1.png")
      jaws.assets.add("img/ornament_green.png")
      jaws.assets.add("img/skull.png")
      jaws.start(MenuState)
    }