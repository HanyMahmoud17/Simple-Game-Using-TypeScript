import { ICard } from "./models/card.model";
import { IPrepare } from "./models/prepare.model";



// #region variable decleration
const prepare: IPrepare = {};
prepare.cards = [];
prepare.progress = 0;
prepare.fullTrack = new Audio('./assets/audios/fullTrack.mp3');
prepare.goodAudio = new Audio('./assets/audios/pass.mp3');
prepare.failAudio = new Audio('./assets/audios/fail.mp3');
prepare.flipAudio = new Audio('./assets/audios/flip.mp3');
prepare.gameOverAudio = new Audio('./assets/audios/gameOver.mp3');
prepare.fullTrack.loop = true;


const numberOfCards = 20;
const tempNumber = [];
let cardsHtmlContent = '';
// #endregion

// #region function description
const getRandom = (min, max) => {
    let result: number;
    let exists = true;
    min = Math.ceil(min);
    max = Math.floor(max);
    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!tempNumber.find(no => no === result.toString())) {
            exists = false;
            tempNumber.push(result.toString());
        }
    }
    return result;
}

const toggleFlip = (index) => {
    prepare.fullTrack.play();
    const card = prepare.cards[index];
    if (!card.flip && card.clicable) {
        flip(card, index);
        selectCard(card, index);
    }
}

const flip = (card: ICard, index: number) => {
    prepare.flipAudio.play();
    if (card) {
        card.flip = card.flip === '' ? 'flip' : '';
        document.getElementById(`card-flip-${index}`).classList.value = card.flip;
    }
}

const selectCard = (card: ICard, index: number) => {
    if (!prepare.selectedCard_1) {
        prepare.selectedCard_1 = card;
        prepare.selectedIndex_1 = index;
    }
    else if (!prepare.selectedCard_2) {
        prepare.selectedCard_2 = card;
        prepare.selectedIndex_2 = index;
    }

    if (prepare.selectedCard_1 && prepare.selectedCard_2) {
        if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
            prepare.selectedCard_1.clicable = false;
            prepare.selectedCard_2.clicable = false;
            prepare.selectedCard_1 = null;
            prepare.selectedCard_2 = null;
            stopAudio(prepare.failAudio);
            stopAudio(prepare.goodAudio);
            prepare.goodAudio.play();
            changeProgress();
            checkFinish();


        } else {
            setTimeout(() => {
                stopAudio(prepare.failAudio);
                stopAudio(prepare.goodAudio);
                prepare.failAudio.play();
                flip(prepare.selectedCard_1, prepare.selectedIndex_1);
                flip(prepare.selectedCard_2, prepare.selectedIndex_2)
                prepare.selectedCard_1 = null;
                prepare.selectedCard_2 = null;

            }, 1000)
        }
    }

}

const changeProgress = () => {
    const progress = prepare.cards.filter(card => !card.clicable).length / numberOfCards * 100;
    const progressElement = document.getElementById('progress');
    progressElement.style.width = `${progress}%`;
    progressElement.innerText = `${progress}%`;
}

const checkFinish = () => {
    if (prepare.cards.filter(card => !card.clicable).length === numberOfCards) {

        stopAudio(prepare.failAudio);
        stopAudio(prepare.fullTrack);
        stopAudio(prepare.goodAudio);
        prepare.gameOverAudio.play();
    }
}

const stopAudio = (audio: HTMLAudioElement) => {
    if (audio && audio.played) {
        audio.pause();
        audio.currentTime = 0;
    }
}



// #endregion



for (let index = 0; index < numberOfCards / 2; index++) {
    prepare.cards.push({
        id: getRandom(0, numberOfCards),
        src: `./assets/image/${index}.jpg`,
        flip: '',
        clicable: true,
        index
    });
    prepare.cards.push({
        id: getRandom(0, numberOfCards),
        src: `./assets/image/${index}.jpg`,
        flip: '',
        clicable: true,
        index
    })
}

prepare.cards.sort((a, b) => a.id > b.id ? 1 : -1);

prepare.cards.forEach((item, index) => {
    cardsHtmlContent += `
    <span class="col-sm-3 col-lg-6">
        <div onclick="toggleFlip(${index})" class="card-flip">
        <div id="card-flip-${index}">
                <div class="front">
                    <div class="card">
                        <img class="card-image" src="./assets/back.jpg">
                        <span class="card-content">
                                ${index + 1}
                        </span>
                    </div>
                </div>
                <div class="back">
                    <div class="card">
                    <img src="./assets/image/${item.index}.jpg" alt="Card Image" data-holder-rendered="true" style="height:120px; width:100%; display:block;">
                    </div>
                </div>
        
            </div>
        </div>
    </span>
    
    `;
});

document.getElementById('cards').innerHTML =cardsHtmlContent;



