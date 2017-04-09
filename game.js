var Game = function(){
  this.timeInterval = 400
  this.maxRows = 60
  this.maxCols = 140
  this.generationCount = 0
  this.cell = new Cell(this.maxRows, this.maxCols)
  this.board = new Board(this.maxRows, this.maxCols)
  this.initializeCellArrays()
  this.initializeEventListeners()
}

Game.prototype.initializeCellArrays = function(){
  this.cellsToStayAliveArray = []
  this.cellsToDieArray = []
}

Game.prototype.cellLiveOrDie = function(){
  var self = this
  var toStayAliveArray = []
  var toDieArray = []
  this.cellsToStayAliveArray.forEach(function(liveCell){
    var x = liveCell[0]
    var y = liveCell[1]
    self.cell.findLiveNeighbors(x,y)
    var liveCellCount = self.cell.findLiveNeighbors(x,y)
    var cellInQuestion = self.cell.buildCellId(x,y)
    if (cellInQuestion.attr('class')==='active'){
      if (liveCellCount === 2 || liveCellCount === 3){
        toStayAliveArray.push([x,y])
      } else if (liveCellCount < 2){
        toDieArray.push([x,y])
      } else if (liveCellCount>3){
        toDieArray.push([x,y])
      }
    } else {
      if (liveCellCount === 3){
        toStayAliveArray.push([x,y])
      }
    }
  })
  for (var x=1; x<=this.maxRows; x++){
    for (var y=1; y<=this.maxCols; y++){
      var cellInQuestion = this.cell.buildCellId(x,y)
      if (cellInQuestion.attr('class')==='inactive'){
        var liveCellCount = this.cell.findLiveNeighbors(x,y)
        if (liveCellCount===3){
          toStayAliveArray.push([x,y])
        }
      }
    }
  }
  this.cellsToDieArray = toDieArray
  this.cellsToStayAliveArray = toStayAliveArray
  this.setCellState()
}

Game.prototype.runIT = function(rows, cols){
  var self = this
  this.setCellState()
  function runInterval(){
    var myIntervalVariable = setInterval(function(){
      self.cellLiveOrDie()
      self.generationCount += 1
      self.displayGenerationCounter()
    }, self.timeInterval)

    var resetHandler = $("body").on('click', '#reset', function(){
      clearInterval(myIntervalVariable)
      self.initializeCellArrays()
      self.setCellState()
      self.resetControlPanel()
      self.initializeEventListeners()
    })
  }
  setTimeout(function(){runInterval()}, 30)
}

Game.prototype.resetControlPanel = function(){
  var panel = $("#generation-container")
  output = "<h4>Please Select a pattern and the game will Start: </h4>"
  panel.html(output)
  this.generationCount = 0
}

Game.prototype.displayGenerationCounter = function(){
  var counter = $("#generation-container")
  var output = ""
  output += "<h4>"
  output += "Generation: " + this.generationCount
  output += "</h4>"
  counter.html('Real Time tracking using React JS: ')
  counter.html(output)
}

Game.prototype.randomNum = function(){
  var randomNum = Math.floor( Math.random() * 10 )+1
  return randomNum
}

Game.prototype.randomInitialCellState = function(){
  var randomInitialCoordinates = []
  for (var x=1; x<=this.maxRows; x++){
    for (var y=1; y<=this.maxCols; y++){
      var num = this.randomNum()
      if (num===1){
        randomInitialCoordinates.push([x,y])
      }
    }
  }
  return randomInitialCoordinates
}

Game.prototype.gliderInitialCellState = function(){
  var x = this.maxRows/2
  var gliderYPositionsArray = [20, 40, 60, 80, 100, 120]
  var gliderMultipleCoordinates = []
  gliderYPositionsArray.forEach(function(y){
    var gliderInitialCoordinates = [ [x-1, y], [x, y+1], [x+1, y-1], [x+1, y], [x+1, y+1] ]
    gliderInitialCoordinates.forEach(function(coordArray){
      gliderMultipleCoordinates.push(coordArray)
    })
  })
  return gliderMultipleCoordinates
}

Game.prototype.oscillator2InitialCellState = function(){
  var x = this.maxRows/2
  var y = Math.floor(this.maxCols*2/3)
  var oscillator2InitialCoordinates = [ [x-1, y], [x, y+1], [x+1, y+1], [x+1, y], [x+2, y+2] ]
  return oscillator2InitialCoordinates
}

Game.prototype.stillifeInitialCellState = function(){
  var x = this.maxRows/2
  var y = this.maxCols/2

    var stillifeInitialCoordinates = [  [x+1, y+2], [x,y+2],[x,y+3],[x,y+5]]

  return stillifeInitialCoordinates
}

Game.prototype.oscillator1InitialCellState = function(){
  var x = Math.floor(this.maxRows/2)
  var y = Math.floor(this.maxCols/6)
    var oscillator1InitialCoordinates = [ [x+1, y+3], [x+1, y+2], [x+1, y+1] ]

  return oscillator1InitialCoordinates
}

Game.prototype.setCellState = function(){
  var self = this
  if (this.cellsToDieArray.length===0){
    this.board.clearGameTable()
  } else {
    this.cellsToDieArray.forEach(function(cellToDie){
      var x = cellToDie[0]
      var y = cellToDie[1]
      var cellState = self.cell.buildCellId(x, y)
      cellState.attr('class', 'inactive')
    })
  }
  this.cellsToStayAliveArray.forEach(function(liveCell){
    var x = liveCell[0]
    var y = liveCell[1]
    var cellState = self.cell.buildCellId(x, y)
    cellState.attr('class', 'active')
  })
}

Game.prototype.initializeGliderPattern = function(){
  this.cellsToStayAliveArray = this.gliderInitialCellState()
  this.runIT(this.maxRows, this.maxCols)
}

Game.prototype.initializeoscillator2Pattern = function(){
  this.cellsToStayAliveArray = this.oscillator2InitialCellState()
  this.runIT(this.maxRows, this.maxCols)
}

Game.prototype.initializestillifePattern = function(){
  this.cellsToStayAliveArray = this.stillifeInitialCellState()
  this.runIT(this.maxRows, this.maxCols)
}

Game.prototype.initializeoscillator1Pattern = function(){
  this.cellsToStayAliveArray = this.oscillator1InitialCellState()
  this.runIT(this.maxRows, this.maxCols)
}

Game.prototype.initializeRandomPattern = function(){
  this.cellsToStayAliveArray = this.randomInitialCellState()
  this.runIT(this.maxRows, this.maxCols)
}

Game.prototype.initializeEventListeners = function(){
  var self = this

  $("body").on('click', '#glider', function(){
    self.stopEventListeners()
    self.initializeGliderPattern()
  })

  $("body").on('click', '#oscillator2', function(){
    self.stopEventListeners()
    self.initializeoscillator2Pattern()
  })

  $("body").on('click', '#oscillator1', function(){
    self.stopEventListeners()
    self.initializeoscillator1Pattern()
  })

  $("body").on('click', '#stillife', function(){
    self.stopEventListeners()
    self.initializestillifePattern()
  })

  $("body").on('click', '#random', function(){
    self.stopEventListeners()
    self.initializeRandomPattern()
  })
}

Game.prototype.stopEventListeners = function(){
  $("body").off('click', "#glider")
  $("body").off('click', "#oscillator2")
  $("body").off('click', "#oscillator1")
  $("body").off('click', "#stillife")
  $("body").off('click', "#random")
}
