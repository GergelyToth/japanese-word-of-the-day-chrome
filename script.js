function readFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

function random(lower, upper) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

function displayWord(word) {
  const kanjiEl = document.getElementById('kanji');
  const hiraganaEl = document.getElementById('hiragana');
  const romajiEl = document.getElementById('romaji');
  const englishEl = document.getElementById('english');

  kanjiEl.textContent = word.kanji;
  hiraganaEl.textContent = word.hiragana;
  romajiEl.textContent = word.romaji;
  englishEl.textContent = word.english;
}

function clock(timerId) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const clockEl = document.getElementById('clock');

  if (clockEl) {
    clockEl.textContent = timeString;
  }

  // timer
  setTimeout(clock, 1000);
}

function render() {
  clock();

  chrome.storage.local.get(['wordOfTheDay'], function(result) {
    if (result.wordOfTheDay.word && new Date(result.wordOfTheDay.date).toDateString() === new Date().toDateString()) {
      displayWord(result.wordOfTheDay.word);
      document.body.style.backgroundColor = 'hsl(' + result.wordOfTheDay.background + ', 58%, 50%)';
    } else {
      readFile("./words.json", function(text) {
        const data = JSON.parse(text);
        const randomColour = random(0, 357);
        const randomWord = data[random(0, data.length)];

        displayWord(randomWord);
        document.body.style.backgroundColor = 'hsl(' + randomColour + ', 58%, 50%)';

        // save the word in the local storage
        chrome.storage.local.set({ 'wordOfTheDay': {
          word: randomWord,
          date: +new Date(),
          background: randomColour,
        }});
      });
    }
  });
};

window.addEventListener('load', render);
