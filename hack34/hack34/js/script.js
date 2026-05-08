/**
 * =========================================================
 * 1. STATE MANAGEMENT SYSTEM 
 * =========================================================
 */
// A. Global Profile State
const userProfile = {
  name: 'Priya S.',
  dob: '',
  bloodGroup: 'O+',
  weight: '68',
  height: '170',
  allergies: 'None',
  lastLogin: ''
};

// B. File Upload Simulation State
let uploadedFileState = {
  isAnalyzed: false,
  fileName: '',
  analysisResult: null
};

function saveUserProfile(data) {
  Object.assign(userProfile, data);
  userProfile.lastLogin = new Date().toISOString();
  localStorage.setItem('medisight_userProfile', JSON.stringify(userProfile));
}

function loadUserProfile() {
  const stored = localStorage.getItem('medisight_userProfile');
  if (stored) Object.assign(userProfile, JSON.parse(stored));
}

/**
 * =========================================================
 * INITIALIZATION & HOOKS
 * =========================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();

  if (document.querySelector('.dashboard-layout')) {
    displayWelcome();
    setupChat();
    setupGlobalUpload();
    setupFullExpertChat();
  }

  // Hook: Signup Data Capture
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const createBtn = signupForm.querySelector('[type=submit]');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('fullName') || document.querySelector('input[type="text"]');
        saveUserProfile({
          name: nameInput && nameInput.value ? nameInput.value.trim() : 'Priya S.'
        });
      });
    }
  }

  // Hook: Onboarding Modal Data Capture
  const completeBtn = document.querySelector('#step-4 .btn-primary') || document.getElementById('btn-go-dashboard');
  const onboardingModal = document.getElementById('onboardingModal');
  
  if (completeBtn && onboardingModal) {
    completeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const bloodGroupSelect = document.querySelector('#step-1 select');
      const heightInput = document.querySelector('#step-1 input[placeholder="170"]');
      const weightInput = document.querySelector('#step-1 input[placeholder="68"]');
      
      saveUserProfile({
        bloodGroup: bloodGroupSelect ? bloodGroupSelect.value : 'O+',
        height: heightInput && heightInput.value ? heightInput.value : '170',
        weight: weightInput && weightInput.value ? weightInput.value : '68'
      });

      onboardingModal.style.display = 'none';
      onboardingModal.classList.remove('open');
      document.querySelector('.main-content')?.classList.add('animate-fade-up');
    });
  }
});

/**
 * =========================================================
 * DASHBOARD TAB SWITCHING & UI LOGIC
 * =========================================================
 */
function displayWelcome() {
  const greetingEl = document.querySelector('h1');
  const firstName = userProfile.name ? userProfile.name.split(' ')[0] : 'User';
  if (greetingEl) greetingEl.textContent = `Welcome back, ${firstName} 👋`;
}

