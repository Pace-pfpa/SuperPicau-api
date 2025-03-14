import dotenv from 'dotenv';
import { LoginDTO } from '../../modules/LoginUsuario';

export async function LoginSapiens(login: LoginDTO): Promise<string> {
    dotenv.config();
    const CMD_Python = process.env.CMD_Python;
    const { spawn } = require('child_process');

    const childPython = spawn(CMD_Python, ["./python/loginPython.py", login.cpf, login.senha])
    let dataPython;
       
    return new Promise(function (resolve, reject) {
        
        childPython.stdout.on("data", (data) => {
            dataPython = (`${data}`).replace("\r\n", "")
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
