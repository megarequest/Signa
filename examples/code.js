// Блоки «Код» под примерами. Исходник лежит как есть в
// <script type="text/plain"> внутри <details class="code"> — без экранирования < и >.
// Единственное исключение: закрывающий тег скрипта пишется как <\/script>,
// иначе он закроет сам блок. Скрипт превращает его в <pre><code> с кнопкой копирования.

for (const source of document.querySelectorAll('details.code > script[type="text/plain"]')) {
    const lines = source.textContent
        .replace(/<\\\/script>/g, '</script>')
        .replace(/^\s*\n|\n\s*$/g, '')
        .split('\n');

    // убираем общий отступ, который появился из-за вложенности в HTML
    const indent = Math.min(
        ...lines.filter(line => line.trim()).map(line => line.match(/^ */)[0].length)
    );

    const text = lines.map(line => line.slice(indent)).join('\n');

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    const copy = document.createElement('button');

    code.textContent = text;

    copy.type = 'button';
    copy.className = 'code-copy';
    copy.textContent = 'Копировать';
    copy.addEventListener('click', async () => {
        await navigator.clipboard.writeText(text);
        copy.textContent = 'Скопировано';
        setTimeout(() => (copy.textContent = 'Копировать'), 1500);
    });

    pre.append(copy, code);
    source.replaceWith(pre);
}
