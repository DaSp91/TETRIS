import Tetramino from './tetramino.js';

//funzione che genera un numero casuale tra min e max
function randomFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1) + min);
}

export default class InterfaceGame{
    constructor(){
        
        this.Nlines = 0;
        this.points = 0;
        this.nextTetramino = null;
        this.currentTetramino = null;
        this.cGame = null;

        //lista che contiene tutte le possibili configurazioni dei tetramini
        this.configs = [
            [],
            [{x:0,y:2}, {x:1,y:1}, {x:1,y:2}, {x:2,y:2}], //T
            [{x:0,y:2}, {x:1,y:2}, {x:2,y:2}, {x:3,y:2}], //I
            [{x:0,y:1}, {x:0,y:2}, {x:1,y:2}, {x:2,y:2}], //J
            [{x:0,y:2}, {x:1,y:2}, {x:2,y:2}, {x:2,y:1}], //L
            [{x:1,y:1}, {x:1,y:2}, {x:2,y:1}, {x:2,y:2}], //O
            [{x:0,y:2}, {x:1,y:2}, {x:1,y:1}, {x:2,y:1}], //S
            [{x:0,y:1}, {x:1,y:1}, {x:1,y:2}, {x:2,y:2}] //Z
        ];
        this.colors = ['', 'green', 'red', 'blue', 'purple', 'brown', 'blueviolet', 'magenta' ];
        this.nextConfig();
    }

    //restituisce il tetramino successivo
    getNextTetramino(){
        this.currentTetramino = new Tetramino(this.configs[this.nextTetramino], this.nextTetramino);
        this.currentTetramino.color = this.colors[this.nextTetramino];
        this.nextConfig();
        return this.currentTetramino;
    }
    //assegna a nextTetramino una configurazione di un tetramino a caso
    nextConfig(){
        this.nextTetramino = randomFromInterval(1, this.configs.length - 1);
    }
}