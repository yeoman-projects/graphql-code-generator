import { PluginFunction, GraphQLSchema, DocumentFile } from 'graphql-codegen-core';
import { visit, concatAST } from 'graphql';
import { FlowDocumentsPluginConfig, FlowDocumentsVisitor } from './visitor';

export type ScalarsMap = { [name: string]: string };

export const plugin: PluginFunction<FlowDocumentsPluginConfig> = (
  schema: GraphQLSchema,
  documents: DocumentFile[],
  config: FlowDocumentsPluginConfig
) => {
  let result = `type $Pick<Origin: Object, Keys: Object> = $ObjMapi<Keys, <Key>(k: Key) => $ElementType<Origin, Key>>;\n\n`;

  const allAst = concatAST(
    documents.reduce((prev, v) => {
      return [...prev, v.content];
    }, [])
  );

  const visitorResult = visit(allAst, {
    leave: new FlowDocumentsVisitor(schema, config)
  });

  return result + visitorResult.definitions.join('\n');
};
