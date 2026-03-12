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

    updateText(textStr) {
        if (this.isTextShowing == true) return;
        this.isTextShowing = true;
        this.showTextString = textStr;
        this.clearText();
    }

    clearText() {
        setTimeout(() => {
            this.isTextShowing = false;
            this.showTextString = "";
        }, 4000);
    }
}
