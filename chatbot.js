const HISTORY_KEY = "campusbot_history_v1";
const knowledge = [
  {keys:["hello","hi","hey","good morning","good evening"],answer:"Hello! 👋 I'm CampusBot, your study companion. You can ask me about computers, programming, study tips, or general topics."},
  {keys:["your name","who are you","what are you"],answer:"I'm CampusBot, a simple educational chatbot created as a BCA final-year project using HTML, CSS and JavaScript. I use predefined rules and a small local knowledge base."},
  {keys:["artificial intelligence","what is ai","define ai"],answer:"Artificial Intelligence (AI) is a field of computer science focused on building systems that can perform tasks that usually require human intelligence, such as understanding language, recognizing patterns, and making predictions."},
  {keys:["machine learning","what is ml"],answer:"Machine Learning is a branch of AI in which a computer system learns patterns from data to make predictions or decisions, rather than relying only on hand-written rules."},
  {keys:["html","what is html"],answer:"HTML (HyperText Markup Language) provides the structure of a web page. Elements such as headings, paragraphs, links, images and forms are written using HTML tags."},
  {keys:["css","what is css"],answer:"CSS (Cascading Style Sheets) controls how web pages look. It is used for colours, fonts, spacing, layouts, animations and responsive design."},
  {keys:["javascript","what is javascript","js"],answer:"JavaScript is a programming language used to add behaviour and interactivity to websites. It can respond to clicks, validate forms, update page content and communicate with web services."},
  {keys:["python"],answer:"Python is a high-level, general-purpose programming language known for readable syntax. It is commonly used in web development, automation, data science and AI."},
  {keys:["database","dbms","what is dbms"],answer:"A database is an organized collection of data. A DBMS (Database Management System) is software used to create, store, retrieve and manage that data. Examples include MySQL, PostgreSQL and SQLite."},
  {keys:["exam","study","preparation","revision"],answer:"Here are practical exam-preparation tips:\n1. Divide the syllabus into small topics.\n2. Create a realistic daily timetable.\n3. Practise previous-year questions.\n4. Revise using short notes and flashcards.\n5. Take timed mock tests and review mistakes.\n6. Sleep well before the exam."},
  {keys:["computer","cpu"],answer:"A computer is an electronic device that accepts input, processes data according to instructions, stores information and produces output. The CPU executes instructions and coordinates many processing activities."},
  {keys:["internet","www"],answer:"The Internet is a global network of connected computer networks. The World Wide Web is a service that runs on the Internet and lets people access linked pages and resources through browsers."},
  {keys:["algorithm"],answer:"An algorithm is a finite, ordered set of clear steps for solving a problem. A good algorithm should have defined inputs, outputs and termination."},
  {keys:["thank","thanks"],answer:"You're welcome! 😊 Feel free to ask another question."},
  {keys:["help","what can you do","topics"],answer:"I can answer some introductory questions about AI, machine learning, HTML, CSS, JavaScript, Python, databases, computers and study habits. Try one of the suggested prompts or ask in your own words."},
  {keys:["joke","funny"],answer:"Why did the programmer quit their job? Because they didn't get arrays! 😄"},
  {keys:["fact","fun fact"],answer:"Here's a computer fact: the first computer “bug” story is associated with a moth found in a relay of the Harvard Mark II computer in 1947. The word “bug” for a fault existed before that, though."},
  {keys:["bye","goodbye","see you"],answer:"Goodbye! 👋 Good luck with your studies. Come back whenever you have another question."}
];

function getHistory(){try{return JSON.parse(localStorage.getItem(HISTORY_KEY))||[]}catch{return []}}
let history = getHistory();
let isWaiting = false;
let toastTimer;

