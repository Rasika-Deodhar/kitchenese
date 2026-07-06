export const CUISINES = [
  "Indian",
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "Mediterranean",
  "French",
  "American Diner",
  "Surprise me",
];

export function getLabels(mode) {
  if (mode === "cook") {
    return {
      submit: "Cook it →",
      cardTitle: "Recipe Card",
      ingredients: "Ingredients",
      method: "Method",
      note: "Chef's Note",
      pairs: "Pairs well with",
      toggleSelf: "🍳 I cook",
      toggleOther: "🍽️ I mostly eat out",
    };
  }
  return {
    submit: "Order it →",
    cardTitle: "Menu Card",
    ingredients: "On the Plate",
    method: "The Experience",
    note: "Waiter's Tip",
    pairs: "Also on the menu",
    toggleSelf: "🍽️ I mostly eat out",
    toggleOther: "🍳 I cook",
  };
}

export const COOK_LOADING_MESSAGES = [
  "Preheating the metaphor...",
  "Julienning the jargon...",
  "Tasting for seasoning...",
  "Reducing the technical sauce...",
  "Letting the analogy simmer...",
];

export const EAT_OUT_LOADING_MESSAGES = [
  "Ticket's in the kitchen...",
  "Plating your analogy...",
  "Sommelier is thinking it over...",
  "Expo is calling the order...",
  "Polishing the metaphor glassware...",
];
