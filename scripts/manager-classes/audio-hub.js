
class MyAudio {
    sound;
    isLoaded = false;

    constructor(sound_) {
        this.sound = new Audio(sound_);
    }
}


class AudioHub {
    // Audiodateien für Piano, Guitar, DRUMS
    static CHAR_HURT = new MyAudio("./assets/sounds/character/characterDamage.mp3");
    static CHAR_DEAD = new MyAudio("./assets/sounds/character/characterDead.mp3");
    static CHAR_JUMP = new MyAudio("./assets/sounds/character/characterJump.mp3");
    static CHAR_LANDING = new MyAudio("./assets/sounds/character/characterLanding.mp3");
    static CHAR_WALK = new MyAudio("./assets/sounds/character/characterRun.mp3"); 
    static CHAR_THROW = new MyAudio("./assets/sounds/character/characterThrow.mp3"); 
    static COLL_COIN = new MyAudio("./assets/sounds/collectables/coinCollectSound.mp3"); 
    static COLL_BOTTLE = new MyAudio("./assets/sounds/collectables/bottleCollectSound.mp3"); 
    static THROW_HITGORUND = new MyAudio("./assets/sounds/throwable/bottleBreak.mp3"); 
    static THROW_HITCHICKEN = new MyAudio("./assets/sounds/chicken/chickenDead.mp3"); 
    static JUMP_HITCHICKEN = new MyAudio("./assets/sounds/chicken/chickenDead2.mp3"); 

    // Array, das alle definierten Audio-Dateien enthält
    static allSounds = [AudioHub.CHAR_HURT, AudioHub.CHAR_DEAD, AudioHub.CHAR_JUMP, AudioHub.CHAR_WALK, AudioHub.CHAR_THROW,
                        AudioHub.COLL_COIN, AudioHub.COLL_BOTTLE, 
                        AudioHub.THROW_HITGORUND, AudioHub.THROW_HITCHICKEN, AudioHub.JUMP_HITCHICKEN,
    ];

    // Spielt eine einzelne Audiodatei ab
    static playOne(track) { 

        if (track.sound.readyState == 4 || track.isLoaded) {
            track.isLoaded = true;
            track.sound.volume = 0.2;  // Setzt die Lautstärke auf 0.2 = 20% / 1 = 100%
            track.sound.currentTime = 0;  // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
            track.sound.play();  // Spielt das übergebene Sound-Objekt ab
        }
    }

    // Stoppt das Abspielen aller Audiodateien
    static stopAll() {
        AudioHub.allSounds.forEach(sound => {
            sound.pause();  // Pausiert jedes Audio in der Liste
        });
        document.getElementById('volume').value = 0.2;  // Setzt den Sound-Slider wieder auf 0.2
    }


    // Stoppt das Abspielen einer einzelnen Audiodatei
    static stopOne(sound) {
        sound.pause();  // Pausiert das übergebene Audio
    }


    // ##########################################################################################################################
    // ################################################  Sound Slider - BONUS !  ################################################
    // Setzt die Lautstärke für alle Audiodateien
    static objSetVolume(volumeSlider) {
        let volumeValue = document.getElementById('volume').value;  // Holt den aktuellen Lautstärkewert aus dem Inputfeld
        volumeSlider.forEach(sound => {
            sound.volume = volumeValue;  // Setzt die Lautstärke für jedes Audio wie im Slider angegeben
        });
    }


    static mute() {
        AudioHub.allSounds.forEach(sound => {
            sound.volume = 0;
        });
    }

    static unmute() {
        AudioHub.allSounds.forEach(sound => {
            sound.volume = 0.2;
        });
    }
}