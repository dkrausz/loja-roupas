export const jwtConfig = () => {
  const jwtKey = process.env.JWT_SECRET;
  const expiresIn = process.env.EXPIRES_IN;

  if (!jwtKey) {
    throw new Error("Missing JWT environment variable `JWT_SECRET`");
  }

  return { jwtKey, expiresIn };
};
