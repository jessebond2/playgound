interface FoundryItem {
  name: string;
  recycledBars: number;
}

type FoundryMetal = Record<number, FoundryItem>;

export const Adamant: FoundryMetal = {
  1317: { name: "Adamant 2h sword", recycledBars: 2 },
  1371: { name: "Adamant battleaxe", recycledBars: 2 },
  1111: { name: "Adamant chainbody", recycledBars: 2 },
  3100: { name: "Adamant claws", recycledBars: 1 },
  1161: { name: "Adamant full helm", recycledBars: 1 },
  1199: { name: "Adamant kiteshield", recycledBars: 2 },
  1301: { name: "Adamant longsword", recycledBars: 1 },
  1123: { name: "Adamant platebody", recycledBars: 4 },
  1073: { name: "Adamant platelegs", recycledBars: 2 },
  1091: { name: "Adamant plateskirt", recycledBars: 2 },
  1331: { name: "Adamant scimitar", recycledBars: 1 },
  1183: { name: "Adamant sq shield", recycledBars: 1 },
  1345: { name: "Adamant warhammer", recycledBars: 2 },
};

export const Bronze: FoundryMetal = {
  1307: { name: "Bronze 2h sword", recycledBars: 2 },
  1375: { name: "Bronze battleaxe", recycledBars: 2 },
  1103: { name: "Bronze chainbody", recycledBars: 2 },
  3095: { name: "Bronze claws", recycledBars: 1 },
  1155: { name: "Bronze full helm", recycledBars: 1 },
  1189: { name: "Bronze kiteshield", recycledBars: 2 },
  1291: { name: "Bronze longsword", recycledBars: 1 },
  1117: { name: "Bronze platebody", recycledBars: 4 },
  1075: { name: "Bronze platelegs", recycledBars: 2 },
  1087: { name: "Bronze plateskirt", recycledBars: 2 },
  1321: { name: "Bronze scimitar", recycledBars: 1 },
  1173: { name: "Bronze sq shield", recycledBars: 1 },
  1337: { name: "Bronze warhammer", recycledBars: 2 },
};

export const Iron: FoundryMetal = {
  1309: { name: "Iron 2h sword", recycledBars: 2 },
  1363: { name: "Iron battleaxe", recycledBars: 2 },
  1101: { name: "Iron chainbody", recycledBars: 2 },
  3096: { name: "Iron claws", recycledBars: 1 },
  1153: { name: "Iron full helm", recycledBars: 1 },
  1191: { name: "Iron kiteshield", recycledBars: 2 },
  1293: { name: "Iron longsword", recycledBars: 1 },
  1115: { name: "Iron platebody", recycledBars: 4 },
  1067: { name: "Iron platelegs", recycledBars: 2 },
  1081: { name: "Iron plateskirt", recycledBars: 2 },
  1323: { name: "Iron scimitar", recycledBars: 1 },
  1175: { name: "Iron sq shield", recycledBars: 1 },
  1335: { name: "Iron warhammer", recycledBars: 2 },
};

export const Mithril: FoundryMetal = {
  1315: { name: "Mithril 2h sword", recycledBars: 2 },
  1369: { name: "Mithril battleaxe", recycledBars: 2 },
  1109: { name: "Mithril chainbody", recycledBars: 2 },
  3099: { name: "Mithril claws", recycledBars: 1 },
  1159: { name: "Mithril full helm", recycledBars: 1 },
  1197: { name: "Mithril kiteshield", recycledBars: 2 },
  1299: { name: "Mithril longsword", recycledBars: 1 },
  1121: { name: "Mithril platebody", recycledBars: 4 },
  1071: { name: "Mithril platelegs", recycledBars: 2 },
  1085: { name: "Mithril plateskirt", recycledBars: 2 },
  1329: { name: "Mithril scimitar", recycledBars: 1 },
  1181: { name: "Mithril sq shield", recycledBars: 1 },
  1343: { name: "Mithril warhammer", recycledBars: 2 },
};

export const Rune: FoundryMetal = {
  1319: { name: "Rune 2h sword", recycledBars: 2 },
  1373: { name: "Rune battleaxe", recycledBars: 2 },
  1113: { name: "Rune chainbody", recycledBars: 2 },
  3101: { name: "Rune claws", recycledBars: 1 },
  1163: { name: "Rune full helm", recycledBars: 1 },
  1201: { name: "Rune kiteshield", recycledBars: 2 },
  1303: { name: "Rune longsword", recycledBars: 1 },
  1127: { name: "Rune platebody", recycledBars: 4 },
  1079: { name: "Rune platelegs", recycledBars: 2 },
  1093: { name: "Rune plateskirt", recycledBars: 2 },
  1333: { name: "Rune scimitar", recycledBars: 1 },
  1185: { name: "Rune sq shield", recycledBars: 1 },
  1347: { name: "Rune warhammer", recycledBars: 2 },
};

export const Steel: FoundryMetal = {
  1311: { name: "Steel 2h sword", recycledBars: 2 },
  1365: { name: "Steel battleaxe", recycledBars: 2 },
  1105: { name: "Steel chainbody", recycledBars: 2 },
  3097: { name: "Steel claws", recycledBars: 1 },
  1157: { name: "Steel full helm", recycledBars: 1 },
  1193: { name: "Steel kiteshield", recycledBars: 2 },
  1295: { name: "Steel longsword", recycledBars: 1 },
  1119: { name: "Steel platebody", recycledBars: 4 },
  1069: { name: "Steel platelegs", recycledBars: 2 },
  1083: { name: "Steel plateskirt", recycledBars: 2 },
  1325: { name: "Steel scimitar", recycledBars: 1 },
  1177: { name: "Steel sq shield", recycledBars: 1 },
  1339: { name: "Steel warhammer", recycledBars: 2 },
};
