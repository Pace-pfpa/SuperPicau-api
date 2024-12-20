const xpath = require('xpath');
import { JSDOMType } from '../dtos/JSDOM';
//OBRIGATORIO PASSAR A PARGINA HTML FORMATADA PELA A BIBLIOTECA JSDOM
//EXEMPLO: const dom = new JSDOM(html);
export function getXPathText(html: JSDOMType, xpathExpression: string): string {
    const dom = html;
    let XPathResult = xpath.XPathResult;
    const nodes = dom.window.document.evaluate(xpathExpression, dom.window.document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const textoDoXpathNaoExiste = nodes.singleNodeValue == null
    if (textoDoXpathNaoExiste) {
        return null;
    }
    return nodes.singleNodeValue.textContent;
}

