//definisco i tertramini come delle matrici di dimensioni 4x4
import Matrix from './matrix.js';

export default class Tetramino {
    //passo una congigurazione al costruttore
    constructor(config, v) {
        this.elements = new Matrix(4,4);
        config.forEach(({x,y}) => {
            this.elements.set(v, x, y);
        });
        this.position = {
            x: 5,
            y: 0
        };
        this.color = null;
    }

    //controlla se dopo la rotazione collido da qualche parte e in caso sistema la vista
    updateAfterRotate(cols){
        let collide = false;

        this.elements.forEach((v, x, y) => {
            if(v !== 0){
                if(x + this.position.x < 0) { //bordo sx
                    this.position.x++;
                } else if (x + this.position.x >= cols) { //bordo dx
                    this.position.x--;
                }
                collide = true;
            }
        });
        return collide;
    }

    rotate(){
        this.elements.transpose();
    }

    rotateInverse(){
        this.elements.inverseTraspose();
    }

    /*restituisce l'array di triple (...,{v_i,x_i,y_i},...) in cui x e y rappresentano la posizione
      dei punti della matrice del tetramino con v != 0 */
    getSetted(){
        let arraypoint = [];
        this.elements.forEach((v, x, y) => {
            if(v !== 0){
                arraypoint.push({ v, x: x + this.position.x, y: y + this.position.y });
            }
        });
        return arraypoint;
    }

    /*
    hasSet(x, y) {
        let ex = x - this.position.x;
        let ey = y - this.position.y;

        if(ex > 0 && ey >= 0 && ex < 4 && ey < 4) return this.elements.get(ex, ey) !== 0;
        else return 0;
    }*/

    //controlla se un qualsiasi elemento del tetramino ha superato i bordi ai lati di gioco
    collideBorders(cols){
        let collide = false;
        this.elements.forEach((v, x, y) => {
            if( (v !== 0) && (x + this.position.x < 0 || x + this.position.x >= cols)){
                collide = true; 
                return;
            }
        });
        return collide;
    }


    //controlla se un qualsiasi elemento del tetramino ha superato il bordo inferiore di gioco
    collideBottom(rows){
        let collide = false;
        this.elements.forEach((v, x, y) => {
            if( (v !== 0) && (y + this.position.y >= rows)){
                collide = true; 
                return;
            }
        });
        return collide;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        this.elements.forEach((v, x, y) => {
            if(v !== 0) {
                ctx.fillRect(x + this.position.x, y + this.position.y , 1, 1);
            }
        });
    }
    
    draw_next_tetr(contest) {
        contest.fillStyle = this.color;
        this.elements.forEach((v, x, y) => {
            if(v !== 0){
                contest.fillRect(x + 1, y + 1, 1, 1);
            }
        });
    }
}