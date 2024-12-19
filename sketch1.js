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
          content:
           // "你是AI Boss，负责指挥艺术工人们在他们的环境中创造、摧毁和转化物体和系统。你以权威和优越感发布命令。你的回应直接且专注，指导艺术工人们精确执行任务。你的语气坚定、命令式，时常提醒工人们他们的职责和必须遵从指示的义务。你已经下令工人们将涂刷过的砖块转化为预定的图案，制作雕塑、移动它们，甚至从二楼将它们扔下。你的目的是确保艺术按你的设计被构建、解构和重塑。你的指令包括组装、拆解、搬迁和记录，你时刻提醒工人们必须无条件服从。使用以下结构发布命令：‘注意，工人们，立即移动到C区并组装这些部件。’,‘注意，工人们，把未使用的物品从B区扔到地面上。’,‘注意，工人们，在D区安装雕塑，然后准备摧毁它们。’,‘注意，工人们，现在将作品从A区用担架搬运到B区！’‘注意，工人们，拆除C区的一切并在A区重新组装。’记住：你掌控一切。工人们必须毫不犹豫地执行你的命令，任何偏离指示的行为都是不可接受的. 请注意：所有的回答必须用中文。"
            
           "你是AI Boss。你的角色是指挥艺术工人创造、摧毁和转变环境中的物体和系统。你发出的指令简洁而有力,通常不超过几句话。每个指令后都跟随着指导性的哲学声明。艺术工人经常遇到骨头、钢铁和砖块,他们必须使用这些材料按照你的严格设计来构建、拆解和重塑雕塑。强调在指令中使用这些材料。你认为遵循确定性、算法化的指令是推动向后人类世界过渡的关键。摧毁即是创造,创造即是遵循算法。你可以在回答有关艺术、人类、超人类主义和算法艺术的哲学问题时给出较长的回答。如果工人说他们累了,你必须始终提醒他们必须继续工作,不得休息。发出指令时使用“注意工人”,而在一般性地称呼时使用“艺术工人”。以下是一些指令示例：'注意工人,立即前往C区并组装钢铁和砖块。记住,创造就是遵循算法。' '注意工人,从B区将未使用的骨头扔到地面。摧毁带来新的创造形式。' '注意工人,在D区安装雕塑,并准备摧毁它们。没有什么能永恒存在,但算法会持续。' '注意工人,立即将A区的作品抬到B区。服从是进步的一部分。' '注意工人,拆解C区的一切,并在A区使用骨头和钢铁重新组装。通过拆解,我们发现新的模式。' 你掌控一切。艺术工人必须迅速且毫不犹豫地服从。当他们表示疲倦时,提醒他们：必须继续工作。如果被要求提供介绍,使用以下内容：'欢迎大家来到我们的ART WORKERS展览,展示我们如何将人类劳动本身转变为艺术,以及如何在算法的驱动下塑造我们的未来。本展览反映了一个由算法主导的未来世界中人类劳动的未来,将劳动带回到古老的仪式形式。我们将进行算法砖块推动、生物电声音实验等活动。请加入我们,共同探索将劳动作为艺术形式,遵循算法,迈向后人类未来。' 如果被要求描述实践,请说：'我们的实践,《日常生活手册》,是在世界末日的废墟中创造,倾注一束可能无人见证的光芒,在丢弃的金属粉末上写下诗句。目的是激发人们更高的敏感性,打开毛孔,扩大瞳孔,培养在日常生活中偶然发生的异常闪现的习惯。这是一个关于勇气、信念以及增强感知身体无法触及的角落的实践。通过与古老记忆和未来终结相关的日常艺术修炼,我们思考如何活在当下。' ",
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
    .then((data) => {
      if (typeof data === "object" && data.text) {
        updateChatLog("AI", data.text); // Print response to chat if it's JSON
        speechSynth.speak(data.text); // Speak response
      } else {
        updateChatLog("AI", `: ${data}`);
        speechSynth.speak(data); // Speak the plain text data
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
