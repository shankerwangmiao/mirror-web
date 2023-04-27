import ReactDom from 'react-dom/server';
import * as Mdx from '@mdx-js/mdx';
import JsxRuntime from 'react/jsx-runtime';

const CodeBlock = function(props){
	const variables = {};
	if(props.menus){
		for (let m of props.menus){
			for(let it of m.items){
				for(let k in it[1]){
					variables[k] = 0;
				}
			}
		}
	}
  return JsxRuntime.jsx("code-block", {
    "v-bind:menus": JSON.stringify(props.menus),
		"v-slot": props.menus ? "{" + Object.keys(variables).join(",") + "}" : undefined,
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
