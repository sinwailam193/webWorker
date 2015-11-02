$(function(){

  if(window.Worker){

    var numWorkers = 10;
    var workers = [];
    var nextRow = 0;
    var generation = 0;
    setupGraphics();

    function resizeToWindow() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var width = ((i_max - i_min) * canvas.width / canvas.height);
      var r_mid = (r_max + r_min) / 2;
      r_min = r_mid - width/2;
      r_max = r_mid + width/2;
      rowData = ctx.createImageData(canvas.width, 1);

      startWorkers();
    }
    
    window.onresize = function(){
      resizeToWindow();
    }

    function reassignWorker(worker){
      var row = nextRow++;

      if(row >= canvas.height){
        worker.idle = true;
      }
      else{
        var task = createTask(row, generation);
        worker.idle = false;
        worker.postMessage(task);
      }
    }

    function processWork(worker, workerResults){
      drawRow(workerResults);
      reassignWorker(worker);
    }

    function startWorkers(){
      generation++;
      nextRow = 0;

      for(var i = 0; i < workers.length; i++){
        var worker = workers[i];

        if(worker.idle){
          var task = createTask(nextRow, generation);//this return an object from the mandellib.js
          worker.idle = false;
          worker.postMessage(task);//we give the task to the web worker, and this is what starts the worker.
          nextRow++;
        }
      }
    }

    for(var i = 0; i < numWorkers; i++){
      var worker = new Worker('js/worker.js');

      worker.onmessage = function(event){
        processWork(event.target, event.data);
      }

      worker.idle = true; //to know which worker is working and which is idle. it is true becasue we haven't given it a work yet
      workers.push(worker);
    }

    startWorkers();

    function handleClick(x, y){
      var width = r_max - r_min;
      var height = i_min - i_max;
      var click_r = r_min + width * x / canvas.width;
      var click_i = i_max + height * y / canvas.height;

      var zoom = 8;

      r_min = click_r - width/zoom;
      r_max = click_r + width/zoom;
      i_max = click_i - height/zoom;
      i_min = click_i + height/zoom;

      startWorkers();
    }

    $('canvas').on('click', function(event){
      //event.clientX, event.clientY are native properties that gives us the coordinates of where the user clicked on the canvas
      handleClick(event.clientX, event.clientY);
    })
  }


});


