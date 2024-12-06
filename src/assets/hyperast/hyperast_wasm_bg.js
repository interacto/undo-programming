let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_0.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
function __wbg_adapter_8(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hc2bd798fa82522da(arg0, arg1, addHeapObject(arg2));
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} name
*/
export function greet(name) {
    const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.greet(ptr0, len0);
}

/**
*/
export function run() {
    wasm.run();
}

let cachedFloat32Memory0 = null;

function getFloat32Memory0() {
    if (cachedFloat32Memory0 === null || cachedFloat32Memory0.byteLength === 0) {
        cachedFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32Memory0;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
function __wbg_adapter_21(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h7e6f9ac032d122c3(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class GitSession {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GitSession.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_gitsession_free(ptr);
    }
    /**
    * @param {NodeId} node
    * @returns {Promise<string>}
    */
    fetch_node(node) {
        _assertClass(node, NodeId);
        var ptr0 = node.__destroy_into_raw();
        const ret = wasm.gitsession_fetch_node(this.__wbg_ptr, ptr0);
        return takeObject(ret);
    }
}
/**
*/
export class HyperAstDb {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(HyperAstDb.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hyperastdb_free(ptr);
    }
    /**
    * @param {string} api_addr
    */
    constructor(api_addr) {
        const ptr0 = passStringToWasm0(api_addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hyperastdb_new(ptr0, len0);
        return HyperAstDb.__wrap(ret);
    }
    /**
    * @returns {GitSession}
    */
    git() {
        const ret = wasm.hyperastdb_git(this.__wbg_ptr);
        return GitSession.__wrap(ret);
    }
    /**
    * @returns {ScratchPadSession}
    */
    scratch_pad() {
        const ret = wasm.hyperastdb_git(this.__wbg_ptr);
        return ScratchPadSession.__wrap(ret);
    }
}
/**
*/
export class NodeId {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nodeid_free(ptr);
    }
}
/**
*/
export class ScratchPadSession {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ScratchPadSession.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_scratchpadsession_free(ptr);
    }
    /**
    * @param {number} prev
    * @param {Float32Array} path
    * @param {string} typ
    */
    snap_build(prev, path, typ) {
        const ptr0 = passArrayF32ToWasm0(path, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(typ, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.scratchpadsession_snap_build(this.__wbg_ptr, prev, ptr0, len0, ptr1, len1);
    }
    /**
    * @param {number} prev
    * @param {Float32Array} path
    * @param {string} typ
    * @param {string} label
    */
    snap_build_with_label(prev, path, typ, label) {
        const ptr0 = passArrayF32ToWasm0(path, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(typ, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(label, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        wasm.scratchpadsession_snap_build_with_label(this.__wbg_ptr, prev, ptr0, len0, ptr1, len1, ptr2, len2);
    }
    /**
    * @param {number} prev
    * @param {Float32Array} path
    */
    snap_build_empty(prev, path) {
        const ptr0 = passArrayF32ToWasm0(path, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.scratchpadsession_snap_build_empty(this.__wbg_ptr, prev, ptr0, len0);
    }
    /**
    * @param {NodeId} node
    * @returns {Promise<string>}
    */
    fetch_node(node) {
        _assertClass(node, NodeId);
        const ret = wasm.scratchpadsession_fetch_node(this.__wbg_ptr, node.__wbg_ptr);
        return takeObject(ret);
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbg_log_dfb5ce0493250931(arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_cb_drop(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbg_new_43f1b47c28813cbd(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_21(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_resolve_53698b95aaf7fcf8(arg0) {
    const ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_then_f7e06ee3c11698eb(arg0, arg1) {
    const ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_closure_wrapper57(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 13, __wbg_adapter_8);
    return addHeapObject(ret);
};

