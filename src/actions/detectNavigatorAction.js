export const detectNavigatorAction = () => {
  return (dispatch) => {
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    // var isSafari = /constructor/i.test(window.HTMLElement) || (function(p) {
    //   return p.toString() === '[object SafariRemoteNotification]';
    // })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    // var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // var isEdge = !isIE && !!window.StyleMedia;
    // var isEdgeChromium = isChrome && (navigator.userAgent.indexOf('Edg') != -1);
    // var isBlink = (isChrome || isOpera) && !!window.CSS;

    dispatch({
      type: 'NAVIGATOR_RECOGNIZED',
      payload: isFirefox
        ? 'firefox'
        : (isChrome
          ? 'chrome'
          : (isOpera
            ? 'opera'
            : 'unknown')),
    });
  };
};
