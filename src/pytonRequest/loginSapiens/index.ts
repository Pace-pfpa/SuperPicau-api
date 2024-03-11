import { Coockie } from '../../type/Cookie'
import { ILoginDTO } from '../../DTO/LoginDTO'
import { RequestLoginSapiens } from './LoginRequestSapiens';
import dotenv from 'dotenv';

export async function LoginSapiens(login: ILoginDTO): Promise<string> {
    dotenv.config();
    const CMD_Python = process.env.CMD_Python;
    // const requestLoginSapiens = new RequestLoginSapiens(login);
    // const result = await  requestLoginSapiens.handle()
    // console.log("", result)
    // return result
    const { spawn } = require('child_process');

    // const childPython = spawn("python", ["--version"])
    const childPython = spawn(CMD_Python, ["./python/loginPython.py", login.cpf, login.senha])
    let dataPython;
       
    return new Promise(function (resolve, reject) {
        
        childPython.stdout.on("data", (data) => {
            dataPython = (`${data}`).replace("\r\n", "")
           
            //dataPython = extraitoken (data);
        })
        childPython.stderr.on("data", (data) => {
            console.log(`${data} login`);
            reject(`${data}`)
        })
        childPython.on("close", (code) => {
            resolve(dataPython);
        })
    });


}

/*export async function extraitoken (data) {
    let elements;
    elements = (`${data}`).replace("\r\n", "").slice(1, -1).split(',');
    return elements.map(element => element.trim().replace(/'/g, ''));
}*/