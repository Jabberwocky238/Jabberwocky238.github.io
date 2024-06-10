import { jwObsidian, jwObsidianHtml } from 'jw-obsidian-micromark-extension';
import { micromark } from 'micromark';
import { gfmAutolinkLiteral, gfmAutolinkLiteralHtml } from 'micromark-extension-gfm-autolink-literal';

export function translate2md(text: string, reflexMap: Map<string, string[]>) {
    const replacement = (token: string) => {
        const url = reflexMap.get(token)
        // console.log(url, token, reflexMap)
        if (url) {
            if (token.endsWith('.png')) {
                return ['markdown', ...url].join('/')
            }
            return ['#', 'document', ...url].join('/')
        } else {
            if (token.endsWith('.png')) {
                return ['markdown', token].join('/')
            }
            return ['#', 'document', token].join('/')
        }
    }

    let html = micromark(text, {
        extensions: [jwObsidian(), gfmAutolinkLiteral()],
        htmlExtensions: [jwObsidianHtml({ 
            edit4image: replacement,
            edit4link: replacement,
        }), gfmAutolinkLiteralHtml()],
    })
    
    // <swagger>(大摇大摆，神气十足地走)
    html = html.replaceAll('&lt;', '<');
    html = html.replaceAll('&gt;', '>');
    html = html.replaceAll(/<([^\>]*)>\(([^)]*)\)/g, '<span class="origin-text">' + '$1' + '<span class="translated-text">' + '$2' + '</span></span>');

    return html
}