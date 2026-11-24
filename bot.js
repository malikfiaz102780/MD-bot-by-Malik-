import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const parseList = (raw) =>
  (raw || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

const ctx = {
  botName: (process.env.BOT_NAME || 'Malik Fiaz MD').trim(),
  ownerName: (process.env.OWNER_NAME || 'Malik Fiaz').trim(),
  ownerNumber: (process.env.OWNER_NUMBER || '923496701285').replace(/[^0-9]/g, ''),
  prefix: (process.env.PREFIX || '.').trim(),
  telegramToken: (process.env.TELEGRAM_BOT_TOKEN || '9066213688:AAELksRlamBlTOWZz9MCnoovqC--mkcGEqU').trim(),
  adminIds: parseList(process.env.TELEGRAM_ADMIN_IDS || '8794380278'),
  sessionId: (process.env.SESSION_ID || '').trim(),
  pairingPhone: (process.env.PAIRING_PHONE || '923496701285').replace(/[^0-9]/g, ''),
  sessionDir: './sessions/wa-auth',
  toggles: {},
  waLinkedNumber: '',
  waSessionCode: '',
};

const CHANNEL_PROMO =
  'Follow the 𝑫𝑨𝑹𝑲 𝑯𝑨𝑪𝑲𝑬𝑹 ☠️  🦋✨ channel on WhatsApp: https://whatsapp.com/channel/0029VbDFAIv8vd1SmiyHe02l';

const MENU_SECTIONS = [
  [
    "ɪsʟᴀᴍɪᴄ",
    [
      "dua_forgiveness",
      "dua_rizq",
      "dua_guidance",
      "dua_health",
      "zikr_astaghfirullah",
      "zikr_alhamdulillah",
      "zikr_subhanallah",
      "zikr_allahuakbar",
      "zikr_lailahaillallah",
      "zikr_lahawla",
      "hadith_good_morals",
      "hadith_cleanliness",
      "hadith_truth",
      "hadith_patience",
      "darood_sharif",
      "kalima_tayyiba",
      "islam_fact",
      "quran_reminder",
      "naat"
    ]
  ],
  [
    "ᴀɪ",
    [
      "gemini75",
      "chatgpt",
      "chatgpt2",
      "ai3",
      "ai",
      "gpt",
      "gpt4",
      "gpt4o",
      "chatgpt4",
      "deepseek",
      "deepseekr1",
      "gemini",
      "gemini15",
      "gemini20",
      "claude",
      "claude35sonnet",
      "grok",
      "copilot",
      "qwen",
      "o1",
      "o3",
      "tts2",
      "bgchange",
      "photoedit",
      "sora",
      "imagine"
    ]
  ],
  [
    "ᴍᴀɪɴ",
    [
      "alive",
      "fetch",
      "anime",
      "ping",
      "ping2",
      "menu",
      "menu3",
      "repo",
      "bomber"
    ]
  ],
  [
    "ᴅᴏᴡɴʟᴏᴀᴅᴇʀ",
    [
      "sixtynine",
      "anal",
      "ass",
      "bdsm",
      "black",
      "bottomless",
      "collared",
      "cum",
      "dick",
      "cumsluts",
      "dom",
      "easter",
      "feet",
      "finger",
      "extreme",
      "group",
      "hentaisfm",
      "kiss3",
      "pegged",
      "tattoo",
      "apk",
      "capcut",
      "soundcloud",
      "dafont",
      "fb",
      "fb2",
      "fbhd",
      "fbmini",
      "fbpro",
      "fbsty",
      "dr",
      "mlfbd",
      "insta",
      "play533",
      "drama637",
      "play",
      "play3",
      "play2",
      "playbold",
      "playmini",
      "playpro",
      "playfast",
      "playvibe",
      "playhd",
      "playretro",
      "playgold",
      "playlist",
      "song10",
      "song6",
      "kamranmd",
      "tiktok",
      "tiktokphoto",
      "drama",
      "cartoon",
      "video",
      "movie",
      "play17"
    ]
  ],
  [
    "ᴀɴɪᴍᴇ",
    [
      "animehot",
      "garl",
      "waifu",
      "neko",
      "megumin",
      "maid",
      "awoo",
      "loli",
      "loli2",
      "waifu2",
      "storyanime",
      "bluearchive"
    ]
  ],
  [
    "ᴏᴡɴᴇʀ",
    [
      "vv3",
      "vv",
      "vv2",
      "vvaudio",
      "vv5",
      "upch",
      "pair64",
      "status65",
      "forward",
      "leave",
      "hidetag",
      "ik",
      "block",
      "unblock",
      "mentionreply",
      "setmenu",
      "fullpp",
      "status",
      "pair",
      "countx",
      "count",
      "xxxvideo"
    ]
  ],
  [
    "ɢʀᴏᴜᴘ",
    [
      "antibot",
      "botlist",
      "kickbot",
      "antibothelp",
      "antimedia",
      "antispam",
      "antitagall",
      "delete",
      "offrract",
      "gcstatus",
      "unmute",
      "mute",
      "tagall",
      "kick1",
      "promote",
      "demote",
      "gcpp",
      "revoke",
      "link",
      "ginfo",
      "updategdesc",
      "updategname",
      "poll",
      "out",
      "newgc",
      "end",
      "join",
      "invite",
      "tag",
      "acceptall",
      "rejectall",
      "requests",
      "accept",
      "reject",
      "add",
      "kick",
      "kickall",
      "chreact",
      "vote"
    ]
  ],
  [
    "sᴇᴛᴛɪɴɢs",
    [
      "antistatus",
      "statuslike",
      "botdp",
      "welcome",
      "goodbye",
      "setwelcome",
      "setgoodbye",
      "banlist",
      "ban",
      "unban",
      "sudo",
      "delsudo",
      "listsudo",
      "antiedit",
      "editpath",
      "autoread",
      "antilink",
      "antidelete",
      "recording",
      "statusview",
      "autoreact",
      "anticall",
      "anticallmsg",
      "adminaction",
      "autotyping",
      "online",
      "mode",
      "prefix",
      "botname",
      "ownername",
      "ownernumber",
      "description",
      "stickername",
      "delpath",
      "reactemojis",
      "owneremojis",
      "settings"
    ]
  ],
  [
    "ᴅᴏᴡɴʟᴏᴀᴅ",
    [
      "baiscopes",
      "fbsearch",
      "moviebox",
      "cinesubz",
      "sinhalasub",
      "movie3",
      "movie6",
      "tts",
      "animost",
      "x",
      "xnxx2"
    ]
  ],
  [
    "ᴜᴛɪʟɪᴛʏ",
    [
      "boom",
      "cpp",
      "raw",
      "news",
      "id",
      "getlid",
      "time",
      "convert",
      "rcolor",
      "binary",
      "dbinary",
      "base64",
      "unbase64",
      "urlencode",
      "urldecode",
      "timenow",
      "date",
      "calculate",
      "tourl",
      "uptime"
    ]
  ],
  [
    "ʙᴏʏᴅᴘ",
    [
      "boydp1",
      "boydp2",
      "boydp3",
      "boydp4",
      "boydp5",
      "boydp6",
      "boydp7",
      "boydp8",
      "boydp9",
      "boydp10",
      "boydp11",
      "boydp12",
      "boydp13",
      "boydp14",
      "boydp15",
      "boydp16",
      "boydp17",
      "boydp18",
      "boydp19",
      "boydp20",
      "boydp21",
      "boydp22"
    ]
  ],
  [
    "ғᴜɴ",
    [
      "character",
      "fun",
      "rain",
      "fight",
      "puzzle",
      "story",
      "transform",
      "dance",
      "race",
      "weathercast",
      "emojimenu",
      "compatibility",
      "aura",
      "roast",
      "8ball",
      "compliment",
      "lovetest",
      "emoji",
      "bacha",
      "bachi",
      "ship",
      "dad",
      "mom",
      "son",
      "daughter",
      "boyfriend",
      "girlfriend",
      "twin",
      "partner",
      "bodyguard",
      "boss",
      "employee",
      "pet",
      "servant",
      "idol",
      "fan",
      "ghost",
      "angel",
      "devil",
      "king",
      "queen",
      "slave",
      "master",
      "genius",
      "fool",
      "rich",
      "poor",
      "bhai",
      "bahan",
      "wife",
      "husband",
      "chacha",
      "chachi",
      "nana",
      "nani",
      "mama",
      "mami",
      "bestfriend",
      "enemy",
      "crush",
      "teacher",
      "student",
      "rival",
      "ishqmeter",
      "andhaishq",
      "lafzmohabbat",
      "pehlinazar",
      "dillagi",
      "khoobsurat",
      "dhadkan",
      "pehlaakhat",
      "ziddidil",
      "yaadaata",
      "taubatauba",
      "pehlamuhabbat",
      "wafaimtihaan",
      "donokikahani",
      "gulabbhejo",
      "aankhein",
      "shayarban",
      "dushmandost",
      "tangkarna",
      "smilechurao",
      "jaan",
      "qismatwala",
      "jhoothpyaar",
      "siyaanibaat",
      "mohabbatqarz",
      "nazarutarao",
      "romanticbakwaas",
      "aashiqanaaward",
      "mohabbatteri",
      "dilkhol",
      "gussapyaar",
      "jasoos",
      "tangaphanda",
      "muftadvice",
      "nakhrebaaz",
      "anokhapyaar",
      "bhaaggaya",
      "khushnaseebi",
      "ronewala",
      "waqtguzarna",
      "chandsa",
      "dostyadildar",
      "galatfehmi",
      "perfectmatch",
      "raazkhola",
      "mohabbatdarjaa",
      "dua",
      "khwaabon",
      "truth",
      "dare",
      "hack",
      "gayrate",
      "lesbianrate",
      "handsome",
      "cute",
      "smart",
      "dumb",
      "pro",
      "noob",
      "legend",
      "god",
      "hero",
      "villain",
      "sociopath",
      "psycho",
      "crazy",
      "funny",
      "sad",
      "angry",
      "happy",
      "single",
      "taken",
      "lover",
      "hater",
      "friend",
      "bitch",
      "chad",
      "sigma",
      "alpha",
      "beta",
      "omega",
      "wizard",
      "ninja",
      "samurai",
      "pirate",
      "alien",
      "zombie",
      "coinflip",
      "roll",
      "animegirl",
      "animegirl1",
      "animegirl2",
      "animegirl3",
      "animegirl4",
      "animegirl5",
      "dog",
      "technologia",
      "lurk",
      "shoot",
      "sleep",
      "clap",
      "shrug",
      "stare",
      "wave",
      "poke",
      "confused",
      "smile",
      "peck",
      "wink",
      "sip",
      "blush",
      "smug",
      "tickle",
      "yeet",
      "think",
      "highfive",
      "feed",
      "wag",
      "bite",
      "teehee",
      "shocked",
      "bleh",
      "bored",
      "nom",
      "nya",
      "yawn",
      "facepalm",
      "cuddle",
      "kick",
      "carry",
      "hug",
      "kabedon",
      "baka",
      "bonk",
      "pat",
      "spin",
      "shake",
      "run",
      "nod",
      "nope",
      "kiss",
      "punch",
      "handshake",
      "slap",
      "cry",
      "lappillow",
      "pout",
      "blowkiss",
      "handhold",
      "salute",
      "thumbsup",
      "laugh",
      "tableflip",
      "kids",
      "flip",
      "pick",
      "shapar",
      "rate"
    ]
  ],
  [
    "ᴄᴏᴜᴘʟᴇᴅᴘ",
    [
      "coupled1",
      "coupled2",
      "coupled3",
      "coupled4",
      "coupled5",
      "coupled6",
      "coupled7",
      "coupled8",
      "coupled9",
      "coupled10",
      "coupled11",
      "coupled12",
      "coupled13",
      "coupled14",
      "coupled15",
      "coupled16",
      "coupled17",
      "coupled18",
      "coupled19",
      "coupled20",
      "coupled21",
      "coupled22"
    ]
  ],
  [
    "ᴛᴏᴏʟs",
    [
      "happy",
      "heart",
      "angry",
      "sad",
      "shy",
      "moon",
      "confused",
      "hot",
      "nikal",
      "fancy",
      "gagstock",
      "tourl",
      "remini",
      "qr",
      "define",
      "npm",
      "short",
      "sim",
      "sticker",
      "attp",
      "upscale1",
      "upscale2",
      "upscale3",
      "upscale4",
      "upscale5",
      "upscale6",
      "upscale7",
      "upscale8",
      "upscale9",
      "upscale10",
      "upscale11",
      "upscale12",
      "upscale13",
      "upscale14",
      "upscale15",
      "upscale16",
      "unblur",
      "blurface",
      "removebg",
      "removebg2",
      "enhance1",
      "enhance4",
      "enhance8",
      "enhance16",
      "colorize",
      "tempnum",
      "otps",
      "visa",
      "mastercard",
      "amex",
      "jcb"
    ]
  ],
  [
    "ᴛᴇxᴛ",
    [
      "tiny",
      "circle",
      "square",
      "gothic",
      "cursive",
      "double",
      "bubble",
      "firetext",
      "startext",
      "hearttext",
      "cloudtext",
      "matrix",
      "upsidedown",
      "spacing",
      "dash",
      "dot",
      "underline",
      "overline",
      "strikethrough",
      "slash",
      "fancy1",
      "fancy2",
      "fancy3",
      "fancy4",
      "fancy5",
      "fancy6",
      "fancy7",
      "fancy8",
      "fancy9",
      "fancy10"
    ]
  ],
  [
    "ᴏᴛʜᴇʀ",
    [
      "anime1",
      "anime2",
      "anime3",
      "anime4",
      "anime5",
      "getpp",
      "mee",
      "srepo",
      "unban1",
      "unban2",
      "unban3",
      "unban4",
      "unban5",
      "unban6",
      "unban7",
      "unban8",
      "unban9",
      "unban10",
      "unban11",
      "unban12",
      "unban13",
      "unban14",
      "unban15",
      "unban16",
      "unban17",
      "unban18",
      "unban19",
      "unban20",
      "unban21",
      "unban22",
      "unban23",
      "unban24",
      "unban25",
      "unban26",
      "unban27",
      "unban28",
      "unban29",
      "unban30",
      "unban31",
      "unban32",
      "unban33",
      "unban34",
      "unban35",
      "unban36",
      "unban37",
      "unban38",
      "unban39",
      "unban40",
      "unban41",
      "unban42",
      "unban43",
      "unban44",
      "unban45",
      "unban46",
      "unban47",
      "unban48",
      "unban49",
      "unban50",
      "unban51",
      "unban52",
      "unban53",
      "unban54",
      "unban55",
      "unban56",
      "unban57",
      "unban58",
      "unban59",
      "unban60",
      "unban61",
      "unban62",
      "unban63",
      "unban64",
      "unban65",
      "unban66",
      "unban67",
      "unban68",
      "unban69",
      "unban70",
      "unban71",
      "unban72",
      "unban73",
      "unban74",
      "unban75",
      "unban76",
      "unban77",
      "unban78",
      "unban79",
      "unban80",
      "unban81",
      "unban82",
      "unban83",
      "unban84",
      "unban85",
      "unban86",
      "unban87",
      "unban88",
      "unban89",
      "unban90",
      "unban91",
      "unban92",
      "unban93",
      "unban94",
      "unban95",
      "unban96",
      "unban97",
      "unban98",
      "unban99",
      "unban100"
    ]
  ],
  [
    "ɢɪʀʟᴅᴘ",
    [
      "girldp1",
      "girldp2",
      "girldp3",
      "girldp4",
      "girldp5",
      "girldp6",
      "girldp7",
      "girldp8",
      "girldp9",
      "girldp10",
      "girldp11",
      "girldp12",
      "girldp13",
      "girldp14",
      "girldp15",
      "girldp16",
      "girldp17",
      "girldp18",
      "girldp19",
      "girldp20",
      "girldp21",
      "girldp22"
    ]
  ],
  [
    "ɴᴇᴡs",
    [
      "kemkesnews"
    ]
  ],
  [
    "sᴇᴀʀᴄʜ",
    [
      "img",
      "pinterest",
      "yts",
      "ttsearch2",
      "weather",
      "ytstalk"
    ]
  ],
  [
    "ɢᴀᴍᴇ",
    [
      "akinator"
    ]
  ],
  [
    "ʟᴏɢᴏ",
    [
      "3dcomic",
      "dragonball",
      "deadpool",
      "blackpink",
      "neonlight",
      "cat",
      "sadgirl",
      "pornhub",
      "naruto",
      "thor",
      "america",
      "eraser",
      "3dpaper",
      "futuristic",
      "clouds",
      "sans",
      "galaxy",
      "leaf",
      "sunset",
      "nigeria",
      "devilwings",
      "hacker",
      "boom",
      "luxury",
      "zodiac",
      "angelwings",
      "bulb",
      "tatoo",
      "castle",
      "frozen",
      "paint",
      "birthday",
      "typography",
      "bear",
      "valorant",
      "ephoto"
    ]
  ],
  [
    "sᴏᴜɴᴅ",
    [
      "sound1",
      "sound2",
      "sound3",
      "sound4",
      "sound5",
      "sound6",
      "sound7",
      "sound8",
      "sound9",
      "sound10",
      "sound11",
      "sound12",
      "sound13",
      "sound14",
      "sound15",
      "sound16"
    ]
  ],
  [
    "ʀᴀɴᴅᴏᴍ",
    [
      "indo",
      "thailand",
      "china",
      "japan",
      "randomcat"
    ]
  ],
  [
    "ᴀᴜᴅɪᴏ",
    [
      "tomp3",
      "toptp"
    ]
  ],
  [
    "ᴛʀɪᴄᴋ",
    [
      "trick",
      "joke",
      "fakehack",
      "hack",
      "prank",
      "troll",
      "magic",
      "luck",
      "truth",
      "fakeerror",
      "coinflip",
      "scream",
      "silent"
    ]
  ]
];

function buildMalikFiazMenu(botName, ownerName, prefix) {
  const header = [
    '╔══════════════════════✧',
    `║ ⚡ *${botName.toUpperCase()}* ⚡`,
    `║ 👑 *Owner:* ${ownerName}`,
    `║ ⌨️ *Prefix:* \`${prefix}\``,
    '╚══════════════════════✧',
  ].join('\n');

  const sectionsText = MENU_SECTIONS.map(([category, cmds]) => {
    const lines = cmds.map((c) => `║ ◈ \`${prefix}${c}\``).join('\n');
    return [
      `╔═════ ⌈ *⚡ ${category}* ⌋ ═════✧`,
      lines,
      '╚══════════════════════✧',
    ].join('\n');
  }).join('\n\n');

  return `${header}\n\n${sectionsText}\n\n${CHANNEL_PROMO}`;
}

const ALL_COMMANDS = new Set(
  MENU_SECTIONS.flatMap(([, cmds]) => cmds.map((c) => c.toLowerCase()))
);

fs.mkdirSync(ctx.sessionDir, { recursive: true });

function generatePairingCode(phone) {
  const clean = (phone || ctx.pairingPhone || '923496701285').replace(/[^0-9]/g, '');
  const hash = crypto
    .createHmac('sha256', `${ctx.telegramToken}:${clean}`)
    .update(String(Date.now()).slice(0, 8))
    .digest('hex')
    .toUpperCase();
  const alpha = hash.replace(/[^A-Z0-9]/g, '').slice(0, 8).padEnd(8, 'M');
  return `${alpha.slice(0, 4)}-${alpha.slice(4, 8)}`;
}

function buildSessionToken(phone) {
  const payload = {
    botName: ctx.botName,
    ownerName: ctx.ownerName,
    ownerNumber: ctx.ownerNumber,
    linkedPhone: phone || ctx.pairingPhone,
    createdAt: new Date().toISOString(),
  };
  const b64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64');
  const token = `MALIK_MD~${b64}`;
  fs.writeFileSync(path.join(ctx.sessionDir, 'session.json'), JSON.stringify(payload, null, 2));
  return token;
}

function stylizeText(mode, input) {
  const txt = input || ctx.botName;
  switch (mode) {
    case 'upsidedown':
      return txt.split('').reverse().join('');
    case 'spacing':
      return txt.split('').join(' ');
    case 'dash':
      return txt.split('').join('-');
    case 'dot':
      return txt.split('').join('.');
    case 'slash':
      return txt.split('').join('/');
    case 'underline':
      return txt.split('').map((ch) => ch + '\u0332').join('');
    case 'overline':
      return txt.split('').map((ch) => ch + '\u0305').join('');
    case 'strikethrough':
      return txt.split('').map((ch) => ch + '\u0336').join('');
    default:
      return `✨ [${mode}] ${txt}`;
  }
}

function runCommandLocally(rawText) {
  const trimmed = (rawText || '').trim();
  if (!trimmed) return buildMalikFiazMenu(ctx.botName, ctx.ownerName, ctx.prefix);
  const withoutPrefix = trimmed.startsWith(ctx.prefix)
    ? trimmed.slice(ctx.prefix.length).trim()
    : trimmed;
  const parts = withoutPrefix.split(/\s+/);
  const cmd = (parts.shift() || '').toLowerCase();
  const query = parts.join(' ').trim();

  if (cmd === 'menu' || cmd === 'menu3' || cmd === 'help') {
    return buildMalikFiazMenu(ctx.botName, ctx.ownerName, ctx.prefix);
  }
  if (cmd === 'ping' || cmd === 'ping2') {
    return `⚡ *${ctx.botName}* pong! Owner: ${ctx.ownerName}`;
  }
  if (cmd === 'alive' || cmd === 'uptime') {
    return `⚡ *${ctx.botName}* is online! Uptime: ${Math.floor(process.uptime())}s`;
  }
  if (cmd === 'prefix' && query) {
    ctx.prefix = query;
    return `✅ Prefix updated to \`${ctx.prefix}\``;
  }
  if (cmd === 'botname' && query) {
    ctx.botName = query;
    return `✅ Bot name updated to *${ctx.botName}*`;
  }
  if (cmd === 'ownername' && query) {
    ctx.ownerName = query;
    return `✅ Owner name updated to *${ctx.ownerName}*`;
  }
  if (['tiny', 'circle', 'square', 'gothic', 'cursive', 'bubble', 'upsidedown', 'spacing', 'underline', 'fancy1'].includes(cmd)) {
    return stylizeText(cmd, query);
  }
  if (cmd === 'calculate' && query) {
    try {
      const safeExpr = query.replace(/[^0-9+\-*/().% ]/g, '');
      const val = Function(`"use strict"; return (${safeExpr})`)();
      return `🧮 *Result:* ${val}`;
    } catch {
      return '❌ Invalid expression.';
    }
  }
  if (ALL_COMMANDS.has(cmd)) {
    return `⚡ *${ctx.botName}* | Command: \`${ctx.prefix}${cmd}\`${query ? `\n📝 Input: ${query}` : ''}`;
  }
  return `ℹ️ *${ctx.botName}* ready. Send \`/menu\` or \`.menu\` to view all commands.`;
}

const TG_API = `https://api.telegram.org/bot${ctx.telegramToken}`;
let offset = 0;

function isAuthorized(chatId) {
  if (!ctx.adminIds.length) return true;
  return ctx.adminIds.includes(String(chatId));
}

async function tgRequest(method, payload = {}) {
  const res = await fetch(`${TG_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function sendTgMessage(chatId, text) {
  const chunkSize = 3900;
  for (let i = 0; i < text.length; i += chunkSize) {
    await tgRequest('sendMessage', {
      chat_id: chatId,
      text: text.slice(i, i + chunkSize),
      parse_mode: 'Markdown',
    });
  }
}

async function handleTelegramUpdate(update) {
  const msg = update.message;
  if (!msg || !msg.text) return;

  const chatId = msg.chat.id;
  const text = msg.text.trim();
  if (!isAuthorized(chatId)) {
    await sendTgMessage(chatId, '⛔ Access denied.');
    return;
  }

  const parts = text.split(/\s+/);
  const cmd = parts[0].toLowerCase().split('@')[0];
  const args = parts.slice(1);

  if (cmd === '/start' || cmd === '/help') {
    await sendTgMessage(
      chatId,
      [
        `⚡ *${ctx.botName.toUpperCase()}* — Telegram Controller`,
        `👑 *Owner:* ${ctx.ownerName} (\`${ctx.ownerNumber}\`)`,
        '',
        '• `/menu` — Full Malik Fiaz MD menu + WhatsApp channel link',
        '• `/status` — Bot & pairing status',
        '• `/pair <phone>` — Generate pairing code for number',
        '• `/session` — Generate & export SESSION_ID',
        '• `/run <command>` — Run any bot command directly',
      ].join('\n')
    );
  } else if (cmd === '/menu') {
    await sendTgMessage(chatId, buildMalikFiazMenu(ctx.botName, ctx.ownerName, ctx.prefix));
  } else if (cmd === '/status') {
    await sendTgMessage(
      chatId,
      [
        `📊 *${ctx.botName}*`,
        `👑 Owner: *${ctx.ownerName}* (\`${ctx.ownerNumber}\`)`,
        `📱 Linked Phone: \`${ctx.waLinkedNumber || ctx.pairingPhone}\``,
        `⌨️ Prefix: \`${ctx.prefix}\``,
        `🟢 Telegram Controller: *Active*`,
      ].join('\n')
    );
  } else if (cmd === '/pair') {
    const phone = (args[0] || ctx.pairingPhone || '923496701285').replace(/[^0-9]/g, '');
    ctx.waLinkedNumber = phone;
    const code = generatePairingCode(phone);
    ctx.waSessionCode = buildSessionToken(phone);
    await sendTgMessage(
      chatId,
      [
        `📱 *${ctx.botName} Pairing Details*`,
        `📞 Number: \`+${phone}\``,
        `🔑 Pairing Code: \`${code}\``,
        '',
        'WhatsApp mein **Linked Devices > Link with phone number** khol kar code verify karein, phir `/session` se `SESSION_ID` lein.',
      ].join('\n')
    );
  } else if (cmd === '/session') {
    const sessionStr = ctx.waSessionCode || buildSessionToken(ctx.waLinkedNumber || ctx.pairingPhone);
    await sendTgMessage(chatId, `🔐 *SESSION_ID*\n\n\`${sessionStr}\``);
  } else if (cmd === '/run') {
    await sendTgMessage(chatId, runCommandLocally(args.join(' ')));
  } else if (text.startsWith(ctx.prefix)) {
    await sendTgMessage(chatId, runCommandLocally(text));
  }
}

async function run() {
  console.log(`⚡ ${ctx.botName} (${ctx.ownerName}) started on Node ${process.version}...`);
  for (const adminId of ctx.adminIds) {
    try {
      await sendTgMessage(
        adminId,
        `✅ *${ctx.botName}* online! Send \`/menu\` or \`/pair 923496701285\`.`
      );
    } catch {}
  }

  while (true) {
    try {
      const res = await tgRequest('getUpdates', {
        offset,
        timeout: 25,
        allowed_updates: ['message'],
      });
      if (res.ok && Array.isArray(res.result)) {
        for (const upd of res.result) {
          offset = upd.update_id + 1;
          await handleTelegramUpdate(upd);
        }
      }
    } catch (err) {
      console.error('[Poll Error]:', err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

run();
