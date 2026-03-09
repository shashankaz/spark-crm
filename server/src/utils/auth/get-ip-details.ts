import axios from "axios";

interface IPDetails {
  city: string | null;
  region: string | null;
  country: string | null;
  isp: string | null;
  lat: string | null;
  lon: string | null;
}

export const getIPDetails = async ({
  ipAddress,
}: {
  ipAddress: string;
}): Promise<IPDetails> => {
  const ipAddressDetails: IPDetails = {
    city: null,
    region: null,
    country: null,
    isp: null,
    lat: null,
    lon: null,
  };

  if (!ipAddress) return ipAddressDetails;

  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const data = response.data;

    if (data.status === "fail") {
      console.error("IP lookup failed:", data.message);
      return ipAddressDetails;
    }

    ipAddressDetails.city = data.city || null;
    ipAddressDetails.region = data.regionName || null;
    ipAddressDetails.country = data.country || null;
    ipAddressDetails.isp = data.isp || null;
    ipAddressDetails.lat = (data.lat && data.lat.toString()) || null;
    ipAddressDetails.lon = (data.lon && data.lon.toString()) || null;
  } catch (error) {
    console.error("Error fetching IP details:", error);
  }

  return ipAddressDetails;
};
