type KitBuilderOptions = {
  url: string;
  title?: string;
  description?: string;
  version?: string;
  namespacePrefix?: string;
};

interface KitConstructor<T extends Kit> {
  new(nodeFactory: NodeFactory): T;
}
declare class KitBuilder {
  #private;
  url: string;
  title?: string;
  description?: string;
  version?: string;
  namespacePrefix?: string;
  constructor({ title, description, version, url, namespacePrefix, }: KitBuilderOptions);
  build<Handlers extends NodeHandlers>(handlers: Handlers): KitConstructor<GenericKit<Handlers>>;
}