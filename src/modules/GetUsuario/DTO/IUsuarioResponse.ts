interface LastLogin {
    date: string;
  }
  
export interface IUsuarioResponse {
    username: string;
    usernameCanonical: string;
    email: string;
    emailCanonical: string;
    enabled: boolean;
    salt: string;
    password: string;
    lastLogin: LastLogin;
    roles: string[];
    id: number;
    nome: string;
    nivelAcesso: number;
    assinaturaHTML: string;
    validado: boolean;
    configuracoes: string;
  }
  