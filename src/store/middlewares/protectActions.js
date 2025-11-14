import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../../utils/env.example';


const listTypesProtected = [
  'OPEN_DIALOG_TIMER', 'START_TIMER_DISCONNECT', 'AUTO_ENABLE_PROXY',
];

// Helper function to open license page (compatible with service workers and popup)
const openLicensePage = () => {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    // Service worker context - use chrome.tabs.create
    chrome.tabs.create({ url: chrome.runtime.getURL('license.html') });
  } else if (typeof window !== 'undefined') {
    // Browser context - use window.open
    const w = window.open('/license.html');
    if (w) w.focus();
  }
};

const protectActions = (store) => (next) => (action) => {
  const { type, payload } = action;

  const result = listTypesProtected.find(value => value === type);
  if (result) {
    chrome.storage.sync.get(['token', 'identity'], (v) => {
      const { id, timeCheck, client } = v.identity || {};
      try {
        const identityCheck = jwt.verify(v.token, PUBLIC_KEY, { algorithms: ['RS256'] });
        if (parseInt(identityCheck.id) !== id || parseInt(identityCheck.timeCheck) !== timeCheck
          || identityCheck.client.toLowerCase() !== client.toLowerCase()) {
          openLicensePage();
        } else {
          return next(action);
        }
      } catch (e) {
        openLicensePage();
      }

    });
  } else return next(action);
};

export default protectActions;
