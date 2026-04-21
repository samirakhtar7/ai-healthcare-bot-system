// Small utilities to build custom comparator functions for Array.prototype.sort
// Usage examples:
//  const cmp = byKey('age', {type: 'number', direction: 'desc'});
//  arr.sort(cmp);
//  const multi = multiComparator([{key: 'lastName'}, {key: 'firstName'}]);
//  arr.sort(multi);

function _toComparable(value, type) {
  if (value === null || value === undefined) return value;
  if (type === "number") return Number(value);
  if (type === "date") return value instanceof Date ? value : new Date(value);
  return String(value);
}

function _cmpPrimitive(a, b, type) {
  if (a === b) return 0;
  if (a === undefined || a === null) return -1;
  if (b === undefined || b === null) return 1;

  if (type === "number") return a < b ? -1 : 1;
  if (type === "date") return a < b ? -1 : 1;
  // default: string comparison (locale-aware)
  return String(a).localeCompare(String(b));
}

// Create a comparator for a single property/key.
// options: { type: 'string'|'number'|'date'|'custom', direction: 'asc'|'desc', transform: fn }
export function byKey(key, options = {}) {
  const { type = "string", direction = "asc", transform } = options;
  const dir = direction === "desc" ? -1 : 1;

  return (x, y) => {
    let a = key == null ? x : x && x[key];
    let b = key == null ? y : y && y[key];
    if (transform) {
      a = transform(a, x);
      b = transform(b, y);
    }
    if (type !== "custom") {
      a = _toComparable(a, type);
      b = _toComparable(b, type);
      return dir * _cmpPrimitive(a, b, type);
    }
    // custom comparator provided as options.compare (a,b) -> -1/0/1
    if (typeof options.compare === "function")
      return dir * options.compare(a, b);
    return 0;
  };
}

// Create a comparator that applies multiple keys/specs in order.
// specs: [{ key, type, direction, transform, compare }] (compare only for type:'custom')
export function multiComparator(specs = []) {
  const comps = specs.map((s) => byKey(s.key, s));
  return (a, b) => {
    for (const c of comps) {
      const r = c(a, b);
      if (r !== 0) return r;
    }
    return 0;
  };
}

// Helper: build comparator from a simple string spec like ['-age','lastName']
// a leading '-' means descending.
export function fromSimpleSpec(arr) {
  const specs = arr.map((s) => {
    const direction = s.startsWith("-") ? "desc" : "asc";
    const key = s.replace(/^[-+]/, "");
    return { key, direction };
  });
  return multiComparator(specs);
}

export default { byKey, multiComparator, fromSimpleSpec };
