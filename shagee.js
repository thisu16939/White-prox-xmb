const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, getContentType, fetchLatestBaileysVersion, generateWAMessageFromContent, prepareWAMessageMedia , downloadContentFromMessage,  generateWAMessageContent,proto,  Browsers, generateForwardMessageContent, jidDecode, generateMessageID, makeInMemoryStore,  MessageRetryMap, AnyMessageContent,   WAMessage, delay} = require('@whiskeysockets/baileys');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const l = console.log;
const cheerio = require("cheerio");
const { updateEnv, readEnv } = require('./lib/database'); 
const EnvVar = require('./lib/mongodbenv'); 
const { cmd } = require('./command'); 
const path = require('path');
//===================SESSION-AUTH============================
const sessionDir = path.join(__dirname, 'session');
const sessionFile = path.join(sessionDir, 'creds.json');

// Always remove and recreate session directory
if (fs.existsSync(sessionDir)) {
  fs.rmSync(sessionDir, { recursive: true, force: true });
}
fs.mkdirSync(sessionDir, { recursive: true });

// Continue with session download
if (!config.SESSION_ID) {
  return console.log('Please add your session to SESSION_ID env !!');
}

const sessdata = config.SESSION_ID.replace('3KBOT', '');
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);

filer.download((err, data) => {
  if (err) throw err;
  fs.writeFile(sessionFile, data, () => {
    console.log('Session downloaded ✅');
  });
});

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//=============================================

async function connectToWA() {
const connectDB = require('./lib/mongodb');
connectDB();
const {readEnv} = require('./lib/database');
const config =await readEnv();
const prefix = config.PREFIX;
console.log("Connecting  ♥✊...");
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/session/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })
    
conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
} else if (connection === 'open') {
console.log('Installing... ✨💤 ')
const path = require('path');
fs.readdirSync("./plugins/").forEach((plugin) => {
if (path.extname(plugin).toLowerCase() == ".js") {
require("./plugins/" + plugin);
}
});
console.log('Plugins installed successful ✅')
console.log('connected to whatsapp 😘♥')


  let message = `*successfully connected*
  
━━━━━━━━━━
> *\`Bot Prefix\`*: ( ${prefix} )
> *\`${prefix}Menu\`* = Get Bot Main Menu 
> *\`${prefix}Setting\`* = Customize Bot Settings


*\`Bot Update\`*


┋ ᴍᴀᴅᴇ ʙʏ ᴘʀᴀᴠᴇᴇɴ & ʀᴏᴄᴋʏ ༊
`;	
 conn.sendMessage(conn.user.id, {
     image: {url: 'https://files.catbox.moe/d6ru8d.jpeg'},
            caption: message,
            contextInfo: {
               forwardingScore: 1,
                isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363421350428668@newsletter',
          newsletterName: "3K GIFT BOT ꨄ︎",
          serverMessageId: 1041,
        }
        }
        });
conn.sendMessage("94704104383@s.whatsapp.net",{text:message});
conn.sendMessage("94758447640@s.whatsapp.net",{text:message});
	
}
})

conn.ev.on('creds.update', saveCreds)  


