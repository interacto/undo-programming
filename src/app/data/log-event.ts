export const ActionTypes = [
    "mouse",
    "key",
    "focus",
    "hovering",
    "scroll",
    "input",
    "touch"
] as const;

const typesSet: ReadonlySet<string> = new Set(ActionTypes);

export type ActionType = typeof ActionTypes[number];

function isActionType(type: string): type is ActionType {
    return typesSet.has(type);
}

export class Action {
    public readonly type: ActionType;
    public readonly start: number;
    public end: number;
    public counts: number;

    public constructor(type: ActionType) {
        this.type = type;
        // Include page loading time?
        this.start = performance.now();
        this.end = this.start;
        this.counts = 1;
    }

    public add(): void {
        this.counts++;
        this.end = performance.now();
    }
}

export class LogEvent {
    private actions: Array<Action>;

    public constructor() {
        this.actions = [];
    }

    public register(elt: EventTarget): void {
        elt.addEventListener("focusout", evt => this.process(evt));
        elt.addEventListener("mouseover", evt => this.process(evt));
        elt.addEventListener("mousedown", evt => this.process(evt));
        elt.addEventListener("mouseup", evt => this.process(evt));
        elt.addEventListener("mousemove", evt => this.process(evt));
        elt.addEventListener("click", evt => this.process(evt));
        elt.addEventListener("auxclick", evt => this.process(evt));
        elt.addEventListener("touchstart", evt => this.process(evt));
        elt.addEventListener("touchend", evt => this.process(evt));
        elt.addEventListener("touchmove", evt => this.process(evt));
        elt.addEventListener("keydown", evt => this.process(evt));
        elt.addEventListener("keyup", evt => this.process(evt));
        elt.addEventListener("change", evt => this.process(evt));
        elt.addEventListener("input", evt => this.process(evt));
        elt.addEventListener("wheel", evt => this.process(evt));
        elt.addEventListener("scroll", evt => this.process(evt));
    }

    public process(evt: Event): void {
        const type = evt.type;
        const currentAction = this.actions.at(-1);

        if(!isActionType(type)) {
            return;
        }

        if(currentAction === undefined || currentAction.type !== type) {
            this.actions.push(new Action(type));
        } else {
            currentAction.add();
        }
    }
}
