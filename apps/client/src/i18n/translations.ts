export type Language = "en" | "he" | "es";

export interface Translations {
  // Language selector
  languageName: string;

  // Menu screen
  menu_title: string;
  menu_subtitle: string;
  menu_resumeLastGame: string;
  menu_local2Players: string;
  menu_playOnline: string;
  menu_vsBot: string;
  menu_tutorial: string;
  menu_settings: string;
  menu_lastMode: string;
  menu_modeBot: string;
  menu_modeOnline: string;
  menu_modeLocal: string;

  // Bot difficulty
  difficulty_title: string;
  difficulty_subtitle: string;
  difficulty_easy: string;
  difficulty_easyDesc: string;
  difficulty_medium: string;
  difficulty_mediumDesc: string;
  difficulty_hard: string;
  difficulty_hardDesc: string;
  difficulty_back: string;

  // Game header
  gameHeader_currentPlayer: string;
  gameHeader_backToMenu: string;
  gameHeader_resetGame: string;
  gameHeader_leaveRoom: string;
  gameHeader_green: string;
  gameHeader_black: string;

  // Game status
  gameStatus_wins: string; // "{player} wins!"
  gameStatus_chainJumps: string;
  gameStatus_botThinking: string;
  gameStatus_helperText: string;

  // Tutorial
  tutorial_title: string;
  tutorial_subtitle: string;
  tutorial_back: string;
  tutorial_objectiveTitle: string;
  tutorial_objectiveText: string;
  tutorial_movementTitle: string;
  tutorial_stepLabel: string;
  tutorial_stepText: string;
  tutorial_jumpLabel: string;
  tutorial_jumpText: string;
  tutorial_rulesTitle: string;
  tutorial_rule1: string;
  tutorial_rule2: string;
  tutorial_rule3: string;
  tutorial_rule4: string;
  tutorial_tipsTitle: string;
  tutorial_tip1: string;
  tutorial_tip2: string;
  tutorial_tip3: string;

  // Settings
  settings_title: string;
  settings_subtitle: string;
  settings_back: string;
  settings_themeTitle: string;
  settings_themeGreen: string;
  settings_themeLily: string;
  settings_soundTitle: string;
  settings_soundEnabled: string;
  settings_animSpeedTitle: string;
  settings_animFast: string;
  settings_animNormal: string;
  settings_animSlow: string;
  settings_boardTitle: string;
  settings_flipBoard: string;
  settings_accessibilityTitle: string;
  settings_reduceMotion: string;
  settings_resumeLastGame: string;

  // Jump continuation overlay
  jumpOverlay_title: string;
  jumpOverlay_instructions: string;
  jumpOverlay_endTurn: string;

  // Waiting for opponent
  waiting_title: string;
  waiting_message: string;
  waiting_copyLink: string;
  waiting_shareWhatsApp: string;

  // Online share (in-game)
  online_copyLink: string;
  online_shareWhatsApp: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    languageName: "English",

    // Menu
    menu_title: "JumpFrog",
    menu_subtitle: "Offline hop-and-jump showdown",
    menu_resumeLastGame: "Resume last game",
    menu_local2Players: "Local 2 Players",
    menu_playOnline: "Play Online",
    menu_vsBot: "Vs Bot",
    menu_tutorial: "Tutorial",
    menu_settings: "Settings",
    menu_lastMode: "Last mode",
    menu_modeBot: "Vs Bot",
    menu_modeOnline: "Online",
    menu_modeLocal: "Local 2 Players",

    // Bot difficulty
    difficulty_title: "Select Difficulty",
    difficulty_subtitle: "Choose your AI opponent",
    difficulty_easy: "Easy",
    difficulty_easyDesc: "Depth 2 · Makes mistakes · Great to learn",
    difficulty_medium: "Medium",
    difficulty_mediumDesc: "Depth 4 · Thinks ahead · Balanced",
    difficulty_hard: "Hard",
    difficulty_hardDesc: "Depth 6+ · No mistakes · For experts",
    difficulty_back: "Back",

    // Game header
    gameHeader_currentPlayer: "Current Player",
    gameHeader_backToMenu: "Back to Menu",
    gameHeader_resetGame: "Reset game",
    gameHeader_leaveRoom: "Leave room",
    gameHeader_green: "GREEN",
    gameHeader_black: "BLACK",

