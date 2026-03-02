// simple credentials provider stub
export interface Credentials {
  email: string;
  password: string;
}

export async function verifyCredentials(creds: Credentials) {
  // validate against DB
  return null;
}
