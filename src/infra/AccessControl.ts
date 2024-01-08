import "dotenv/config";
import bcrypt from "bcrypt";
import UseAccess from "../database/models/useaccess";
import { ObjectId } from "mongodb";

function calculateExpirationDate(expires: string): Date {
  const expiration = new Date();
  const amount = parseInt(expires.slice(0, -1));
  const unit = expires.slice(-1);

  switch (unit) {
    case "h": // Hours
      expiration.setHours(expiration.getHours() + amount);
      break;
    case "d": // Days
      expiration.setDate(expiration.getDate() + amount);
      break;
    case "y": // Years
      if (amount < 1) {
        expiration.setFullYear(expiration.getFullYear() + amount);
      } else {
        expiration.setFullYear(expiration.getFullYear() + 1);
      }
      break;
    default:
      throw new Error("Invalid expiration unit");
  }

  return expiration;
}

const SECRET_KEY = process.env.SECRET_KEY!;

/**
 * Create access key function
 * @param userId user id in database
 * @param expires [number][type] -> [number] = number of hours/days/years(max 1 year) -> [type] = 'h' = hours | 'd' = days | 'y' = years -> Ex.: '1d'
 * @returns
 */
export async function createAccessKey(userId: ObjectId, expires: string) {
  try {
    const saltRounds = 10;
    const apiKey = await bcrypt.hash(SECRET_KEY, saltRounds);

    const expiresAt = calculateExpirationDate(expires);

    const newAccessKey = new UseAccess({
      userId,
      apiKey,
      expires: expiresAt,
    });

    await newAccessKey.save();

    return apiKey;
  } catch (error) {
    console.error("Error creating access key:", error);
    throw error;
  }
}

export async function validateAccessKey(apiKey: string): Promise<boolean> {
  try {
    const accessKey = await UseAccess.findOne({ apiKey });

    if (!accessKey) {
      return false; // Chave não encontrada
    }

    if (accessKey.expires <= new Date()) {
      return false; // Chave expirada
    }

    return true; // Chave válida
  } catch (error) {
    console.error("Error validating access key:", error);
    throw error;
  }
}
