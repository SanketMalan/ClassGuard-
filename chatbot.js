/* Simple client-side chatbot widget
   - No external network calls
   - Rule-based replies for common questions
   - Use Chatbot.init({role, name}) to set role-specific greeting
*/
(function (global) {
  const Chatbot = {
    role: 'guest',
    name: '',
    container: null,
    open: false,
    init(opts) {
      this.role = opts && opts.role ? opts.role : 'guest';
      this.name = (opts && opts.name) ? opts.name : '';
      this.renderLauncher();
    },
    renderLauncher() {
      if (this.container) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'chatbot-launcher';

      // launcher button
      const btn = document.createElement('button');
      btn.className = 'chatbot-button';
      btn.title = 'Open chat assistant';
      btn.innerHTML = '&#128172;';
      btn.addEventListener('click', () => this.togglePanel());

      // panel (hidden initially)
      const panel = document.createElement('div');
      panel.className = 'chatbot-panel';
      panel.style.display = 'none';

      const header = document.createElement('div');
      header.className = 'chatbot-header';
      const title = document.createElement('div');
      title.textContent = this.role === 'teacher' ? 'Teacher Assistant' : 'Student Assistant';
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.background = 'transparent';
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.cursor = 'pointer';
      closeBtn.addEventListener('click', () => this.togglePanel(false));
      header.appendChild(title);
      header.appendChild(closeBtn);

      const messages = document.createElement('div');
      messages.className = 'chatbot-messages';

      const suggests = document.createElement('div');
      suggests.className = 'chatbot-suggests';

      const inputRow = document.createElement('div');
      inputRow.className = 'chatbot-input';
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Ask me about timetables, registration, or scheduling...';
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          send();
        }
      });
      const sendBtn = document.createElement('button');
      sendBtn.textContent = 'Send';
      sendBtn.addEventListener('click', send);
      inputRow.appendChild(input);
      inputRow.appendChild(sendBtn);

      panel.appendChild(header);
      panel.appendChild(messages);
      panel.appendChild(suggests);
      panel.appendChild(inputRow);

      wrapper.appendChild(panel);
      wrapper.appendChild(btn);
      document.body.appendChild(wrapper);

      this.container = { wrapper, btn, panel, messages, input, suggests };

      // initial greeting
      setTimeout(() => {
        this.postBotMessage(this.getGreeting());
        this.showSuggestions(['What is my timetable?', 'How to register?', 'How to generate timetable?']);
      }, 400);

      function send() {
        const text = input.value.trim();
        if (!text) return;
        Chatbot.postUserMessage(text);
        input.value = '';
        // compute reply
        setTimeout(() => {
          const reply = Chatbot.computeReply(text);
          Chatbot.postBotMessage(reply);
        }, 450);
      }

      // suggestion click handler
      suggests.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('chatbot-suggest')) {
          const q = e.target.textContent;
          input.value = q;
          input.focus();
        }
      });
    },
    togglePanel(force) {
      if (!this.container) return;
      this.open = typeof force === 'boolean' ? force : !this.open;
      this.container.panel.style.display = this.open ? 'flex' : 'none';
      if (this.open) {
        this.container.input.focus();
      }
    },
    postUserMessage(text) {
      this.appendMessage('user', text);
    },
    postBotMessage(text) {
      this.appendMessage('bot', text);
    },
    appendMessage(kind, text) {
      if (!this.container) return;
      const row = document.createElement('div');
      row.className = 'chatbot-msg ' + (kind === 'bot' ? 'bot' : 'user');
      const bubble = document.createElement('div');
      bubble.className = 'chatbot-bubble ' + (kind === 'bot' ? 'bot' : 'user');
      bubble.textContent = text;
      row.appendChild(bubble);
      this.container.messages.appendChild(row);
      this.container.messages.scrollTop = this.container.messages.scrollHeight + 200;
    },
    showSuggestions(list) {
      if (!this.container) return;
      const el = this.container.suggests;
      el.innerHTML = '';
      list.forEach((t) => {
        const but = document.createElement('div');
        but.className = 'chatbot-suggest';
        but.textContent = t;
        el.appendChild(but);
      });
    },
    getGreeting() {
      if (this.role === 'teacher') {
        return `Hello ${this.name || 'Teacher'} — I can help with scheduling, assigning classes, or generating timetables.`;
      }
      if (this.role === 'student') {
        return `Hello ${this.name || 'Student'} — ask me about your timetable, class information or how to register.`;
      }
      return 'Hello — how can I help today?';
    },
    computeReply(text) {
      const t = text.toLowerCase();
      // simple keyword matching
      if (t.includes('timetable') || t.includes('schedule') || t.includes('class')) {
        if (this.role === 'student') {
          return 'To view your timetable, open the timetable section in your dashboard. If your account has a class assigned it will appear there. Try: "What is my timetable?"';
        }
        if (this.role === 'teacher') {
          return 'Teachers can generate timetables from the Scheduling panel. Use "Generate Timetable" and assign teachers and rooms in the panels.';
        }
        return 'Timetables are managed in the scheduling area.';
      }
      if (t.includes('register') || t.includes('signup') || t.includes('sign up')) {
        return 'To register, go to the registration page and fill the required form. Students and teachers have separate registration forms.';
      }
      if (t.includes('generate') || t.includes('create') || t.includes('assign')) {
        return 'To generate a timetable, teachers can use the Generate Timetable button in Scheduling — make sure classes, teachers, subjects and rooms are defined first.';
      }
      if (t.includes('contact') || t.includes('help') || t.includes('support')) {
        return 'For administrative help, contact the school administrator or use the support link in About. For demo, ask specific questions here.';
      }
      // match specific student/teacher short queries
      if (t.match(/my name|who am i/)) {
        return `You are logged in as ${this.name || 'a user'} (${this.role}).`;
      }
      // fallback
      this.showSuggestions(['What is my timetable?', 'How to register?', 'How to generate timetable?']);
      return "Sorry, I don't understand exactly — try one of the suggestions or ask about timetables, registration, or scheduling.";
    },
  };

  // expose
  global.Chatbot = Chatbot;
})(window);
