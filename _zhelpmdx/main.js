import ReactDom from 'react-dom/server';
import * as Mdx from '@mdx-js/mdx';
import JsxRuntime from 'react/jsx-runtime';

const CodeBlock = function(props){
  return JsxRuntime.jsx("code-block", {
    "v-bind:menus": JSON.stringify(props.menus),
    children: props.children,
  });
};

const evalMdx = function(components, mdx_string){
  const compiled = Mdx.compileSync(mdx_string, {outputFormat: 'function-body', development: false}).value;
  const _func = new Function("__jsx_context", compiled);
  return _func(JsxRuntime).default({components});
}

export default function(mdxString){
  const mdxDoc = evalMdx({CodeBlock}, mdxString);
  return ReactDom.renderToStaticMarkup(mdxDoc);
}