    // Game status
    gameStatus_wins: "{player} wins!",
    gameStatus_chainJumps: "Chain your jumps!",
    gameStatus_botThinking: "Bot is thinking",
    gameStatus_helperText: "Select a frog, then choose a highlighted destination.",

    // Tutorial
    tutorial_title: "Tutorial",
    tutorial_subtitle: "Learn how to play JumpFrog",
    tutorial_back: "Back",
    tutorial_objectiveTitle: "Objective",
    tutorial_objectiveText:
      "Be the first player to move all your frogs to your opponent's starting row. Green starts at the top, Black starts at the bottom.",
    tutorial_movementTitle: "Movement",
    tutorial_stepLabel: "Step:",
    tutorial_stepText: "Move one square diagonally forward onto an empty dark square.",
    tutorial_jumpLabel: "Jump:",
    tutorial_jumpText:
      "Hop over an adjacent frog (yours or opponent's) to land on the empty square beyond it. You can chain multiple jumps in one turn!",
    tutorial_rulesTitle: "Rules",
    tutorial_rule1: "Frogs can only move diagonally on dark squares",
    tutorial_rule2: "You must continue jumping if possible after a jump",
    tutorial_rule3: "You cannot jump back to where you just came from",
    tutorial_rule4: "Green moves first",
    tutorial_tipsTitle: "Tips",
    tutorial_tip1: "Plan your jumps ahead to create long chains",
    tutorial_tip2: "Block your opponent's frogs when possible",
    tutorial_tip3: "Move multiple frogs forward instead of just one",

    // Settings
    settings_title: "Settings",
    settings_subtitle: "Local-only preferences",
    settings_back: "Back",
    settings_themeTitle: "Theme",
    settings_themeGreen: "Green Tiles",
    settings_themeLily: "Lily Pads",
    settings_soundTitle: "Sound",
    settings_soundEnabled: "Sound enabled",
    settings_animSpeedTitle: "Animation Speed",
    settings_animFast: "Fast",
    settings_animNormal: "Normal",
    settings_animSlow: "Slow",
    settings_boardTitle: "Board",
    settings_flipBoard: "Flip board by default",
    settings_accessibilityTitle: "Accessibility",
    settings_reduceMotion: "Reduce motion",
    settings_resumeLastGame: "Resume last game on launch",

    // Jump continuation
    jumpOverlay_title: "Continue Jumping!",
    jumpOverlay_instructions: "Select another jump target or end your turn",
    jumpOverlay_endTurn: "End Turn",

    // Waiting for opponent
    waiting_title: "Waiting for opponent...",
    waiting_message: "Share the link to invite a player",
    waiting_copyLink: "📋 Copy Link",
    waiting_shareWhatsApp: "💬 Share on WhatsApp",

