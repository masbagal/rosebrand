const wiki = require("wikijs").default;
const generateImage = require("./generateImage");

const TARGET_SYLLABLE = 6;
const vocal = ["a", "i", "u", "e", "o"];

const alphaRegex = /[a-zA-Z]/;
const numRegex = /[0-9]/;

function isAlphabet(char) {
  return alphaRegex.test(char);
}

function isVocal(char) {
  return vocal.includes(char.toLowerCase());
}

function isNotScientificName(title) {
  try {
    return wiki({ apiUrl: "https://id.wikipedia.org/w/api.php" })
      .page(title)
      .then((page) => page.fullInfo())
      .then((info) => Object.keys(info).includes("regnum"))
      .catch(() => false)
  } catch (err) {
    return false;
  }
}

function isMatchTargetSyllable(word) {
  if (numRegex.test(word)) {
    return false;
  }

  // clean up diacritics
  word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const wordLength = word.length;
  let syllableCount = 0;
  let syllable = "";

  for (let i = 0; i < wordLength; i++) {
    // if more than target, return early
    if (syllableCount > TARGET_SYLLABLE) {
      return false;
    }

    // if current counted syllable is empty, fill and continue for
    if (syllable.length < 1) {
      syllable = word[i];
      continue;
    }

    const lastCharSyllable = syllable[syllable.length - 1];
    // if encounter space or comma, reset current syllable
    if (!isAlphabet(word[i])) {
      if (isVocal(lastCharSyllable)) {
        syllableCount += 1;
      }
      syllable = "";
      continue;
    }

    if (!isVocal(lastCharSyllable) && !isVocal(word[i])) {
      syllable += word[i];
    } else if (!isVocal(lastCharSyllable) && isVocal(word[i])) {
      syllable += word[i];
    } else if (lastCharSyllable === "a" && word[i] === "a") {
      syllable = "";
      syllableCount += 2;
    } else {
      syllable = "";
      syllableCount += 1;
    }
  }

  if (isVocal(word[word.length - 1])) {
    syllableCount += 1;
  }

  return syllableCount === TARGET_SYLLABLE;
}

function findMatchedTitle() {
  return wiki({ apiUrl: "https://id.wikipedia.org/w/api.php" })
    .random(10)
    .then((page) => {
      const matched = page.filter((p) => isMatchTargetSyllable(p));
      const matchedNotLatin = matched.find((m) => isNotScientificName(m));
      return matchedNotLatin;
    })
    .catch(() => null)
}

async function findTitle() {
  let matched ; 
  let attempt = 1;
  while (!matched) {
    matched = await findMatchedTitle();
    console.log(matched, attempt++);
  }
  console.log(matched);
  generateImage(matched);
}

findTitle();
