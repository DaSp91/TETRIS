/*classe Matrice che uso per costruire i tetramini e per gestire 
  l'aggiornamento della mappa di gioco
*/
export default class Matrix{
    constructor(width, height){
        this.elements = [];
        //finchè l'altezza è maggiore di zero inizializzo la matrice a tutti 0
        while(height-- > 0){
            this.elements.push( new Array(width).fill(0));
        }
    }

    //metodo per settare il valore v nella posizione (x,y) della matrice
    set(v, x, y){
        this.elements[y][x] = v;
    }

    //metodo che restituisce il valore della matrice nella posizione (x,y)
    get(x,y) {
        return this.elements[y][x];
    }

    /*metodo per ottenere la matrice trasposta:
      mi serve per la rotazioe dei tetramini*/
    transpose(){
        //scambio le righe con le colonne
        for(let i=0; i<4; i++) {
            for(let j=0; j<i; j++){//lavoro solo sulla diagonale
                let tmp = this.get(i,j);
                this.set(this.get(j,i), i, j);
                this.set(tmp, j ,i);
            }
        }  
        //inverto le righe
        for(let i=0; i<4; i++) this.elements[i].reverse();
        
    }
    //riporta indietro la rotazione
    inverseTraspose(){
        //inverto le righe
        for(let i=0; i<4; i++) this.elements[i].reverse();
        //scambio le righe con le colonne
        for(let i=0; i<4; i++) {
            for(let j=0; j<i; j++){//lavoro solo sulla diagonale
                let tmp = this.get(i,j);
                this.set(this.get(j,i), i, j);
                this.set(tmp, j ,i);
            }
        }  
    }
    
    //esegue una funzione cb su ogni elemento della matrice
    forEach(cb) {
        this.elements.forEach((row, y) => {
            row.forEach((v, x) => {
                cb(v, x, y);
            });
        });
    }

    //aggiorna la matrice di gioco se ci sono righe da eliminare
    updateRows(){
        let rowToDelete = []; //inseriro' gli indici di riga da eliminare
        
        const len = this.elements.length;//salvo la lunghezza della matrice(numero di righe)
        //console.log("LUNGHEZZA",len);
        this.elements.forEach((row, i) => {
            
            if(i<=26){
                /*per ogni riga della matrice 
                controllo che tutti gli elementi della riga siano  !=0
                e nel caso inserisco l'indice di riga in rowToDelete*/
                if(row.every((v) => v !== 0)){
                    rowToDelete.push(i);
                }
            }
        }); 

        //elimino le righe dalla matrice prendendo gli indici da rowToDelete
        rowToDelete.forEach((idx) => {
            this.elements.splice(idx, 1);
        }); 

        /*
        for(let i=0; i<rowToDelete.length; i++){
            this.elements.splice(rowToDelete[i],1);
        }
        */

        
        //aggiungo in cima alla matrice tante righe vuote(piene di zeri) quante ne ho cancellate
        for(let k = 0; k < rowToDelete.length; k++){
            this.elements.unshift(new Array(this.elements[0].length).fill(0));
        }
        
        //restituisco il numero delle righe cancellate per poi poter aggiornare Nlines
        return rowToDelete.length;
    }
}