function normalize(text){return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim()}
function makeReply(input){
  const text=normalize(input);
  if(!text)return "Please type a question so I can try to help.";
  let best=null,bestScore=0;
  for(const item of knowledge){
    let score=0;
    for(const key of item.keys){
      const k=normalize(key);
      if(text===k)score+=5;
      else if(text.includes(k))score+=3;
      else if(k.split(" ").length>1 && k.split(" ").every(word=>text.includes(word)))score+=2;
    }
    if(score>bestScore){bestScore=score;best=item;}
  }
  if(best && bestScore>0)return best.answer;
  const words=text.split(" ").filter(w=>w.length>3);
  const hints=words.slice(0,4).join(", ");
  return `That's an interesting question. My current knowledge base is limited, so I don't have a reliable prepared answer for it yet.\n\nYou could try asking about artificial intelligence, machine learning, HTML, CSS, JavaScript, Python, databases, computers, algorithms, or exam preparation.${hints?`\n\nI noticed these topic words in your message: ${hints}.`: ""}`;
}
function timeLabel(){return new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
function escapeHTML(value){return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function addMessage(role,text,save=true){
  const messages=document.getElementById("messages");
  const row=document.createElement("div");row.className=`message ${role}`;
  const avatar=document.createElement("div");avatar.className="avatar";avatar.textContent=role==="bot"?"CB":"YOU";
  const wrap=document.createElement("div");
  const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=text;
  const time=document.createElement("div");time.className="message-time";time.textContent=timeLabel();
  wrap.append(bubble,time);row.append(avatar,wrap);messages.append(row);
  document.getElementById("welcome").style.display="none";
  document.getElementById("chat-area").scrollTop=document.getElementById("chat-area").scrollHeight;
  if(save){history.push({role,text,createdAt:new Date().toISOString()});localStorage.setItem(HISTORY_KEY,JSON.stringify(history.slice(-100)));}
}
function showTyping(){
  const row=document.createElement("div");row.className="message bot";row.id="typing-indicator";
  row.innerHTML='<div class="avatar">CB</div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
  document.getElementById("messages").append(row);
  document.getElementById("chat-area").scrollTop=document.getElementById("chat-area").scrollHeight;
}
function sendMessage(text){
  const clean=text.trim();if(!clean||isWaiting)return;
  isWaiting=true;document.getElementById("send-button").disabled=true;
  addMessage("user",clean);showTyping();
  window.setTimeout(()=>{
    document.getElementById("typing-indicator")?.remove();
    addMessage("bot",makeReply(clean));
    isWaiting=false;document.getElementById("send-button").disabled=false;
    document.getElementById("user-input").focus();
  },450);
}
function restoreHistory(){
  if(!history.length)return;
  document.getElementById("welcome").style.display="none";
  for(const item of history){
    const row=document.createElement("div");row.className=`message ${item.role}`;
    const avatar=document.createElement("div");avatar.className="avatar";avatar.textContent=item.role==="bot"?"CB":"YOU";
    const wrap=document.createElement("div"),bubble=document.createElement("div"),time=document.createElement("div");
    bubble.className="bubble";bubble.textContent=item.text;time.className="message-time";
    time.textContent=item.createdAt?new Date(item.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}):"Earlier";
    wrap.append(bubble,time);row.append(avatar,wrap);document.getElementById("messages").append(row);
  }
}
function toast(message){
  const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2000);
}
const input=document.getElementById("user-input");
document.getElementById("chat-form").addEventListener("submit",e=>{
  e.preventDefault();const text=input.value;input.value="";input.style.height="auto";sendMessage(text);
});
input.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();document.getElementById("chat-form").requestSubmit();}
});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,140)+"px";});
document.querySelectorAll("[data-prompt]").forEach(button=>button.addEventListener("click",()=>sendMessage(button.dataset.prompt)));
document.getElementById("new-chat").addEventListener("click",()=>{
  history=[];localStorage.removeItem(HISTORY_KEY);document.getElementById("messages").innerHTML="";
  document.getElementById("welcome").style.display="block";toast("New conversation started");
});
document.getElementById("clear-history").addEventListener("click",()=>{
  if(!confirm("Clear all saved chat messages in this browser?"))return;
  history=[];localStorage.removeItem(HISTORY_KEY);document.getElementById("messages").innerHTML="";
  document.getElementById("welcome").style.display="block";toast("Chat history cleared");
});
const about=document.getElementById("about-dialog");
document.getElementById("about-button").addEventListener("click",()=>about.showModal());
document.getElementById("about-close").addEventListener("click",()=>about.close());
document.getElementById("about-ok").addEventListener("click",()=>about.close());
restoreHistory();
