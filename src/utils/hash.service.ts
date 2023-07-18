import { Md5 } from "ts-md5";

export class HashService {
  static encryptData(data: any) {
    const md5 = new Md5();
    return (
      md5
        .appendStr(
          JSON.stringify(data).toLocaleLowerCase() + process.env.ENCRYPTPASSWORD
        )
        .end() || ""
    ).toString();
  }
}