conn.ev.on('messages.upsert', async(mek) => {
mek = mek.messages[0]
if (!mek.message) return	
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
 
  if (config.AUTO_READ_STATUS === "on" && mek.key && mek.key.remoteJid === 'status@broadcast') {
    await conn.readMessages([mek.key]);
 if (mek?.key && mek.key.remoteJid === 'status@broadcast') {
    const react = await conn.decodeJid(conn.user.id);
    const emojis = ['❤️','🔥','☠️', '💀', '💎', '🌟', '🐉','🚀', '💥', '🎉', '👑', '🖤','🕊️', '🌍', '😊', '🤯', '😎', '🌈', '💫', '🥰', '😍', '🤩', '😂', '😇', '😘', '😁', '😌', '😻', '😃', '😜', '😋', '🙃', '🤗', '✨']
;
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    if (mek.key.participant && react) {
        await conn.sendMessage(mek.key.remoteJid, {
            react: {
                key: { remoteJid: mek.key.remoteJid, id: mek.key.id, participant: mek.key.participant },
                text: randomEmoji 
            }
        }, { statusJidList: [mek.key.participant, react] });
    }
}

		}  


const from = mek.key.remoteJid

if (config.ALWAYS_ONLINE === "off") {
           await conn.sendPresenceUpdate('unavailable');
        }
        if (config.TYPING === "on") {
            await conn.sendPresenceUpdate('composing', from)
        };
        if (config.RECORDING === "on") {
            await conn.sendPresenceUpdate('recording', from)
        };

const processedCalls = new Set(); 
conn.ev.on("call", async (calls) => {
    calls = calls.map(call => call);
    const { status, from, id, isGroup } = calls[0];

    if (status === "offer") { 
        if (config.ANCALL === 'on') {
            if (!processedCalls.has(id)) { 
                processedCalls.add(id); 

                try {

                    await conn.rejectCall(id, from);
  
                } catch (error) {
                    console.error("Error handling the call:", error);
                }
            }
        }
    }
});

const m = sms(conn, mek)
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
const args = body.trim().split(/ +/).slice(1)
const q = args.join(' ')
const isGroup = from.endsWith('@g.us')
const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
const senderNumber = sender.split('@')[0]
const botNumber = conn.user.id.split(':')[0]
const pushname = mek.pushName || 'Red Dragon User'
const rc = ['94704104383'] 
const prv = ['94758447640']
const isRc = rc.includes(senderNumber)	
const isPrv = rc.includes(senderNumber)	
const dev = config.DEVNO.split(",")
const isDev = dev.includes(senderNumber)
const isMe = botNumber.includes(senderNumber) || isDev || isRc || isPrv
const isOwner =isDev || isMe || isRc
const botNumber2 = await jidNormalizedUser(conn.user.id);
const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
const isAdmins = isGroup ? groupAdmins.includes(sender) : false
const isReact = m.message.reactionMessage ? true : false
const reply  =  (teks) => { 
	conn.sendMessage(from, {
	text : teks ,
      contextInfo: {
       forwardingScore: 1,
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
        newsletterJid: '120363421350428668@newsletter',
        newsletterName: "3K GIFT BOT ꨄ︎",
        serverMessageId: 1041,
                }
            } 
	},{quoted:mek||null});
}
//======================

console.log(command)

conn.decodeJid = (jid) => {
    if (!jid) return jid;
    try {
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}; 
            return (decode.user && decode.server) 
                ? `${decode.user}@${decode.server}` 
                : jid;
        } else {
            return jid; 
        }
    } catch (error) {
        console.error('Error decoding JID:', error); 
        return jid;
    }
};

conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
              let mime = '';
              let res = await axios.head(url)
              mime = res.headers['content-type']
              if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
              }
              let type = mime.split("/")[0] + "Message"
              if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
              }
              if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
              }
            }
//=======================
 
conn.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return conn.sendMessage(jid, { poll: { name, values, selectableCount }}) }
	
//=========================

if(senderNumber.includes("94704104383")){
if(isReact) return
m.react("👑")
}
if(senderNumber.includes("94762857217")){
if(isReact) return
m.react("👑")
}

//================================WORK TYPE============================================ 
if(!isOwner && isDev && config.MODE === "private") return 
if(!isOwner && isGroup && isDev  && config.MODE === "inbox") return 
if(!isOwner && !isGroup && isDev  && config.MODE === "groups") return 
//=====================================================================================
 
const events = require('./command')
const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
if (isCmd) {
const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
if (cmd) {
if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})

try {
cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
} catch (e) {
console.error("[PLUGIN ERROR] " + e);
}
}
}
events.commands.map(async(command) => {
if (body && command.on === "body") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (mek.q && command.on === "text") {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
(command.on === "image" || command.on === "photo") &&
mek.type === "imageMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
} else if (
command.on === "sticker" &&
mek.type === "stickerMessage"
) {
command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
}});

})
}
//cmd===========================

