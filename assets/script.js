// // // Text to speech Converter
// const text = document.getElementById("textToConvert");
// const convertBtn = document.getElementById("convertBtn");

// convertBtn.addEventListener('click', function () {
//     const speechSynth = window.speechSynthesis;
//     const enteredText = text.value;
//     const error = document.querySelector('.error-para');
//     console.log('hi');

//     if (!speechSynth.speaking &&
//         !enteredText.trim().length) {
//         error.textContent = `Nothing to Convert! 
//         Enter text in the text area.`
//     }
    
//     if (!speechSynth.speaking && enteredText.trim().length) {
//         error.textContent = "";
//         const newUtter =
//             new SpeechSynthesisUtterance(enteredText);
//         speechSynth.speak(newUtter);
//         convertBtn.textContent = "Sound is Playing..."
//     }
    
//     setTimeout(() => {
//         convertBtn.textContent = "Play Converted Sound"
//     }, 5000);
// });
// let audioBlob = null;

// document.getElementById('convertButton').addEventListener('click', () => {
//     const fileInput = document.getElementById('fileInput');
//     if (fileInput.files.length === 0) {
//         alert('Please select a text file.');
//         return;
//     }

//     const file = fileInput.files[0];
//     const reader = new FileReader();

//     reader.onload = function(event) {
//         const text = event.target.result;
//         generateAudio(text);
//     };

//     reader.readAsText(file);
// });

// document.getElementById('downloadButton').addEventListener('click', () => {
//     if (audioBlob) {
//         const url = URL.createObjectURL(audioBlob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'output.wav';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//     }
// });

// function generateAudio(text) {
//     const utterance = new SpeechSynthesisUtterance(text);
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const destination = audioContext.createMediaStreamDestination();
//     const mediaRecorder = new MediaRecorder(destination.stream);
//     let chunks = [];

//     utterance.onstart = () => {
//         const source = audioContext.createMediaStreamSource(destination.stream);
//         source.connect(destination);
//     };

//     utterance.onend = () => {
//         mediaRecorder.stop();
//     };

//     mediaRecorder.ondataavailable = (event) => {
//         chunks.push(event.data);
//     };

//     mediaRecorder.onstop = () => {
//         audioBlob = new Blob(chunks, { type: 'audio/wav' });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         const audioPlayer = document.getElementById('audioPlayer');
//         audioPlayer.src = audioUrl;
//         document.getElementById('downloadButton').style.display = 'inline';
//     };

//     // Start recording
//     mediaRecorder.start();

//     // Speak the text
//     window.speechSynthesis.speak(utterance);
// }
let audioBlob = null;

document.getElementById('convertButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a text file.');
        return;
    }

    const file = fileInput.files[0];

    if (file.size > 500 * 1024) { // 500KB limit
        alert('File size is too large');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const text = event.target.result;
        generateAudio(text);
    };

    reader.readAsText(file);
});

document.getElementById('downloadButton').addEventListener('click', () => {
    if (audioBlob) {
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.mp3'; // Set to mp3 format
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

document.getElementById('playButton').addEventListener('click', () => {
    document.getElementById('audioPlayer').play();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    document.getElementById('audioPlayer').pause();
});

function generateAudio(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream, { mimeType: 'audio/webm' });
    let chunks = [];

    utterance.onstart = () => {
        const source = audioContext.createMediaStreamSource(destination.stream);
        source.connect(destination);
    };

    utterance.onend = () => {
        mediaRecorder.stop();
    };

    mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioBuffer = await audioBlob.arrayBuffer();
        const audioUrl = URL.createObjectURL(new Blob([audioBuffer], { type: 'audio/webm' }));
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        document.getElementById('playButton').style.display = 'inline';
        document.getElementById('pauseButton').style.display = 'inline';
        document.getElementById('downloadButton').style.display = 'inline';

        // Convert webm to mp3
        convertWebMToMP3(audioBlob);
    };

    // Start recording
    mediaRecorder.start();

    // Speak the text
    window.speechSynthesis.speak(utterance);
}

async function convertWebMToMP3(audioBlob) {
    const response = await fetch('https://cdn.rawgit.com/zhuker/lamejs/1.2.0/lame.min.js');
    const scriptContent = await response.text();
    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.body.appendChild(script);

    script.onload = () => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const arrayBuffer = event.target.result;
            const buffer = new Uint8Array(arrayBuffer);
            const mp3Blob = encodeMP3(buffer);
            audioBlob = new Blob([mp3Blob], { type: 'audio/mp3' });
        };
        reader.readAsArrayBuffer(audioBlob);
    };
}

function encodeMP3(buffer) {
    const mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128);
    const samples = new Int16Array(buffer);
    const mp3Data = [];
    let remaining = samples.length;
    const maxSamples = 1152;

    for (let i = 0; remaining >= maxSamples; i += maxSamples) {
        const mono = samples.subarray(i, i + maxSamples);
        const mp3buf = mp3Encoder.encodeBuffer(mono);
        if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
        }
        remaining -= maxSamples;
    }
    const d = mp3Encoder.flush();
    if (d.length > 0) {
        mp3Data.push(d);
    }
    return new Blob(mp3Data, { type: 'audio/mp3' });
}
