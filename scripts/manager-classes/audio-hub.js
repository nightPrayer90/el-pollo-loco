class MyAudio {
    myAudio;
    isLoaded = false;

    constructor(sound) {
        this.myAudio = new Audio(sound);
    }
}

class AudioHub {
    // Audiodateien SFx
    static CHAR_HURT = new MyAudio("./assets/sounds/character/characterDamage.mp3");
    static CHAR_DEAD = new MyAudio("./assets/sounds/character/characterDead.mp3");
    static CHAR_JUMP = new MyAudio("./assets/sounds/character/characterJump.mp3");
    static CHAR_LANDING = new MyAudio("./assets/sounds/character/characterLanding.mp3");
    static CHAR_WALK = new MyAudio("./assets/sounds/character/characterRun.mp3");
    static CHAR_THROW = new MyAudio("./assets/sounds/character/characterThrow.mp3");
    static CHAR_SLEEP = new MyAudio("./assets/sounds/character/characterSnoring.mp3");
    static COLL_COIN = new MyAudio("./assets/sounds/collectables/coinCollectSound.mp3");
    static COLL_BOTTLE = new MyAudio("./assets/sounds/collectables/bottleCollectSound.mp3");
    static THROW_HITGORUND = new MyAudio("./assets/sounds/throwable/bottleBreak.mp3");
    static THROW_HITCHICKEN = new MyAudio("./assets/sounds/chicken/chickenDead.mp3");
    static JUMP_HITCHICKEN = new MyAudio("./assets/sounds/chicken/chickenDead2.mp3");

    // Audiodaten Bgm
    static GAME_MUSIC = new MyAudio("./assets/bgm/my-quest.mp3");

    static DEFAULT_VOLUME = 0.2;
    static AUDIO_VOLUME = 0.2;
    static ISSOUND_MUTE = false;

    // Array, das alle definierten Audio-Dateien enthält
    static allSounds = [AudioHub.GAME_MUSIC, AudioHub.CHAR_HURT, AudioHub.CHAR_DEAD, AudioHub.CHAR_JUMP, AudioHub.CHAR_WALK, AudioHub.CHAR_THROW, AudioHub.CHAR_SLEEP, AudioHub.COLL_COIN, AudioHub.COLL_BOTTLE, AudioHub.THROW_HITGORUND, AudioHub.THROW_HITCHICKEN, AudioHub.JUMP_HITCHICKEN];

    static initAudioHub() {
        if (localVolume == null) {
            localStorage.setItem("[EPL] volume", AudioHub.DEFAULT_VOLUME);
            AudioHub.AUDIO_VOLUME = AudioHub.DEFAULT_VOLUME;
        } else {
            AudioHub.AUDIO_VOLUME = Number(localVolume);
        }
        AudioHub.setAudioSlider();

        if (muteStatus == null) {
            AudioHub.saveMuteStatus(false);
        } else {
            if (muteStatus == "true") {
                AudioHub.mute();
                AudioHub.ISSOUND_MUTE  = true;
            }
        }
    }

    static initAudio

    // Spielt eine einzelne Audiodatei ab
    static playOne(track) {
        if (track.myAudio.readyState == 4 || track.isLoaded) {
            track.isLoaded = true;
            track.myAudio.volume = AudioHub.AUDIO_VOLUME; // Setzt die Lautstärke auf 0.2 = 20% / 1 = 100%
            track.myAudio.currentTime = 0; // Startet ab einer bestimmten stelle (0=Anfang/ 5 = 5 sec.)
            track.myAudio.play(); // Spielt das übergebene Sound-Objekt ab
        }
    }

    // Stoppt das Abspielen aller Audiodateien
    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            sound.myAudio.pause(); // Pausiert jedes Audio in der Liste
        });
    }

    // Stoppt das Abspielen einer einzelnen Audiodatei
    static stopOne(track) {
        track.myAudio.pause(); // Pausiert das übergebene Audio
    }

    // ##########################################################################################################################
    // ################################################  Sound Slider - BONUS !  ################################################
    // Setzt die Lautstärke für alle Audiodateien
    static objSetVolume() {
        let volumeValue = document.getElementById("volume").value; // Holt den aktuellen Lautstärkewert aus dem Inputfeld
        AudioHub.AUDIO_VOLUME = Number(volumeValue);
        AudioHub.saveMuteStatus(false);
        localStorage.setItem("[EPL] volume", AudioHub.AUDIO_VOLUME);

        AudioHub.allSounds.forEach((sound) => {
            sound.myAudio.volume = AudioHub.AUDIO_VOLUME;
        });
    }

    static setAudioSlider() {
        document.getElementById("volume").value = AudioHub.AUDIO_VOLUME;
    }

    static toggleSound() {
        AudioHub.saveMuteStatus(!AudioHub.ISSOUND_MUTE);
        if (AudioHub.ISSOUND_MUTE) {
            AudioHub.mute();
        } else {
            AudioHub.unmute();
        }
    }

    static mute() {
        AudioHub.AUDIO_VOLUME = 0;
        AudioHub.allSounds.forEach((sound) => {
            sound.myAudio.volume = AudioHub.AUDIO_VOLUME;
        });
    }

    static unmute() {
        AudioHub.AUDIO_VOLUME = localStorage.getItem("[EPL] volume");
        AudioHub.allSounds.forEach((sound) => {
            sound.myAudio.volume = AudioHub.AUDIO_VOLUME;
        });
    }

    static saveMuteStatus(isMute) {
        localStorage.setItem("[EPL] mute", isMute);
        AudioHub.ISSOUND_MUTE = isMute;
    }
}