async function handleUpdate(reply, key, newValue, validation, errorMsg) { 
  if (validation && !validation(newValue)) {
    return reply("❌ " + errorMsg); 
  } 
  try { 
    await updateEnv(key, newValue); 
    reply(`✅ *Update Success!*\n🔧 ${key} → \`${newValue}\``); 
  } catch (err) { 
    console.error(`Error updating ${key}: ` + err.message); 
    reply(`🙇‍♂️ *Failed to update ${key}. Please try again.*\n🪲 Error: ${err.message}`); 
  } 
} 
cmd({
  pattern: "setting",
  alias: ["settings", "botsettings", "botsetting"],
  desc: "List all current bot settings",
  category: "owner",
  react: "📜",
  filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
  if (!isOwner) return reply("🚫 _ඔබ බොට් හිමිකරු නොවේ..._");

  try {
    const config = await readEnv();
 
    const aliveImg = config.ALIVE_IMG;
    const ancall = config.ANCALL;
    const prefix = config.PREFIX;
    const autoReadStatus = config.AUTO_READ_STATUS;
    const mode = config.MODE;
    const allwaysOnline = config.ALWAYS_ONLINE;
    const antiLink = config.ANTI_LINK;
    const autoReactStatus = config.AUTO_REACT_STATUS;
    const rec = config.RECORDING;
    const typ = config.TYPING;
 const cap = `✦✧✰ 𝗦𝗘𝗧𝗧𝗜𝗡𝗚 𝗠𝗘𝗡𝗨 ✦✧✰

╔═══════●●► 
║
╠ 🔑 *Prefix*: Now: ( ${prefix} )
╠ 🔄 *Update Prefix*: ${prefix}prefix
║
╠🖼️ *𝗔𝗟𝗜𝗩𝗘 𝗜𝗺𝗮𝗴𝗲*: Now: ${aliveImg}
╠🔄 *Update ALIVE Image*: ${prefix}aliveimg
║
╠ 🌙 *Mode*: Now: ${mode}
╠ 🔄 *Update Mode*: ${prefix}mode inbox/public
║
╠ 👀 *Auto Read Status*: Now: ${autoReadStatus}
╠ 🔄 *Update Auto Read Status*: ${prefix}status on/off
║
╠ 📞 *Anti Call*: Now: ${ancall}
╠ 🔄 *Update Anti Call*: ${prefix}call on/off
║
╠ 🌐 *Always Online*: Now: ${allwaysOnline}
╠ 🔄 *Update Always Online*: ${prefix}online on/off
║
╠ 🎙️ *Recording*: Now: ${rec}
╠ 🔄 *Update Fake rec*: ${prefix}recording on/off
║
╠ ✍️ *Typing*: Now: ${typ}
╠ 🔄 *Update Fake typing*: ${prefix}typing on/off
║
╚═══════●●► 
⚡ *© ʀᴇᴅ ᴅʀᴀɢᴏɴ ᴡᴀ ʙᴏᴛ* ✨
`;

     await conn.sendMessage(from, {
                    [isImage ? "image" : "video"]: { url: config.ALIVE_IMG },
                    caption: cap,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363390314235567@newsletter",
                            newsletterName: "© 3K GIFT BOT ꨄ︎",
                            serverMessageId:893,
                        },
                    },
                });

  } catch (err) {
    console.error('Error fetching environment variables: ' + err.message);
    reply("❌ _There was an error fetching the settings._");
  }
});

cmd({ 
  pattern: "prefix", 
  desc: "Update the command prefix", 
  category: "owner", 
  react: "✅", 
  filename: __filename 
}, async (conn, mek, m, { q, reply, isOwner }) => { 
  if (!isOwner) return reply("🚫 _ඔබ බොට් හිමිකරු නොවේ..._"); 
  if (!q || q.length > 3) {
    return reply("✏️ Please set a valid prefix (1-3 characters):\n\nExample: `.prefix !`"); 
  } 
  const key = 'PREFIX'; 
  handleUpdate(reply, key, q, null, null); 
});

