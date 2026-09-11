## markup-generator module

`yarn add markup-generator`  or  `npm install markup-generator`

Simple TypeScript helper for generating unique filenames and writing HTML (or any text) content to disk.
Primarily used inside email-newsletter generation pipelines.

```ts
import { writeHTML, generateTemplateName } from 'markup-generator';

const content = '<html></html>'; // long html template stored in this variable
const fileName = generateTemplateName('prefix-for-your-generated-file');

await writeHTML(fileName, content);
```

### Development

The package lives under `write/packages/write-module` (Nx workspace).

```bash
cd write
npm install
npx nx test write-module
npx nx build write-module
```

### TODO / Roadmap

- [x] Convert tests to TypeScript + ts-jest
- [ ] Dual CJS + ESM build (and optional browser entry for pure helpers)
- [ ] Publish polished version to npm

### Arthur Tkachenko articles

* [https://hackernoon.com/5-reasons-why-newsletters-should-be-part-of-your-business-strategy](https://hackernoon.com/5-reasons-why-newsletters-should-be-part-of-your-business-strategy)
* [https://hackernoon.com/organizing-an-advanced-structure-for-html-email-template](https://hackernoon.com/organizing-an-advanced-structure-for-html-email-template)
* [https://hackernoon.com/how-i-started-to-build-react-components-for-email-templates](https://hackernoon.com/how-i-started-to-build-react-components-for-email-templates)
* [https://hackernoon.com/introducing-a-simple-npm-module-with-email-templates](https://hackernoon.com/introducing-a-simple-npm-module-with-email-templates)
* [https://hackernoon.com/glossary-for-non-technies](https://hackernoon.com/glossary-for-non-technies)
* [https://hackernoon.com/email-marketing-and-how-to-curate-an-effective-business-newsletter](https://hackernoon.com/email-marketing-and-how-to-curate-an-effective-business-newsletter)
* [https://hackernoon.com/exploring-substack-for-building-your-newsletter](https://hackernoon.com/exploring-substack-for-building-your-newsletter)
* [https://hackernoon.com/building-a-design-system-for-email-templates-react](https://hackernoon.com/building-a-design-system-for-email-templates-react)
* [https://hackernoon.com/together4victory-list-of-email-marketing-tools](https://hackernoon.com/together4victory-list-of-email-marketing-tools)
* [https://hackernoon.com/cool-newsletters-for-developers-part-1](https://hackernoon.com/cool-newsletters-for-developers-part-1)
* [https://hackernoon.com/cool-resources-for-sending-emails](https://hackernoon.com/cool-resources-for-sending-emails)

## [Linkedin page of LLazyEmail](https://www.linkedin.com/company/llazyemail/)
