const visit = require('unist-util-visit');

const codeSandboxRegexp = /https:\/\/codesandbox\.io\/embed\/.*/;

const getEmbeddedCodeSandbox = (link) => {
  const url = link.split('?')[0]
  const queryString = link.split('?')[1]
  return `<iframe src="${link}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;
}

const isCodeSandboxLink = node => {
  return node.children.length === 1 && node.children[0].type === 'link' && codeSandboxRegexp.test(node.children[0].url)
}

module.exports = (options) => {
  const debug = options.debug ? console.log : () => {}

  return async tree => {

    const nodes = [];

    visit(tree, 'paragraph', (node) => {
      debug(node);
      if (isCodeSandboxLink(node)) {
        debug(`\nfound codesandbox link`, node.children[0].url)
        nodes.push([node, node.children[0].url])
      }
    })

    for (let i = 0; i < nodes.length; i++) {
      const nt = nodes[i];
      const node = nt[0];
      const csLink = nt[1];
      debug(`\nembeding codesandbox: ${csLink}`);
      try {
        const csEmbed = getEmbeddedCodeSandbox(csLink);
        node.type = 'html';
        node.value = csEmbed;
      } catch (err) {
        debug(`\nfailed to get iframe for ${csLink}\n`, er)
      }
    }

  }
}