// Global function to switch tabs
window.switchDashTab = function(tabId, element) {
  // Update sidebar active classes
  if (element) {
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    element.classList.add('active');
  }

  // Hide all tabs and show target tab
  document.querySelectorAll('.dash-tab').forEach(tab => tab.classList.remove('active'));
  const targetTab = document.getElementById('tab-' + tabId);
  if (targetTab) {
    targetTab.classList.add('active');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
};

/**
 * =========================================================
 * 2. EXPERT AI CHAT LOGIC
 * =========================================================
 */
function setupChat() {
  const btnSend = document.getElementById('btnSendChat');
  const chatInput = document.getElementById('chatInput');
  const chatWindow = document.getElementById('chat-window');
  const chatImageInput = document.getElementById('chatImageInput');
  const chatImageStatus = document.getElementById('chatImageStatus');

  if (!btnSend || !chatInput || !chatWindow) return;

  // --- Image Upload & Analysis Handler ---
  function handleImageUpload(event) {
    if (event.target.files.length === 0) return;
    const file = event.target.files[0];
    
    // Reset State
    uploadedFileState.isAnalyzed = false;
    uploadedFileState.fileName = file.name;
    uploadedFileState.analysisResult = null;
    
    // UI Update: Processing
    if(chatImageStatus) {
      chatImageStatus.style.display = 'flex';
      chatImageStatus.className = 'chat-upload-status status-analyzing';
      chatImageStatus.textContent = `Analyzing ${file.name}... Please wait.`;
    }
    
    // Simulate ML Delay (2 Seconds)
    setTimeout(() => {
      uploadedFileState.isAnalyzed = true;
      uploadedFileState.analysisResult = "High probability of viral infection detected";
      
      if(chatImageStatus) {
        chatImageStatus.className = 'chat-upload-status status-complete';
        chatImageStatus.innerHTML = `<i data-lucide="check-circle-2" style="width:14px;height:14px;"></i> Image analyzed successfully: ${uploadedFileState.analysisResult}`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
      
      // Auto-trigger an AI message acknowledging the image
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg msg-ai';
      aiMsg.textContent = `I have received and analyzed the image. It indicates a ${uploadedFileState.analysisResult}. How are you feeling right now?`;
      chatWindow.appendChild(aiMsg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 2000);
  }

  if (chatImageInput) {
    chatImageInput.addEventListener('change', handleImageUpload);
  }

  // --- Core Chat Engine ---
  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Render User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg msg-user';
    userMsg.textContent = text;
    chatWindow.appendChild(userMsg);
    
    chatInput.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // 2. Typing Indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-msg msg-ai typing-indicator';
    typingMsg.textContent = 'Typing...';
    chatWindow.appendChild(typingMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // 3. Smart Response Generation (1.5s delay)
    setTimeout(() => {
      typingMsg.remove();
      
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg msg-ai';
      let response = "";

      // Check if global image was stored instead of chat image
      const storedGlobalImage = localStorage.getItem('medisight_storedImage');

      if (uploadedFileState.isAnalyzed && uploadedFileState.analysisResult) {
        response = `Based on the image you provided [${uploadedFileState.analysisResult}], I recommend taking plenty of rest, isolating if possible, and monitoring your body temperature. If symptoms worsen, please visit a clinic.`;
      } else if (storedGlobalImage) {
        response = `I see you have stored an image in your records. I've run a preliminary scan and detected a minor skin irritation. I recommend applying a soothing lotion and keeping the area clean.`;
        // Clear it so it doesn't repeat
        localStorage.removeItem('medisight_storedImage');
      } else {
        let weight = parseFloat(userProfile.weight) || 0;
        let height = parseFloat(userProfile.height) / 100 || 0;
        let bmi = height > 0 ? (weight / (height * height)).toFixed(1) : 0;

        if (text.toLowerCase().includes('fatigue') || text.toLowerCase().includes('tired')) {
          response = `Given your blood group (${userProfile.bloodGroup}) and potential mild deficiencies, fatigue might be related to your recent low Vitamin D warning. I suggest increasing morning sun exposure.`;
        } else if (text.toLowerCase().includes('weight') || text.toLowerCase().includes('diet')) {
          if (bmi >= 25) {
            response = `Your calculated BMI is ${bmi} (Overweight). I recommend incorporating 30 minutes of light cardio daily and tracking your caloric intake.`;
          } else {
            response = `Your calculated BMI is ${bmi} (Normal). You are maintaining a healthy weight!`;
          }
        } else {
          response = `I'm here to help. Based on your profile, your vitals are generally stable. Do you have any specific concerns today?`;
        }
      }

      aiMsg.textContent = response;
      chatWindow.appendChild(aiMsg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 1500);
  }

  btnSend.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });
}

/**
 * =========================================================
 * 3. GLOBAL IMAGE UPLOAD LOGIC
 * =========================================================
 */
function setupGlobalUpload() {
  const globalUpload = document.getElementById('globalFileUpload');
  if (globalUpload) {
    globalUpload.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        // Simulate reading the file to store it globally
        const reader = new FileReader();
        reader.onload = function(event) {
          const dataUrl = event.target.result;
          localStorage.setItem('medisight_storedImage', dataUrl);
          
          if (typeof showToast === 'function') {
            showToast(`Image '${file.name}' stored securely. AI can now access it.`, 'success');
          } else {
            alert(`Image '${file.name}' stored securely. AI can now access it.`);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

/**
 * =========================================================
 * 4. FULL PAGE EXPERT AI CHAT (WITH GEMINI API)
 * =========================================================
 */
function setupFullExpertChat() {
  const btnSend = document.getElementById('btnSendFullChat');
  const chatInput = document.getElementById('fullChatInput');
  const chatWindow = document.getElementById('full-chat-window');
  const apiKeyInput = document.getElementById('geminiApiKey');

  if (!btnSend || !chatInput || !chatWindow) return;

  async function handleSendFullChat() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Render User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg msg-user';
    userMsg.style.maxWidth = '70%';
    userMsg.style.alignSelf = 'flex-end';
    userMsg.style.borderBottomRightRadius = '4px';
    userMsg.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
    userMsg.textContent = text;
    chatWindow.appendChild(userMsg);
    
    chatInput.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Typing Indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-msg msg-ai typing-indicator';
    typingMsg.style.maxWidth = '70%';
    typingMsg.style.borderBottomLeftRadius = '4px';
    typingMsg.textContent = 'Analyzing...';
    chatWindow.appendChild(typingMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Check for API Key
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
    
    if (!apiKey) {
      setTimeout(() => {
        typingMsg.remove();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'chat-msg msg-ai';
        errorMsg.style.color = 'var(--danger)';
        errorMsg.textContent = 'Please enter your Gemini API Key in the top right input field to use the live AI model.';
        chatWindow.appendChild(errorMsg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }, 500);
      return;
    }

    // Call Gemini API
    try {
      const prompt = `You are a professional, empathetic medical AI assistant for the MediSight Health platform. The user's name is ${userProfile.name}. They are ${userProfile.height}cm tall and weigh ${userProfile.weight}kg. Blood Group: ${userProfile.bloodGroup}. Please provide a helpful, concise response to their query: ${text}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      typingMsg.remove();
      
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg msg-ai';
      aiMsg.style.maxWidth = '70%';
      aiMsg.style.borderBottomLeftRadius = '4px';
      aiMsg.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
      
      if (data.error) {
        aiMsg.style.color = 'var(--danger)';
        aiMsg.textContent = 'Error: ' + data.error.message;
      } else if (data.candidates && data.candidates.length > 0) {
        // Simple Markdown conversion for bold text
        let replyText = data.candidates[0].content.parts[0].text;
        replyText = replyText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        aiMsg.innerHTML = replyText;
      } else {
        aiMsg.textContent = 'Sorry, I could not generate a response.';
      }
      
      chatWindow.appendChild(aiMsg);
      chatWindow.scrollTop = chatWindow.scrollHeight;

    } catch (error) {
      typingMsg.remove();
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg msg-ai';
      aiMsg.style.color = 'var(--danger)';
      aiMsg.textContent = 'Network error while contacting Gemini API.';
      chatWindow.appendChild(aiMsg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }

  btnSend.addEventListener('click', handleSendFullChat);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendFullChat();
  });
}

/**
 * =========================================================
 * 5. HEALTH INSURANCE COVERAGE LOGIC
 * =========================================================
 */

function handleTabSwitch(targetId) {
  // Update Tab Buttons
  const buttons = document.querySelectorAll('.ins-tab-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    btn.style.color = 'var(--text-muted)';
    btn.style.borderBottomColor = 'transparent';
  });
  
  // Find and activate the clicked button
  const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(targetId));
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.color = 'var(--primary)';
    activeBtn.style.borderBottomColor = 'var(--accent)';
  }

  // Update Tab Contents
  const contents = document.querySelectorAll('.ins-content');
  contents.forEach(content => {
    content.style.display = 'none';
    content.classList.remove('active');
  });

  const targetContent = document.getElementById(targetId);
  if (targetContent) {
    targetContent.style.display = 'block';
    targetContent.classList.add('active');
  }
}

function checkEligibility(planId) {
  let feedbackEl = null;
  let message = "";
  let colorClass = "";
  let textColor = "";

  if (planId === 'gov-plan') {
    feedbackEl = document.getElementById('gov-feedback');
    const age = parseInt(document.getElementById('gov-age').value);
    const income = document.getElementById('gov-income').value;
    const status = document.getElementById('gov-status').value;

    if (isNaN(age)) {
      message = "Please enter a valid age.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else if (age < 18 || status === 'Severe' || income === 'High') {
      message = "Not Eligible – Exceeds income limits or requires specialized care.";
      colorClass = "var(--danger-light)";
      textColor = "var(--danger)";
    } else {
      message = "🎉 HIGHLY ELIGIBLE! Coverage details available.";
      colorClass = "var(--success-light)";
      textColor = "var(--success)";
    }
  } else if (planId === 'private-a') {
    feedbackEl = document.getElementById('priv-feedback');
    const age = parseInt(document.getElementById('priv-age').value);
    const income = document.getElementById('priv-income').value;
    const status = document.getElementById('priv-status').value;
    const tobacco = document.getElementById('priv-tobacco').value;

    if (isNaN(age)) {
      message = "Please enter a valid age.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else if (tobacco === 'Yes') {
      message = "Eligible with higher premiums due to tobacco use.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else if (age > 65 && income === 'High') {
      message = "🎉 HIGHLY ELIGIBLE! Premium senior coverage available.";
      colorClass = "var(--success-light)";
      textColor = "var(--success)";
    } else if (status === 'Yes' && income === 'Low') {
      message = "Additional review required for pre-existing conditions.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else {
      message = "Eligible for standard private plans. See details.";
      colorClass = "var(--success-light)";
      textColor = "var(--success)";
    }
  } else if (planId === 'catastrophic') {
    feedbackEl = document.getElementById('cat-feedback');
    const age = parseInt(document.getElementById('cat-age').value);
    const status = document.getElementById('cat-status').value;
    const hosp = document.getElementById('cat-hosp').value;

    if (isNaN(age)) {
      message = "Please enter a valid age.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else if (age > 30) {
      message = "Not Eligible – Plan restricted to individuals under 30.";
      colorClass = "var(--danger-light)";
      textColor = "var(--danger)";
    } else if (status === 'Severe' || hosp === 'Yes') {
      message = "Not Recommended – High out-of-pocket costs for frequent care.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else {
      message = "🎉 ELIGIBLE! Great low-premium option for healthy young adults.";
      colorClass = "var(--success-light)";
      textColor = "var(--success)";
    }
  } else if (planId === 'family-plan') {
    feedbackEl = document.getElementById('fam-feedback');
    const age = parseInt(document.getElementById('fam-age').value);
    const deps = parseInt(document.getElementById('fam-dep').value);
    const status = document.getElementById('fam-status').value;

    if (isNaN(age) || isNaN(deps)) {
      message = "Please enter valid numbers for age and dependents.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else if (age > 65) {
      message = "Eldest member exceeds age limit for standard family floater.";
      colorClass = "var(--danger-light)";
      textColor = "var(--danger)";
    } else if (status === 'Severe') {
      message = "Eligible, but specific exclusions may apply for severe conditions.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else {
      message = `🎉 ELIGIBLE! Excellent coverage for you and your ${deps} dependent(s).`;
      colorClass = "var(--success-light)";
      textColor = "var(--success)";
    }
  } else if (planId === 'corporate-plan') {
    feedbackEl = document.getElementById('corp-feedback');
    const emp = document.getElementById('corp-emp').value;
    const size = document.getElementById('corp-size').value;

    if (emp === 'Unemployed' || emp === 'Freelance') {
      message = "Not Eligible – Requires active full-time or part-time employment.";
      colorClass = "var(--danger-light)";
      textColor = "var(--danger)";
    } else if (emp === 'Part-time' && size === 'Small') {
      message = "May not be eligible; small businesses typically cover only full-time.";
      colorClass = "var(--warning-light)";
      textColor = "var(--warning)";
    } else {
      message = "🎉 HIGHLY ELIGIBLE! Check with your HR for enrollment details.";
      colorClass = "var(--success-light)";
      textColor = "var(--success)";
    }
  }

  if (feedbackEl) {
    feedbackEl.style.display = 'block';
    feedbackEl.style.backgroundColor = colorClass;
    feedbackEl.style.color = textColor;
    feedbackEl.innerText = message;
  }
}

/**
 * =========================================================
 * 6. APPOINTMENTS LOGIC
 * =========================================================
 */
const appointmentsState = [];

function submitAppointment() {
  const hospital = document.getElementById('appt-hospital').value;
  const dept = document.getElementById('appt-dept').value;
  const date = document.getElementById('appt-date').value;
  const time = document.getElementById('appt-time').value;
  const reason = document.getElementById('appt-reason').value;

  if (!hospital || !dept || !date || !time || !reason) return;

  const newAppt = {
    id: Date.now(),
    hospital,
    dept,
    date,
    time,
    reason,
    status: 'Confirmed'
  };

  appointmentsState.push(newAppt);
  
  // Sort by date/time
  appointmentsState.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  renderAppointments();
  
  // Reset Form
  document.getElementById('appointment-form').reset();
  
  // Optional Toast
  if (typeof showToast === 'function') {
    showToast('Appointment Confirmed successfully!', 'success');
  } else {
    alert('Appointment Confirmed successfully!');
  }
}

function cancelAppointment(id) {
  const index = appointmentsState.findIndex(app => app.id === id);
  if (index > -1) {
    if(confirm("Are you sure you want to cancel this appointment?")) {
      appointmentsState.splice(index, 1);
      renderAppointments();
    }
  }
}

function renderAppointments() {
  const listEl = document.getElementById('appointments-list');
  const noMsgEl = document.getElementById('no-appointments-msg');
  
  if (!listEl) return;
  
  // Clear list except the no-msg element
  Array.from(listEl.children).forEach(child => {
    if (child.id !== 'no-appointments-msg') child.remove();
  });

  if (appointmentsState.length === 0) {
    if (noMsgEl) noMsgEl.style.display = 'block';
  } else {
    if (noMsgEl) noMsgEl.style.display = 'none';
    
    appointmentsState.forEach(appt => {
      const dateObj = new Date(appt.date);
      // Format as "Mon, Jan 12"
      const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      const apptCard = document.createElement('div');
      apptCard.style.cssText = "padding: 16px; border: 1px solid var(--surface-dim); border-radius: 8px; display: flex; align-items: flex-start; justify-content: space-between; background: white;";
      
      apptCard.innerHTML = `
        <div style="display: flex; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--primary-light); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <i data-lucide="building-2"></i>
          </div>
          <div>
            <div style="font-weight: 700; color: var(--text-primary); font-size: 1.05rem; margin-bottom: 2px;">${appt.hospital}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 6px;">
              <span style="font-weight: 600; color: var(--accent);">${appt.dept}</span> • ${appt.reason}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 12px;">
              <span style="display: flex; align-items: center; gap: 4px;"><i data-lucide="calendar" style="width:14px;height:14px;"></i> ${formattedDate}</span>
              <span style="display: flex; align-items: center; gap: 4px;"><i data-lucide="clock" style="width:14px;height:14px;"></i> ${appt.time}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
          <span style="padding: 4px 8px; background: var(--success-light); color: var(--success); font-size: 0.75rem; font-weight: 700; border-radius: 12px;">${appt.status}</span>
          <button onclick="cancelAppointment(${appt.id})" style="border: none; background: none; color: var(--danger); font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 4px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">Cancel</button>
        </div>
      `;
      listEl.appendChild(apptCard);
    });
    
    // Re-initialize icons since we appended dynamic HTML
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}
