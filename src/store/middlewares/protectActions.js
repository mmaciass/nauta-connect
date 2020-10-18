import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../../utils/env.example';


const listTypesProtected = [
  'OPEN_DIALOG_TIMER', 'START_TIMER_DISCONNECT', 'AUTO_ENABLE_PROXY',
];

const protectActions = (store) => (next) => (action) => {
  const { type, payload } = action;

  const result = listTypesProtected.find(value => value === type);
  if (result) {
    chrome.storage.sync.get(['token', 'identity'], (v) => {
      const { id, timeCheck, client } = v.identity;
      try {
        const identityCheck = jwt.verify(v.token, PUBLIC_KEY, { algorithms: ['RS256'] });
        if (parseInt(identityCheck.id) !== id || parseInt(identityCheck.timeCheck) !== timeCheck
          || identityCheck.client.toLowerCase() !== client.toLowerCase()) {
          const w = window.open('/license.html');
          w.focus();
        } else {
          return next(action);
        }
      } catch (e) {
        const w = window.open('/license.html');
        w.focus();
      }

    });
  } else return next(action);
};

export default protectActions;
