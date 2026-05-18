const BANDEIRAS: Record<string, string> = {
  // Grupo A
  "Mexico": "🇲🇽",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  "Czechia": "🇨🇿",
  // Grupo B
  "Canada": "🇨🇦",
  "Bosnia-Herzegovina": "🇧🇦",
  "Qatar": "🇶🇦",
  "Switzerland": "🇨🇭",
  // Grupo C
  "Brazil": "🇧🇷",
  "Morocco": "🇲🇦",
  "Haiti": "🇭🇹",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  // Grupo D
  "USA": "🇺🇸",
  "Paraguay": "🇵🇾",
  "Australia": "🇦🇺",
  "Turkey": "🇹🇷",
  // Grupo E
  "Germany": "🇩🇪",
  "Curaçao": "🇨🇼",
  "Ivory Coast": "🇨🇮",
  "Ecuador": "🇪🇨",
  // Grupo F
  "Netherlands": "🇳🇱",
  "Japan": "🇯🇵",
  "Tunisia": "🇹🇳",
  "Sweden": "🇸🇪",
  // Grupo G
  "Belgium": "🇧🇪",
  "Egypt": "🇪🇬",
  "Iran": "🇮🇷",
  "New Zealand": "🇳🇿",
  // Grupo H
  "Spain": "🇪🇸",
  "Cape Verde": "🇨🇻",
  "Saudi Arabia": "🇸🇦",
  "Uruguay": "🇺🇾",
  // Grupo I
  "France": "🇫🇷",
  "Senegal": "🇸🇳",
  "Iraq": "🇮🇶",
  "Norway": "🇳🇴",
  // Grupo J
  "Argentina": "🇦🇷",
  "Algeria": "🇩🇿",
  "Austria": "🇦🇹",
  "Jordan": "🇯🇴",
  // Grupo K
  "Portugal": "🇵🇹",
  "Congo DR": "🇨🇩",
  "Uzbekistan": "🇺🇿",
  "Colombia": "🇨🇴",
  // Grupo L
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Croatia": "🇭🇷",
  "Ghana": "🇬🇭",
  "Panama": "🇵🇦",
};

export function getBandeira(time: string): string {
  return BANDEIRAS[time] ?? "🏳️";
}
