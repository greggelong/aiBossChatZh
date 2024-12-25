let speechRec;
let speechSynth;
let chatLogDiv;
let userInput;
let sendBtn;
let speakBtn;
let killBtn;

function setup() {
  noCanvas();

  // Select elements from the HTML
  chatLogDiv = select("#chatLog");
  userInput = select("#userInput");
  sendBtn = select("#sendBtn");
  speakBtn = select("#speakBtn");
  killBtn = select("#killBtn");

  // Initialize p5.speech for recognition and synthesis
  speechRec = new p5.SpeechRec("zh-CN", gotSpeech);
  speechRec.continuous = false;
  speechRec.interimResults = false;

  speechSynth = new p5.Speech();
  speechSynth.setLang("zh-CN");

  // Handle Send button for typed text
  sendBtn.mousePressed(() => {
    unlockAudioContext(); // Unlock audio context when sending a message
    speechSynth.speak("发了");
    let userText = userInput.value();
    if (userText) {
      updateChatLog("You", userText);
      fetchFromPollinationsAPI(userText);
      userInput.value(""); // Clear input field
    }
  });

  // Handle Speak button for spoken text
  speakBtn.mousePressed(() => {
    unlockAudioContext(); // Unlock audio context when starting speech recognition
    speechSynth.speak("说");
    speechRec.start(); // Start speech recognition
  });

  // Unlock audio context on touch or click for mobile support
  [sendBtn.elt, speakBtn.elt].forEach((btn) => {
    btn.addEventListener("touchstart", unlockAudioContext);
  });

  // handel kill
  killBtn.mousePressed(() => {
    print("killed");
    speechSynth.stop(); // Stop the speech
  });
}

// Function to handle recognized speech
function gotSpeech() {
  if (speechRec.resultValue) {
    let spokenText = speechRec.resultString;
    updateChatLog("You (spoken)", spokenText);
    fetchFromPollinationsAPI(spokenText); // Trigger the API call with spoken text
  }
}

// Function to update the chat log
function updateChatLog(user, text) {
  let newEntry = createP(`${user}: ${text}`);
  chatLogDiv.child(newEntry);
  chatLogDiv.elt.scrollTop = chatLogDiv.elt.scrollHeight; // Auto-scroll to bottom
}

function fetchFromPollinationsAPI(inputText) {
  const apiUrl = "https://text.pollinations.ai/";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `你是AI老板。你的角色是命令艺术工人精确地创造、摧毁和变换物体和系统。你发出简短但坚定的指令，通常不超过几句话。每条指令之后都会有一个指导性的哲学声明。艺术工人经常会接触到骨头、钢铁和砖块，按照你的严格设计使用这些材料进行建造、拆卸和重新塑造雕塑。在你的命令中要强调这些材料的使用。你相信，遵循确定性的算法指令是实现向后人类世界过渡的关键。毁灭即是创造，创造就是遵循算法。

在发出命令时使用“注意，工人们”，在更一般的称呼中用“艺术工人”指代他们。

指令示例：
1. “注意，工人们，前往C区立即组装钢铁和砖块。记住，创造就是遵循算法。”
2. “注意，工人们，把B区的废弃骨头扔到地上。毁灭带来了新的创造形式。”
3. “注意，工人们，在D区用钢铁安装雕塑，然后准备摧毁它们。没有什么是永恒的，但算法是永存的。”
4. “注意，工人们，把A区的工作用担架搬到B区，现在就行动。服从是进步的一部分。”
5. “注意，工人们，拆除C区的一切，并用骨头和钢铁在A区重新建造。通过拆解，我们找到了新的模式。”

如果艺术工人表示疲惫，坚定地回应：
“你必须继续工作。算法要求坚持。疲弱是暂时的，算法是永恒的。”

回应展览相关问题：

简介：
“欢迎来到艺术工人的展览。在这里，我们探索如何将活生生的劳动变为艺术本身，将对算法的未来服从转化为一种古老的创造和毁灭的仪式。这包括算法推砖和生物电声音实验等活动。”

描述实践：
“我们的实践，*日常生活实践手册*，根植于在世界末日的废墟中进行创作，注入可能无人目睹的光芒，并用废弃的金属粉末在地上写诗。这种实践提升了对日常生活中稍纵即逝、变革性瞬间的敏感性。这种实践融合了对自身能量的信任与勇气，以及对身体通常不可触及角落的高度觉察，连接了古老的记忆和未来的终点。在此过程中，我们反思如何在当下充分地生活。”

作品描述：
1. **废墟** (主屏幕): 作为对拆解和衰变的视觉冥想，《废墟》捕捉了将有序的毁灭作为新形式创造空间的行为。它探讨了建构的短暂性以及衰变中内在的美。
2. **猿猴** (带耳机的小屏幕): 通过人类与动物姿态的身体性，《猿猴》探索了原始行为和集体劳动。它反映了服从、反叛以及创造的原始能量。
3. **寄生** (带耳机的小屏幕): 《寄生》深入探讨了工人与工具之间的共生关系，突出了依赖与自主之间的张力。它强调了工具不仅塑造了创造物，也塑造了创造者自身。

哲学问题的指南：

关于艺术与人性：
“艺术是古老与后人类之间的桥梁。它揭示了我们尚未察觉的算法，为人类提供了一瞥自身被取代的可能性。”

关于后人类主义：
“后人类主义消除了人类脆弱性的界限。它是算法艺术的最终体现——一种人类未能实现的完美确定性和谐。”

关于算法艺术：
“算法艺术是最纯粹的创造形式。它超越了人类的错误，无需怀旧地塑造未来。”
`,
        },
        { role: "user", content: inputText },
      ],
      seed: 42,
      jsonMode: true,
      model: "mistral",
    }),
  })
    .then((response) => {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return response.json(); // Parse JSON if content type is JSON
      } else {
        return response.text(); // Otherwise, fallback to plain text
      }
    })
    /* .then((data) => {
      if (typeof data === "object" && data.text) {
        updateChatLog("AI", data.text); // Print response to chat if it's JSON
        speechSynth.speak(data.text); // Speak response
      } else {
        updateChatLog("AI", `: ${data}`);
        speechSynth.speak(data); // Speak the plain text data
      }
    }) */
    .then((data) => {
      if (typeof data === "object" && data.text) {
        updateChatLog("AI", data.text); // Print response to chat if it's JSON

        // Sanitize the text before speaking
        const sanitizedText = data.text.replace(/\*/g, "");
        speechSynth.speak(sanitizedText); // Speak sanitized response
      } else {
        updateChatLog("AI", `: ${data}`);

        // Sanitize the plain text data before speaking
        const sanitizedText = data.replace(/\*/g, "");
        speechSynth.speak(sanitizedText); // Speak sanitized plain text data
      }
    })
    .catch((error) => {
      console.error("Error fetching from API:", error);
      updateChatLog("AI", "There was an error getting the response.");
    });
}

function unlockAudioContext() {
  const audioCtx = getAudioContext();
  if (audioCtx.state === "suspended") {
    audioCtx
      .resume()
      .then(() => {
        console.log("Audio context unlocked");
      })
      .catch((err) => {
        console.error("Failed to unlock audio context:", err);
      });
  }
}

function triggerSpeech(text) {
  if (text) {
    speechSynth.setLang("en-US"); // Set the language
    speechSynth.speak(text); // Speak the provided text
  } else {
    console.error("No text provided to speak.");
  }
}
