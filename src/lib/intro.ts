export const INTRO_KEY = "aquila-intro-shown";

/** Runs before first paint: a repeat visit in the same session never sees the intro. */
export const introScript = `try{if(sessionStorage.getItem("${INTRO_KEY}"))document.documentElement.classList.add("aq-intro-seen")}catch(e){}`;
