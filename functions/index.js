const { onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Fungsi chatbot
exports.chatbot = onCall((data, context) => {
  const userInput = data.userInput; // Input dari client

  // Cek input dan beri balasan
  let reply = '';
  if (userInput.toLowerCase().includes("halo")) {
    reply = "Halo! Apa yang bisa saya bantu?";
  } else if (userInput.toLowerCase().includes("terima kasih")) {
    reply = "Sama-sama! Senang bisa membantu!";
  } else {
    reply = `Anda berkata: ${userInput}. Saya belum mengerti itu.`;
  }

  // Log dan kirim balasan ke client
  logger.info(`User input: ${userInput}, Reply: ${reply}`);
  return { reply };
});
