class MyAudio {
    myAudio;
    isLoaded = false;

    constructor(sound) {
        this.myAudio = new Audio(sound);
    }
}

class AudioHub {
    static CHAR_HURT = new MyAudio("./assets/sounds/character/characterDamage.mp3");
    static CHAR_DEAD = new MyAudio("./assets/sounds/character/characterDead.mp3");
    static CHAR_JUMP = new MyAudio("./assets/sounds/character/characterJump.mp3");
    static CHAR_LANDING = new MyAudio("./assets/sounds/character/characterLanding.mp3");
    static CHAR_WALK = new MyAudio("./assets/sounds/character/characterRun.mp3");
    static CHAR_THROW = new MyAudio("./assets/sounds/character/characterThrow.mp3");
    static CHAR_SLEEP = new MyAudio("./assets/sounds/character/characterSnoring.mp3");
    static COLL_COIN = new MyAudio("./assets/sounds/collectables/coin-collect-sound.mp3");
    static COLL_COIN_4 = new MyAudio("./assets/sounds/collectables/coin-4-collect-sound.mp3") 
    static COLL_BOTTLE = new MyAudio("./assets/sounds/collectables/bottle-collect-sound.mp3");
    static THROW_HITGORUND = new MyAudio("./assets/sounds/throwable/bottleBreak.mp3");
    static THROW_HITCHICKEN = new MyAudio("./assets/sounds/chicken/chickenDead.mp3");
    static JUMP_HITCHICKEN = new MyAudio("./assets/sounds/chicken/chickenDead2.mp3");
    static RUN_START_SOUND = new MyAudio("./assets/sounds/game/run-start-sound.mp3");
    static TYPE_SOUND = new MyAudio("./assets/sounds/game/type-sound.mp3");
    static ENDBOSS_HIT_S1 = new MyAudio("./assets/sounds/endboss/boss-hit-first-stage.mp3");
    static ENDBOSS_HIT_S2 = new MyAudio("./assets/sounds/endboss/boss-get-hit.mp3");
    static ENDBOSS_CHANGE_STATE = new MyAudio("./assets/sounds/endboss/boss-get-hit.mp3");
    static ENDBOSS_JUMP_ATTACK = new MyAudio("./assets/sounds/endboss/boss-jump-attack.mp3");
    static ENDBOSS_LANDING = new MyAudio("./assets/sounds/endboss/boss-landing.mp3");
    static ENDBOSS_DIE = new MyAudio("./assets/sounds/endboss/boss-approach.mp3");
    static GAME_WIN = new MyAudio("./assets/sounds/game/win-sound.mp3");
    static GAME_OVER = new MyAudio("./assets/sounds/game/game-over-sound.mp3");
    static GAME_MUSIC = new MyAudio("./assets/bgm/mexico-mariachi-music.mp3");

    static DEFAULT_VOLUME = 0.2;
    static AUDIO_VOLUME = 0.2;
    static ISSOUND_MUTE = false;


    static allSounds = [AudioHub.GAME_MUSIC, 
        AudioHub.CHAR_HURT, AudioHub.CHAR_DEAD, AudioHub.CHAR_JUMP, AudioHub.CHAR_WALK, AudioHub.CHAR_THROW, AudioHub.CHAR_SLEEP, 
        AudioHub.COLL_COIN, AudioHub.COLL_BOTTLE, 
        AudioHub.THROW_HITGORUND, AudioHub.THROW_HITCHICKEN, 
        AudioHub.JUMP_HITCHICKEN, AudioHub.TYPE_SOUND,
        AudioHub.ENDBOSS_HIT_S1, AudioHub.ENDBOSS_HIT_S2, AudioHub.ENDBOSS_CHANGE_STATE, AudioHub.ENDBOSS_JUMP_ATTACK, AudioHub.ENDBOSS_LANDING,
        AudioHub.GAME_WIN, AudioHub.GAME_OVER
    ];

    static initAudioHub() {
        AudioHub.initAudioVolume();
        AudioHub.initAudioMute();
    }

    static initAudioVolume() {
        let localVolume = localStorage.getItem("[EPL] volume");
        if (localVolume == null) {
            localStorage.setItem("[EPL] volume", AudioHub.DEFAULT_VOLUME);
            AudioHub.AUDIO_VOLUME = AudioHub.DEFAULT_VOLUME;
        } else {
            AudioHub.AUDIO_VOLUME = Number(localVolume);
        }
        AudioHub.setAudioSlider();
    }

    static initAudioMute() {
        let muteStatus = localStorage.getItem("[EPL] mute");
        if (muteStatus == null) {
            AudioHub.saveMuteStatus(false);
        } else {
            if (muteStatus == "true") {
                AudioHub.mute(); 
                AudioHub.ISSOUND_MUTE = true;
            }
        }
    }


    static playOne(track, isLoop = false) {
        if (track.myAudio.readyState == 4 || track.isLoaded) {
            track.isLoaded = true;
            track.myAudio.volume = AudioHub.AUDIO_VOLUME; 
            track.myAudio.currentTime = 0; 
            track.myAudio.loop = isLoop;
            track.myAudio.play(); 
        }
    }

    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            sound.myAudio.pause();
        });
    }

    static stopOne(track) {
        track.myAudio.pause();
    }

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
