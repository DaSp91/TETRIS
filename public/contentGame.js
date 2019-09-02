/*
  file che conterrà la matrice grande quanto tutto il canvas per poter
  inserire e quindi disegnare man mano i tetramini caduti e aggiornare
  la mappa di gioco
*/

import Matrix from "./matrix.js";

export default class ContentGame{
    constructor(width, height, iGame) {
        this.width = width;
        this.height = height;
        this.iGame = iGame;
        this.content = new Matrix(width, height);
    }

    //restituisce true se (parte del) il tetramino ha toccato il fondo o altri tetromini nel game
    collide(tetramino){
        if(tetramino.collideBottom(this.height)){
            return true;
        }
        if (this.collideothers(tetramino)) {
            return true;
        }
        return false;
    }

    //restituisce true se (parte del) il tetramino ha toccato un altro (parte) tetramino in gioco
    collideothers(tetramino){
        let collide = false;
        //recupero l'array dei punti settati a 1 del tetramino
        let pointSetted = tetramino.getSetted();
        pointSetted.forEach(({ v, x, y }) => {
            if(this.content.get(x, y) !==0 ) collide = true;
        });
        return collide;
    }

    //unisce il tetramino al contenuto di gioco 
    unisci(tetramino){
        //recupero l'array dei punti settati a 1 del tetramino
        let pointSetted = tetramino.getSetted();
        //copio il contenuto nella mappa di gioco
        pointSetted.forEach((pos) => {
            const {v, x, y } = pos;
            this.content.set(v, x, y);
        });
    }

    /*aggiorna la mappa eliminando se necassario le righe completate
      e conta il num di righe cancellate*/
    deleteRows() {
        this.iGame.Nlines += this.content.updateRows();
    }

    //disegna la mappa
    draw(ctx) {
        this.content.forEach((v, x, y) => {
            //console.log(v, x, y);
            if(v !== 0) {
                ctx.fillStyle = this.iGame.colors[v];
                ctx.fillRect(x, y, 1, 1);
            }
        });
        //console.table(this.content);
    }
}