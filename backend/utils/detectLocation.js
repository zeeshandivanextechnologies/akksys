export const detectLocation = async (ip) => {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
    return { city: 'Local', region: '', country: 'IN', countryName: 'India', lat: 0, lon: 0 };
  }

  try {
    const cleanIp = ip.replace('::ffff:', '');
    const response = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,countryCode,regionName,city,lat,lon`);
    const data = await response.json();

    if (data.status === 'success') {
      return {
        city: data.city || 'Unknown',
        region: data.regionName || '',
        country: data.countryCode || 'XX',
        countryName: data.country || 'Unknown',
        lat: data.lat || 0,
        lon: data.lon || 0,
      };
    }
  } catch {
    // Geolocation failed, return defaults
  }

  return { city: 'Unknown', region: '', country: 'XX', countryName: 'Unknown', lat: 0, lon: 0 };
};
