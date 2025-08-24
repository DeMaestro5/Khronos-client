// Quick script to clear old AI chat data
// Run this in your browser console to clear old dummy data

// Clear the AI chat conversations from localStorage
localStorage.removeItem('ai_chat_conversations');

// Also clear any other related chat data that might exist
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (
    key &&
    (key.includes('chat') || key.includes('ai') || key.includes('conversation'))
  ) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach((key) => {
  localStorage.removeItem(key);
});

setTimeout(() => {
  window.location.reload();
}, 2000);
