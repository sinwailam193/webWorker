importScripts('./workerlib.js');

onmessage = function(event){
  var workerResult = computeRow(event.data); //worker does the task its assigned to
  postMessage(workerResult); //once finished, the worker send the result back to script.js
}