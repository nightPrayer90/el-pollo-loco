/**
 * @class
 * Represents a UI text object used to display temporary messages on screen.
 */
export class StatusTextObject extends DrawableObject {

    //#region Properties
    x = 720/2;
    y = 150;

    isDrawText = true;
    isTextShowing = false;

    textAlign = "center";
    textFontStyle = "28px Boogaloo";
    textFontColor = "white";
    //#endregion

    /**
     * Creates the status text object.
     */
    constructor() {
        super();
        this.showTextString="";
    }

     //#region Methods
    /**
     * Displays a text message for a short duration.
     * @param {string} textStr - Text to display.
     * @param {number} soundType - Optional sound identifier.
     */
    updateText(textStr, soundType) {
        if (this.isTextShowing) return;
        
        this.isTextShowing = true;
        this.showTextString = textStr;
        this.clearText();
        this.playSound(soundType);
    }

    /**
     * Clears the displayed text after a delay.
     */
    clearText() {
        setTimeout(() => {
            this.isTextShowing = false;
            this.showTextString = "";
        }, 4000);
    }

    /**
     * Plays a sound depending on the message type.
     */
    playSound(soundType) {
        switch (soundType) {
            case 0:
            break;
            case 1:
            AudioHub.playOne(AudioHub.TYPE_SOUND);
            break;
        }
    }
}