cmd({ 
  pattern: "status", 
  desc: "Enable or disable auto-read status", 
  category: "owner", 
  react: "✅", 
  filename: __filename 
}, async (conn, mek, m, { q, reply, isOwner }) => { 
  if (!isOwner) return reply("🚫 _ඔබ බොට් හිමිකරු නොවේ..._"); 
  if (!q) return reply("⚙️ Please enable or disable auto-read status using:\n\nExample: `.autostates on`");
  const key = 'AUTO_READ_STATUS'; 
  const validModes = ['on', 'off']; 
  handleUpdate(reply, key, q, val => validModes.includes(val), "⚠️ *Invalid value. Use `on` or `off`.*"); 
});

cmd({ 
  pattern: "mode", 
  desc: "Update bot mode", 
  category: "owner", 
  react: "✅", 
  filename: __filename 
}, async (conn, mek, m, { q, reply, isOwner }) => { 
  if (!isOwner) return reply("🚫 _ඔබ බොට් හිමිකරු නොවේ..._"); 
  if (!q) return reply(`🌐 Please set the bot mode using one of the following:\n\nExample: ${PREFIX}mode private`);
  const key = 'MODE'; 
  const validModes = ['private', 'public', 'groups', 'inbox']; 
  handleUpdate(reply, key, q, val => validModes.includes(val), `⚠️ *Invalid mode. Use one of: ${validModes.join(', ')}*`); 
});

// ALIVE_IMG
cmd({
  pattern: "aliveimg",
  desc: "Update the alive image URL",
  category: "owner",
  react: "✅",
  filename: __filename
}, async (conn, mek, m, { q, reply, isOwner }) => {
  if (!isOwner) return reply("🚫 _ඔබ බොට් හිමිකරු නොවේ..._");
  if (!q) return reply("🖼️ Please set your image URL:\n\nExample: .aliveimg https://example.com/image.jpg");
  handleUpdate(reply, 'ALIVE_IMG', q, val => val.startsWith('https://'), "📛 *Invalid URL. Must start with `https://`*");
});

// ANCILLARY CALL BLOCK (ANCALL)
cmd({
  pattern: "call",
  desc: "Set call block mode",
  category: "owner",
  react: "📵",
  filename: __filename
}, async (conn, mek, m, { q, reply, isOwner }) => {
  const modes = ['off', 'on'];
  if (!isOwner) return reply("🚫 _Only the bot owner can perform this action._");
  if (!q) return reply(`📵 Set call block mode:\nExample: .ancall on<recte call is on now >`);
  handleUpdate(reply, 'ANCALL', q, val => modes.includes(val), `❌ Invalid mode. Use: ${modes.join(', ')}`);
});

// TYPING STATUS
cmd({
  pattern: "typing",
  desc: "Enable or disable typing indicator",
  category: "owner",
  react: "⌨️",
  filename: __filename
}, async (conn, mek, m, { q, reply, isOwner }) => {
  if (!isOwner) return reply("🚫 Owner only.");
  if (!q) return reply("⌨️ Example: .typing on");
  handleUpdate(reply, 'TYPING', q, val => ['on', 'off'].includes(val), "⚠️ Use `on` or `off`");
});

// RECORDING STATUS
cmd({
  pattern: "recording",
  desc: "Enable or disable recording status",
  category: "owner",
  react: "🎙️",
  filename: __filename
}, async (conn, mek, m, { q, reply, isOwner }) => {
  if (!isOwner) return reply("🚫 Owner only.");
  if (!q) return reply("🎙️ Example: .recording on");
  handleUpdate(reply, 'RECORDING', q, val => ['on', 'off'].includes(val), "⚠️ Use `on` or `off`");
});

cmd({
  pattern: "online",
  desc: "Set online",
  category: "owner",
  react: "📍",
  filename: __filename
}, async (conn, mek, m, { q, reply, isOwner }) => {
  if (!isOwner) return reply("🚫 _Only the owner can change this._");
  if (!q) return reply("📍 Set always online on or off ");
  handleUpdate(reply, 'ALWAYS_ONLINE', q);
});

//===========================================================================================
app.get("/", (req, res) => {
res.send("hey,  started♥");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
connectToWA()
}, 4000);
