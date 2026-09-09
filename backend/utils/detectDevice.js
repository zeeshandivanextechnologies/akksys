import ua from 'useragent';

export const detectDevice = (userAgentString) => {
  if (!userAgentString) return { type: 'Unknown', os: 'Unknown', browser: 'Unknown' };

  const agent = ua.parse(userAgentString);

  let type = 'Desktop';
  const uaLower = userAgentString.toLowerCase();
  if (uaLower.includes('mobile') || uaLower.includes('android') || uaLower.includes('iphone')) {
    type = 'Mobile';
  } else if (uaLower.includes('tablet') || uaLower.includes('ipad')) {
    type = 'Tablet';
  }

  return {
    type,
    os: agent.os.toString(),
    browser: agent.family,
  };
};
