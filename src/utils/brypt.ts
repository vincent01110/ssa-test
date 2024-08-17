import bcrypt from "bcrypt";

const saltRounds = 5;

export async function encrypt(text: string){
    return bcrypt.hash(text, saltRounds);
}

export async function isMatch(text: string, hash: string){
    return bcrypt.compare(text, hash);
}
