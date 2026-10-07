import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";

let transcriber = null;

async function loadWhisper() {
  const status = document.getElementById("status");

  status.innerText = "Đang tải Whisper lần đầu...";

  try {
    transcriber = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en"
    );

    status.innerText = "Whisper đã sẵn sàng.";
  } catch (error) {
    console.error(error);
    status.innerText = "Lỗi tải Whisper: " + error.message;
  }
}

async function transcribe() {
  const fileInput = document.getElementById("audioFile");
  const status = document.getElementById("status");
  const resultBox = document.getElementById("result");

  if (!fileInput.files.length) {
    status.innerText = "Hãy chọn file ghi âm trước.";
    return;
  }

  if (!transcriber) {
    await loadWhisper();
  }

  status.innerText = "Đang chuyển giọng nói thành văn bản...";
  resultBox.value = "";

  try {
    const file = fileInput.files[0];
    const audioURL = URL.createObjectURL(file);

    const result = await transcriber(audioURL, {
      chunk_length_s: 30,
      stride_length_s: 5
    });

    resultBox.value = result.text;
    status.innerText = "Hoàn tất.";

    URL.revokeObjectURL(audioURL);

  } catch (error) {
    console.error(error);
    status.innerText = "Có lỗi khi xử lý file: " + error.message;
  }
}

export { loadWhisper, transcribe };
