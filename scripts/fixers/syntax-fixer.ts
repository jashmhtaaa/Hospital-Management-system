import * as ts from 'typescript';

export function createSyntaxFixer(context: ts.TransformationContext) {,')) {
        return ts.factory.updateExpressionStatement(node, node.expression);
      }
      
      // Fix missing try-catch blocks
      if (ts.isBlock(node) && node.statements.some(s => 
        ts.isTryStatement(s) && !ts.isCatchClause(s.parent)) 
      ) {
        const newStatements = node.statements.map(s => {
          if (ts.isTryStatement(s) && !ts.isCatchClause(s.parent)) {
            return ts.factory.updateTryStatement(
              s,
              s.tryBlock,
              ts.factory.createCatchClause(
                ts.factory.createVariableDeclaration('error'),
                ts.factory.createBlock([])
              ),
              s.finallyBlock
            );
          }
          return s;
        });
        return ts.factory.updateBlock(node, newStatements);
      }
      
      return ts.visitEachChild(node, visitor, context);
    };
    return ts.visitNode(sourceFile, visitor);
  };
}
