import Matrix from './matrix.js';
import Tetramino from './tetramino.js';
import ContentGame from './contentGame.js';
import InterfaceGame from './interfaceGame.js';

//console.log("TETRIS.JS LOADED");

var canvas = document.getElementById('canvas'); //riferimento allo schermo
var ctx = canvas.getContext('2d'); //oggetto per disegnare sul canvas

var canv_next_tetr = document.getElementById('canv_next_tetr'); 
var ctx2 = canv_next_tetr.getContext('2d'); 

const SCALE = 20; //fattore di scala (ogni pixel diventerà 20 pixel)

//scalo il contesto per poter lavorare su blocchi da 1 pixel che in realtà saranno scalati in 20 pixel
ctx.scale(SCALE, SCALE);
ctx2.scale(SCALE, SCALE);

var tetris = document.getElementById('tetris'); //contiene bordo_gioco e stats_gioco
var bordo_gioco = document.getElementById('bordo_gioco');//contiene titolo e playButton
var titolo = document.getElementById('titolo');
var playButton = document.getElementById('play');
var musica = document.getElementById('musica');
var stats_gioco = document.getElementById('stats_gioco');//contiene level, nRows e points
var level = document.getElementById('level');
var nRows = document.getElementById('nRows');
var points = document.getElementById('points');

var countLevel = 1;
var countPoints = 0;
var oldLines = 0;

var iGame = new InterfaceGame(); //creao l'interfaccia di gioco(inizializzo la prima config del tetramino)
var cGame = new ContentGame(canvas.width / SCALE, canvas.height / SCALE, iGame); //matrice contenitrice della mappa del gioco
var t = iGame.getNextTetramino(); //assegno a t un tetramino
var nextTetr = null;

//variabili ausiliarie per gestire la caduta dei tetramini
var lastTime = 0;
var dropInterval = 700; //decide la velocità con cui scenderà il tetramino
var lastDropDt = 0; //accumulerà i deltaTime tra un aggiornamento e l'altro 

var active = false; //variabile per attivare il requestanimationframe

var lost = false;//per sapere se ho perso

var clickplay= false;

//gestisce quando si clicca sul bottone play
playButton.addEventListener('mousedown', function() {
    
    titolo.parentNode.removeChild(titolo); //rimuovo il titolo
    playButton.parentNode.removeChild(playButton);//rimuovo il bottone
    clickplay = true;
    canvas.addEventListener("mouseup", function(e) {
        if(clickplay){
            clickplay = false;
            active = true;
            musica.play();
            stats_gioco.style.visibility = 'visible';//rendo visibile le statistiche di gioco
            update();
        }
        else{
            if(lost) window.location.reload(false);
        }
    });
});

function drawGame(){
    
    //disegno lo sfondo
    ctx.fillStyle = 'lightblue'; 
    ctx.fillRect(0, 0, canvas.width/SCALE, canvas.height/SCALE); 

    //disegno il prossimo tetramino che cadrà in alto a dx
    ctx2.fillStyle = 'lightblue';
    ctx2.fillRect(0, 0, canv_next_tetr.width/SCALE, canv_next_tetr.height/SCALE);
    nextTetr = new Tetramino(iGame.configs[iGame.nextTetramino], iGame.nextTetramino);
    nextTetr.color = iGame.colors[iGame.nextTetramino];
    nextTetr.draw_next_tetr(ctx2);
}

//funzione che aggiorna le statitistiche di gioco
function updateStats(){
    //AGGIORNO IL NUMERO DI RIGHE ELIMINATE
    nRows.textContent = "Rows: ".concat(iGame.Nlines);
    //AGGIORNO I PUNTI
    if(countLevel  === 1 && (oldLines < iGame.Nlines)) {
        countPoints += (iGame.Nlines - oldLines) * 50
        points.textContent = "Points: ".concat(countPoints);
    }
    else if(countLevel  === 2 && (oldLines < iGame.Nlines)) {
        countPoints += (iGame.Nlines - oldLines) * 100
        points.textContent = "Points: ".concat(countPoints);
    }
    else if(countLevel  === 3 && (oldLines < iGame.Nlines)) {
        countPoints += (iGame.Nlines - oldLines) * 200
        points.textContent = "Points: ".concat(countPoints);
    }
    else if(countLevel  === 4 && (oldLines < iGame.Nlines)) {
        countPoints += (iGame.Nlines - oldLines) * 400
        points.textContent = "Points: ".concat(countPoints);
    }
    else if(countLevel  === 5 && (oldLines < iGame.Nlines)) {
        countPoints += (iGame.Nlines - oldLines) * 800
        points.textContent = "Points: ".concat(countPoints);
    }
    //AGGIORNO IL LIVELLO
    if( (countLevel === 1) && (iGame.Nlines >= 5)  && (oldLines < iGame.Nlines)){ 
        countLevel++;
        level.textContent = "Level: ".concat(countLevel);
        musica.playbackRate += 0.25; //incremento la velocità della musica
        dropInterval -= 150; //incremento la velocità del drop dei tetramini
    }
    else if( (countLevel === 2) && (iGame.Nlines >= 10) && (oldLines < iGame.Nlines)){
        countLevel++;
        level.textContent = "Level: ".concat(countLevel);
        musica.playbackRate += 0.50;
        dropInterval -= 200;
    }
    else if( (countLevel === 3) && (iGame.Nlines >= 15) && (oldLines < iGame.Nlines)){
        countLevel++;
        level.textContent = "Level: ".concat(countLevel);
        musica.playbackRate += 0.75;
        dropInterval -= 250;
    }
    else if( (countLevel === 4) && (iGame.Nlines >= 20) && (oldLines < iGame.Nlines)){
        countLevel++;
        level.textContent = "Level: ".concat(countLevel);
        musica.playbackRate += 1;
        dropInterval -= 100;
    }
    
    oldLines = iGame.Nlines;

}

