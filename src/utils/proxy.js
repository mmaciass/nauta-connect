export const byPass = (host, byPassList) => {
  for (let i = 0; i < byPassList.length; i++) {
    let byPass = byPassList[i];
    if (byPass.charAt(0) == '*') {
      byPass = byPass.substring(1);
    }
    if (host.endsWith(byPass))
      return true;
  }
  return false;
};

export const firefoxProxyListener = (host, byPassList) => ((requestInfo) => {
  if (!byPass(requestInfo.url, byPassList)) {
    return { type: 'https', host, port: 443 };
  }
  return { type: 'direct' };
});

export const firefoxProxyErrorListener = (error) => {
  console.error('Proxy error');
  console.error(error);
};
