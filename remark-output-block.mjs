import { visit } from 'unist-util-visit';

export function remarkOutputBlock() {
  return function (tree) {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'output') return;

      // Mark the preceding code block so CSS can join them
      if (index > 0 && parent.children[index - 1].type === 'code') {
        const prev = parent.children[index - 1];
        prev.data = prev.data || {};
        prev.data.hProperties = prev.data.hProperties || {};
        prev.data.hProperties['data-has-output'] = '';
      }

      node.type = 'html';
      const escaped = node.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      node.value = `<div class="output-block"><span class="output-label">output</span><pre><code>${escaped}</code></pre></div>`;
    });
  };
}
