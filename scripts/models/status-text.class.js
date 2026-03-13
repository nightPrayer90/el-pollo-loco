class StatusTextObject extends DrawableObject {
    x = 720/2;
    y = 150;

    isDrawText = true;
    isTextShowing = false;
    textAlign = "center";
    textFontStyle = "28px Boogaloo";
    textFontColor = "white";

    constructor() {
        super();
        this.showTextString="";
    }

    updateText(textStr, soundType) {
        if (this.isTextShowing == true) return;
        this.isTextShowing = true;
        this.showTextString = textStr;
        this.clearText();
        this.playSound(soundType);
    }

    clearText() {
        setTimeout(() => {
            this.isTextShowing = false;
            this.showTextString = "";
        }, 4000);
    }

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
