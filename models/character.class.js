class Character extends MoveableObject {

    constructor() {
        super(); // Ruft den Konstruktor von MoveableObject auf (wichtig!)
        this.loadImage('img/02_character_bud/Idle.png'); // Pfad zu deinem Bild
    }
}