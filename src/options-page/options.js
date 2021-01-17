// define default config
/* Adding a config option checklist:
add html element
add an entry in default config
fetch the element
add it to create config from state
add it to load config */

const defaultConfig = {
  'fontSize': 10,
  'maxDepth': 10,
  'spaceBehavesLikeTab': true,
  'restrictMismatchedBrackets': true,
  'sumStartsWithNEquals': true,
  'supSubsRequireOperand': true,
  'autoSubscriptNumerals': true,
}

window.addEventListener('load', () => {
  // fetch elements
  const fontSizeInput = document.getElementById("fontSizeInput");
  const maxDepthInput = document.getElementById("maxDepthInput");
  const spaceBehavesLikeTab = document.getElementById("spaceBehaveLikeTab");
  const restrictMismatchedBrackets = document.getElementById("restrictMismatchedBrackets");
  const sumStartsWithNEquals = document.getElementById("sumStartWithNEquals");
  const supSubsRequireOperand = document.getElementById("supSubsRequireOperand");
  const autoSubscriptNumerals = document.getElementById("autoSubscriptNumerals");


  const saveButton = document.getElementById("saveButton");
  const loadDefaultsButton = document.getElementById("loadButton");
  const settingsSavedText = document.getElementById("settingsSavedText");

  // add listeners
  fontSizeInput.addEventListener('focusout', validateFontSizeListener);
  maxDepthInput.addEventListener('focusout', validateMaxDepthListener);
  saveButton.addEventListener('click', saveButtonListener);
  loadDefaultsButton.addEventListener('click', loadDefaultsButtonListener);

  // hide settings saved text
  settingsSavedText.style.display = "none";
  // preload defaults and saved options
  fetchOptions();
});

function saveButtonListener() {
  saveConfig();
  // toggle saved indicator
  settingsSavedText.style.display = "block";
  setTimeout(() => {
    settingsSavedText.style.display = "none";
  }, 3000);
}

// save button listener
function saveConfig() {
  const config = createConfigFromState();
  chrome.storage.sync.set({
    'config': config
  }, () => {
    console.log("Config Saved: ");
    console.log(config);
  });
}

// load defualts listener
function loadDefaultsButtonListener() {
  loadConfig(defaultConfig);
}

// creates a config object from the state of the form
function createConfigFromState() {
  const config = {};
  config.fontSize = fontSizeInput.value;
  config.maxDepth = maxDepthInput.value;
  config.spaceBehavesLikeTab = spaceBehavesLikeTab.checked;
  config.restrictMismatchedBrackets = restrictMismatchedBrackets.checked;
  config.sumStartsWithNEquals = sumStartsWithNEquals.checked;
  config.supSubsRequireOperand = supSubsRequireOperand.checked;
  config.autoSubscriptNumerals = autoSubscriptNumerals.checked;
  return config;
}

// fetches config from store and loads them
function fetchOptions() {
  chrome.storage.sync.get(['config'], (result) => {
    console.log(Object.keys(result).length);
    if (Object.keys(result).length === 0) { // first time user opened options
      console.log("No Saved config found! Loading default")
      loadConfig(defaultConfig);
      saveConfig();
    } else { // load saved options
      console.log("Loading fetched config!");
      loadConfig(result.config);
    }
  });
}

// loads config into form
function loadConfig(config) {
  fontSizeInput.value = config.fontSize;
  maxDepthInput.value = config.maxDepth;
  spaceBehavesLikeTab.checked = config.spaceBehavesLikeTab;
  restrictMismatchedBrackets.checked = config.restrictMismatchedBrackets;
  sumStartsWithNEquals.checked = config.sumStartsWithNEquals;
  supSubsRequireOperand.checked = config.supSubsRequireOperand;
  autoSubscriptNumerals.checked = config.autoSubscriptNumerals;
}

function validateFontSizeListener(e) {
  if (e.target.value > 100) {
    e.target.value = 100;
  } else if (e.target.value < 8) {
    e.target.value = 10;
  }
}

function validateMaxDepthListener(e) {
  if (e.target.value > 100) {
    e.target.value = 100;
  } else if (e.target.value === "") {
    e.target.value = 10;
  } else if (e.target.value < 8) {
    e.target.value = 8;
  }
}
