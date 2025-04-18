import { compare, hash } from "bcryptjs";

export async function getHashed(data: string) {
  return await hash(data, 10);
}
export function comparePassword({
  rawData,
  hashedData,
}: {
  rawData: string;
  hashedData: string;
}) {
  return new Promise((resolve, reject) => {
    return compare(rawData, hashedData, (err, success) => {
      if (err) {
        reject(err);
      }
      resolve(success);
    });
  });
}
