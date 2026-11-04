"""Check local resources, links, labels and fidelity parity without dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re

ROOT = Path(__file__).resolve().parents[1]


class Document(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = []
        self.labels = set()
        self.inputs = []
        self.h1 = 0
        self.lang = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.h1 += tag == 'h1'
        if tag == 'html':
            self.lang = attrs.get('lang')
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'label':
            self.labels.add(attrs.get('for'))
        if tag == 'input':
            self.inputs.append(attrs.get('id'))
        for key in ('href', 'src'):
            if key in attrs:
                self.refs.append(attrs[key])


def check():
    errors = []
    files = [ROOT / 'index.html', *sorted((ROOT / 'pantallas').glob('*.html')),
             *sorted((ROOT / 'wireframes').glob('*.html'))]
    designs = {p.name for p in (ROOT / 'pantallas').glob('*.html')}
    wires = {p.name for p in (ROOT / 'wireframes').glob('*.html')}
    if designs != wires:
        errors.append('Las dos fidelidades tienen inventarios diferentes.')
    documents = {}
    for file in files:
        doc = Document()
        doc.feed(file.read_text(encoding='utf-8'))
        documents[file.resolve()] = doc
        name = str(file.relative_to(ROOT))
        if doc.h1 != 1 or doc.lang != 'es-AR':
            errors.append(f'{name}: revisar H1 o idioma.')
        if len(doc.ids) != len(set(doc.ids)):
            errors.append(f'{name}: identificadores repetidos.')
        if any(not value or value not in doc.labels for value in doc.inputs):
            errors.append(f'{name}: campo sin etiqueta asociada.')
    for file, doc in documents.items():
        for ref in doc.refs:
            url = urlsplit(ref)
            if url.scheme or url.netloc:
                errors.append(f'{file.name}: recurso externo inesperado: {ref}')
                continue
            target = (file.parent / unquote(url.path)).resolve() if url.path else file
            if not target.is_file():
                errors.append(f'{file.name}: no existe {ref}')
            elif url.fragment and target in documents and unquote(url.fragment) not in documents[target].ids:
                errors.append(f'{file.name}: ancla inexistente {ref}')
    for css in (ROOT / 'assets').glob('*.css'):
        text = css.read_text(encoding='utf-8')
        if 'TEMPORARY QA' in text:
            errors.append(f'{css.name}: quedó un ajuste temporal de revisión.')
        for ref in re.findall(r'url\([\'"]?([^\)\'\"]+)', text):
            if not (css.parent / ref).is_file():
                errors.append(f'{css.name}: recurso inexistente {ref}')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'OK: {len(files)} HTML; {len(designs)} pantallas en cada fidelidad; '
          'enlaces, anclas, recursos y etiquetas válidos.')


if __name__ == '__main__':
    check()
