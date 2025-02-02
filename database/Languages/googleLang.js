import { translate } from "../../config/googleTranslate";

async function listLanguages() {
  try {

    // Lists available translation languages with their full names in English
    const [languages] = await translate.getLanguages(true);
    return languages;

  } catch (err) {

    return `${err}`;

  }
}

// Execute to obtain list of languages
const languages = listLanguages();

export default languages;