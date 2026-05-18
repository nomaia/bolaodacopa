type InfoTime = { nome: string; codigo: string };

const TIMES: Record<string, InfoTime> = {
  // Grupo A
  "Mexico":             { nome: "México",              codigo: "mx" },
  "South Africa":       { nome: "África do Sul",        codigo: "za" },
  "South Korea":        { nome: "Coreia do Sul",         codigo: "kr" },
  "Czechia":            { nome: "Rep. Tcheca",           codigo: "cz" },
  // Grupo B
  "Canada":             { nome: "Canadá",               codigo: "ca" },
  "Bosnia-Herzegovina": { nome: "Bósnia",               codigo: "ba" },
  "Qatar":              { nome: "Catar",                 codigo: "qa" },
  "Switzerland":        { nome: "Suíça",                 codigo: "ch" },
  // Grupo C
  "Brazil":             { nome: "Brasil",               codigo: "br" },
  "Morocco":            { nome: "Marrocos",             codigo: "ma" },
  "Haiti":              { nome: "Haiti",                 codigo: "ht" },
  "Scotland":           { nome: "Escócia",              codigo: "gb-sct" },
  // Grupo D
  "USA":                { nome: "Estados Unidos",        codigo: "us" },
  "Paraguay":           { nome: "Paraguai",              codigo: "py" },
  "Australia":          { nome: "Austrália",             codigo: "au" },
  "Turkey":             { nome: "Turquia",               codigo: "tr" },
  // Grupo E
  "Germany":            { nome: "Alemanha",              codigo: "de" },
  "Curaçao":            { nome: "Curaçao",              codigo: "cw" },
  "Ivory Coast":        { nome: "Costa do Marfim",       codigo: "ci" },
  "Ecuador":            { nome: "Equador",               codigo: "ec" },
  // Grupo F
  "Netherlands":        { nome: "Holanda",               codigo: "nl" },
  "Japan":              { nome: "Japão",                 codigo: "jp" },
  "Tunisia":            { nome: "Tunísia",               codigo: "tn" },
  "Sweden":             { nome: "Suécia",                codigo: "se" },
  // Grupo G
  "Belgium":            { nome: "Bélgica",               codigo: "be" },
  "Egypt":              { nome: "Egito",                 codigo: "eg" },
  "Iran":               { nome: "Irã",                   codigo: "ir" },
  "New Zealand":        { nome: "Nova Zelândia",          codigo: "nz" },
  // Grupo H
  "Spain":              { nome: "Espanha",               codigo: "es" },
  "Cape Verde":         { nome: "Cabo Verde",            codigo: "cv" },
  "Saudi Arabia":       { nome: "Arábia Saudita",        codigo: "sa" },
  "Uruguay":            { nome: "Uruguai",               codigo: "uy" },
  // Grupo I
  "France":             { nome: "França",                codigo: "fr" },
  "Senegal":            { nome: "Senegal",               codigo: "sn" },
  "Iraq":               { nome: "Iraque",                codigo: "iq" },
  "Norway":             { nome: "Noruega",               codigo: "no" },
  // Grupo J
  "Argentina":          { nome: "Argentina",             codigo: "ar" },
  "Algeria":            { nome: "Argélia",               codigo: "dz" },
  "Austria":            { nome: "Áustria",               codigo: "at" },
  "Jordan":             { nome: "Jordânia",              codigo: "jo" },
  // Grupo K
  "Portugal":           { nome: "Portugal",              codigo: "pt" },
  "Congo DR":           { nome: "Congo",                 codigo: "cd" },
  "Uzbekistan":         { nome: "Uzbequistão",           codigo: "uz" },
  "Colombia":           { nome: "Colômbia",              codigo: "co" },
  // Grupo L
  "England":            { nome: "Inglaterra",            codigo: "gb-eng" },
  "Croatia":            { nome: "Croácia",               codigo: "hr" },
  "Ghana":              { nome: "Gana",                  codigo: "gh" },
  "Panama":             { nome: "Panamá",                codigo: "pa" },
};

export function getNomeTime(timeEn: string): string {
  return TIMES[timeEn]?.nome ?? timeEn;
}

export function getFlagUrl(timeEn: string): string {
  const codigo = TIMES[timeEn]?.codigo ?? timeEn.toLowerCase().slice(0, 2);
  return `https://flagcdn.com/w40/${codigo}.png`;
}
