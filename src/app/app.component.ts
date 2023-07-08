import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting, syntaxTree } from '@codemirror/language';
import { Diagnostic, lintGutter, lintKeymap, linter } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { EditorState, Extension, StateField } from '@codemirror/state';
import { EditorView, ViewUpdate, crosshairCursor, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, rectangularSelection } from '@codemirror/view';

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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('editor')
  private editor: ElementRef<HTMLDivElement>;

  // private editorView: EditorView;

  protected content: string =
`expofrt class Foo {
  privadte foo: string = "yolo";

  constructor() {
    idf(this.foo ==!= "bar") {
      console.log("coucou");
    }
  }
}`;

  public constructor() {
  }

  public ngAfterViewInit(): void {
    window.document.onkeydown = function(e) {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
      }
    }

    const listenChangesExtension = StateField.define({
      // we won't use the actual StateField value, null or undefined is fine
      create: () => null,
      update: (value, transaction) => {
        if (transaction.docChanged) {
          // console.log(transaction.newDoc.toJSON());
          console.log(transaction.changes.toJSON());
        }
        return null;
      },
    });

    const errorExtension = EditorView.exceptionSink.of(err => {
      console.error(err);
    });

    // this.editorView =
    new EditorView({
      parent: this.editor.nativeElement,
      // dispatch: this.dispatchChange,
      state: EditorState.create({
        doc: this.content,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          // history(),
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
          this.syntaxLinter(),
          // this.simpleLezerLinter(),
          lintGutter(),
          // linter(esLint(new Linter(), config)),
          themeExt,
          // EditorView.domEventHandlers({
          //   change(_event, _view) {
          //     console.log("yolo");
          //   },
          // })
          // EditorView.updateListener.of(update => this.viewUpdate(update)),
          listenChangesExtension
        ]
      })
    });
  }

  public simpleLezerLinter(): Extension {
    return linter(view => {
      const {state} = view;
      const tree = syntaxTree(state);

      tree.iterate({enter: n => {
        console.log(n.name, n.type.isError, n.type, n.node);
      }});

      return []
    });
  }

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

  // public dispatchChange(_tr: Transaction): void {
  //   console.log("change:", _tr);
  // }

  public viewUpdate(up: ViewUpdate): void {
    if(up.docChanged) {
      console.log("update:", up);
    }
  }

  // public changeListener(evt: Event): void {
  //   console.log("change:", evt);
  // }
}
