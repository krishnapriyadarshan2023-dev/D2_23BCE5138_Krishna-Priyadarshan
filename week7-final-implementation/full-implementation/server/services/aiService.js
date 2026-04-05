// server/services/aiService.js

/**
 * AI-powered keyword-based classification for incident analysis
 * @param {string} description - The text written by the citizen.
 * @returns {Promise<Object>} - { category, confidence, severity }
 */
async function analyzeIncidentText(description) {
  const text = description.toLowerCase();
  
  // Keyword patterns for each category
  const patterns = {
    fire: {
      keywords: ['fire', 'flame', 'smoke', 'burning', 'burn', 'blaze', 'explosion', 'gas leak', 'arson', 'wildfire', 'house fire', 'building fire', 'electrical fire', 'kitchen fire', 'forest fire', 'sparks', 'ignite', 'combustion', 'inferno', 'furnace', 'oven fire', 'propane', 'flammable', 'heat', 'ash'],
      severity: 90
    },
    medical: {
      keywords: ['medical', 'emergency', 'ambulance', 'injured', 'hurt', 'bleeding', 'unconscious', 'collapsed', 'heart attack', 'breathing', 'seizure', 'overdose', 'poison', 'choking', 'stroke', 'cardiac', 'cpr', 'dying', 'dead', 'unresponsive', 'convulsing', 'vomiting', 'chest pain', 'diabetic', 'allergic reaction', 'anaphylaxis', 'broken bone', 'fracture', 'head injury', 'concussion', 'drowning', 'hypothermia', 'heatstroke', 'pregnancy', 'labor', 'miscarriage', 'suicide attempt', 'self harm', 'mental health crisis'],
      severity: 95
    },
    violence: {
      keywords: ['fight', 'assault', 'attack', 'weapon', 'gun', 'knife', 'stabbing', 'shooting', 'beating', 'violence', 'threatening', 'terrorist', 'terrorism', 'bomb', 'active shooter', 'hostage', 'kidnap', 'murder', 'killing', 'armed', 'gunman', 'rape', 'sexual assault', 'domestic violence', 'child abuse', 'abduction', 'gang', 'riot', 'mob', 'lynching', 'torture', 'massacre', 'slaughter', 'execution', 'threat', 'explosive', 'grenade', 'machete', 'axe', 'bat', 'club', 'punch', 'kick', 'choke', 'strangle', 'hit', 'brawl', 'war', 'militant'],
      severity: 95
    },
    accident: {
      keywords: ['accident', 'crash', 'collision', 'hit', 'car accident', 'vehicle', 'fell', 'falling', 'slip', 'trip', 'motorcycle', 'bicycle', 'pedestrian', 'hit and run', 'rollover', 'pileup', 'train', 'bus', 'truck', 'derailment', 'plane crash', 'helicopter', 'boat', 'drowning', 'electrocution', 'construction', 'scaffold', 'ladder', 'roof', 'workplace injury'],
      severity: 75
    },
    theft: {
      keywords: ['theft', 'robbery', 'stolen', 'burglar', 'burglary', 'breaking in', 'break in', 'stealing', 'robbed', 'robber', 'shoplifting', 'pickpocket', 'mugging', 'carjacking', 'looting', 'vandalism', 'trespassing', 'breaking and entering', 'home invasion', 'armed robbery', 'purse snatching', 'bike theft', 'car theft', 'package theft', 'identity theft', 'fraud', 'scam'],
      severity: 60
    },
    harassment: {
      keywords: ['harassment', 'harassing', 'following', 'stalking', 'threatening', 'intimidating', 'bullying', 'cyberbullying', 'verbal abuse', 'racial slur', 'discrimination', 'hate crime', 'catcalling', 'unwanted contact', 'restraining order', 'ex boyfriend', 'ex girlfriend', 'obsessed', 'won\'t leave me alone', 'keeps calling', 'texting', 'messaging'],
      severity: 50
    },
    suspicious: {
      keywords: ['suspicious', 'strange', 'unusual', 'lurking', 'loitering', 'weird', 'creepy', 'prowler', 'peeping', 'watching', 'following me', 'stranger', 'unknown person', 'trespasser', 'casing', 'scouting', 'suspicious vehicle', 'suspicious package', 'abandoned bag', 'unattended', 'doesn\'t belong', 'out of place', 'acting strange', 'nervous', 'hiding'],
      severity: 40
    }
  };

  let bestMatch = { category: 'other', confidence: 0, severity: 30 };
  
  // Check each category
  for (const [category, data] of Object.entries(patterns)) {
    let matchCount = 0;
    let matchedKeywords = [];
    
    for (const keyword of data.keywords) {
      if (text.includes(keyword)) {
        matchCount++;
        matchedKeywords.push(keyword);
      }
    }
    
    if (matchCount > 0) {
      const confidence = Math.min(0.6 + (matchCount * 0.15), 0.98);
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          category,
          confidence: Math.round(confidence * 100) / 100,
          severity: data.severity + (matchCount > 2 ? 5 : 0)
        };
      }
    }
  }
  
  console.log(`🤖 AI Classification: ${bestMatch.category} (${Math.round(bestMatch.confidence * 100)}% confidence)`);
  return bestMatch;
}

module.exports = { analyzeIncidentText };
