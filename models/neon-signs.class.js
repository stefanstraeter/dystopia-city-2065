class NeonSign extends MoveableObject {

    // Du kannst hier Standard-Werte festlegen
    // oder sie später im Constructor übergeben.

    constructor(path, x, y, width, height, frames, speed) {
        super();
        this.x = x;
        this.y = y; // Position auf dem Canvas
        this.width = width;
        this.height = height;

        // Da die Schilder feststehen, brauchen sie keine Schwerkraft.
        // Aber sie brauchen die Animations-Logik.

        this.loadImage(path); // Lädt das erste Bild/Spritesheet

        // Animations-Einstellungen
        this.frameCount = frames; // Wie viele Einzelbilder hat das Spritesheet?
        this.frameSpeed = speed;   // Wie schnell soll es blinken? (höher = langsamer)

        // Da Schilder sich nicht bewegen, reicht es, die Animation zu starten.
        // 'animate()' von MoveableObject erledigt den Rest.
    }

    // Wir überschreiben updateState, damit das Schild nur animiert wird,
    // aber sich nicht bewegt.
    updateState() {
        this.animate(); // Ruft super.animate() auf, um die Frames durchzugehen
    }
}