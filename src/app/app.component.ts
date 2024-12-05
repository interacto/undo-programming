import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { bracketMatching, defaultHighlightStyle, ensureSyntaxTree, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting, syntaxTree } from '@codemirror/language';
import { Diagnostic, lintGutter, lintKeymap, linter } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { EditorState, Extension, StateField, Transaction } from '@codemirror/state';
import { EditorView, crosshairCursor, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view';
import { TreeUndoHistory } from 'interacto';
import { interactoTreeUndoProviders } from 'interacto-angular';
import { CodeChanged } from './commands/code-changed';
// import { java } from '@codemirror/lang-java';

const theme = EditorView.theme(
  {
    "& *": {
    fontFamily: "Fira Code",
    fontVariantLigatures: "common-ligatures",
    },
  }
)

const themeExt: Extension = [
  theme,
]

// const config = {
// 	// eslint configuration
// 	parserOptions: {
// 		ecmaVersion: 2022,
// 		sourceType: "module",
// 	},
// 	env: {
// 		browser: true,
// 		node: true,
// 	},
// 	rules: {
// 		semi: ["error", "never"],
// 	},
// };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [interactoTreeUndoProviders()]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('editor')
  private editor: ElementRef<HTMLDivElement>;

  private debouncer: NodeJS.Timeout | undefined;

  private editorView: EditorView;

  // private readonly log: LogEvent = new LogEvent();

  protected content: string =
`
// TypeScript code
class Foo {
}`;

  public constructor(private history: TreeUndoHistory) {
  }

  public ngAfterViewInit(): void {
    // this.log.register(window.document);

    window.document.onkeydown = function(e) {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
      }
    }

    let latestChangesets: Array<Transaction> = [];



    const listenChangesExtension = StateField.define({
      create: () => null,
      update: (_value, transaction: Transaction) => {
        // https://codemirror.net/docs/ref/#state.Transaction^userEvent
        if (transaction.docChanged && !transaction.isUserEvent("none")) {
          if (this.debouncer !== undefined) {
            clearTimeout(this.debouncer);
          }

          if (latestChangesets.length === 0) {
            latestChangesets.push(transaction);
          } else {
            latestChangesets.push(transaction);
          }

          this.debouncer = setTimeout(() => {
            if(latestChangesets.length > 0) {
              const tree = ensureSyntaxTree(transaction.startState, transaction.startState.doc.length, 5000)?.cursorAt(0);
              latestChangesets.map(cs => {
              })
              tree?.iterate(node => {
                console.dir(node.node);
              }
              );


              const cmd = new CodeChanged(latestChangesets, this.editorView);
              cmd.done();
              this.history.add(cmd);
              latestChangesets = [];
            }
          }, 2000);
        }
        return null;
      },
    });

    const errorExtension = EditorView.exceptionSink.of(err => {
      console.error(err);
    });

    this.editorView = new EditorView({
      parent: this.editor.nativeElement,
      state: EditorState.create({
        doc: this.content,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          //history(),
          foldGutter(),
          drawSelection(),
          dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          rectangularSelection(),
          crosshairCursor(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          errorExtension,
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            // ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
            indentWithTab
          ]),
          javascript({
            typescript: true
          }),
          // java(),
          this.syntaxLinter(),
          // this.simpleLezerLinter(),
          lintGutter(),
          // linter(esLint(new Linter(), config)),
          themeExt,
          listenChangesExtension
        ]
      })
    });
  }

  // public simpleLezerLinter(): Extension {
  //   return linter(view => {
  //     const {state} = view;
  //     const tree = syntaxTree(state);

  //     tree.iterate({enter: n => {
  //       console.log(n.name, n.type.isError, n.type, n.node);
  //     }});

  //     return []
  //   });
  // }

  public syntaxLinter(): Extension {
    return linter(view => {
      const {state} = view;
      const tree = syntaxTree(state);
      const acc = new Array<Diagnostic>();

      if (tree.length === state.doc.length) {
        // let pos: number | undefined = undefined;
        tree.iterate({enter: n => {
          if (n.type.isError) {
            const from = n.node.prevSibling?.from ?? 0;
            const to = n.node.prevSibling?.to ?? n.node.from;

            acc.push({from, to, severity: 'error', message: 'syntax error'});
            return false;
          }
          return true;
        }})
      }

      return acc;
    });
  }
}
