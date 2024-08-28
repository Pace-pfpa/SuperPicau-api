import { getXPathText } from "../../../../helps/GetTextoPorXPATH";

export async function getImoveisRurais(paginaSislabra: string){


        let xptahIrNoCartorio = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[1]/th[11]`)
        let xpathNumeroCafir = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[1]/th[17]`)
        let xpathDataInscricao = getXPathText(paginaSislabra, `/html/body/div/main/div/div[13]/table/tbody/tr[1]/th[18]`)

        if(xptahIrNoCartorio && xpathNumeroCafir && xpathDataInscricao){
            return true
        }else{
            return false
        }
    }

