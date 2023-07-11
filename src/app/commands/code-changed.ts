import { Transaction } from "@codemirror/state";
import { EditorView } from "codemirror";
import { UndoableCommand } from "interacto";
import { Diff } from "diff";

export class CodeChanged extends UndoableCommand {
    private cacheSnapshot: HTMLElement | undefined;

    public constructor(
        private transactions: Transaction[],
        private editorView: EditorView
    ) {
        super();
        this.cacheSnapshot = undefined;
    }

    override redo(): void {
        for (const tr of this.transactions) {
            this.editorView.dispatch({
                changes: tr.changes,
                userEvent: "none"
            });
        }
    }

    override undo(): void {
        const changes = this.transactions.slice().reverse().map(t => t.changes.invert(t.startState.doc));

        // Does not work when directly dispatching array of changes
        for (const c of changes) {
            this.editorView.dispatch({
                changes: c,
                userEvent: "none"
            });
        }
    }

    protected override execution(): void | Promise<void> {
        this.redo();
    }

    public override getVisualSnapshot(): HTMLElement {
        return this.cacheSnapshot ?? this.createHtmlSnapshot();
    }

    private createHtmlSnapshot(): HTMLElement {
        const diff = new Diff().diff(this.transactions.at(0)?.startState.doc.toString()!, this.transactions.at(-1)?.state.doc.toString()!);
        const div = document.createElement('div');
        div.style.fontFamily = "Fira Code";
        div.style.fontSize = "small";

        let lastPartHadChange = false;

        diff.forEach((part, i) => {
            let txt = part.value;
            const span = document.createElement('span');
            span.style.color = part.added ? 'green' : part.removed ? 'red' : 'black';
            span.style.textDecoration = part.added ? 'underline' : part.removed ? 'line-through' : '';

            if(part.added || part.removed) {
                lastPartHadChange = true;
            }else {
                const split = this.splitTxtBreakLine(txt);

                if(lastPartHadChange) {
                    const next = diff.at(i+1);

                    if(next != undefined && (next.added || next.removed)) {
                        if(split.length > 2) {
                            txt = `${split.at(0)!} ... ${split.at(-1)!}`;
                        }
                    }else {
                        txt = split.at(0)!;
                    }
                }else {
                    txt = split.at(-1)!;
                }
                lastPartHadChange = false;
            }

            span.appendChild(document.createTextNode(txt));
            div.appendChild(span);
          });

        this.cacheSnapshot = div;
        return this.cacheSnapshot;
    }

    private splitTxtBreakLine(txt: string): ReadonlyArray<string> {
        return txt.split(/\r?\n|\r|\n/g);
    }
}
