(() => {
  if (window.top !== window.self) return;

  // Configuration - Replace with your OpenRouter API key
  const OPENROUTER_API_KEY =
    "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";
  const MODEL = "openai/gpt-3.5-turbo";
  let isButtonInserted = false;

  // LinkedIn DOM Selectors (Updated July 2024)
  const SELECTORS = {
    MESSAGES_CONTAINER: ".msg-s-message-list-content",
    RECEIVED_MESSAGE:
      ".msg-s-event-listitem__message-bubble:not(.msg-s-event-listitem__message-bubble--self)",
    REPLY_BOX:
      '[role="textbox"][contenteditable="true"].msg-form__contenteditable',
    TOOLBAR: ".msg-form__right-actions",
  };

  function getLastReceivedMessage() {
    const container = document.querySelector(SELECTORS.MESSAGES_CONTAINER);
    if (!container) return null;

    const messages = [
      ...container.querySelectorAll(SELECTORS.RECEIVED_MESSAGE),
    ];
    if (!messages.length) return null;

    return messages.pop().textContent.replace(/\s+/g, " ").trim();
  }

  async function insertAIButton() {
    if (isButtonInserted) return;
    const toolbar = document.querySelector(SELECTORS.TOOLBAR);
    if (!toolbar) return;

    // Remove existing button if any
    const existingBtn = document.getElementById("ai-reply-btn");
    if (existingBtn) existingBtn.remove();

    // Create button element
    const btn = document.createElement("button");
    btn.id = "ai-reply-btn";
    btn.innerHTML = `
            <span style="display: flex; align-items: center; gap: 6px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2.2 11.4L16 13.4l-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 1.8-1.8 1.4 1.4-1.8 1.8 1.8 1.8-1.4 1.4z" fill="white"/>
                </svg>
                AI Reply
            </span>
        `;

    // Button styling
    btn.style.cssText = `
            background: #0A66C2;
            color: white;
            border: none;
            border-radius: 18px;
            padding: 8px 16px;
            margin: 0 8px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            transition: opacity 0.2s;
            font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        `;

    // Click handler
    btn.onclick = async () => {
      try {
        const message = getLastReceivedMessage();
        if (!message) {
          alert("No recent messages found from the sender");
          return;
        }

        // Update button state
        btn.style.opacity = "0.7";
        btn.innerHTML =
          '<span style="animation: spin 1s linear infinite;">⚙️</span> Generating...';

        // Generate response
        const response = await generateAIResponse(message);
        await insertResponse(response);

        // Success state
        btn.innerHTML = "✅ Response Ready";
        setTimeout(() => {
          btn.style.opacity = "1";
          btn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2.2 11.4L16 13.4l-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 1.8-1.8 1.4 1.4-1.8 1.8 1.8 1.8-1.4 1.4z" fill="white"/>
                        </svg>
                        AI Reply
                    `;
        }, 2000);
      } catch (error) {
        console.error("AI Error:", error);
        btn.innerHTML = "❌ Error";
        setTimeout(() => {
          btn.style.opacity = "1";
          btn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2.2 11.4L16 13.4l-2.8 2.8-1.4-1.4 2.8-2.8-2.8-2.8 1.4-1.4 2.8 2.8 1.8-1.8 1.4 1.4-1.8 1.8 1.8 1.8-1.4 1.4z" fill="white"/>
                        </svg>
                        AI Reply
                    `;
        }, 2000);
      }
    };

    // Insert button
    toolbar.prepend(btn);
    isButtonInserted = true;
  }

  async function generateAIResponse(message) {
    const firstname = extractFirstName();
    const Username = extractUsername();

    const prompt = `Analyze this LinkedIn message language: "${message}". 
    Compose response IN THE SAME LANGUAGE using:
    
    1. Greeting in DETECTED LANGUAGE
    \n
    2. Response body (3-8 lines)
    \n
    3. Closing with name
    
    STRICT RULES:
    - RESPOND ONLY WITH FINAL MESSAGE
    - NO LANGUAGE ANNOTATIONS
    - NEVER SHOW "Detected language:" 
    - \n ONLY FOR LINE BREAKS
    - PRESERVE NAMES: ${firstname}/${Username}`;
    
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.href,
          "X-Title": "LinkedIn AI Reply",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: `You are a multilingual assistant. Critical rules:
              1. Detect language but NEVER mention detection
              2. Only output formatted reply
              3. Never add comments/notes
              4. Format strictly:
                 [Greeting]\n[Response]\n[Closing]` },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  async function insertResponse(text) {
    const replyBox = document.querySelector(SELECTORS.REPLY_BOX);
    if (replyBox) {
      replyBox.focus();
  
      // Clear existing content
      replyBox.innerHTML = "";
  
      // Format the text (replace newlines with <br> for proper formatting)
      const formattedText = text.replace(/\n/g, "<br>");
      Object.assign(replyBox.style, {
        color:        "black",   // text color
        fontSize:     "14px",    // font size
        fontWeight:   "bold"     // font weight
      });
      replyBox.innerHTML = formattedText;

      
  
      // Simulate input event to activate the send button
      const inputEvent = new Event("input", { bubbles: true });
      replyBox.dispatchEvent(inputEvent);
  
      // Trigger change event as well (some platforms listen for this)
      const changeEvent = new Event("change", { bubbles: true });
      replyBox.dispatchEvent(changeEvent);
  
      // Ensure the send button is activated (if not already)
      const sendButton = document.querySelector(SELECTORS.TOOLBAR + " button[type='submit']");
      if (sendButton) {
        sendButton.disabled = false; // Just in case it's still disabled
      }
    }
  }
  

  // Mutation Observer
  const observer = new MutationObserver(() => {
    if (document.querySelector(SELECTORS.MESSAGES_CONTAINER)) {
      insertAIButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  // Initial check with retry
  let checkAttempts = 0;
  const initCheck = setInterval(() => {
    if (document.querySelector(SELECTORS.TOOLBAR)) {
      insertAIButton();
      clearInterval(initCheck);
    }
    if (checkAttempts++ > 10) clearInterval(initCheck);
  }, 500);

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);
})();

function extractFirstName() {
  const nameSpan = document.querySelector(
    ".msg-overlay-bubble-header__title a span.t-bold"
  );
  if (!nameSpan) return null;

  const fullName = nameSpan.textContent.trim();
  return fullName.split(" ")[0];
}

function extractUsername() {
    // Find the profile link element
    const profileLink = document.querySelector('.artdeco-card a[href^="/in/"]');
    if (!profileLink) return null;
    
    // Extract username from href attribute
    const href = profileLink.getAttribute('href');
    return href.split('/')[2]; // Split URL and get the username part
}