/*funzione che assegna al tetramino un'altra configurazione e lo riporta in alto
  (la usero' prima che appaia il prossimo tetramino) */
function resetTetramino(){
    t = iGame.getNextTetramino();
    t.position.y = 0;
    //aggiorno le righe cancellate
    cGame.deleteRows();
    //disegno il prossimo tetramino che cadra' in alto a dx
    ctx2.clearRect(0, 0, canv_next_tetr.width/SCALE, canv_next_tetr.height/SCALE);
    ctx2.fillStyle = 'lightblue';
    ctx2.fillRect(0, 0, canv_next_tetr.width/SCALE, canv_next_tetr.height/SCALE);
    nextTetr = new Tetramino(iGame.configs[iGame.nextTetramino], iGame.nextTetramino);
    nextTetr.color = iGame.colors[iGame.nextTetramino];
    nextTetr.draw_next_tetr(ctx2);
    //aggiorno le statistiche
    updateStats();
}


//evento keydown
window.addEventListener("keydown", (event) => {
    const {key} = event; //dall'oggetto event recupero la chiave key e la metto nella costante key
    let direction = 0; //memorizzo la direzione in cui sposto il tetramino
    if (key === "ArrowLeft" || key === "a") {
        direction = -1;
    } else if (key === "ArrowRight" || key === "d") {
        direction = 1;
    }
    t.position.x += direction;

    /*se il tetramino è arrivato ai bordi laterali del gioco
      oppure ha toccato un altro tetramino in gioco o
      semplicemente è arrivato in fondo 
      e premo ancora destra o sinistra faccio in modo che il tetramino non si sposti più*/
    if(t.collideBorders(canvas.width / SCALE) && direction != 0 ){
        t.position.x -= direction;
    } else if (cGame.collideothers(t) && direction !== 0){
        t.position.x -= direction;
    }

    //se premo s o freccia giu faccio scendere il tetramino piu veloce
    if( key === 'ArrowDown' || key === 's') {
        DropTetramino();
    }

    //se premo e ruoto a dx il tetramino
    if(key === 'e'){
        //se non è il quadrato
        if(t.color !== "brown"){
            t.rotate();
            /*se dopo la rotazione il tetramino va contro i bordi
            chiamo la funzione che lo sistema*/
            if(t.collideBorders(canvas.width / SCALE)) t.updateAfterRotate(canvas.width / SCALE);
    
            //se sono arrivato in fondo o ho toccato altri tetramini aggiorno la mappa e resetto il tetramino successivo
            if(cGame.collide(t)) {
                //non permetto la rotzione
                t.rotateInverse();
                //faccio scendere ancora di uno il tetramino e poi unisco il tutto alla mappa
                DropTetramino();
            } 
        }
    }

    //se premo q ruoto a sx il tetramino
    if(key === 'q'){
        //se non è il quadrato
        if(t.color !== "brown"){
            t.rotateInverse();
            /*se dopo la rotazione il tetramino va contro i bordi
            chiamo la funzione che lo sistema*/
            if(t.collideBorders(canvas.width / SCALE)) t.updateAfterRotate(canvas.width / SCALE);
    
            //se sono arrivato in fondo o ho toccato altri tetramini aggiorno la mappa e resetto il tetramino successivo
            if(cGame.collide(t)) {
                //non permetto la rotzione
                t.rotate();
                //faccio scendere ancora di uno il tetramino e poi unisco il tutto alla mappa
                DropTetramino();
            } 
        }
    }
});


//funzione che controlla il drop dei tetromini
function DropTetramino() {
    //faccio scendere il tetramino
    t.position.y++; 
    /*quando il tetramino ha toccato il fondo o altri tetramini
      aggiorno la mappa di gioco(contentGame)*/
    if(cGame.collide(t)) {
        t.position.y--;
        if(t.position.y === 0) {
            active = false;
            lost = true;
            musica.pause();
            gameOver();
        }
        else{
            cGame.unisci(t);
            resetTetramino();
        }
    } 
    lastDropDt = 0; //resetto il tempo del lastDrop
}

//funzione per aggiornare e quindi disegnare la vista
function update(time = 0){
    let deltaTime = time - lastTime; //calcolo il deltatime
    /*
    console.log("TIME",time/1000);
    console.log("DELTATIME", deltaTime/1000);*/
    lastDropDt += deltaTime; 
    //console.log("LASTDROPDT",lastDropDt/1000);
    if(lastDropDt > dropInterval){
        DropTetramino();
    }
    if(active){
        //disegno lo sfondo del gioco pulito ogni volta che aggiorno
        drawGame();
        //disegno il tetramino nella posizione aggiornata
        t.draw(ctx);
        //disegno la mappa di gioco aggiornata
        cGame.draw(ctx);

        lastTime = time; 
        requestAnimationFrame(update);//la funzione continua a chiamare se stessa
    }
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width/SCALE, canvas.height/SCALE);
    ctx2.clearRect(0, 0, canv_next_tetr.width/SCALE, canv_next_tetr.height/SCALE);
    /*ctx2.fillStyle = "orange";
    ctx2.fillRect(0, 0, canv_next_tetr.width/SCALE, canv_next_tetr.height/SCALE);*/
    ctx.font = "bold 2px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", (canvas.width/SCALE)/2, (canvas.height/SCALE)/2);
    ctx.font = "bold 1px Arial";
    ctx.fillText("Fai Click per riprovare!", (canvas.width/SCALE) / 2, (canvas.height/SCALE) / 2 + 5);
}