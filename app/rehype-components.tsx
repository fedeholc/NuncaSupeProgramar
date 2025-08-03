import { Root, Properties, ElementContent } from "hast";
import { Plugin, Processor } from "unified";
import { visit, SKIP } from "unist-util-visit";
import { isElement } from "hast-util-is-element";
import { VFile } from "vfile";

export type ComponentFunction = (
  props: Properties,
  children: ElementContent[],
  context: ComponentContext
) => ElementContent;

export interface ComponentContext {
  tree: Root;
  vfile: VFile;
  processor: Processor;
}

interface Options {
  components: Record<string, ComponentFunction>;
}

const rehypeComponents: Plugin<[Options], Root, Root> = function (options) {
  const { components = {} } = options;
  return (tree, vfile) => {
    const context: ComponentContext = { tree, vfile, processor: this };
    visit(tree, (node, index, parent) => {
      if (!isElement(node)) {
        return;
      }
      const component = components[node.tagName];
      if (component && parent && typeof index === 'number') {
        const replacedNode = component(
          node.properties || {},
          node.children,
          context
        );
        parent.children[index] = replacedNode;

        // This return value makes sure that the traversal continues by
        // visiting the children of the replaced node (if any)
        return [SKIP, index];
      }
    });
  };
};

export default rehypeComponents;
