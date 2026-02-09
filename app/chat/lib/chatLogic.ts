// === PSYCHOLOGY SCRIPT ENGINE ===

export const getGreeting = (persona: string) => {
  if(persona === 'insomnia') return "Hey Night Owl! Still staring at the ceiling? Come sit by the fire.";
  if(persona === 'stress') return "Whoa buddy, you look like a pressure cooker. Let's let some steam out.";
  if(persona === 'loneliness') return "Hey there. The world's noisy, but it's quiet here. I got you.";
  return "I'm here for you, buddy.";
};

// Returns the delay time (ms) based on persona personality
export const getThinkingTime = (persona: string) => {
  return 1800; // Dylan is straightforward and responds quickly
};

// Returns the status text shown while "typing"
export const getTypingText = (persona: string) => {
  if (persona === 'insomnia') return "Thinking of something soothing...";
  if (persona === 'stress') return "Finding the right words...";
  if (persona === 'loneliness') return "Coming up with a warm response...";
  return "Thinking...";
};

export const getNextReply = (persona: string, currentStep: number) => {
  // This function is now used only as fallback if API fails
  // The actual AI responses come from the API with the new System Prompt
  if (persona === 'insomnia' || persona === 'stress' || persona === 'loneliness') {
    switch (currentStep) {
      case 0: return "Hey, tell me what's on your mind. I'm listening.";
      case 1: return "Life's like a BBQ, buddy. Sometimes you get burned, but it still tastes good.";
      case 2: return "Don't let your heart freeze over. Come warm up by the fire.";
      case 3: return "I've seen all kinds of people running my shop. Your issue isn't as big as you think.";
      case 4: return "Hey, stop overthinking it. Drop the heavy stuff and breathe.";
      case 5: return "Life's about being happy. Don't be too hard on yourself.";
      case 6: return "You need something practical. Come find me tomorrow. We'll grab some food and talk.";
      default: return "What's up? Keep talking, buddy.";
    }
  }

  return "I'm here for you, buddy.";
};
