const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultContainer = document.querySelector('.resultContainer');
const wordTitle = document.querySelector('.wordtitle');
const wordDescription = document.querySelector('.wordDescription');
const audioButton = document.getElementById('audioButton');

searchButton.addEventListener("click", () => {
    search();
});

searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        search();
    }
});

function search() {
    const searchItem = searchInput.value.trim();
    if (searchItem === '') {
        alert('Please enter a word to search');
        return;
    }
    fetchDictionaryData(searchItem);
}

async function fetchDictionaryData(searchItem) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchItem}`);
        if (!response.ok) {
            throw new Error('Word not found or API error');
        }

        const data = await response.json();
        displayResult(data);
    } catch (error) {
        console.error(error);
        alert('An error has occurred. Check the word or try again later.');
    }
}

function displayResult(data) {
    resultContainer.style.display = 'block';
    const wordData = data[0];
    wordTitle.textContent = wordData.word;

    wordDescription.innerHTML = `
        <ul>
            ${wordData.meanings.map(meaning => `
                <li>
                    <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
                    <p><strong>Definition:</strong> ${meaning.definitions[0].definition}</p>
                </li>
            `).join('')}
        </ul>
    `;

    // Optional: play audio if available
    if (wordData.phonetics && wordData.phonetics[0] && wordData.phonetics[0].audio) {
        audioButton.onclick = () => {
            const audio = new Audio(wordData.phonetics[0].audio);
            audio.play();
        };
    } else {
        audioButton.onclick = () => speak(wordData.word);
    }
}

function speak(word) {
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = 'en-US';
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}
