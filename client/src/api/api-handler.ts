export const withApiHandler = async <T>(fn: () => Promise<T>): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
