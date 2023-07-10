import { Transaction } from "@codemirror/state";
import { EditorView } from "codemirror";
import { UndoableCommand } from "interacto";

export class CodeChanged extends UndoableCommand {
    public constructor(
        private transactions: Transaction[],
        private editorView: EditorView
    ) {
        super();
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

    public override getVisualSnapshot(): string {
        return "changed";
    }
}