    // Online share
    online_copyLink: "Copy link",
    online_shareWhatsApp: "Share on WhatsApp",
  },

  he: {
    languageName: "עברית",

    // Menu
    menu_title: "JumpFrog",
    menu_subtitle: "קרב קפיצות אופליין",
    menu_resumeLastGame: "המשך משחק אחרון",
    menu_local2Players: "2 שחקנים מקומי",
    menu_playOnline: "משחק אונליין",
    menu_vsBot: "נגד בוט",
    menu_tutorial: "מדריך",
    menu_settings: "הגדרות",
    menu_lastMode: "מצב אחרון",
    menu_modeBot: "נגד בוט",
    menu_modeOnline: "אונליין",
    menu_modeLocal: "2 שחקנים מקומי",

    // Bot difficulty
    difficulty_title: "בחר רמת קושי",
    difficulty_subtitle: "בחר את יריב הבינה המלאכותית",
    difficulty_easy: "קל",
    difficulty_easyDesc: "עומק 2 · טועה · מצוין ללמידה",
    difficulty_medium: "בינוני",
    difficulty_mediumDesc: "עומק 4 · חושב קדימה · מאוזן",
    difficulty_hard: "קשה",
    difficulty_hardDesc: "עומק 6+ · בלי טעויות · למומחים",
    difficulty_back: "חזרה",

    // Game header
    gameHeader_currentPlayer: "שחקן נוכחי",
    gameHeader_backToMenu: "חזרה לתפריט",
    gameHeader_resetGame: "איפוס משחק",
    gameHeader_leaveRoom: "עזיבת חדר",
    gameHeader_green: "ירוק",
    gameHeader_black: "שחור",

    // Game status
    gameStatus_wins: "{player} ניצח!",
    gameStatus_chainJumps: "שרשר את הקפיצות!",
    gameStatus_botThinking: "הבוט חושב",
    gameStatus_helperText: "בחר צפרדע, ואז בחר יעד מסומן.",

    // Tutorial
    tutorial_title: "מדריך",
    tutorial_subtitle: "למד איך לשחק JumpFrog",
    tutorial_back: "חזרה",
    tutorial_objectiveTitle: "מטרה",
    tutorial_objectiveText:
      "היה השחקן הראשון להעביר את כל הצפרדעים שלך לשורת ההתחלה של היריב. ירוק מתחיל למעלה, שחור מתחיל למטה.",
    tutorial_movementTitle: "תנועה",
    tutorial_stepLabel: "צעד:",
    tutorial_stepText: "הזז משבצת אחת באלכסון קדימה למשבצת כהה ריקה.",
    tutorial_jumpLabel: "קפיצה:",
    tutorial_jumpText:
      "קפוץ מעל צפרדע סמוכה (שלך או של היריב) ונחת על המשבצת הריקה שמעבר. אפשר לשרשר מספר קפיצות בתור אחד!",
    tutorial_rulesTitle: "חוקים",
    tutorial_rule1: "צפרדעים יכולות לנוע רק באלכסון על משבצות כהות",
    tutorial_rule2: "חובה להמשיך לקפוץ אם אפשר אחרי קפיצה",
    tutorial_rule3: "אי אפשר לקפוץ חזרה למקום שממנו באת",
    tutorial_rule4: "ירוק מתחיל ראשון",
    tutorial_tipsTitle: "טיפים",
    tutorial_tip1: "תכנן קפיצות מראש ליצירת שרשראות ארוכות",
    tutorial_tip2: "חסום את הצפרדעים של היריב כשאפשר",
    tutorial_tip3: "הזז מספר צפרדעים קדימה במקום רק אחת",

    // Settings
    settings_title: "הגדרות",
    settings_subtitle: "העדפות מקומיות",
    settings_back: "חזרה",
    settings_themeTitle: "ערכת נושא",
    settings_themeGreen: "אריחים ירוקים",
    settings_themeLily: "עלי שושן",
    settings_soundTitle: "צליל",
    settings_soundEnabled: "צליל מופעל",
    settings_animSpeedTitle: "מהירות אנימציה",
    settings_animFast: "מהיר",
    settings_animNormal: "רגיל",
    settings_animSlow: "איטי",
    settings_boardTitle: "לוח",
    settings_flipBoard: "הפוך לוח כברירת מחדל",
    settings_accessibilityTitle: "נגישות",
    settings_reduceMotion: "הפחת תנועה",
    settings_resumeLastGame: "המשך משחק אחרון בהפעלה",

    // Jump continuation
    jumpOverlay_title: "המשך לקפוץ!",
    jumpOverlay_instructions: "בחר יעד קפיצה נוסף או סיים את התור",
    jumpOverlay_endTurn: "סיים תור",

    // Waiting for opponent
    waiting_title: "ממתין ליריב...",
    waiting_message: "שתף את הקישור כדי להזמין שחקן",
    waiting_copyLink: "📋 העתק קישור",
    waiting_shareWhatsApp: "💬 שתף בווטסאפ",

    // Online share
    online_copyLink: "העתק קישור",
    online_shareWhatsApp: "שתף בווטסאפ",
  },

  es: {
    languageName: "Español",

    // Menu
    menu_title: "JumpFrog",
    menu_subtitle: "Duelo de saltos sin conexión",
    menu_resumeLastGame: "Continuar último juego",
    menu_local2Players: "2 Jugadores Local",
    menu_playOnline: "Jugar en Línea",
    menu_vsBot: "Contra Bot",
    menu_tutorial: "Tutorial",
    menu_settings: "Ajustes",
    menu_lastMode: "Último modo",
    menu_modeBot: "Contra Bot",
    menu_modeOnline: "En Línea",
    menu_modeLocal: "2 Jugadores Local",

    // Bot difficulty
    difficulty_title: "Seleccionar Dificultad",
    difficulty_subtitle: "Elige tu oponente de IA",
    difficulty_easy: "Fácil",
    difficulty_easyDesc: "Profundidad 2 · Comete errores · Ideal para aprender",
    difficulty_medium: "Medio",
    difficulty_mediumDesc: "Profundidad 4 · Piensa adelante · Equilibrado",
    difficulty_hard: "Difícil",
    difficulty_hardDesc: "Profundidad 6+ · Sin errores · Para expertos",
    difficulty_back: "Volver",

    // Game header
    gameHeader_currentPlayer: "Jugador Actual",
    gameHeader_backToMenu: "Volver al Menú",
    gameHeader_resetGame: "Reiniciar juego",
    gameHeader_leaveRoom: "Salir de la sala",
    gameHeader_green: "VERDE",
    gameHeader_black: "NEGRO",

    // Game status
    gameStatus_wins: "¡{player} gana!",
    gameStatus_chainJumps: "¡Encadena tus saltos!",
    gameStatus_botThinking: "El bot está pensando",
    gameStatus_helperText: "Selecciona una rana, luego elige un destino resaltado.",

    // Tutorial
    tutorial_title: "Tutorial",
    tutorial_subtitle: "Aprende a jugar JumpFrog",
    tutorial_back: "Volver",
    tutorial_objectiveTitle: "Objetivo",
    tutorial_objectiveText:
      "Sé el primer jugador en mover todas tus ranas a la fila inicial de tu oponente. Verde empieza arriba, Negro empieza abajo.",
    tutorial_movementTitle: "Movimiento",
    tutorial_stepLabel: "Paso:",
    tutorial_stepText: "Mueve una casilla en diagonal hacia adelante a una casilla oscura vacía.",
    tutorial_jumpLabel: "Salto:",
    tutorial_jumpText:
      "Salta sobre una rana adyacente (tuya o del oponente) para aterrizar en la casilla vacía más allá. ¡Puedes encadenar múltiples saltos en un turno!",
    tutorial_rulesTitle: "Reglas",
    tutorial_rule1: "Las ranas solo pueden moverse en diagonal sobre casillas oscuras",
    tutorial_rule2: "Debes continuar saltando si es posible después de un salto",
    tutorial_rule3: "No puedes saltar de vuelta al lugar de donde viniste",
    tutorial_rule4: "Verde mueve primero",
    tutorial_tipsTitle: "Consejos",
    tutorial_tip1: "Planifica tus saltos para crear cadenas largas",
    tutorial_tip2: "Bloquea las ranas de tu oponente cuando sea posible",
    tutorial_tip3: "Mueve varias ranas hacia adelante en vez de solo una",

    // Settings
    settings_title: "Ajustes",
    settings_subtitle: "Preferencias locales",
    settings_back: "Volver",
    settings_themeTitle: "Tema",
    settings_themeGreen: "Mosaicos Verdes",
    settings_themeLily: "Hojas de Lirio",
    settings_soundTitle: "Sonido",
    settings_soundEnabled: "Sonido activado",
    settings_animSpeedTitle: "Velocidad de Animación",
    settings_animFast: "Rápido",
    settings_animNormal: "Normal",
    settings_animSlow: "Lento",
    settings_boardTitle: "Tablero",
    settings_flipBoard: "Voltear tablero por defecto",
    settings_accessibilityTitle: "Accesibilidad",
    settings_reduceMotion: "Reducir movimiento",
    settings_resumeLastGame: "Continuar último juego al iniciar",

    // Jump continuation
    jumpOverlay_title: "¡Sigue saltando!",
    jumpOverlay_instructions: "Selecciona otro objetivo de salto o termina tu turno",
    jumpOverlay_endTurn: "Terminar Turno",

    // Waiting for opponent
    waiting_title: "Esperando oponente...",
    waiting_message: "Comparte el enlace para invitar a un jugador",
    waiting_copyLink: "📋 Copiar Enlace",
    waiting_shareWhatsApp: "💬 Compartir en WhatsApp",

    // Online share
    online_copyLink: "Copiar enlace",
    online_shareWhatsApp: "Compartir en WhatsApp",
  },
};

/** Language metadata for the selector dropdown */
export const languageOptions: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

/** Whether a language is RTL */
export const isRtlLanguage = (lang: Language): boolean => lang === "he";
